import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bib = searchParams.get('bib');
    const reg = searchParams.get('reg');

    if (!bib && !reg) {
      return NextResponse.json(
        { error: 'Nomor BIB atau nomor registrasi harus diisi' },
        { status: 400 }
      );
    }

    // Search by BIB number
    if (bib) {
      const participant = await prisma.runMadanParticipant.findFirst({
        where: { nomorBib: bib.toUpperCase() },
        include: { registrant: true },
      });

      if (!participant) {
        return NextResponse.json(
          { error: 'Peserta dengan nomor BIB tersebut tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: [
          {
            namaLengkap: participant.namaLengkap,
            nomorBib: participant.nomorBib,
            preferensiAktivitas: participant.preferensiAktivitas,
            jenisKelamin: participant.jenisKelamin,
            waktuFinish: participant.waktuFinish,
            nomorRegistrasi: participant.registrant.nomorRegistrasi,
          },
        ],
      });
    }

    // Search by registration number
    const registrant = await prisma.runMadanRegistrant.findFirst({
      where: { nomorRegistrasi: reg! },
      include: { participants: true },
    });

    if (!registrant) {
      return NextResponse.json(
        { error: 'Data registrasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registrant.participants.map((p) => ({
        namaLengkap: p.namaLengkap,
        nomorBib: p.nomorBib,
        preferensiAktivitas: p.preferensiAktivitas,
        jenisKelamin: p.jenisKelamin,
        waktuFinish: p.waktuFinish,
        nomorRegistrasi: registrant.nomorRegistrasi,
      })),
    });
  } catch (error) {
    console.error('Certificate lookup error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mencari data peserta' },
      { status: 500 }
    );
  }
}
