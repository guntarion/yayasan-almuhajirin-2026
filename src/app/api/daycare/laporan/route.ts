// src/app/api/daycare/laporan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET - Get various daycare reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    switch (type) {
      case 'anak-aktif':
        return handleAnakAktif(searchParams);
      case 'rekap-pembayaran':
        return handleRekapPembayaran(searchParams);
      case 'tunggakan':
        return handleTunggakan(searchParams);
      case 'pemasukan':
        return handlePemasukan(searchParams);
      case 'kehadiran':
        return handleKehadiran(searchParams);
      default:
        return NextResponse.json(
          { error: 'Parameter type wajib diisi. Pilihan: anak-aktif, rekap-pembayaran, tunggakan, pemasukan, kehadiran' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching laporan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data laporan' },
      { status: 500 }
    );
  }
}

// ===========================================
// HANDLER: ANAK AKTIF
// ===========================================
async function handleAnakAktif(searchParams: URLSearchParams) {
  const paket = searchParams.get('paket') || 'all';
  const status = searchParams.get('status') || 'aktif';

  // Build where clause
  const where: Record<string, unknown> = {};

  if (paket !== 'all') {
    where.paketLayanan = paket;
  }

  if (status !== 'all') {
    where.status = status;
  }

  // Get anak with relations
  const anakList = await prisma.daycareAnak.findMany({
    where,
    include: {
      orangTua: {
        where: { isPrimary: true },
        select: {
          id: true,
          nama: true,
          nomorHP: true,
          relasi: true,
        },
      },
    },
    orderBy: [
      { paketLayanan: 'asc' },
      { namaLengkap: 'asc' },
    ],
  });

  // Group by paket
  const groupedByPaket = {
    FULLDAY: anakList.filter((a) => a.paketLayanan === 'FULLDAY'),
    AFTER_SCHOOL: anakList.filter((a) => a.paketLayanan === 'AFTER_SCHOOL'),
    HARIAN: anakList.filter((a) => a.paketLayanan === 'HARIAN'),
  };

  // Calculate counts
  const summary = {
    totalAnak: anakList.length,
    totalFullday: groupedByPaket.FULLDAY.length,
    totalAfterSchool: groupedByPaket.AFTER_SCHOOL.length,
    totalHarian: groupedByPaket.HARIAN.length,
  };

  return NextResponse.json({
    success: true,
    data: anakList,
    grouped: groupedByPaket,
    summary,
  });
}

// ===========================================
// HANDLER: REKAP PEMBAYARAN
// ===========================================
async function handleRekapPembayaran(searchParams: URLSearchParams) {
  const bulan = parseInt(searchParams.get('bulan') || String(new Date().getMonth() + 1));
  const tahun = parseInt(searchParams.get('tahun') || String(new Date().getFullYear()));

  // Get all tagihan for the period with payments
  const tagihanList = await prisma.daycareTagihanBulanan.findMany({
    where: {
      bulan,
      tahun,
    },
    include: {
      anak: {
        select: {
          id: true,
          nomorInduk: true,
          namaLengkap: true,
          paketLayanan: true,
        },
      },
      pembayaran: {
        orderBy: { tanggalBayar: 'asc' },
      },
    },
    orderBy: [
      { anak: { namaLengkap: 'asc' } },
    ],
  });

  // Calculate statistics
  let totalTagihan = 0;
  let totalTerbayar = 0;
  let totalLunas = 0;
  let totalBelumBayar = 0;
  let totalSebagian = 0;

  const processedList = tagihanList.map((tagihan) => {
    const totalPembayaran = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Number(tagihan.totalTagihan) - totalPembayaran;

    totalTagihan += Number(tagihan.totalTagihan);
    totalTerbayar += totalPembayaran;

    if (tagihan.status === 'lunas') totalLunas++;
    else if (tagihan.status === 'belum_bayar') totalBelumBayar++;
    else totalSebagian++;

    return {
      ...tagihan,
      totalPembayaran,
      sisaTagihan,
      nominal: Number(tagihan.nominal),
      diskon: Number(tagihan.diskon),
      totalTagihan: Number(tagihan.totalTagihan),
      pembayaran: tagihan.pembayaran.map((p) => ({
        ...p,
        nominal: Number(p.nominal),
      })),
    };
  });

  return NextResponse.json({
    success: true,
    data: processedList,
    summary: {
      bulan,
      tahun,
      totalTagihan,
      totalTerbayar,
      totalTunggakan: totalTagihan - totalTerbayar,
      totalLunas,
      totalBelumBayar,
      totalSebagian,
      totalAnak: tagihanList.length,
    },
  });
}

