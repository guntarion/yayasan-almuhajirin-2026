// src/app/api/daycare/pembayaran-harian/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DaycareStatusTagihan } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper function to determine status - Harian only supports belum_bayar or lunas
function calculateTagihanHarianStatus(
  totalTagihan: number,
  totalBayar: number
): DaycareStatusTagihan {
  if (totalBayar >= totalTagihan) {
    return 'lunas';
  }
  return 'belum_bayar';
}

// GET - Get pembayaran harian detail
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const pembayaran = await prisma.daycarePembayaranHarian.findUnique({
      where: { id },
      include: {
        tagihan: {
          include: {
            kehadiran: {
              include: {
                anak: {
                  select: {
                    id: true,
                    nomorInduk: true,
                    namaLengkap: true,
                    namaPanggilan: true,
                    foto: true,
                    paketLayanan: true,
                  },
                },
              },
              take: 1,
            },
            pembayaran: true,
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

    // Calculate totals for the tagihan
    const totalBayar = pembayaran.tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const totalTagihan = Number(pembayaran.tagihan.nominal);

    return NextResponse.json({
      ...pembayaran,
      anak: pembayaran.tagihan.kehadiran[0]?.anak || null,
      _tagihanInfo: {
        totalTagihan,
        totalBayar,
        sisaTagihan: Math.max(0, totalTagihan - totalBayar),
        status: pembayaran.tagihan.status,
      },
    });
  } catch (error) {
    console.error('Error fetching pembayaran harian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// PUT - Update pembayaran harian
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get existing pembayaran with tagihan info
    const existingPembayaran = await prisma.daycarePembayaranHarian.findUnique({
      where: { id },
      include: {
        tagihan: {
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

    const oldNominal = Number(existingPembayaran.nominal);
    const newNominal = body.nominal !== undefined ? Number(body.nominal) : oldNominal;

    // Build update data
    const updateData: {
      tanggalBayar?: Date;
      nominal?: number;
      metodePembayaran?: 'cash' | 'transfer';
      buktiTransfer?: string | null;
      catatan?: string | null;
    } = {};

    if (body.tanggalBayar !== undefined) {
      updateData.tanggalBayar = new Date(body.tanggalBayar);
    }

    if (body.nominal !== undefined) {
      if (newNominal <= 0) {
        return NextResponse.json(
          { error: 'Nominal harus lebih dari 0' },
          { status: 400 }
        );
      }
      updateData.nominal = newNominal;
    }

    if (body.metodePembayaran !== undefined) {
      updateData.metodePembayaran = body.metodePembayaran;
    }

    if (body.buktiTransfer !== undefined) {
      updateData.buktiTransfer = body.buktiTransfer || null;
    }

    if (body.catatan !== undefined) {
      updateData.catatan = body.catatan || null;
    }

    // Update pembayaran and recalculate tagihan status
    const result = await prisma.$transaction(async (tx) => {
      // Update pembayaran
      const updatedPembayaran = await tx.daycarePembayaranHarian.update({
        where: { id },
        data: updateData,
        include: {
          tagihan: {
            include: {
              kehadiran: {
                include: {
                  anak: true,
                },
                take: 1,
              },
              pembayaran: true,
            },
          },
        },
      });

      // Recalculate total paid (including the updated amount)
      const totalTagihan = Number(updatedPembayaran.tagihan.nominal);
      const newTotalPaid = updatedPembayaran.tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const newStatus = calculateTagihanHarianStatus(totalTagihan, newTotalPaid);

      // Update tagihan status if changed
      if (updatedPembayaran.tagihan.status !== newStatus) {
        await tx.daycareTagihanHarian.update({
          where: { id: updatedPembayaran.tagihanId },
          data: { status: newStatus },
        });
      }

      return { pembayaran: updatedPembayaran, newStatus, newTotalPaid, totalTagihan };
    });

    return NextResponse.json({
      ...result.pembayaran,
      anak: result.pembayaran.tagihan.kehadiran[0]?.anak || null,
      _totalBayar: result.newTotalPaid,
      _sisaTagihan: Math.max(0, result.totalTagihan - result.newTotalPaid),
      _newStatus: result.newStatus,
    });
  } catch (error) {
    console.error('Error updating pembayaran harian:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate pembayaran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pembayaran harian
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get pembayaran with tagihan info
    const pembayaran = await prisma.daycarePembayaranHarian.findUnique({
      where: { id },
      include: {
        tagihan: {
          include: {
            pembayaran: true,
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

    // Delete pembayaran and recalculate tagihan status
    const result = await prisma.$transaction(async (tx) => {
      // Delete pembayaran
      await tx.daycarePembayaranHarian.delete({
        where: { id },
      });

      // Calculate new total (excluding deleted payment)
      const totalTagihan = Number(pembayaran.tagihan.nominal);
      const deletedAmount = Number(pembayaran.nominal);
      const currentTotal = pembayaran.tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const newTotalPaid = currentTotal - deletedAmount;
      const newStatus = calculateTagihanHarianStatus(totalTagihan, newTotalPaid);

      // Update tagihan status
      await tx.daycareTagihanHarian.update({
        where: { id: pembayaran.tagihanId },
        data: { status: newStatus },
      });

      return { newStatus, newTotalPaid, totalTagihan };
    });

    return NextResponse.json({
      message: 'Pembayaran berhasil dihapus',
      tagihanId: pembayaran.tagihanId,
      _newStatus: result.newStatus,
      _totalBayar: result.newTotalPaid,
      _sisaTagihan: Math.max(0, result.totalTagihan - result.newTotalPaid),
    });
  } catch (error) {
    console.error('Error deleting pembayaran harian:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus pembayaran' },
      { status: 500 }
    );
  }
}
