// src/app/api/kbtk/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { KbtkDashboardStats } from '@/types/kbtk';

// GET - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tahunAjaran = searchParams.get('tahunAjaran') || '';

    // Build base where clause for tahunAjaran filter
    const siswaWhere: Record<string, unknown> = {};
    if (tahunAjaran && tahunAjaran !== 'all') {
      siswaWhere.tahunAjaran = tahunAjaran;
    }

    // Get current date for determining current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Execute all queries in parallel
    const [
      totalSiswa,
      siswaAktif,
      siswaByLevel,
      pendaftaranThisMonth,
      tagihanBelumLunas,
    ] = await Promise.all([
      // Total siswa count
      prisma.kbtkSiswa.count({
        where: siswaWhere,
      }),

      // Active students count
      prisma.kbtkSiswa.count({
        where: {
          ...siswaWhere,
          status: 'aktif',
        },
      }),

      // Students by level (KB/TK)
      prisma.kbtkSiswa.groupBy({
        by: ['kelompokLevel'],
        where: {
          ...siswaWhere,
          status: 'aktif',
        },
        _count: true,
      }),

      // New registrations this month
      prisma.kbtkPendaftaran.count({
        where: {
          tanggalDaftar: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
          ...(tahunAjaran && tahunAjaran !== 'all' ? { tahunAjaran } : {}),
        },
      }),

      // Get all unpaid tagihan for calculating tunggakan
      prisma.kbtkTagihanSpp.findMany({
        where: {
          status: { not: 'lunas' },
          siswa: siswaWhere,
        },
        include: {
          pembayaran: {
            select: { nominal: true },
          },
        },
      }),
    ]);

    // Calculate total tunggakan (unpaid amounts)
    let totalTunggakan = 0;
    const siswaWithTunggakan = new Set<string>();

    for (const tagihan of tagihanBelumLunas) {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const sisa = Number(tagihan.totalTagihan) - totalBayar;
      if (sisa > 0) {
        totalTunggakan += sisa;
        siswaWithTunggakan.add(tagihan.siswaId);
      }
    }

    // Extract counts by level
    const siswaKB = siswaByLevel.find((s) => s.kelompokLevel === 'KB')?._count || 0;
    const siswaTK = siswaByLevel.find((s) => s.kelompokLevel === 'TK')?._count || 0;

    const stats: KbtkDashboardStats = {
      totalSiswa,
      siswaAktif,
      siswaKB,
      siswaTK,
      pendaftaranBaru: pendaftaranThisMonth,
      totalTunggakan,
      siswaMenunggak: siswaWithTunggakan.size,
    };

    // Get additional detailed stats
    const [
      siswaByStatus,
      pendaftaranByStatus,
      tagihanByStatus,
      recentPayments,
    ] = await Promise.all([
      // Students by status
      prisma.kbtkSiswa.groupBy({
        by: ['status'],
        where: siswaWhere,
        _count: true,
      }),

      // Pendaftaran by status
      prisma.kbtkPendaftaran.groupBy({
        by: ['status'],
        where: tahunAjaran && tahunAjaran !== 'all' ? { tahunAjaran } : {},
        _count: true,
      }),

      // Tagihan by status
      prisma.kbtkTagihanSpp.groupBy({
        by: ['status'],
        where: {
          siswa: siswaWhere,
        },
        _count: true,
        _sum: {
          totalTagihan: true,
        },
      }),

      // Recent payments (last 10)
      prisma.kbtkPembayaranSpp.findMany({
        include: {
          tagihan: {
            include: {
              siswa: {
                select: {
                  id: true,
                  nomorInduk: true,
                  namaLengkap: true,
                  kelompokLevel: true,
                  kelompokKelas: true,
                },
              },
            },
          },
        },
        orderBy: { tanggalBayar: 'desc' },
        take: 10,
      }),
    ]);

    // Calculate payment totals this month
    const paymentsThisMonth = await prisma.kbtkPembayaranSpp.aggregate({
      where: {
        tanggalBayar: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
        },
      },
      _sum: {
        nominal: true,
      },
      _count: true,
    });

    // Build detailed stats response
    const detailedStats = {
      ...stats,
      siswaByStatus: siswaByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      pendaftaranByStatus: pendaftaranByStatus.map((p) => ({
        status: p.status,
        count: p._count,
      })),
      tagihanByStatus: tagihanByStatus.map((t) => ({
        status: t.status,
        count: t._count,
        total: Number(t._sum.totalTagihan || 0),
      })),
      pembayaranBulanIni: {
        count: paymentsThisMonth._count,
        total: Number(paymentsThisMonth._sum.nominal || 0),
      },
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        tanggalBayar: p.tanggalBayar,
        nominal: Number(p.nominal),
        metodePembayaran: p.metodePembayaran,
        siswa: p.tagihan.siswa,
        bulan: p.tagihan.bulan,
        tahun: p.tagihan.tahun,
      })),
    };

    return NextResponse.json(detailedStats);
  } catch (error) {
    console.error('Error fetching KBTK stats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik KBTK' },
      { status: 500 }
    );
  }
}
