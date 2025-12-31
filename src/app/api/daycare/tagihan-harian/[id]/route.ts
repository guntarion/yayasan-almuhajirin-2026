// src/app/api/daycare/tagihan-harian/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DaycareStatusTagihan } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get tagihan harian detail with kehadiran and pembayaran
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const tagihan = await prisma.daycareTagihanHarian.findUnique({
      where: { id },
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
                orangTua: {
                  where: { isPrimary: true },
                  select: {
                    id: true,
                    nama: true,
                    nomorHP: true,
                    email: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
        pembayaran: {
          orderBy: { tanggalBayar: 'desc' },
        },
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate totals
    const totalBayar = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Number(tagihan.nominal) - totalBayar;

    // Get anak info from kehadiran
    const anak = tagihan.kehadiran[0]?.anak || null;

    return NextResponse.json({
      ...tagihan,
      anak,
      _totalBayar: totalBayar,
      _sisaTagihan: Math.max(0, sisaTagihan),
      _isFullyPaid: tagihan.status === 'lunas',
    });
  } catch (error) {
    console.error('Error fetching tagihan harian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tagihan' },
      { status: 500 }
    );
  }
}

// PUT - Update tagihan harian
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if tagihan exists
    const existingTagihan = await prisma.daycareTagihanHarian.findUnique({
      where: { id },
      include: { pembayaran: true },
    });

    if (!existingTagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: {
      nominal?: number;
      status?: DaycareStatusTagihan;
      catatan?: string | null;
    } = {};

    if (body.nominal !== undefined) {
      updateData.nominal = Number(body.nominal);
    }

    if (body.status !== undefined) {
      // Validate status
      if (!['belum_bayar', 'lunas'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Status tidak valid. Harian hanya mendukung: belum_bayar, lunas' },
          { status: 400 }
        );
      }
      updateData.status = body.status as DaycareStatusTagihan;
    }

    if (body.catatan !== undefined) {
      updateData.catatan = body.catatan || null;
    }

    // Update tagihan
    const updatedTagihan = await prisma.daycareTagihanHarian.update({
      where: { id },
      data: updateData,
      include: {
        kehadiran: {
          include: {
            anak: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
              },
            },
          },
        },
        pembayaran: true,
      },
    });

    const totalBayar = updatedTagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    return NextResponse.json({
      ...updatedTagihan,
      anak: updatedTagihan.kehadiran[0]?.anak || null,
      _totalBayar: totalBayar,
      _sisaTagihan: Math.max(0, Number(updatedTagihan.nominal) - totalBayar),
    });
  } catch (error) {
    console.error('Error updating tagihan harian:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate tagihan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tagihan harian
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if tagihan exists and has no payments
    const tagihan = await prisma.daycareTagihanHarian.findUnique({
      where: { id },
      include: {
        pembayaran: true,
        kehadiran: true,
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Prevent deletion if there are payments
    if (tagihan.pembayaran.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus tagihan yang sudah memiliki pembayaran' },
        { status: 400 }
      );
    }

    // Delete tagihan in transaction (also unlink kehadiran)
    await prisma.$transaction(async (tx) => {
      // Unlink kehadiran from this tagihan
      await tx.daycareKehadiranHarian.updateMany({
        where: { tagihanId: id },
        data: { tagihanId: null },
      });

      // Delete tagihan
      await tx.daycareTagihanHarian.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      message: 'Tagihan berhasil dihapus',
      unlinkedKehadiran: tagihan.kehadiran.length,
    });
  } catch (error) {
    console.error('Error deleting tagihan harian:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus tagihan' },
      { status: 500 }
    );
  }
}
