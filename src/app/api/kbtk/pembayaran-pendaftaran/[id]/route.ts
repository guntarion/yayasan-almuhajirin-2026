// src/app/api/kbtk/pembayaran-pendaftaran/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single pembayaran by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const pembayaran = await prisma.kbtkPembayaranPendaftaran.findUnique({
      where: { id },
      include: {
        pendaftaran: {
          include: {
            siswa: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
              },
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

    return NextResponse.json(pembayaran);
  } catch (error) {
    console.error('Error fetching pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// PUT - Update pembayaran
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if pembayaran exists
    const existingPembayaran = await prisma.kbtkPembayaranPendaftaran.findUnique({
      where: { id },
      include: {
        pendaftaran: true,
      },
    });

    if (!existingPembayaran) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.tanggalBayar !== undefined) {
      updateData.tanggalBayar = new Date(body.tanggalBayar);
    }

    if (body.nominal !== undefined) {
      if (Number(body.nominal) <= 0) {
        return NextResponse.json(
          { error: 'Nominal harus lebih dari 0' },
          { status: 400 }
        );
      }
      updateData.nominal = body.nominal;
    }

    if (body.metodePembayaran !== undefined) {
      updateData.metodePembayaran = body.metodePembayaran;
    }

    if (body.buktiTransfer !== undefined) {
      updateData.buktiTransfer = body.buktiTransfer;
    }

    if (body.catatan !== undefined) {
      updateData.catatan = body.catatan;
    }

    // Update pembayaran and recalculate status
    const result = await prisma.$transaction(async (tx) => {
      // Update pembayaran
      const updatedPembayaran = await tx.kbtkPembayaranPendaftaran.update({
        where: { id },
        data: updateData,
        include: {
          pendaftaran: {
            include: {
              siswa: true,
              pembayaran: true,
            },
          },
        },
      });

      // Recalculate total paid
      const totalPaid = updatedPembayaran.pendaftaran.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const isFullyPaid = totalPaid >= Number(updatedPembayaran.pendaftaran.biayaPendaftaran);

      // Update pendaftaran status if needed
      if (isFullyPaid && updatedPembayaran.pendaftaran.status !== 'diterima') {
        await tx.kbtkPendaftaran.update({
          where: { id: existingPembayaran.pendaftaranId },
          data: {
            status: 'diterima',
            tanggalDiterima: new Date(),
          },
        });

        await tx.kbtkSiswa.update({
          where: { id: updatedPembayaran.pendaftaran.siswaId },
          data: { status: 'aktif' },
        });
      } else if (!isFullyPaid && updatedPembayaran.pendaftaran.status === 'diterima') {
        // If payment reduced and no longer fully paid, revert status
        await tx.kbtkPendaftaran.update({
          where: { id: existingPembayaran.pendaftaranId },
          data: {
            status: 'daftar',
            tanggalDiterima: null,
          },
        });
      }

      return updatedPembayaran;
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

// DELETE - Delete pembayaran
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if pembayaran exists
    const existingPembayaran = await prisma.kbtkPembayaranPendaftaran.findUnique({
      where: { id },
      include: {
        pendaftaran: {
          include: {
            pembayaran: true,
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

    // Delete pembayaran and update status
    await prisma.$transaction(async (tx) => {
      // Delete pembayaran
      await tx.kbtkPembayaranPendaftaran.delete({
        where: { id },
      });

      // Recalculate remaining payments (excluding deleted one)
      const remainingPayments = existingPembayaran.pendaftaran.pembayaran.filter(
        (p) => p.id !== id
      );
      const totalPaid = remainingPayments.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const isFullyPaid = totalPaid >= Number(existingPembayaran.pendaftaran.biayaPendaftaran);

      // If no longer fully paid and status was diterima, revert
      if (!isFullyPaid && existingPembayaran.pendaftaran.status === 'diterima') {
        await tx.kbtkPendaftaran.update({
          where: { id: existingPembayaran.pendaftaranId },
          data: {
            status: 'daftar',
            tanggalDiterima: null,
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
