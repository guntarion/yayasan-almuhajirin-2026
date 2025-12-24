import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

/**
 * Laporan Aktivitas / Statement of Activities
 * Based on PSAK 45 / ISAK 35 for Non-Profit Organizations
 *
 * Shows revenues, expenses, and changes in net assets
 */

interface ActivityItem {
  kode: string;
  nama: string;
  jumlah: number;
  subKategori: string | null;
}

interface ActivitySection {
  title: string;
  items: ActivityItem[];
  total: number;
}

// GET /api/keuangan/reports/aktivitas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;

    // Get fiscal period
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: { year },
    });

    if (!fiscalPeriod) {
      return NextResponse.json(
        { error: 'Fiscal period not found' },
        { status: 404 }
      );
    }

    // Build date range
    const startDate = new Date(`${year}-01-01`);
    const endDate = month
      ? new Date(year, month, 0)
      : new Date(`${year}-12-31`);

    // Get all accounts
    const accounts = await prisma.kodeAkun.findMany({
      where: {
        isActive: true,
        kategori: { in: ['pendapatan', 'beban'] }
      },
      orderBy: { kode: 'asc' },
    });

    // Get journal entries for the period
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        transaction: {
          fiscalPeriodId: fiscalPeriod.id,
          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
          isVoided: false,
        },
      },
      include: {
        akun: true,
      },
    });

    // Calculate amounts for each account
    const amounts: Record<string, number> = {};

    for (const entry of journalEntries) {
      const kode = entry.kodeAkun;
      if (!amounts[kode]) {
        amounts[kode] = 0;
      }

      const amount = Number(entry.amount);
      const akun = entry.akun;

      // For pendapatan (credit normal) and beban (debit normal)
      if (entry.entryType === 'debit') {
        if (akun.normalBalance === 'debit') {
          amounts[kode] += amount; // beban increases
        } else {
          amounts[kode] -= amount; // pendapatan decreases (refund)
        }
      } else {
        if (akun.normalBalance === 'credit') {
          amounts[kode] += amount; // pendapatan increases
        } else {
          amounts[kode] -= amount; // beban decreases (reversal)
        }
      }
    }

    // Group by category
    const pendapatanTanpaPembatasan: ActivityItem[] = [];
    const pendapatanPembatasanTemporer: ActivityItem[] = [];
    const pendapatanPembatasanPermanen: ActivityItem[] = [];
    const bebanProgram: ActivityItem[] = [];
    const bebanOperasional: ActivityItem[] = [];

    for (const akun of accounts) {
      const jumlah = amounts[akun.kode] || 0;
      if (jumlah === 0) continue;

      const item: ActivityItem = {
        kode: akun.kode,
        nama: akun.nama,
        jumlah,
        subKategori: akun.subKategori,
      };

      if (akun.kategori === 'pendapatan') {
        if (akun.subKategori === 'restricted') {
          if (akun.restrictionType === 'permanent') {
            pendapatanPembatasanPermanen.push(item);
          } else {
            pendapatanPembatasanTemporer.push(item);
          }
        } else {
          pendapatanTanpaPembatasan.push(item);
        }
      } else if (akun.kategori === 'beban') {
        if (akun.subKategori === 'operasional') {
          bebanOperasional.push(item);
        } else {
          bebanProgram.push(item);
        }
      }
    }

    // Calculate totals
    const calcTotal = (items: ActivityItem[]) =>
      items.reduce((sum, item) => sum + item.jumlah, 0);

    const totalPendapatanTanpaPembatasan = calcTotal(pendapatanTanpaPembatasan);
    const totalPendapatanPembatasanTemporer = calcTotal(pendapatanPembatasanTemporer);
    const totalPendapatanPembatasanPermanen = calcTotal(pendapatanPembatasanPermanen);
    const totalPendapatan =
      totalPendapatanTanpaPembatasan +
      totalPendapatanPembatasanTemporer +
      totalPendapatanPembatasanPermanen;

    const totalBebanProgram = calcTotal(bebanProgram);
    const totalBebanOperasional = calcTotal(bebanOperasional);
    const totalBeban = totalBebanProgram + totalBebanOperasional;

    // Changes in net assets
    const perubahanAsetBersihTanpaPembatasan =
      totalPendapatanTanpaPembatasan - totalBeban;
    const perubahanAsetBersihPembatasanTemporer =
      totalPendapatanPembatasanTemporer;
    const perubahanAsetBersihPembatasanPermanen =
      totalPendapatanPembatasanPermanen;
    const totalPerubahanAsetBersih =
      perubahanAsetBersihTanpaPembatasan +
      perubahanAsetBersihPembatasanTemporer +
      perubahanAsetBersihPembatasanPermanen;

    // Get program summary from ProgramKerja
    const programs = await prisma.programKerja.findMany({
      where: {
        fiscalYear: year,
        status: 'aktif',
      },
      include: {
        items: true,
        bidang: true,
        unitKerja: true,
      },
    });

    const programSummary = programs.map(program => {
      const totalAnggaran = program.items.reduce(
        (sum, item) => sum + Number(item.jumlah),
        0
      );
      const totalRealisasi = program.items.reduce(
        (sum, item) => sum + Number(item.realisasi),
        0
      );

      return {
        kode: program.kode,
        nama: program.nama,
        jenis: program.jenis,
        bidang: program.bidang.nama,
        unit: program.unitKerja.nama,
        anggaran: totalAnggaran,
        realisasi: totalRealisasi,
        progress: totalAnggaran > 0
          ? Math.round((totalRealisasi / totalAnggaran) * 100)
          : 0,
      };
    });

    return NextResponse.json({
      data: {
        period: {
          year,
          month,
          startDate,
          endDate,
          fiscalPeriodName: fiscalPeriod.name,
        },
        pendapatan: {
          tanpaPembatasan: {
            title: 'Pendapatan Tanpa Pembatasan',
            items: pendapatanTanpaPembatasan,
            total: totalPendapatanTanpaPembatasan,
          } as ActivitySection,
          pembatasanTemporer: {
            title: 'Pendapatan Dengan Pembatasan Temporer',
            items: pendapatanPembatasanTemporer,
            total: totalPendapatanPembatasanTemporer,
          } as ActivitySection,
          pembatasanPermanen: {
            title: 'Pendapatan Dengan Pembatasan Permanen',
            items: pendapatanPembatasanPermanen,
            total: totalPendapatanPembatasanPermanen,
          } as ActivitySection,
          totalPendapatan,
        },
        beban: {
          program: {
            title: 'Beban Program',
            items: bebanProgram,
            total: totalBebanProgram,
          } as ActivitySection,
          operasional: {
            title: 'Beban Operasional',
            items: bebanOperasional,
            total: totalBebanOperasional,
          } as ActivitySection,
          totalBeban,
        },
        perubahanAsetBersih: {
          tanpaPembatasan: perubahanAsetBersihTanpaPembatasan,
          pembatasanTemporer: perubahanAsetBersihPembatasanTemporer,
          pembatasanPermanen: perubahanAsetBersihPembatasanPermanen,
          total: totalPerubahanAsetBersih,
        },
        programSummary,
      },
    });
  } catch (error) {
    console.error('Aktivitas report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate activities statement' },
      { status: 500 }
    );
  }
}
