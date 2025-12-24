import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// PUT /api/keuangan/pengaturan/bidang/[kode] - Update bidang
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;
    const body = await request.json();
    const { nama, isActive } = body;

    const existing = await prisma.bidang.findUnique({
      where: { kode },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Bidang tidak ditemukan' },
        { status: 404 }
      );
    }

    const bidang = await prisma.bidang.update({
      where: { kode },
      data: {
        ...(nama && { nama }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { kode: bidang.kode, nama: bidang.nama },
    });
  } catch (error) {
    console.error('Bidang PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update bidang' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/pengaturan/bidang/[kode] - Delete bidang
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;

    const existing = await prisma.bidang.findUnique({
      where: { kode },
      include: {
        unitKerja: { take: 1 },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Bidang tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.unitKerja.length > 0) {
      return NextResponse.json(
        { error: 'Bidang yang memiliki unit tidak dapat dihapus' },
        { status: 400 }
      );
    }

    await prisma.bidang.delete({
      where: { kode },
    });

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil dihapus',
    });
  } catch (error) {
    console.error('Bidang DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bidang' },
      { status: 500 }
    );
  }
}
