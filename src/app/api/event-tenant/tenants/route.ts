import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    // Fetch all tenants
    const tenants = await prisma.eventTenant.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const totalTenants = tenants.length;

    // Count by payment status
    const paymentStats = {
      belum_bayar: tenants.filter((t) => t.statusPembayaran === 'belum_bayar').length,
      menunggu_konfirmasi: tenants.filter((t) => t.statusPembayaran === 'menunggu_konfirmasi').length,
      lunas: tenants.filter((t) => t.statusPembayaran === 'lunas').length,
      ditolak: tenants.filter((t) => t.statusPembayaran === 'ditolak').length,
    };

    // Count by product type
    const productTypeStats = {
      MAKANAN: tenants.filter((t) => t.jenisProduk.includes('MAKANAN')).length,
      MINUMAN: tenants.filter((t) => t.jenisProduk.includes('MINUMAN')).length,
      PRODUK_UMKM: tenants.filter((t) => t.jenisProduk.includes('PRODUK_UMKM')).length,
      PRODUK_KESEHATAN: tenants.filter((t) => t.jenisProduk.includes('PRODUK_KESEHATAN')).length,
      LAINNYA: tenants.filter((t) => t.jenisProduk.includes('LAINNYA')).length,
    };

    // Count by activity participation
    const activityStats = {
      SENAM_PAGI: tenants.filter((t) => t.kegiatanDiikuti === 'SENAM_PAGI').length,
      FUN_RUN: tenants.filter((t) => t.kegiatanDiikuti === 'FUN_RUN').length,
      KEDUANYA: tenants.filter((t) => t.kegiatanDiikuti === 'KEDUANYA').length,
    };

    // Count electricity needs
    const electricityStats = {
      butuhListrik: tenants.filter((t) => t.butuhListrik).length,
      tidakButuhListrik: tenants.filter((t) => !t.butuhListrik).length,
    };

    return NextResponse.json({
      success: true,
      statistics: {
        totalTenants,
        paymentStats,
        productTypeStats,
        activityStats,
        electricityStats,
      },
      tenants: tenants.map((t) => ({
        id: t.id,
        nomorRegistrasi: t.nomorRegistrasi,
        namaEvent: t.namaEvent,
        namaTenant: t.namaTenant,
        namaPenanggungJawab: t.namaPenanggungJawab,
        alamat: t.alamat,
        nomorTelepon: t.nomorTelepon,
        email: t.email,
        jenisProduk: t.jenisProduk,
        jenisProdukLainnya: t.jenisProdukLainnya,
        namaProdukUtama: t.namaProdukUtama,
        deskripsiProduk: t.deskripsiProduk,
        butuhListrik: t.butuhListrik,
        kebutuhanListrik: t.kebutuhanListrik,
        perlengkapanDibawa: t.perlengkapanDibawa,
        kegiatanDiikuti: t.kegiatanDiikuti,
        statusPembayaran: t.statusPembayaran,
        tanggalBayar: t.tanggalBayar,
        status: t.status,
        lokasiStan: t.lokasiStan,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Fetch tenants error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data tenant' }, { status: 500 });
  }
}
