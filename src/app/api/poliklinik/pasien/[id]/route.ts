// src/app/api/poliklinik/pasien/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single pasien with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const pasien = await prisma.pasienKlinik.findUnique({
      where: { id },
      include: {
        jamaah: {
          select: {
            id: true,
            nama: true,
            sebutan: true,
            nomerHandphone: true,
            email: true,
          },
        },
        kunjungan: {
          include: {
            rekamMedis: {
              include: {
                resepObat: {
                  include: {
                    obat: true,
                  },
                },
              },
            },
          },
          orderBy: { tanggalKunjungan: 'desc' },
        },
        _count: {
          select: {
            kunjungan: true,
          },
        },
      },
    });

    if (!pasien) {
      return NextResponse.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(pasien);
  } catch (error) {
    console.error('Error fetching pasien:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pasien' },
      { status: 500 }
    );
  }
}

// PUT - Update pasien
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if pasien exists
    const existing = await prisma.pasienKlinik.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if jamaahId is being changed and already linked to another pasien
    if (body.jamaahId && body.jamaahId !== existing.jamaahId) {
      const existingLink = await prisma.pasienKlinik.findUnique({
        where: { jamaahId: body.jamaahId },
      });

      if (existingLink && existingLink.id !== id) {
        return NextResponse.json(
          { error: 'Jamaah ini sudah terdaftar sebagai pasien lain dengan nomor RM: ' + existingLink.nomorRM },
          { status: 400 }
        );
      }
    }

    // Update pasien
    const pasien = await prisma.pasienKlinik.update({
      where: { id },
      data: {
        jamaahId: body.jamaahId !== undefined ? body.jamaahId : existing.jamaahId,
        namaLengkap: body.namaLengkap || existing.namaLengkap,
        jenisKelamin: body.jenisKelamin || existing.jenisKelamin,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : existing.tanggalLahir,
        tempatLahir: body.tempatLahir !== undefined ? body.tempatLahir : existing.tempatLahir,
        golonganDarah: body.golonganDarah !== undefined ? body.golonganDarah : existing.golonganDarah,
        alamat: body.alamat !== undefined ? body.alamat : existing.alamat,
        nomorHP: body.nomorHP !== undefined ? body.nomorHP : existing.nomorHP,
        nomorHPDarurat: body.nomorHPDarurat !== undefined ? body.nomorHPDarurat : existing.nomorHPDarurat,
        statusPernikahan: body.statusPernikahan !== undefined ? body.statusPernikahan : existing.statusPernikahan,
        pekerjaan: body.pekerjaan !== undefined ? body.pekerjaan : existing.pekerjaan,
        penanggungJawab: body.penanggungJawab !== undefined ? body.penanggungJawab : existing.penanggungJawab,
        hubunganPenanggungJawab: body.hubunganPenanggungJawab !== undefined ? body.hubunganPenanggungJawab : existing.hubunganPenanggungJawab,
        riwayatAlergi: body.riwayatAlergi !== undefined ? body.riwayatAlergi : existing.riwayatAlergi,
        riwayatPenyakitKronis: body.riwayatPenyakitKronis !== undefined ? body.riwayatPenyakitKronis : existing.riwayatPenyakitKronis,
        catatanKhusus: body.catatanKhusus !== undefined ? body.catatanKhusus : existing.catatanKhusus,
        isAktif: body.isAktif !== undefined ? body.isAktif : existing.isAktif,
      },
      include: {
        jamaah: {
          select: {
            id: true,
            nama: true,
            sebutan: true,
          },
        },
        _count: {
          select: {
            kunjungan: true,
          },
        },
      },
    });

    // Update jamaah isPengunjungKlinik flag if jamaahId changed
    if (body.jamaahId && body.jamaahId !== existing.jamaahId) {
      // Set new jamaah
      await prisma.jamaah.update({
        where: { id: body.jamaahId },
        data: { isPengunjungKlinik: true },
      });

      // Unset old jamaah if exists
      if (existing.jamaahId) {
        await prisma.jamaah.update({
          where: { id: existing.jamaahId },
          data: { isPengunjungKlinik: false },
        });
      }
    }

    return NextResponse.json(pasien);
  } catch (error) {
    console.error('Error updating pasien:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data pasien' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pasien
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if pasien exists
    const existing = await prisma.pasienKlinik.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            kunjungan: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }

    // Warn if pasien has kunjungan history
    if (existing._count.kunjungan > 0) {
      return NextResponse.json(
        { error: `Tidak dapat menghapus pasien yang memiliki ${existing._count.kunjungan} riwayat kunjungan. Silakan nonaktifkan pasien ini sebagai gantinya.` },
        { status: 400 }
      );
    }

    // Delete pasien
    await prisma.pasienKlinik.delete({
      where: { id },
    });

    // Update jamaah flag if linked
    if (existing.jamaahId) {
      await prisma.jamaah.update({
        where: { id: existing.jamaahId },
        data: { isPengunjungKlinik: false },
      });
    }

    return NextResponse.json({ message: 'Pasien berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting pasien:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data pasien' },
      { status: 500 }
    );
  }
}
