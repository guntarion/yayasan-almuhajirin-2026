// src/app/api/kbtk/laporan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const tahunAjaran = searchParams.get('tahunAjaran');
    const bulan = searchParams.get('bulan');
    const tahun = searchParams.get('tahun');
    const bulanDari = searchParams.get('bulanDari');
    const tahunDari = searchParams.get('tahunDari');
    const bulanSampai = searchParams.get('bulanSampai');
    const tahunSampai = searchParams.get('tahunSampai');

    switch (type) {
      case 'siswa-aktif':
        return await getSiswaAktif(tahunAjaran);

      case 'rekap-spp':
        if (!bulan || !tahun) {
          return NextResponse.json(
            { error: 'Parameter bulan dan tahun diperlukan' },
            { status: 400 }
          );
        }
        return await getRekapSpp(parseInt(bulan), parseInt(tahun));

      case 'tunggakan':
        return await getTunggakan(tahunAjaran);

      case 'pemasukan':
        if (!bulanDari || !tahunDari || !bulanSampai || !tahunSampai) {
          return NextResponse.json(
            { error: 'Parameter periode diperlukan' },
            { status: 400 }
          );
        }
        return await getPemasukan(
          parseInt(bulanDari),
          parseInt(tahunDari),
          parseInt(bulanSampai),
          parseInt(tahunSampai)
        );

      case 'pelunasan-pendaftaran':
        return await getPelunasanPendaftaran(tahunAjaran);

      default:
        return NextResponse.json(
          { error: 'Tipe laporan tidak valid' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data laporan' },
      { status: 500 }
    );
  }
}

async function getSiswaAktif(tahunAjaran: string | null) {
  const whereClause: Record<string, unknown> = {
    status: 'aktif',
  };

  if (tahunAjaran && tahunAjaran !== 'all') {
    whereClause.tahunAjaran = tahunAjaran;
  }

  const siswa = await prisma.kbtkSiswa.findMany({
    where: whereClause,
    include: {
      orangTua: true,
    },
    orderBy: [
      { kelompokLevel: 'asc' },
      { kelompokKelas: 'asc' },
      { namaLengkap: 'asc' },
    ],
  });

  // Transform data
  const transformedData = siswa.map((s) => ({
    id: s.id,
    nomorInduk: s.nomorInduk,
    namaLengkap: s.namaLengkap,
    namaPanggilan: s.namaPanggilan,
    jenisKelamin: s.jenisKelamin,
    kelompokLevel: s.kelompokLevel,
    kelompokKelas: s.kelompokKelas,
    tahunAjaran: s.tahunAjaran,
    tanggalMasuk: s.tanggalMasuk.toISOString(),
    status: s.status,
    orangTua: s.orangTua.map((ot) => ({
      nama: ot.nama,
      relasi: ot.relasi,
      nomorHP: ot.nomorHP,
      isPrimary: ot.isPrimary,
    })),
  }));

  // Calculate summary
  const summary = {
    total: siswa.length,
    byKelompok: {} as Record<string, number>,
  };

  siswa.forEach((s) => {
    const key = `${s.kelompokLevel} ${s.kelompokKelas}`;
    summary.byKelompok[key] = (summary.byKelompok[key] || 0) + 1;
  });

  return NextResponse.json({
    data: transformedData,
    summary,
  });
}

async function getRekapSpp(bulan: number, tahun: number) {
  const tagihan = await prisma.kbtkTagihanSpp.findMany({
    where: {
      bulan,
      tahun,
    },
    include: {
      siswa: true,
      pembayaran: true,
    },
    orderBy: {
      siswa: {
        namaLengkap: 'asc',
      },
    },
  });

  const transformedData = tagihan.map((t) => {
    const totalBayar = t.pembayaran.reduce(
      (acc, p) => acc + Number(p.nominal),
      0
    );
    const sisa = Number(t.totalTagihan) - totalBayar;

    return {
      id: t.id,
      siswaId: t.siswaId,
      namaSiswa: t.siswa.namaLengkap,
      nomorInduk: t.siswa.nomorInduk,
      kelompokLevel: t.siswa.kelompokLevel,
      kelompokKelas: t.siswa.kelompokKelas,
      bulan: t.bulan,
      tahun: t.tahun,
      nominal: Number(t.nominal),
      diskon: Number(t.diskon),
      totalTagihan: Number(t.totalTagihan),
      totalBayar,
      sisa,
      status: sisa === 0 ? 'lunas' : sisa < Number(t.totalTagihan) ? 'bayar_sebagian' : 'belum_bayar',
    };
  });

  const summary = {
    totalTagihan: transformedData.reduce((acc, t) => acc + t.totalTagihan, 0),
    totalBayar: transformedData.reduce((acc, t) => acc + t.totalBayar, 0),
    totalTunggakan: transformedData.reduce((acc, t) => acc + t.sisa, 0),
    jumlahLunas: transformedData.filter((t) => t.status === 'lunas').length,
    jumlahBelumLunas: transformedData.filter((t) => t.status !== 'lunas').length,
    total: transformedData.length,
  };

  return NextResponse.json({
    data: transformedData,
    summary,
  });
}

