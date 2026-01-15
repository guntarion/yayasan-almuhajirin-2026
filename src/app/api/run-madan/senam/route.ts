import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Gender } from '@prisma/client';

// Helper to generate registration number for Senam
async function generateSenamRegistrationNumber() {
  const year = new Date().getFullYear();
  const latestRegistrant = await prisma.senamRegistrant.findFirst({
    where: {
      nomorRegistrasi: {
        startsWith: `SM-${year}-`,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let sequence = 1;
  if (latestRegistrant) {
    const match = latestRegistrant.nomorRegistrasi.match(/SM-\d{4}-(\d{4})/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }

  return `SM-${year}-${sequence.toString().padStart(4, '0')}`;
}

// Helper to generate kupon number
async function generateKuponNumber(index: number, registrationNumber: string) {
  // Format: KP-SM-2026-XXXX-01 (kupon based on registration + participant index)
  return `KP-${registrationNumber}-${(index + 1).toString().padStart(2, '0')}`;
}

// Helper to calculate age from date of birth
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Valid health conditions
const VALID_HEALTH_CONDITIONS = [
  'HIPERTENSI',
  'DIABETES',
  'ASAM_URAT',
  'KOLESTEROL',
  'JANTUNG',
  'ASMA',
  'STROKE',
  'NYERI_SENDI',
  'OSTEOPOROSIS',
  'VERTIGO',
  'LAINNYA',
  'TIDAK_ADA',
];

// Valid community interests
const VALID_COMMUNITY_INTERESTS = [
  'SENAM_SEHAT',
  'SENAM_AQUATIK_LANSIA',
  'LINE_DANCE',
  'POUND_FITNESS',
];

interface SenamParticipantData {
  namaLengkap: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir: string;
  kondisiKesehatan: string[];
  kondisiLainnya?: string;
  minatKomunitas: string[];
}

interface SenamRegistrationData {
  registrant: {
    nama: string;
    nomorHP: string;
    email?: string;
    alamat: string;
  };
  participants: SenamParticipantData[];
}

export async function POST(request: NextRequest) {
  try {
    const data: SenamRegistrationData = await request.json();

    // Validate data
    if (!data.registrant || !data.participants || data.participants.length === 0) {
      return NextResponse.json(
        { error: 'Data pendaftar dan peserta harus diisi' },
        { status: 400 }
      );
    }

    // Validate registrant
    const { nama, nomorHP, email, alamat } = data.registrant;
    if (!nama || !nomorHP || !alamat) {
      return NextResponse.json(
        { error: 'Nama, nomor HP, dan alamat pendaftar harus diisi' },
        { status: 400 }
      );
    }

    // Validate participants
    for (const participant of data.participants) {
      if (
        !participant.namaLengkap ||
        !participant.jenisKelamin ||
        !participant.tanggalLahir ||
        !participant.kondisiKesehatan ||
        participant.kondisiKesehatan.length === 0 ||
        !participant.minatKomunitas ||
        participant.minatKomunitas.length === 0
      ) {
        return NextResponse.json(
          { error: 'Semua field peserta harus diisi lengkap (nama, jenis kelamin, tanggal lahir, kondisi kesehatan, minat komunitas)' },
          { status: 400 }
        );
      }

      // Validate health conditions
      for (const condition of participant.kondisiKesehatan) {
        if (!VALID_HEALTH_CONDITIONS.includes(condition)) {
          return NextResponse.json(
            { error: `Kondisi kesehatan tidak valid: ${condition}` },
            { status: 400 }
          );
        }
      }

      // Validate community interests
      for (const interest of participant.minatKomunitas) {
        if (!VALID_COMMUNITY_INTERESTS.includes(interest)) {
          return NextResponse.json(
            { error: `Minat komunitas tidak valid: ${interest}` },
            { status: 400 }
          );
        }
      }

      // If LAINNYA is selected, kondisiLainnya must be provided
      if (participant.kondisiKesehatan.includes('LAINNYA') && !participant.kondisiLainnya?.trim()) {
        return NextResponse.json(
          { error: 'Mohon jelaskan kondisi kesehatan lainnya' },
          { status: 400 }
        );
      }
    }

    // Generate registration number
    const nomorRegistrasi = await generateSenamRegistrationNumber();

    // Create registrant and participants in a transaction
    const result = await prisma.senamRegistrant.create({
      data: {
        nomorRegistrasi,
        nama,
        nomorHP,
        email: email || null,
        alamat,
        participants: {
          create: await Promise.all(data.participants.map(async (p, index) => {
            const birthDate = new Date(p.tanggalLahir);
            const age = calculateAge(birthDate);
            const kuponNumber = await generateKuponNumber(index, nomorRegistrasi);

            return {
              nomorKupon: kuponNumber,
              namaLengkap: p.namaLengkap,
              jenisKelamin: p.jenisKelamin as Gender,
              tanggalLahir: birthDate,
              usia: age,
              kondisiKesehatan: JSON.stringify(p.kondisiKesehatan),
              kondisiLainnya: p.kondisiLainnya || null,
              minatKomunitas: JSON.stringify(p.minatKomunitas),
            };
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    // Return success response with registration details
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran Senam Sehat berhasil!',
      data: {
        nomorRegistrasi: result.nomorRegistrasi,
        nama: result.nama,
        nomorHP: result.nomorHP,
        email: result.email,
        jumlahPeserta: result.participants.length,
        participants: result.participants.map((p) => ({
          namaLengkap: p.namaLengkap,
          usia: p.usia,
          nomorKupon: p.nomorKupon,
          kondisiKesehatan: JSON.parse(p.kondisiKesehatan),
          minatKomunitas: JSON.parse(p.minatKomunitas),
        })),
        info: {
          biaya: 'GRATIS',
          pesan: 'Pendaftaran Anda telah berhasil! Tunjukkan nomor kupon saat hadir untuk kesempatan mendapatkan doorprize.',
          waktu: 'Minggu, 8 Februari 2026 - 06:00 WIB',
          lokasi: 'Lapangan Masjid Al Muhajirin Rewwin',
          dresscode: 'Pakaian olahraga menutup aurat, nuansa biru atau putih',
        },
      },
    });
  } catch (error) {
    console.error('Senam registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nomorHP = searchParams.get('nomorHP');
    const nomorRegistrasi = searchParams.get('nomorRegistrasi');

    if (!nomorHP && !nomorRegistrasi) {
      return NextResponse.json(
        { error: 'Nomor HP atau nomor registrasi harus diisi' },
        { status: 400 }
      );
    }

    const registrant = await prisma.senamRegistrant.findFirst({
      where: nomorHP
        ? { nomorHP }
        : { nomorRegistrasi: nomorRegistrasi! },
      include: {
        participants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!registrant) {
      return NextResponse.json(
        { error: 'Data pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        nomorRegistrasi: registrant.nomorRegistrasi,
        nama: registrant.nama,
        nomorHP: registrant.nomorHP,
        jumlahPeserta: registrant.participants.length,
        participants: registrant.participants.map((p) => ({
          namaLengkap: p.namaLengkap,
          usia: p.usia,
          nomorKupon: p.nomorKupon,
          sudahHadir: p.sudahHadir,
        })),
      },
    });
  } catch (error) {
    console.error('Get senam registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}
