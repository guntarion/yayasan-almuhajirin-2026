// src/app/api/poliklinik/rekam-medis/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hitungIMT } from '@/types/poliklinik';
import { Decimal } from '@prisma/client/runtime/library';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single rekam medis with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const rekamMedis = await prisma.rekamMedisKlinik.findUnique({
      where: { id },
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

    if (!rekamMedis) {
      return NextResponse.json(
        { error: 'Rekam medis tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(rekamMedis);
  } catch (error) {
    console.error('Error fetching rekam medis:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data rekam medis' },
      { status: 500 }
    );
  }
}

// PUT - Update rekam medis
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if rekam medis exists
    const existing = await prisma.rekamMedisKlinik.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Rekam medis tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate IMT if weight and height provided
    let imt: Decimal | undefined = undefined;
    const beratBadan = body.beratBadan !== undefined ? body.beratBadan : existing.beratBadan;
    const tinggiBadan = body.tinggiBadan !== undefined ? body.tinggiBadan : existing.tinggiBadan;

    if (beratBadan && tinggiBadan) {
      const imtValue = hitungIMT(Number(beratBadan), Number(tinggiBadan));
      imt = new Decimal(imtValue);
    }

    // Update rekam medis
    const rekamMedis = await prisma.rekamMedisKlinik.update({
      where: { id },
      data: {
        // Anamnesis
        keluhanUtama: body.keluhanUtama !== undefined ? body.keluhanUtama : existing.keluhanUtama,
        riwayatPenyakitSekarang: body.riwayatPenyakitSekarang !== undefined ? body.riwayatPenyakitSekarang : existing.riwayatPenyakitSekarang,
        riwayatPenyakitDahulu: body.riwayatPenyakitDahulu !== undefined ? body.riwayatPenyakitDahulu : existing.riwayatPenyakitDahulu,
        riwayatAlergi: body.riwayatAlergi !== undefined ? body.riwayatAlergi : existing.riwayatAlergi,
        riwayatObat: body.riwayatObat !== undefined ? body.riwayatObat : existing.riwayatObat,
        // Pemeriksaan Fisik
        tekananDarahSistolik: body.tekananDarahSistolik !== undefined ? body.tekananDarahSistolik : existing.tekananDarahSistolik,
        tekananDarahDiastolik: body.tekananDarahDiastolik !== undefined ? body.tekananDarahDiastolik : existing.tekananDarahDiastolik,
        nadi: body.nadi !== undefined ? body.nadi : existing.nadi,
        suhu: body.suhu !== undefined ? (body.suhu ? new Decimal(body.suhu) : null) : existing.suhu,
        pernapasan: body.pernapasan !== undefined ? body.pernapasan : existing.pernapasan,
        beratBadan: body.beratBadan !== undefined ? (body.beratBadan ? new Decimal(body.beratBadan) : null) : existing.beratBadan,
        tinggiBadan: body.tinggiBadan !== undefined ? (body.tinggiBadan ? new Decimal(body.tinggiBadan) : null) : existing.tinggiBadan,
        imt: imt !== undefined ? imt : existing.imt,
        gulaDarah: body.gulaDarah !== undefined ? body.gulaDarah : existing.gulaDarah,
        kolesterol: body.kolesterol !== undefined ? body.kolesterol : existing.kolesterol,
        asamUrat: body.asamUrat !== undefined ? (body.asamUrat ? new Decimal(body.asamUrat) : null) : existing.asamUrat,
        catatanPemeriksaan: body.catatanPemeriksaan !== undefined ? body.catatanPemeriksaan : existing.catatanPemeriksaan,
        // Diagnosis
        diagnosisUtama: body.diagnosisUtama !== undefined ? body.diagnosisUtama : existing.diagnosisUtama,
        diagnosisTambahan: body.diagnosisTambahan !== undefined ? body.diagnosisTambahan : existing.diagnosisTambahan,
        kodeICD10: body.kodeICD10 !== undefined ? body.kodeICD10 : existing.kodeICD10,
        // Tindakan
        tindakanMedis: body.tindakanMedis !== undefined ? body.tindakanMedis : existing.tindakanMedis,
        edukasiPasien: body.edukasiPasien !== undefined ? body.edukasiPasien : existing.edukasiPasien,
        // Rencana
        rencanaSelanjutnya: body.rencanaSelanjutnya !== undefined ? body.rencanaSelanjutnya : existing.rencanaSelanjutnya,
        tanggalKontrol: body.tanggalKontrol !== undefined ? (body.tanggalKontrol ? new Date(body.tanggalKontrol) : null) : existing.tanggalKontrol,
        rujukan: body.rujukan !== undefined ? body.rujukan : existing.rujukan,
        updatedBy: body.updatedBy || null,
      },
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
  } catch (error) {
    console.error('Error updating rekam medis:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate rekam medis' },
      { status: 500 }
    );
  }
}

// Add resep to rekam medis
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if rekam medis exists
    const existing = await prisma.rekamMedisKlinik.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Rekam medis tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate required fields for resep
    if (!body.namaObat) {
      return NextResponse.json(
        { error: 'Nama obat wajib diisi' },
        { status: 400 }
      );
    }

    // Create resep
    const resep = await prisma.resepObatKlinik.create({
      data: {
        rekamMedisId: id,
        obatId: body.obatId || null,
        namaObat: body.namaObat,
        dosis: body.dosis || null,
        aturanPakai: body.aturanPakai || null,
        lamaPemakaian: body.lamaPemakaian || null,
        jumlahObat: body.jumlahObat || 1,
        satuan: body.satuan || 'tablet',
        keterangan: body.keterangan || null,
      },
      include: {
        obat: true,
      },
    });

    // Update stok obat if obatId provided
    if (body.obatId) {
      await prisma.masterObat.update({
        where: { id: body.obatId },
        data: {
          stokKeluar: { increment: body.jumlahObat || 1 },
          stokSaatIni: { decrement: body.jumlahObat || 1 },
        },
      });
    }

    return NextResponse.json(resep, { status: 201 });
  } catch (error) {
    console.error('Error adding resep:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan resep' },
      { status: 500 }
    );
  }
}