async function getTunggakan(tahunAjaran: string | null) {
  const whereClause: Record<string, unknown> = {
    siswa: {
      status: 'aktif',
    },
    status: {
      not: 'lunas',
    },
  };

  if (tahunAjaran && tahunAjaran !== 'all') {
    whereClause.siswa = {
      ...whereClause.siswa as Record<string, unknown>,
      tahunAjaran,
    };
  }

  const tagihan = await prisma.kbtkTagihanSpp.findMany({
    where: whereClause,
    include: {
      siswa: {
        include: {
          orangTua: {
            where: {
              isPrimary: true,
            },
          },
        },
      },
      pembayaran: true,
    },
    orderBy: {
      siswa: {
        namaLengkap: 'asc',
      },
    },
  });

  // Group by siswa
  const siswaTunggakan = new Map<string, {
    siswaId: string;
    namaSiswa: string;
    nomorInduk: string;
    kelompokLevel: string;
    kelompokKelas: string;
    orangTuaUtama: string;
    nomorHP: string | null;
    tunggakanBulan: Array<{ bulan: number; tahun: number; nominal: number }>;
    totalTunggakan: number;
  }>();

  tagihan.forEach((t) => {
    const totalBayar = t.pembayaran.reduce(
      (acc, p) => acc + Number(p.nominal),
      0
    );
    const sisa = Number(t.totalTagihan) - totalBayar;

    if (sisa <= 0) return;

    const existing = siswaTunggakan.get(t.siswaId);
    if (existing) {
      existing.tunggakanBulan.push({
        bulan: t.bulan,
        tahun: t.tahun,
        nominal: sisa,
      });
      existing.totalTunggakan += sisa;
    } else {
      const primaryOrangTua = t.siswa.orangTua[0];
      siswaTunggakan.set(t.siswaId, {
        siswaId: t.siswaId,
        namaSiswa: t.siswa.namaLengkap,
        nomorInduk: t.siswa.nomorInduk,
        kelompokLevel: t.siswa.kelompokLevel,
        kelompokKelas: t.siswa.kelompokKelas,
        orangTuaUtama: primaryOrangTua?.nama || '-',
        nomorHP: primaryOrangTua?.nomorHP || null,
        tunggakanBulan: [{
          bulan: t.bulan,
          tahun: t.tahun,
          nominal: sisa,
        }],
        totalTunggakan: sisa,
      });
    }
  });

  const transformedData = Array.from(siswaTunggakan.values())
    .map((s, index) => ({
      id: String(index + 1),
      ...s,
    }))
    .sort((a, b) => b.totalTunggakan - a.totalTunggakan);

  const summary = {
    totalTunggakan: transformedData.reduce((acc, t) => acc + t.totalTunggakan, 0),
    totalSiswa: transformedData.length,
  };

  return NextResponse.json({
    data: transformedData,
    summary,
  });
}