// ===========================================
// HANDLER: TUNGGAKAN
// ===========================================
async function handleTunggakan(searchParams: URLSearchParams) {
  const paket = searchParams.get('paket') || 'all';

  // Build where for anak
  const anakWhere: Record<string, unknown> = {
    status: 'aktif',
  };

  if (paket !== 'all') {
    anakWhere.paketLayanan = paket;
  }

  // Get all unpaid tagihan grouped by anak
  const tunggakanList = await prisma.daycareTagihanBulanan.findMany({
    where: {
      status: { not: 'lunas' },
      anak: anakWhere,
    },
    include: {
      anak: {
        select: {
          id: true,
          nomorInduk: true,
          namaLengkap: true,
          paketLayanan: true,
        },
      },
      pembayaran: {
        select: { nominal: true },
      },
    },
    orderBy: [
      { tahun: 'asc' },
      { bulan: 'asc' },
    ],
  });

  // Get primary contact for each anak
  const anakIds = [...new Set(tunggakanList.map((t) => t.anakId))];
  const contacts = await prisma.daycareOrangTua.findMany({
    where: {
      anakId: { in: anakIds },
      isPrimary: true,
    },
    select: {
      anakId: true,
      nama: true,
      nomorHP: true,
    },
  });

  const contactMap = new Map(contacts.map((c) => [c.anakId, c]));

  // Group tunggakan by anak
  const tunggakanByAnak = new Map<string, {
    anak: {
      id: string;
      nomorInduk: string;
      namaLengkap: string;
      paketLayanan: string;
    };
    orangTuaKontak?: {
      nama: string;
      nomorHP?: string | null;
    };
    tunggakan: { bulan: number; tahun: number; nominal: number }[];
    totalTunggakan: number;
  }>();

  for (const tagihan of tunggakanList) {
    const totalBayar = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Number(tagihan.totalTagihan) - totalBayar;

    if (sisaTagihan <= 0) continue;

    if (!tunggakanByAnak.has(tagihan.anakId)) {
      const contact = contactMap.get(tagihan.anakId);
      tunggakanByAnak.set(tagihan.anakId, {
        anak: tagihan.anak,
        orangTuaKontak: contact ? {
          nama: contact.nama,
          nomorHP: contact.nomorHP,
        } : undefined,
        tunggakan: [],
        totalTunggakan: 0,
      });
    }

    const entry = tunggakanByAnak.get(tagihan.anakId)!;
    entry.tunggakan.push({
      bulan: tagihan.bulan,
      tahun: tagihan.tahun,
      nominal: sisaTagihan,
    });
    entry.totalTunggakan += sisaTagihan;
  }

  // Convert to array and sort by total tunggakan descending
  const result = Array.from(tunggakanByAnak.values()).sort(
    (a, b) => b.totalTunggakan - a.totalTunggakan
  );

  // Calculate total
  const totalTunggakan = result.reduce((sum, r) => sum + r.totalTunggakan, 0);

  return NextResponse.json({
    success: true,
    data: result,
    summary: {
      totalTunggakan,
      jumlahAnakMenunggak: result.length,
    },
  });
}

