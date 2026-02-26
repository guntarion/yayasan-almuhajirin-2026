import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Gender, UkuranKaos, PreferensiAktivitas } from '@prisma/client';

// Helper to generate registration number
async function generateRegistrationNumber() {
  const year = new Date().getFullYear();
  const latestRegistrant = await prisma.runMadanRegistrant.findFirst({
    where: {
      nomorRegistrasi: {
        startsWith: `RM-${year}-`,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let sequence = 1;
  if (latestRegistrant) {
    const match = latestRegistrant.nomorRegistrasi.match(/RM-\d{4}-(\d{4})/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }

  return `RM-${year}-${sequence.toString().padStart(4, '0')}`;
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

interface ParticipantData {
  namaLengkap: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir: string;
  ukuranKaos: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  preferensiAktivitas: 'FULL_LARI' | 'LARI_JALAN' | 'JALAN';
}

interface RegistrationData {
  registrant: {
    nama: string;
    nomorHP: string;
    email?: string;
    alamat: string;
  };
  participants: ParticipantData[];
}

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json();

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
        !participant.ukuranKaos ||
        !participant.preferensiAktivitas
      ) {
        return NextResponse.json(
          { error: 'Semua field peserta harus diisi lengkap' },
          { status: 400 }
        );
      }
    }

    // Generate registration number
    const nomorRegistrasi = await generateRegistrationNumber();

    // Calculate total cost (Rp 50,000 per participant)
    const totalBiaya = data.participants.length * 50000;

    // Create registrant and participants in a transaction
    const result = await prisma.runMadanRegistrant.create({
      data: {
        nomorRegistrasi,
        nama,
        nomorHP,
        email: email || null,
        alamat,
        participants: {
          create: data.participants.map((p) => {
            const birthDate = new Date(p.tanggalLahir);
            const age = calculateAge(birthDate);

            return {
              namaLengkap: p.namaLengkap,
              jenisKelamin: p.jenisKelamin as Gender,
              tanggalLahir: birthDate,
              ukuranKaos: p.ukuranKaos as UkuranKaos,
              preferensiAktivitas: p.preferensiAktivitas as PreferensiAktivitas,
              usia: age,
            };
          }),
        },
      },
      include: {
        participants: true,
      },
    });

    // Return success response with registration details
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil!',
      data: {
        nomorRegistrasi: result.nomorRegistrasi,
        nama: result.nama,
        nomorHP: result.nomorHP,
        email: result.email,
        jumlahPeserta: result.participants.length,
        totalBiaya,
        participants: result.participants.map((p) => ({
          namaLengkap: p.namaLengkap,
          usia: p.usia,
          ukuranKaos: p.ukuranKaos,
        })),
        instruksiPembayaran: {
          bank: 'BRI',
          nomorRekening: '0211.01.004869.53.6',
          atasNama: 'Al Muhajirin Rewwin',
          nominal: totalBiaya,
          whatsapp: '+62 812-5906-069',
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status by phone number
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

    const registrant = await prisma.runMadanRegistrant.findFirst({
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
        statusPembayaran: registrant.statusPembayaran,
        tanggalBayar: registrant.tanggalBayar,
        jumlahPeserta: registrant.participants.length,
        participants: registrant.participants,
      },
    });
  } catch (error) {
    console.error('Get registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}
