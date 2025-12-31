// src/app/api/poliklinik/kunjungan/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single kunjungan with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const kunjungan = await prisma.kunjunganKlinik.findUnique({
      where: { id },
      include: {
        pasien: {
          select: {
            id: true,
            nomorRM: true,
            namaLengkap: true,
            jenisKelamin: true,
            tanggalLahir: true,
            alamat: true,
            nomorHP: true,
            golonganDarah: true,
            riwayatAlergi: true,
            riwayatPenyakitKronis: true,
            catatanKhusus: true,
            penanggungJawab: true,
            hubunganPenanggungJawab: true,
          },
        },
        rekamMedis: {
          include: {
            resepObat: {
              include: {
                obat: true,
              },
              orderBy: { createdAt: 'asc' },
            },
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

    return NextResponse.json(kunjungan);
  } catch (error) {
    console.error('Error fetching kunjungan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kunjungan' },
      { status: 500 }
    );
  }
}

// PUT - Update kunjungan status or details
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if kunjungan exists
    const existing = await prisma.kunjunganKlinik.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Kunjungan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update kunjungan
    const kunjungan = await prisma.kunjunganKlinik.update({
      where: { id },
      data: {
        jenisPelayanan: body.jenisPelayanan !== undefined ? body.jenisPelayanan : existing.jenisPelayanan,
        dokter: body.dokter !== undefined ? body.dokter : existing.dokter,
        keluhanUtama: body.keluhanUtama !== undefined ? body.keluhanUtama : existing.keluhanUtama,
        statusKunjungan: body.statusKunjungan !== undefined ? body.statusKunjungan : existing.statusKunjungan,
      },
      include: {
        pasien: {
          select: {
            id: true,
            nomorRM: true,
            namaLengkap: true,
            jenisKelamin: true,
            tanggalLahir: true,
            riwayatAlergi: true,
          },
        },
        rekamMedis: {
          select: {
            id: true,
            diagnosisUtama: true,
          },
        },
      },
    });

    return NextResponse.json(kunjungan);
  } catch (error) {
    console.error('Error updating kunjungan:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data kunjungan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete kunjungan (only if no rekam medis)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if kunjungan exists with rekam medis
    const existing = await prisma.kunjunganKlinik.findUnique({
      where: { id },
      include: {
        rekamMedis: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Kunjungan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.rekamMedis) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus kunjungan yang sudah memiliki rekam medis' },
        { status: 400 }
      );
    }

    // Delete kunjungan
    await prisma.kunjunganKlinik.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kunjungan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting kunjungan:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kunjungan' },
      { status: 500 }
    );
  }
}
