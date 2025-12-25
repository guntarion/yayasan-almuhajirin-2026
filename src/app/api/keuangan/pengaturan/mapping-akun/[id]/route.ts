import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// PUT /api/keuangan/pengaturan/mapping-akun/[id] - Update single item's account mapping
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { kodeAkun } = body;

    if (!kodeAkun) {
      return NextResponse.json(
        { error: 'kodeAkun harus diisi' },
        { status: 400 }
      );
    }

    // Verify item exists
    const item = await prisma.programItem.findUnique({
      where: { id },
      select: { id: true, namaItem: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verify account code exists
    const akun = await prisma.kodeAkun.findUnique({
      where: { kode: kodeAkun },
      select: { kode: true, nama: true },
    });

    if (!akun) {
      return NextResponse.json(
        { error: `Kode akun tidak ditemukan: ${kodeAkun}` },
        { status: 400 }
      );
    }

    // Update the mapping
    const updated = await prisma.programItem.update({
      where: { id },
      data: { kodeAkun },
      include: {
        akun: {
          select: {
            kode: true,
            nama: true,
            kategori: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        kodeAkun: updated.kodeAkun,
        akun: updated.akun,
      },
    });
  } catch (error) {
    console.error('Mapping akun PUT by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to update mapping' },
      { status: 500 }
    );
  }
}
