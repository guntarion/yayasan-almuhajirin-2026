import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/keuangan/dashboard - Get dashboard summary
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Get fiscal period
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: { year, isActive: true },
    });

    if (!fiscalPeriod) {
      return NextResponse.json(
        { error: 'Fiscal period not found' },
        { status: 404 }
      );
    }

    // Get date range for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Aggregate transactions for the year
    const yearlyTransactions = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        fiscalPeriodId: fiscalPeriod.id,
        isVoided: false,
      },
      _sum: {
        amount: true,
      },
    });

    // Monthly transactions
    const monthlyTransactions = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        transactionDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        isVoided: false,
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate totals
    const incomeResult = yearlyTransactions.find(t => t.type === 'income');
    const expenseResult = yearlyTransactions.find(t => t.type === 'expense');
    const monthlyIncomeResult = monthlyTransactions.find(t => t.type === 'income');
    const monthlyExpenseResult = monthlyTransactions.find(t => t.type === 'expense');

    const totalPendapatan = incomeResult?._sum?.amount ? Number(incomeResult._sum.amount) : 0;
    const totalBeban = expenseResult?._sum?.amount ? Number(expenseResult._sum.amount) : 0;
    const pendapatanBulanIni = monthlyIncomeResult?._sum?.amount ? Number(monthlyIncomeResult._sum.amount) : 0;
    const bebanBulanIni = monthlyExpenseResult?._sum?.amount ? Number(monthlyExpenseResult._sum.amount) : 0;

    // Get cash & bank balance (simplified - sum of all income minus expenses)
    const kasBank = totalPendapatan - totalBeban;

    // Get recent transactions
    const transaksiTerakhir = await prisma.transaction.findMany({
      where: {
        isVoided: false,
      },
      orderBy: {
        transactionDate: 'desc',
      },
      take: 5,
      include: {
        unitKerja: true,
        bidang: true,
      },
    });

    // Get programs with items for realization calculation
    const programs = await prisma.programKerja.findMany({
      where: {
        fiscalYear: year,
        status: { in: ['aktif', 'selesai'] },
      },
      include: {
        items: true,
      },
    });

    // Calculate overall realization
    let totalBudget = 0;
    let totalRealisasi = 0;
    programs.forEach(program => {
      program.items.forEach(item => {
        totalBudget += Number(item.jumlah);
        totalRealisasi += Number(item.realisasi);
      });
    });
    const realisasiProgram = totalBudget > 0 ? Math.round((totalRealisasi / totalBudget) * 100) : 0;

    // Get bidang summary
    const bidangSummary = await prisma.bidang.findMany({
      include: {
        programs: {
          where: {
            fiscalYear: year,
            status: { in: ['aktif', 'selesai'] },
          },
          include: {
            items: true,
          },
        },
      },
    });

    const ringkasanBidang = bidangSummary.map(bidang => {
      let bidangBudget = 0;
      let bidangRealisasi = 0;
      let bidangPendapatan = 0;
      let bidangPengeluaran = 0;
      bidang.programs.forEach(program => {
        program.items.forEach(item => {
          const jumlah = Number(item.jumlah);
          bidangBudget += jumlah;
          bidangRealisasi += Number(item.realisasi);
          if (program.jenis === 'pendapatan') {
            bidangPendapatan += jumlah;
          } else {
            bidangPengeluaran += jumlah;
          }
        });
      });
      return {
        kode: bidang.kode,
        nama: bidang.nama,
        anggaran: bidangBudget,
        realisasi: bidangRealisasi,
        persenRealisasi: bidangBudget > 0 ? Math.round((bidangRealisasi / bidangBudget) * 100) : 0,
        pendapatan: bidangPendapatan,
        pengeluaran: bidangPengeluaran,
      };
    });

    // Featured units summary: KETAKMIRAN, DAYCARE, KBTK, LAZMU
    const featuredUnits = [
      { kode: 'TKM', nama: 'Ketakmiran' },
      { kode: 'DCR', nama: 'Daycare' },
      { kode: 'KBT', nama: 'KBTK' },
      { kode: 'LAZ', nama: 'LAZMU' },
    ];

    const unitSummaries = await Promise.all(
      featuredUnits.map(async (unit) => {
        const unitData = await prisma.unitKerja.findUnique({
          where: { kode: unit.kode },
          include: {
            programs: {
              where: {
                fiscalYear: year,
                status: { in: ['aktif', 'selesai'] },
              },
              include: {
                items: true,
              },
            },
          },
        });

        if (!unitData) {
          return {
            kode: unit.kode,
            nama: unit.nama,
            anggaranPendapatan: 0,
            anggaranPengeluaran: 0,
            realisasiPendapatan: 0,
            realisasiPengeluaran: 0,
            saldo: 0,
            persenRealisasi: 0,
          };
        }

        let anggaranPendapatan = 0;
        let anggaranPengeluaran = 0;
        let realisasiPendapatan = 0;
        let realisasiPengeluaran = 0;

        unitData.programs.forEach(program => {
          program.items.forEach(item => {
            const jumlah = Number(item.jumlah);
            const realisasi = Number(item.realisasi);
            if (program.jenis === 'pendapatan') {
              anggaranPendapatan += jumlah;
              realisasiPendapatan += realisasi;
            } else {
              anggaranPengeluaran += jumlah;
              realisasiPengeluaran += realisasi;
            }
          });
        });

        const totalAnggaran = anggaranPendapatan + anggaranPengeluaran;
        const totalRealisasi = realisasiPendapatan + realisasiPengeluaran;

        return {
          kode: unit.kode,
          nama: unitData.nama || unit.nama,
          anggaranPendapatan,
          anggaranPengeluaran,
          realisasiPendapatan,
          realisasiPengeluaran,
          saldo: anggaranPendapatan - anggaranPengeluaran,
          persenRealisasi: totalAnggaran > 0 ? Math.round((totalRealisasi / totalAnggaran) * 100) : 0,
        };
      })
    );

    return NextResponse.json({
      fiscalPeriod: {
        year: fiscalPeriod.year,
        name: fiscalPeriod.name,
        isActive: fiscalPeriod.isActive,
      },
      summary: {
        kasBank,
        totalPendapatan,
        totalBeban,
        surplusDefisit: totalPendapatan - totalBeban,
        pendapatanBulanIni,
        bebanBulanIni,
        realisasiProgram,
      },
      transaksiTerakhir: transaksiTerakhir.map(trx => ({
        id: trx.id,
        code: trx.code,
        date: trx.transactionDate,
        description: trx.description,
        amount: Number(trx.amount),
        type: trx.type,
        unit: trx.unitKerja?.nama || '-',
        bidang: trx.bidang?.nama || '-',
      })),
      ringkasanBidang,
      featuredUnitSummaries: unitSummaries,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
