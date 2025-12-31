// src/app/api/poliklinik/rekam-medis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hitungIMT } from '@/types/poliklinik';
import { Decimal } from '@prisma/client/runtime/library';

// GET - Get rekam medis by kunjunganId
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const kunjunganId = searchParams.get('kunjunganId');
    const pasienId = searchParams.get('pasienId');

    if (kunjunganId) {
      // Get specific rekam medis by kunjunganId
      const rekamMedis = await prisma.rekamMedisKlinik.findUnique({
        where: { kunjunganId },
        include: {
          kunjungan: {
            include: {
              pasien: true,
            },
          },
          resepObat: {
            include: {
              obat: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return NextResponse.json(rekamMedis);
    }

    if (pasienId) {
      // Get all rekam medis for a pasien
      const rekamMedisList = await prisma.rekamMedisKlinik.findMany({
        where: {
          kunjungan: {
            pasienId,
          },
        },
        include: {
          kunjungan: {
            select: {
              id: true,
              nomorKunjungan: true,
              tanggalKunjungan: true,
              dokter: true,
              jenisPelayanan: true,
            },
          },
          resepObat: {
            include: {
              obat: true,
            },
          },
        },
        orderBy: {
          kunjungan: {
            tanggalKunjungan: 'desc',
          },
        },
      });

      return NextResponse.json(rekamMedisList);
    }

    return NextResponse.json(
      { error: 'Parameter kunjunganId atau pasienId diperlukan' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching rekam medis:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data rekam medis' },
      { status: 500 }
    );
  }
}

// POST - Create rekam medis for a kunjungan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.kunjunganId) {
      return NextResponse.json(
        { error: 'ID Kunjungan wajib diisi' },
        { status: 400 }
      );
    }

    // Check if kunjungan exists and doesn't have rekam medis
    const kunjungan = await prisma.kunjunganKlinik.findUnique({
      where: { id: body.kunjunganId },
      include: {
        rekamMedis: true,
        pasien: {
          select: {
            riwayatAlergi: true,
          },
        },
      },
    });

    if (!kunjungan) {
      return NextResponse.json(
        { error: 'Kunjungan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (kunjungan.rekamMedis) {
      return NextResponse.json(
        { error: 'Kunjungan ini sudah memiliki rekam medis' },
        { status: 400 }
      );
    }

    // Calculate IMT if weight and height provided
    let imt: Decimal | null = null;
    if (body.beratBadan && body.tinggiBadan) {
      const imtValue = hitungIMT(Number(body.beratBadan), Number(body.tinggiBadan));
      imt = new Decimal(imtValue);
    }

    // Create rekam medis
    const rekamMedis = await prisma.rekamMedisKlinik.create({
      data: {
        kunjunganId: body.kunjunganId,
        // Anamnesis
        keluhanUtama: body.keluhanUtama || null,
        riwayatPenyakitSekarang: body.riwayatPenyakitSekarang || null,
        riwayatPenyakitDahulu: body.riwayatPenyakitDahulu || null,
        riwayatAlergi: body.riwayatAlergi || kunjungan.pasien.riwayatAlergi || null,
        riwayatObat: body.riwayatObat || null,
        // Pemeriksaan Fisik
        tekananDarahSistolik: body.tekananDarahSistolik || null,
        tekananDarahDiastolik: body.tekananDarahDiastolik || null,
        nadi: body.nadi || null,
        suhu: body.suhu ? new Decimal(body.suhu) : null,
        pernapasan: body.pernapasan || null,
        beratBadan: body.beratBadan ? new Decimal(body.beratBadan) : null,
        tinggiBadan: body.tinggiBadan ? new Decimal(body.tinggiBadan) : null,
        imt,
        gulaDarah: body.gulaDarah || null,
        kolesterol: body.kolesterol || null,
        asamUrat: body.asamUrat ? new Decimal(body.asamUrat) : null,
        catatanPemeriksaan: body.catatanPemeriksaan || null,
        // Diagnosis
        diagnosisUtama: body.diagnosisUtama || null,
        diagnosisTambahan: body.diagnosisTambahan || null,
        kodeICD10: body.kodeICD10 || null,
        // Tindakan
        tindakanMedis: body.tindakanMedis || null,
        edukasiPasien: body.edukasiPasien || null,
        // Rencana
        rencanaSelanjutnya: body.rencanaSelanjutnya || null,
        tanggalKontrol: body.tanggalKontrol ? new Date(body.tanggalKontrol) : null,
        rujukan: body.rujukan || null,
        updatedBy: body.updatedBy || null,
      },
      include: {
        kunjungan: {
          include: {
            pasien: true,
          },
        },
      },
    });

    // Update kunjungan status to 'dalam_pemeriksaan' if still 'menunggu'
    if (kunjungan.statusKunjungan === 'menunggu') {
      await prisma.kunjunganKlinik.update({
        where: { id: body.kunjunganId },
        data: { statusKunjungan: 'dalam_pemeriksaan' },
      });
    }

    return NextResponse.json(rekamMedis, { status: 201 });
  } catch (error) {
    console.error('Error creating rekam medis:', error);
    return NextResponse.json(
      { error: 'Gagal membuat rekam medis' },
      { status: 500 }
    );
  }
}
