// src/app/api/kbtk/pembayaran-spp/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET - Get single pembayaran by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pembayaran = await prisma.kbtkPembayaranSpp.findUnique({
      where: { id },
      include: {
        tagihan: {
          include: {
            siswa: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
                kelompokLevel: true,
                kelompokKelas: true,
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if pembayaran exists
    const existing = await prisma.kbtkPembayaranSpp.findUnique({
      where: { id },
      include: { tagihan: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      );
    }

    const oldNominal = Number(existing.nominal);
    const newNominal = body.nominal !== undefined ? body.nominal : oldNominal;

    // Update pembayaran and recalculate tagihan status
    const result = await prisma.$transaction(async (tx) => {
      // Update pembayaran
      const pembayaran = await tx.kbtkPembayaranSpp.update({
        where: { id },
        data: {
          tanggalBayar: body.tanggalBayar
            ? new Date(body.tanggalBayar)
            : existing.tanggalBayar,
          nominal: newNominal,
          metodePembayaran: body.metodePembayaran || existing.metodePembayaran,
          buktiTransfer: body.buktiTransfer,
          catatan: body.catatan,
        },
      });

      // Recalculate tagihan status
      const allPayments = await tx.kbtkPembayaranSpp.findMany({
        where: { tagihanId: existing.tagihanId },
      });

      const totalBayar = allPayments.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const totalTagihan = Number(existing.tagihan.totalTagihan);

      let newStatus: 'lunas' | 'bayar_sebagian' | 'belum_bayar';
      if (totalBayar >= totalTagihan) {
        newStatus = 'lunas';
      } else if (totalBayar > 0) {
        newStatus = 'bayar_sebagian';
      } else {
        newStatus = 'belum_bayar';
      }

      await tx.kbtkTagihanSpp.update({
        where: { id: existing.tagihanId },
        data: { status: newStatus },
      });

      return pembayaran;
    });

    // Fetch complete data
    const pembayaran = await prisma.kbtkPembayaranSpp.findUnique({
      where: { id: result.id },
      include: {
        tagihan: {
          include: {
            siswa: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
                kelompokLevel: true,
                kelompokKelas: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(pembayaran);
  } catch (error) {
    console.error('Error updating pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate pembayaran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pembayaran
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if pembayaran exists
    const existing = await prisma.kbtkPembayaranSpp.findUnique({
      where: { id },
      include: { tagihan: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete pembayaran and recalculate tagihan status
    await prisma.$transaction(async (tx) => {
      // Delete pembayaran
      await tx.kbtkPembayaranSpp.delete({
        where: { id },
      });

      // Recalculate tagihan status
      const remainingPayments = await tx.kbtkPembayaranSpp.findMany({
        where: { tagihanId: existing.tagihanId },
      });

      const totalBayar = remainingPayments.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const totalTagihan = Number(existing.tagihan.totalTagihan);

      let newStatus: 'lunas' | 'bayar_sebagian' | 'belum_bayar';
      if (totalBayar >= totalTagihan) {
        newStatus = 'lunas';
      } else if (totalBayar > 0) {
        newStatus = 'bayar_sebagian';
      } else {
        newStatus = 'belum_bayar';
      }

      await tx.kbtkTagihanSpp.update({
        where: { id: existing.tagihanId },
        data: { status: newStatus },
      });
    });

    return NextResponse.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting pembayaran:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus pembayaran' },
      { status: 500 }
    );
  }
}
