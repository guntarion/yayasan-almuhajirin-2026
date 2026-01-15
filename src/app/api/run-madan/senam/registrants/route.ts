import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    // Fetch all senam registrants with their participants
    const registrants = await prisma.senamRegistrant.findMany({
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

    // Count by confirmation status
    const confirmationStats = {
      belum_terkonfirmasi: registrants.filter((r) => r.statusKonfirmasi === 'belum_terkonfirmasi').length,
      terkonfirmasi: registrants.filter((r) => r.statusKonfirmasi === 'terkonfirmasi').length,
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

    // Count by community interest
    const communityStats = {
      SENAM_SEHAT: 0,
      SENAM_AQUATIK_LANSIA: 0,
      LINE_DANCE: 0,
      POUND_FITNESS: 0,
    };

    // Count by health condition
    const healthStats: Record<string, number> = {
      HIPERTENSI: 0,
      DIABETES: 0,
      ASAM_URAT: 0,
      KOLESTEROL: 0,
      JANTUNG: 0,
      ASMA: 0,
      STROKE: 0,
      NYERI_SENDI: 0,
      OSTEOPOROSIS: 0,
      VERTIGO: 0,
      LAINNYA: 0,
      TIDAK_ADA: 0,
    };

    // Calculate age group stats
    const ageGroupStats = {
      anak: 0,       // < 18
      dewasa: 0,     // 18-40
      paruhBaya: 0,  // 41-60
      lansia: 0,     // > 60
    };

    // Process participants for statistics
    registrants.forEach((r) => {
      r.participants.forEach((p) => {
        // Parse community interests (stored as JSON string)
        try {
          const interests = JSON.parse(p.minatKomunitas || '[]');
          interests.forEach((interest: string) => {
            if (interest in communityStats) {
              communityStats[interest as keyof typeof communityStats]++;
            }
          });
        } catch {
          // Ignore parsing errors
        }

        // Parse health conditions (stored as JSON string)
        try {
          const conditions = JSON.parse(p.kondisiKesehatan || '[]');
          conditions.forEach((condition: string) => {
            if (condition in healthStats) {
              healthStats[condition]++;
            }
          });
        } catch {
          // Ignore parsing errors
        }

        // Age group calculation
        if (p.usia) {
          if (p.usia < 18) {
            ageGroupStats.anak++;
          } else if (p.usia <= 40) {
            ageGroupStats.dewasa++;
          } else if (p.usia <= 60) {
            ageGroupStats.paruhBaya++;
          } else {
            ageGroupStats.lansia++;
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      statistics: {
        totalRegistrants,
        totalParticipants,
        confirmationStats,
        genderStats,
        communityStats,
        healthStats,
        ageGroupStats,
      },
      registrants: registrants.map((r) => ({
        id: r.id,
        nomorRegistrasi: r.nomorRegistrasi,
        nama: r.nama,
        nomorHP: r.nomorHP,
        email: r.email,
        alamat: r.alamat,
        statusKonfirmasi: r.statusKonfirmasi,
        tanggalKonfirmasi: r.tanggalKonfirmasi,
        createdAt: r.createdAt,
        participants: r.participants.map((p) => ({
          id: p.id,
          namaLengkap: p.namaLengkap,
          jenisKelamin: p.jenisKelamin,
          usia: p.usia,
          nomorKupon: p.nomorKupon,
          kondisiKesehatan: p.kondisiKesehatan,
          kondisiLainnya: p.kondisiLainnya,
          minatKomunitas: p.minatKomunitas,
          sudahHadir: p.sudahHadir,
        })),
      })),
    });
  } catch (error) {
    console.error('Fetch senam registrants error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data pendaftaran senam' }, { status: 500 });
  }
}
