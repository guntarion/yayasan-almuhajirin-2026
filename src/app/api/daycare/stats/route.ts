// src/app/api/daycare/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DaycareStatsResponse } from '@/types/daycare';

// GET - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paketFilter = searchParams.get('paket') || '';

    // Build base where clause for paket filter
    const anakWhere: Record<string, unknown> = {};
    if (paketFilter && paketFilter !== 'all') {
      anakWhere.paketLayanan = paketFilter;
    }

    // Get current date for determining current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const today = new Date(currentYear, now.getMonth(), now.getDate());
    const endOfToday = new Date(currentYear, now.getMonth(), now.getDate(), 23, 59, 59);

    // Execute all queries in parallel
    const [
      totalAnak,
      anakAktif,
      anakByPaket,
      pendaftaranThisMonth,
      tagihanBelumLunas,
      pembayaranBulanIni,
      dailyReportsToday,
    ] = await Promise.all([
      // Total anak count
      prisma.daycareAnak.count({
        where: anakWhere,
      }),

      // Active anak count
      prisma.daycareAnak.count({
        where: {
          ...anakWhere,
          status: 'aktif',
        },
      }),

      // Anak by paket
      prisma.daycareAnak.groupBy({
        by: ['paketLayanan'],
        where: {
          status: 'aktif',
        },
        _count: true,
      }),

      // New registrations this month
      prisma.daycarePendaftaran.count({
        where: {
          tanggalDaftar: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      // Get all unpaid tagihan for calculating tunggakan
      prisma.daycareTagihanBulanan.findMany({
        where: {
          status: { not: 'lunas' },
          anak: anakWhere,
        },
        include: {
          pembayaran: {
            select: { nominal: true },
          },
        },
      }),

      // Pembayaran this month (both pendaftaran and bulanan)
      Promise.all([
        prisma.daycarePembayaranPendaftaran.aggregate({
          where: {
            tanggalBayar: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: { nominal: true },
        }),
        prisma.daycarePembayaranBulanan.aggregate({
          where: {
            tanggalBayar: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: { nominal: true },
        }),
        prisma.daycarePembayaranHarian.aggregate({
          where: {
            tanggalBayar: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: { nominal: true },
        }),
      ]),

      // Daily reports today
      prisma.daycareDailyReport.count({
        where: {
          tanggal: {
            gte: today,
            lte: endOfToday,
          },
        },
      }),
    ]);

    // Calculate total tunggakan (unpaid amounts)
    let totalTunggakan = 0;
    for (const tagihan of tagihanBelumLunas) {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const sisa = Number(tagihan.totalTagihan) - totalBayar;
      if (sisa > 0) {
        totalTunggakan += sisa;
      }
    }

    // Extract counts by paket
    const anakFullday = anakByPaket.find((a) => a.paketLayanan === 'FULLDAY')?._count || 0;
    const anakAfterSchool = anakByPaket.find((a) => a.paketLayanan === 'AFTER_SCHOOL')?._count || 0;
    const anakHarian = anakByPaket.find((a) => a.paketLayanan === 'HARIAN')?._count || 0;

    // Calculate total pemasukan bulan ini
    const [pendaftaranIncome, bulananIncome, harianIncome] = pembayaranBulanIni;
    const pemasukanBulanIni =
      Number(pendaftaranIncome._sum.nominal || 0) +
      Number(bulananIncome._sum.nominal || 0) +
      Number(harianIncome._sum.nominal || 0);

    const stats: DaycareStatsResponse = {
      totalAnak,
      totalAnakAktif: anakAktif,
      anakFullday,
      anakAfterSchool,
      anakHarian,
      pendaftaranBaru: pendaftaranThisMonth,
      totalTunggakan,
      pemasukanBulanIni,
      dailyReportsHariIni: dailyReportsToday,
    };

    // Get additional detailed stats
    const [
      anakByStatus,
      pendaftaranByStatus,
      tagihanByStatus,
      recentPayments,
      recentDailyReports,
    ] = await Promise.all([
      // Anak by status
      prisma.daycareAnak.groupBy({
        by: ['status'],
        where: anakWhere,
        _count: true,
      }),

      // Pendaftaran by status
      prisma.daycarePendaftaran.groupBy({
        by: ['status'],
        _count: true,
      }),

      // Tagihan by status
      prisma.daycareTagihanBulanan.groupBy({
        by: ['status'],
        where: {
          anak: anakWhere,
        },
        _count: true,
        _sum: {
          totalTagihan: true,
        },
      }),

      // Recent pembayaran bulanan (last 10)
      prisma.daycarePembayaranBulanan.findMany({
        include: {
          tagihan: {
            include: {
              anak: {
                select: {
                  id: true,
                  nomorInduk: true,
                  namaLengkap: true,
                  paketLayanan: true,
                },
              },
            },
          },
        },
        orderBy: { tanggalBayar: 'desc' },
        take: 10,
      }),

      // Recent daily reports (last 10)
      prisma.daycareDailyReport.findMany({
        include: {
          anak: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              foto: true,
            },
          },
        },
        orderBy: { tanggal: 'desc' },
        take: 10,
      }),
    ]);

    // Build detailed stats response
    const detailedStats = {
      ...stats,
      anakByStatus: anakByStatus.map((a) => ({
        status: a.status,
        count: a._count,
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
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        tanggalBayar: p.tanggalBayar,
        nominal: Number(p.nominal),
        metodePembayaran: p.metodePembayaran,
        anak: p.tagihan.anak,
        bulan: p.tagihan.bulan,
        tahun: p.tagihan.tahun,
      })),
      recentDailyReports: recentDailyReports.map((r) => ({
        id: r.id,
        tanggal: r.tanggal,
        guruPengisi: r.guruPengisi,
        anak: r.anak,
      })),
    };

    return NextResponse.json(detailedStats);
  } catch (error) {
    console.error('Error fetching Daycare stats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik Daycare' },
      { status: 500 }
    );
  }
}
