// src/app/api/daycare/pendaftaran/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { PendaftaranFormData } from '@/types/daycare';

// GET - Get pendaftaran detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pendaftaran = await prisma.daycarePendaftaran.findUnique({
      where: { id },
      include: {
        anak: {
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

    // Calculate payment summary
    const totalBayar = pendaftaran.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    return NextResponse.json({
      ...pendaftaran,
      _totalBayar: totalBayar,
      _sisaTagihan: Number(pendaftaran.biayaPendaftaran) - totalBayar,
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<PendaftaranFormData> & { status?: 'terdaftar' | 'aktif' | 'batal' } = await request.json();

    // Check if pendaftaran exists
    const existingPendaftaran = await prisma.daycarePendaftaran.findUnique({
      where: { id },
    });

    if (!existingPendaftaran) {
      return NextResponse.json(
        { error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update pendaftaran
    const pendaftaran = await prisma.daycarePendaftaran.update({
      where: { id },
      data: {
        tanggalMulai: body.tanggalMulai ? new Date(body.tanggalMulai) : existingPendaftaran.tanggalMulai,
        paketDipilih: body.paketDipilih ?? existingPendaftaran.paketDipilih,
        biayaPendaftaran: body.biayaPendaftaran ?? existingPendaftaran.biayaPendaftaran,
        schemaPembayaran: body.schemaPembayaran ?? existingPendaftaran.schemaPembayaran,
        status: body.status ?? existingPendaftaran.status,
        tanggalAktif: body.status === 'aktif' && existingPendaftaran.status !== 'aktif'
          ? new Date()
          : existingPendaftaran.tanggalAktif,
        catatan: body.catatan ?? existingPendaftaran.catatan,
      },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
          },
        },
        pembayaran: true,
      },
    });

    // Calculate payment summary
    const totalBayar = pendaftaran.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    return NextResponse.json({
      ...pendaftaran,
      _totalBayar: totalBayar,
      _sisaTagihan: Number(pendaftaran.biayaPendaftaran) - totalBayar,
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if pendaftaran exists
    const existingPendaftaran = await prisma.daycarePendaftaran.findUnique({
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

    // Check if there are any payments
    if (existingPendaftaran.pembayaran.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus pendaftaran yang sudah memiliki pembayaran. Hapus pembayaran terlebih dahulu.' },
        { status: 400 }
      );
    }

    // Delete pendaftaran
    await prisma.daycarePendaftaran.delete({
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
