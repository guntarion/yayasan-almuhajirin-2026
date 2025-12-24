import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// PUT /api/keuangan/pengaturan/unit/[kode] - Update unit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;
    const body = await request.json();
    const { nama, bidangKode, isActive } = body;

    const existing = await prisma.unitKerja.findUnique({
      where: { kode },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Unit tidak ditemukan' },
        { status: 404 }
      );
    }

    // If changing bidang, verify it exists
    if (bidangKode && bidangKode !== existing.bidangKode) {
      const bidang = await prisma.bidang.findUnique({
        where: { kode: bidangKode },
      });

      if (!bidang) {
        return NextResponse.json(
          { error: 'Bidang tidak ditemukan' },
          { status: 400 }
        );
      }
    }

    const unit = await prisma.unitKerja.update({
      where: { kode },
      data: {
        ...(nama && { nama }),
        ...(bidangKode && { bidangKode }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { kode: unit.kode, nama: unit.nama },
    });
  } catch (error) {
    console.error('Unit PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/pengaturan/unit/[kode] - Delete unit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;

    const existing = await prisma.unitKerja.findUnique({
      where: { kode },
      include: {
        programs: { take: 1 },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Unit tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.programs.length > 0) {
      return NextResponse.json(
        { error: 'Unit yang memiliki program tidak dapat dihapus' },
        { status: 400 }
      );
    }

    await prisma.unitKerja.delete({
      where: { kode },
    });

    return NextResponse.json({
      success: true,
      message: 'Unit berhasil dihapus',
    });
  } catch (error) {
    console.error('Unit DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete unit' },
      { status: 500 }
    );
  }
}