async function getPemasukan(
  bulanDari: number,
  tahunDari: number,
  bulanSampai: number,
  tahunSampai: number
) {
  const startDate = new Date(tahunDari, bulanDari - 1, 1);
  const endDate = new Date(tahunSampai, bulanSampai, 0, 23, 59, 59);

  // Get SPP payments
  const pembayaranSpp = await prisma.kbtkPembayaranSpp.findMany({
    where: {
      tanggalBayar: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      tagihan: {
        include: {
          siswa: true,
        },
      },
    },
    orderBy: {
      tanggalBayar: 'desc',
    },
  });

  // Get registration payments
  const pembayaranPendaftaran = await prisma.kbtkPembayaranPendaftaran.findMany({
    where: {
      tanggalBayar: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      pendaftaran: {
        include: {
          siswa: true,
        },
      },
    },
    orderBy: {
      tanggalBayar: 'desc',
    },
  });

  // Transform SPP payments
  const sppData = pembayaranSpp.map((p) => ({
    id: p.id,
    tanggal: p.tanggalBayar.toISOString().split('T')[0],
    jenis: 'spp' as const,
    namaSiswa: p.tagihan.siswa.namaLengkap,
    nomorInduk: p.tagihan.siswa.nomorInduk,
    nominal: Number(p.nominal),
    metodePembayaran: p.metodePembayaran,
    keterangan: p.catatan || `SPP ${p.tagihan.bulan}/${p.tagihan.tahun}`,
  }));

  // Transform registration payments
  const pendaftaranData = pembayaranPendaftaran.map((p) => ({
    id: p.id,
    tanggal: p.tanggalBayar.toISOString().split('T')[0],
    jenis: 'pendaftaran' as const,
    namaSiswa: p.pendaftaran.siswa.namaLengkap,
    nomorInduk: p.pendaftaran.siswa.nomorInduk,
    nominal: Number(p.nominal),
    metodePembayaran: p.metodePembayaran,
    keterangan: p.catatan || `Pendaftaran ${p.pendaftaran.tahunAjaran}`,
  }));

  // Combine and sort by date
  const allPayments = [...sppData, ...pendaftaranData].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  // Calculate summary
  const pemasukanPendaftaran = pendaftaranData.reduce((acc, p) => acc + p.nominal, 0);
  const pemasukanSpp = sppData.reduce((acc, p) => acc + p.nominal, 0);

  const summary = {
    pemasukanPendaftaran,
    pemasukanSpp,
    totalPemasukan: pemasukanPendaftaran + pemasukanSpp,
    byCash: allPayments.filter((p) => p.metodePembayaran === 'cash').reduce((acc, p) => acc + p.nominal, 0),
    byTransfer: allPayments.filter((p) => p.metodePembayaran === 'transfer').reduce((acc, p) => acc + p.nominal, 0),
    totalTransaksi: allPayments.length,
  };

  return NextResponse.json({
    data: allPayments,
    summary,
  });
}

async function getPelunasanPendaftaran(tahunAjaran: string | null) {
  const whereClause: Record<string, unknown> = {};

  if (tahunAjaran && tahunAjaran !== 'all') {
    whereClause.tahunAjaran = tahunAjaran;
  }

  const pendaftaran = await prisma.kbtkPendaftaran.findMany({
    where: whereClause,
    include: {
      siswa: true,
      pembayaran: true,
    },
    orderBy: {
      tanggalDaftar: 'desc',
    },
  });

  const transformedData = pendaftaran.map((p) => {
    const totalBayar = p.pembayaran.reduce(
      (acc, pb) => acc + Number(pb.nominal),
      0
    );
    const sisa = Number(p.biayaPendaftaran) - totalBayar;

    return {
      id: p.id,
      siswaId: p.siswaId,
      namaSiswa: p.siswa.namaLengkap,
      nomorInduk: p.siswa.nomorInduk,
      program: p.program,
      tahunAjaran: p.tahunAjaran,
      tanggalDaftar: p.tanggalDaftar.toISOString().split('T')[0],
      biayaPendaftaran: Number(p.biayaPendaftaran),
      totalBayar,
      sisa,
      schemaPembayaran: p.schemaPembayaran,
      status: sisa === 0 ? 'lunas' : 'belum_lunas',
      jumlahCicilan: p.pembayaran.length,
    };
  });

  const summary = {
    totalDaftar: transformedData.length,
    lunas: transformedData.filter((p) => p.status === 'lunas').length,
    belumLunas: transformedData.filter((p) => p.status === 'belum_lunas').length,
    persentaseLunas: transformedData.length > 0
      ? Math.round((transformedData.filter((p) => p.status === 'lunas').length / transformedData.length) * 100)
      : 0,
    totalBiaya: transformedData.reduce((acc, p) => acc + p.biayaPendaftaran, 0),
    totalTerbayar: transformedData.reduce((acc, p) => acc + p.totalBayar, 0),
    totalSisa: transformedData.reduce((acc, p) => acc + p.sisa, 0),
  };

  return NextResponse.json({
    data: transformedData,
    summary,
  });
}
