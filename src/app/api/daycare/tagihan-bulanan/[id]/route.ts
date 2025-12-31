// src/app/api/daycare/tagihan-bulanan/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DaycareStatusTagihan } from '@prisma/client';

// GET - Get tagihan bulanan detail with pembayaran
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tagihan = await prisma.daycareTagihanBulanan.findUnique({
      where: { id },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            namaPanggilan: true,
            jenisKelamin: true,
            tanggalLahir: true,
            paketLayanan: true,
            status: true,
            foto: true,
            alamat: true,
            orangTua: {
              select: {
                id: true,
                nama: true,
                relasi: true,
                nomorHP: true,
                nomorHPDarurat: true,
                email: true,
                isPrimary: true,
              },
              orderBy: { isPrimary: 'desc' },
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

    // Calculate total pembayaran
    const totalBayar = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Math.max(0, Number(tagihan.totalTagihan) - totalBayar);

    return NextResponse.json({
      ...tagihan,
      _totalBayar: totalBayar,
      _sisaTagihan: sisaTagihan,
    });
  } catch (error) {
    console.error('Error fetching tagihan bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tagihan' },
      { status: 500 }
    );
  }
}

// PUT - Update tagihan bulanan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if tagihan exists
    const existingTagihan = await prisma.daycareTagihanBulanan.findUnique({
      where: { id },
      include: { pembayaran: true },
    });

    if (!existingTagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      nominal?: number;
      diskon?: number;
      totalTagihan?: number;
      status?: DaycareStatusTagihan;
      tanggalJatuhTempo?: Date;
      catatan?: string;
    } = {};

    if (body.nominal !== undefined) {
      updateData.nominal = Number(body.nominal);
    }

    if (body.diskon !== undefined) {
      updateData.diskon = Number(body.diskon);
    }

    // Recalculate totalTagihan if nominal or diskon changed
    if (updateData.nominal !== undefined || updateData.diskon !== undefined) {
      const nominal = updateData.nominal ?? Number(existingTagihan.nominal);
      const diskon = updateData.diskon ?? Number(existingTagihan.diskon);
      updateData.totalTagihan = nominal - diskon;
    }

    if (body.status) {
      updateData.status = body.status as DaycareStatusTagihan;
    }

    if (body.tanggalJatuhTempo) {
      updateData.tanggalJatuhTempo = new Date(body.tanggalJatuhTempo);
    }

    if (body.catatan !== undefined) {
      updateData.catatan = body.catatan;
    }

    // Update tagihan
    const updatedTagihan = await prisma.daycareTagihanBulanan.update({
      where: { id },
      data: updateData,
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            paketLayanan: true,
          },
        },
        pembayaran: {
          orderBy: { tanggalBayar: 'desc' },
        },
      },
    });

    // Calculate totals
    const totalBayar = updatedTagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    return NextResponse.json({
      ...updatedTagihan,
      _totalBayar: totalBayar,
      _sisaTagihan: Math.max(0, Number(updatedTagihan.totalTagihan) - totalBayar),
    });
  } catch (error) {
    console.error('Error updating tagihan bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data tagihan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tagihan bulanan (only if no pembayaran)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if tagihan exists and has pembayaran
    const existingTagihan = await prisma.daycareTagihanBulanan.findUnique({
      where: { id },
      include: { pembayaran: true },
    });

    if (!existingTagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingTagihan.pembayaran.length > 0) {
      return NextResponse.json(
        { error: 'Tagihan yang sudah memiliki pembayaran tidak dapat dihapus' },
        { status: 400 }
      );
    }

    // Delete tagihan
    await prisma.daycareTagihanBulanan.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Tagihan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting tagihan bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data tagihan' },
      { status: 500 }
    );
  }
}
