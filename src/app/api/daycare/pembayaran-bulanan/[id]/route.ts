// src/app/api/daycare/pembayaran-bulanan/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DaycareStatusTagihan } from '@prisma/client';

// Helper function to determine status based on payments
function calculateTagihanStatus(
  totalTagihan: number,
  totalBayar: number
): DaycareStatusTagihan {
  if (totalBayar >= totalTagihan) {
    return 'lunas';
  } else if (totalBayar > 0) {
    return 'bayar_sebagian';
  }
  return 'belum_bayar';
}

// GET - Get pembayaran bulanan detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pembayaran = await prisma.daycarePembayaranBulanan.findUnique({
      where: { id },
      include: {
        tagihan: {
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

    // Calculate total payments for this tagihan
    const totalBayar = pembayaran.tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    return NextResponse.json({
      ...pembayaran,
      _totalBayarTagihan: totalBayar,
      _sisaTagihan: Math.max(0, Number(pembayaran.tagihan.totalTagihan) - totalBayar),
    });
  } catch (error) {
    console.error('Error fetching pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// PUT - Update pembayaran bulanan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if pembayaran exists
    const existingPembayaran = await prisma.daycarePembayaranBulanan.findUnique({
      where: { id },
      include: {
        tagihan: {
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
      const pembayaran = await tx.daycarePembayaranBulanan.update({
        where: { id },
        data: {
          tanggalBayar: body.tanggalBayar ? new Date(body.tanggalBayar) : undefined,
          nominal: newNominal,
          metodePembayaran: body.metodePembayaran ?? existingPembayaran.metodePembayaran,
          buktiTransfer: body.buktiTransfer ?? existingPembayaran.buktiTransfer,
          catatan: body.catatan ?? existingPembayaran.catatan,
        },
        include: {
          tagihan: {
            include: {
              anak: true,
              pembayaran: true,
            },
          },
        },
      });

      // Recalculate total paid (excluding old, including new)
      const otherPayments = existingPembayaran.tagihan.pembayaran
        .filter(p => p.id !== id)
        .reduce((sum, p) => sum + Number(p.nominal), 0);
      const newTotalPaid = otherPayments + newNominal;
      const totalTagihan = Number(existingPembayaran.tagihan.totalTagihan);

      // Determine new status
      const newStatus = calculateTagihanStatus(totalTagihan, newTotalPaid);

      // Update tagihan status
      await tx.daycareTagihanBulanan.update({
        where: { id: existingPembayaran.tagihanId },
        data: { status: newStatus },
      });

      return { pembayaran, newStatus, newTotalPaid, totalTagihan };
    });

    return NextResponse.json({
      ...result.pembayaran,
      _totalBayar: result.newTotalPaid,
      _sisaTagihan: Math.max(0, result.totalTagihan - result.newTotalPaid),
      _newStatus: result.newStatus,
    });
  } catch (error) {
    console.error('Error updating pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data pembayaran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pembayaran bulanan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if pembayaran exists
    const existingPembayaran = await prisma.daycarePembayaranBulanan.findUnique({
      where: { id },
      include: {
        tagihan: {
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
      await tx.daycarePembayaranBulanan.delete({
        where: { id },
      });

      // Recalculate remaining payments
      const remainingTotal = existingPembayaran.tagihan.pembayaran
        .filter(p => p.id !== id)
        .reduce((sum, p) => sum + Number(p.nominal), 0);
      const totalTagihan = Number(existingPembayaran.tagihan.totalTagihan);

      // Determine new status
      const newStatus = calculateTagihanStatus(totalTagihan, remainingTotal);

      // Update tagihan status
      await tx.daycareTagihanBulanan.update({
        where: { id: existingPembayaran.tagihanId },
        data: { status: newStatus },
      });
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
