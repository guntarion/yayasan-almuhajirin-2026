import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    // Fetch all registrants with their participants
    const registrants = await prisma.runMadanRegistrant.findMany({
      include: {
        participants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const totalRegistrants = registrants.length;
    const totalParticipants = registrants.reduce((sum, r) => sum + r.participants.length, 0);
    const totalRevenue = totalParticipants * 100000;

    // Count by payment status
    const paymentStats = {
      belum_bayar: registrants.filter((r) => r.statusPembayaran === 'belum_bayar').length,
      menunggu_konfirmasi: registrants.filter((r) => r.statusPembayaran === 'menunggu_konfirmasi').length,
      lunas: registrants.filter((r) => r.statusPembayaran === 'lunas').length,
      ditolak: registrants.filter((r) => r.statusPembayaran === 'ditolak').length,
    };

    // Count participants by gender
    const genderStats = {
      lelaki: registrants.reduce(
        (sum, r) => sum + r.participants.filter((p) => p.jenisKelamin === 'lelaki').length,
        0
      ),
      perempuan: registrants.reduce(
        (sum, r) => sum + r.participants.filter((p) => p.jenisKelamin === 'perempuan').length,
        0
      ),
    };

    // Count by activity preference
    const activityStats = {
      FULL_LARI: registrants.reduce(
        (sum, r) => sum + r.participants.filter((p) => p.preferensiAktivitas === 'FULL_LARI').length,
        0
      ),
      LARI_JALAN: registrants.reduce(
        (sum, r) => sum + r.participants.filter((p) => p.preferensiAktivitas === 'LARI_JALAN').length,
        0
      ),
      JALAN: registrants.reduce(
        (sum, r) => sum + r.participants.filter((p) => p.preferensiAktivitas === 'JALAN').length,
        0
      ),
    };

    // Shirt size distribution
    const shirtSizeStats = {
      S: registrants.reduce((sum, r) => sum + r.participants.filter((p) => p.ukuranKaos === 'S').length, 0),
      M: registrants.reduce((sum, r) => sum + r.participants.filter((p) => p.ukuranKaos === 'M').length, 0),
      L: registrants.reduce((sum, r) => sum + r.participants.filter((p) => p.ukuranKaos === 'L').length, 0),
      XL: registrants.reduce((sum, r) => sum + r.participants.filter((p) => p.ukuranKaos === 'XL').length, 0),
      XXL: registrants.reduce((sum, r) => sum + r.participants.filter((p) => p.ukuranKaos === 'XXL').length, 0),
    };

    return NextResponse.json({
      success: true,
      statistics: {
        totalRegistrants,
        totalParticipants,
        totalRevenue,
        paymentStats,
        genderStats,
        activityStats,
        shirtSizeStats,
      },
      registrants: registrants.map((r) => ({
        id: r.id,
        nomorRegistrasi: r.nomorRegistrasi,
        nama: r.nama,
        nomorHP: r.nomorHP,
        email: r.email,
        alamat: r.alamat,
        statusPembayaran: r.statusPembayaran,
        tanggalBayar: r.tanggalBayar,
        createdAt: r.createdAt,
        participants: r.participants.map((p) => ({
          id: p.id,
          namaLengkap: p.namaLengkap,
          jenisKelamin: p.jenisKelamin,
          usia: p.usia,
          ukuranKaos: p.ukuranKaos,
          preferensiAktivitas: p.preferensiAktivitas,
          nomorBib: p.nomorBib,
        })),
      })),
    });
  } catch (error) {
    console.error('Fetch registrants error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data pendaftaran' }, { status: 500 });
  }
}
