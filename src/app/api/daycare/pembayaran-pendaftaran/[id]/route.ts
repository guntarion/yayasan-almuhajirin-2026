// src/app/api/daycare/pembayaran-pendaftaran/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET - Get pembayaran pendaftaran detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pembayaran = await prisma.daycarePembayaranPendaftaran.findUnique({
      where: { id },
      include: {
        pendaftaran: {
          include: {
            anak: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
                namaPanggilan: true,
                paketLayanan: true,
                foto: true,
              },
            },
            pembayaran: {
              orderBy: { tanggalBayar: 'desc' },
            },
          },
        },
      },
    });

    if (!pembayaran) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate total payments for this pendaftaran
    const totalBayar = pembayaran.pendaftaran.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    return NextResponse.json({
      ...pembayaran,
      _totalBayarPendaftaran: totalBayar,
      _sisaTagihanPendaftaran: Number(pembayaran.pendaftaran.biayaPendaftaran) - totalBayar,
    });
  } catch (error) {
    console.error('Error fetching pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// PUT - Update pembayaran pendaftaran
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if pembayaran exists
    const existingPembayaran = await prisma.daycarePembayaranPendaftaran.findUnique({
      where: { id },
      include: {
        pendaftaran: {
          include: {
            pembayaran: true,
            anak: true,
          },
        },
      },
    });

    if (!existingPembayaran) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      );
    }

    const oldNominal = Number(existingPembayaran.nominal);
    const newNominal = body.nominal !== undefined ? Number(body.nominal) : oldNominal;

    // Update pembayaran with status recalculation
    const result = await prisma.$transaction(async (tx) => {
      // Update pembayaran
      const pembayaran = await tx.daycarePembayaranPendaftaran.update({
        where: { id },
        data: {
          tanggalBayar: body.tanggalBayar ? new Date(body.tanggalBayar) : undefined,
          nominal: newNominal,
          metodePembayaran: body.metodePembayaran ?? existingPembayaran.metodePembayaran,
          buktiTransfer: body.buktiTransfer ?? existingPembayaran.buktiTransfer,
          catatan: body.catatan ?? existingPembayaran.catatan,
        },
        include: {
          pendaftaran: {
            include: {
              anak: true,
              pembayaran: true,
            },
          },
        },
      });

      // Recalculate total paid (excluding old, including new)
      const otherPayments = existingPembayaran.pendaftaran.pembayaran
        .filter(p => p.id !== id)
        .reduce((sum, p) => sum + Number(p.nominal), 0);
      const newTotalPaid = otherPayments + newNominal;
      const biayaPendaftaran = Number(existingPembayaran.pendaftaran.biayaPendaftaran);
      const isFullyPaid = newTotalPaid >= biayaPendaftaran;

      // Update pendaftaran status based on new total
      if (isFullyPaid && existingPembayaran.pendaftaran.status !== 'aktif') {
        await tx.daycarePendaftaran.update({
          where: { id: existingPembayaran.pendaftaranId },
          data: {
            status: 'aktif',
            tanggalAktif: new Date(),
          },
        });
        await tx.daycareAnak.update({
          where: { id: existingPembayaran.pendaftaran.anakId },
          data: { status: 'aktif' },
        });
      } else if (!isFullyPaid && existingPembayaran.pendaftaran.status === 'aktif') {
        // If was fully paid but now not, revert to terdaftar
        await tx.daycarePendaftaran.update({
          where: { id: existingPembayaran.pendaftaranId },
          data: {
            status: 'terdaftar',
            tanggalAktif: null,
          },
        });
      }

      return pembayaran;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data pembayaran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pembayaran pendaftaran
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if pembayaran exists
    const existingPembayaran = await prisma.daycarePembayaranPendaftaran.findUnique({
      where: { id },
      include: {
        pendaftaran: {
          include: {
            pembayaran: true,
            anak: true,
          },
        },
      },
    });

    if (!existingPembayaran) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete pembayaran with status recalculation
    await prisma.$transaction(async (tx) => {
      // Delete pembayaran
      await tx.daycarePembayaranPendaftaran.delete({
        where: { id },
      });

      // Recalculate remaining payments
      const remainingTotal = existingPembayaran.pendaftaran.pembayaran
        .filter(p => p.id !== id)
        .reduce((sum, p) => sum + Number(p.nominal), 0);
      const biayaPendaftaran = Number(existingPembayaran.pendaftaran.biayaPendaftaran);
      const isStillFullyPaid = remainingTotal >= biayaPendaftaran;

      // Update pendaftaran status if no longer fully paid
      if (!isStillFullyPaid && existingPembayaran.pendaftaran.status === 'aktif') {
        await tx.daycarePendaftaran.update({
          where: { id: existingPembayaran.pendaftaranId },
          data: {
            status: 'terdaftar',
            tanggalAktif: null,
          },
        });
      }
    });

    return NextResponse.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data pembayaran' },
      { status: 500 }
    );
  }
}
