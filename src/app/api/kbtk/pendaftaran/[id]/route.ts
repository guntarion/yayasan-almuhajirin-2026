// src/app/api/kbtk/pendaftaran/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single pendaftaran by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const pendaftaran = await prisma.kbtkPendaftaran.findUnique({
      where: { id },
      include: {
        siswa: {
          include: {
            orangTua: {
              orderBy: { isPrimary: 'desc' },
            },
          },
        },
        pembayaran: {
          orderBy: { tanggalBayar: 'desc' },
        },
      },
    });

    if (!pendaftaran) {
      return NextResponse.json(
        { error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate totals
    const totalBayar = pendaftaran.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Number(pendaftaran.biayaPendaftaran) - totalBayar;

    return NextResponse.json({
      ...pendaftaran,
      _totalBayar: totalBayar,
      _sisaTagihan: sisaTagihan,
    });
  } catch (error) {
    console.error('Error fetching pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// PUT - Update pendaftaran
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if pendaftaran exists
    const existingPendaftaran = await prisma.kbtkPendaftaran.findUnique({
      where: { id },
    });

    if (!existingPendaftaran) {
      return NextResponse.json(
        { error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.tahunAjaran !== undefined) {
      updateData.tahunAjaran = body.tahunAjaran;
    }

    if (body.tanggalDaftar !== undefined) {
      updateData.tanggalDaftar = new Date(body.tanggalDaftar);
    }

    if (body.program !== undefined) {
      updateData.program = body.program;
    }

    if (body.biayaPendaftaran !== undefined) {
      updateData.biayaPendaftaran = body.biayaPendaftaran;
    }

    if (body.schemaPembayaran !== undefined) {
      updateData.schemaPembayaran = body.schemaPembayaran;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'diterima' && !existingPendaftaran.tanggalDiterima) {
        updateData.tanggalDiterima = new Date();
      }
    }

    if (body.catatan !== undefined) {
      updateData.catatan = body.catatan;
    }

    // Update pendaftaran
    const updatedPendaftaran = await prisma.kbtkPendaftaran.update({
      where: { id },
      data: updateData,
      include: {
        siswa: true,
        pembayaran: {
          orderBy: { tanggalBayar: 'desc' },
        },
      },
    });

    // If status changed to diterima, update siswa status
    if (body.status === 'diterima' && existingPendaftaran.status !== 'diterima') {
      await prisma.kbtkSiswa.update({
        where: { id: existingPendaftaran.siswaId },
        data: { status: 'aktif' },
      });
    }

    // Calculate totals
    const totalBayar = updatedPendaftaran.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Number(updatedPendaftaran.biayaPendaftaran) - totalBayar;

    return NextResponse.json({
      ...updatedPendaftaran,
      _totalBayar: totalBayar,
      _sisaTagihan: sisaTagihan,
    });
  } catch (error) {
    console.error('Error updating pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data pendaftaran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pendaftaran
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if pendaftaran exists
    const existingPendaftaran = await prisma.kbtkPendaftaran.findUnique({
      where: { id },
      include: {
        pembayaran: true,
      },
    });

    if (!existingPendaftaran) {
      return NextResponse.json(
        { error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Prevent deletion if there are payments
    if (existingPendaftaran.pembayaran.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus pendaftaran yang sudah memiliki pembayaran. Hapus pembayaran terlebih dahulu.' },
        { status: 400 }
      );
    }

    // Delete pendaftaran
    await prisma.kbtkPendaftaran.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pendaftaran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data pendaftaran' },
      { status: 500 }
    );
  }
}