// ===========================================
// HANDLER: PEMASUKAN
// ===========================================
async function handlePemasukan(searchParams: URLSearchParams) {
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Default to current month if not specified
  const now = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Get all pembayaran in the period
  const [pembayaranPendaftaran, pembayaranBulanan, pembayaranHarian] = await Promise.all([
    // Pembayaran Pendaftaran
    prisma.daycarePembayaranPendaftaran.findMany({
      where: {
        tanggalBayar: {
          gte: start,
          lte: end,
        },
      },
      include: {
        pendaftaran: {
          include: {
            anak: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
              },
            },
          },
        },
      },
      orderBy: { tanggalBayar: 'asc' },
    }),

    // Pembayaran Bulanan
    prisma.daycarePembayaranBulanan.findMany({
      where: {
        tanggalBayar: {
          gte: start,
          lte: end,
        },
      },
      include: {
        tagihan: {
          include: {
            anak: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
              },
            },
          },
        },
      },
      orderBy: { tanggalBayar: 'asc' },
    }),

    // Pembayaran Harian
    prisma.daycarePembayaranHarian.findMany({
      where: {
        tanggalBayar: {
          gte: start,
          lte: end,
        },
      },
      include: {
        tagihan: {
          include: {
            kehadiran: {
              include: {
                anak: {
                  select: {
                    id: true,
                    nomorInduk: true,
                    namaLengkap: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { tanggalBayar: 'asc' },
    }),
  ]);

  // Calculate totals
  const totalPendaftaran = pembayaranPendaftaran.reduce(
    (sum, p) => sum + Number(p.nominal),
    0
  );
  const totalBulanan = pembayaranBulanan.reduce(
    (sum, p) => sum + Number(p.nominal),
    0
  );
  const totalHarian = pembayaranHarian.reduce(
    (sum, p) => sum + Number(p.nominal),
    0
  );

  // Build detail list
  const details = [
    ...pembayaranPendaftaran.map((p) => ({
      id: p.id,
      tanggal: p.tanggalBayar,
      jenis: 'Pendaftaran',
      anak: p.pendaftaran.anak.namaLengkap,
      anakId: p.pendaftaran.anak.id,
      nominal: Number(p.nominal),
      metodePembayaran: p.metodePembayaran,
    })),
    ...pembayaranBulanan.map((p) => ({
      id: p.id,
      tanggal: p.tanggalBayar,
      jenis: `Bulanan (${p.tagihan.bulan}/${p.tagihan.tahun})`,
      anak: p.tagihan.anak.namaLengkap,
      anakId: p.tagihan.anak.id,
      nominal: Number(p.nominal),
      metodePembayaran: p.metodePembayaran,
    })),
    ...pembayaranHarian.map((p) => ({
      id: p.id,
      tanggal: p.tanggalBayar,
      jenis: 'Harian',
      anak: p.tagihan.kehadiran[0]?.anak?.namaLengkap || '-',
      anakId: p.tagihan.kehadiran[0]?.anak?.id || '',
      nominal: Number(p.nominal),
      metodePembayaran: p.metodePembayaran,
    })),
  ].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  return NextResponse.json({
    success: true,
    data: details,
    summary: {
      periodStart: start,
      periodEnd: end,
      totalPemasukan: totalPendaftaran + totalBulanan + totalHarian,
      breakdown: {
        pendaftaran: totalPendaftaran,
        bulanan: totalBulanan,
        harian: totalHarian,
      },
      jumlahTransaksi: details.length,
    },
  });
}

// ===========================================
// HANDLER: KEHADIRAN (untuk paket HARIAN)
// ===========================================
async function handleKehadiran(searchParams: URLSearchParams) {
  const bulan = parseInt(searchParams.get('bulan') || String(new Date().getMonth() + 1));
  const tahun = parseInt(searchParams.get('tahun') || String(new Date().getFullYear()));

  // Get start and end of month
  const startDate = new Date(tahun, bulan - 1, 1);
  const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

  // Get all anak with HARIAN paket
  const anakHarian = await prisma.daycareAnak.findMany({
    where: {
      paketLayanan: 'HARIAN',
      status: 'aktif',
    },
    select: {
      id: true,
      nomorInduk: true,
      namaLengkap: true,
    },
    orderBy: { namaLengkap: 'asc' },
  });

  // Get kehadiran for the month
  const kehadiranList = await prisma.daycareKehadiranHarian.findMany({
    where: {
      tanggal: {
        gte: startDate,
        lte: endDate,
      },
      anak: {
        paketLayanan: 'HARIAN',
      },
    },
    include: {
      anak: {
        select: {
          id: true,
          nomorInduk: true,
          namaLengkap: true,
        },
      },
    },
  });

  // Group by anak
  const kehadiranByAnak = new Map<string, {
    anak: { id: string; nomorInduk: string; namaLengkap: string };
    totalHadir: number;
    totalTidakHadir: number;
    totalHari: number;
    details: { tanggal: Date; isHadir: boolean }[];
  }>();

  // Initialize all anak
  for (const anak of anakHarian) {
    kehadiranByAnak.set(anak.id, {
      anak,
      totalHadir: 0,
      totalTidakHadir: 0,
      totalHari: 0,
      details: [],
    });
  }

  // Populate with kehadiran data
  for (const kehadiran of kehadiranList) {
    const entry = kehadiranByAnak.get(kehadiran.anakId);
    if (entry) {
      entry.totalHari++;
      if (kehadiran.isHadir) {
        entry.totalHadir++;
      } else {
        entry.totalTidakHadir++;
      }
      entry.details.push({
        tanggal: kehadiran.tanggal,
        isHadir: kehadiran.isHadir,
      });
    }
  }

  const result = Array.from(kehadiranByAnak.values());

  // Calculate totals
  const totalKehadiranBulanIni = result.reduce((sum, r) => sum + r.totalHadir, 0);
  const totalTidakHadirBulanIni = result.reduce((sum, r) => sum + r.totalTidakHadir, 0);

  return NextResponse.json({
    success: true,
    data: result,
    summary: {
      bulan,
      tahun,
      totalAnakHarian: anakHarian.length,
      totalKehadiran: totalKehadiranBulanIni,
      totalTidakHadir: totalTidakHadirBulanIni,
    },
  });
}
