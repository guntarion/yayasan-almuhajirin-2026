import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET /api/keuangan/programs/[id]/items/[itemId] - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: programId, itemId } = await params;

    const item = await prisma.programItem.findFirst({
      where: {
        id: itemId,
        programId: programId,
      },
      include: {
        akun: true,
        transactions: {
          where: { isVoided: false },
          orderBy: { transactionDate: 'desc' },
          take: 5,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: item.id,
        kodeItem: item.kodeItem,
        namaItem: item.namaItem,
        keterangan: item.keterangan,
        volume: Number(item.volume),
        satuan: item.satuan,
        hargaSatuan: Number(item.hargaSatuan),
        jumlah: Number(item.jumlah),
        realisasi: Number(item.realisasi),
        kodeAkun: item.akun ? {
          kode: item.akun.kode,
          nama: item.akun.nama,
        } : null,
        recentTransactions: item.transactions.map(trx => ({
          id: trx.id,
          code: trx.code,
          date: trx.transactionDate,
          description: trx.description,
          amount: Number(trx.amount),
        })),
      },
    });
  } catch (error) {
    console.error('Program item GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program item' },
      { status: 500 }
    );
  }
}

// PUT /api/keuangan/programs/[id]/items/[itemId] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: programId, itemId } = await params;
    const body = await request.json();
    const {
      kodeItem,
      namaItem,
      keterangan,
      volume,
      satuan,
      hargaSatuan,
      kodeAkun,
      kodeAkunPasangan,
    } = body;

    // Check if item exists
    const existing = await prisma.programItem.findFirst({
      where: {
        id: itemId,
        programId: programId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if new kodeItem conflicts with another item
    if (kodeItem && kodeItem !== existing.kodeItem) {
      const conflict = await prisma.programItem.findFirst({
        where: {
          programId: programId,
          kodeItem,
          id: { not: itemId },
        },
      });
      if (conflict) {
        return NextResponse.json(
          { error: `Kode item "${kodeItem}" sudah digunakan dalam program ini` },
          { status: 400 }
        );
      }
    }

    // Validate kodeAkun if provided
    if (kodeAkun) {
      const akun = await prisma.kodeAkun.findUnique({
        where: { kode: kodeAkun },
      });
      if (!akun) {
        return NextResponse.json(
          { error: `Kode akun "${kodeAkun}" tidak ditemukan` },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: Prisma.ProgramItemUpdateInput = {};

    if (kodeItem) updateData.kodeItem = kodeItem;
    if (namaItem) updateData.namaItem = namaItem;
    if (keterangan !== undefined) updateData.keterangan = keterangan || null;
    if (satuan) updateData.satuan = satuan;
    if (kodeAkun !== undefined) {
      updateData.akun = { connect: { kode: kodeAkun || '51101' } };
    }
    if (kodeAkunPasangan !== undefined) {
      updateData.akunPasangan = kodeAkunPasangan
        ? { connect: { kode: kodeAkunPasangan } }
        : { disconnect: true };
    }

    // Recalculate jumlah if volume or hargaSatuan changed
    const newVolume = volume !== undefined ? new Prisma.Decimal(volume) : existing.volume;
    const newHargaSatuan = hargaSatuan !== undefined ? new Prisma.Decimal(hargaSatuan) : existing.hargaSatuan;

    if (volume !== undefined) updateData.volume = newVolume;
    if (hargaSatuan !== undefined) updateData.hargaSatuan = newHargaSatuan;

    if (volume !== undefined || hargaSatuan !== undefined) {
      updateData.jumlah = newVolume.mul(newHargaSatuan);
    }

    const item = await prisma.programItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        akun: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: item.id,
        kodeItem: item.kodeItem,
        namaItem: item.namaItem,
        keterangan: item.keterangan,
        volume: Number(item.volume),
        satuan: item.satuan,
        hargaSatuan: Number(item.hargaSatuan),
        jumlah: Number(item.jumlah),
        realisasi: Number(item.realisasi),
        kodeAkun: item.akun ? {
          kode: item.akun.kode,
          nama: item.akun.nama,
        } : null,
      },
    });
  } catch (error) {
    console.error('Program item PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update program item' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/programs/[id]/items/[itemId] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: programId, itemId } = await params;

    // Check if item exists
    const existing = await prisma.programItem.findFirst({
      where: {
        id: itemId,
        programId: programId,
      },
      include: {
        transactions: { where: { isVoided: false }, take: 1 },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if item has transactions
    if (existing.transactions && existing.transactions.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus item yang sudah memiliki transaksi. Pertimbangkan untuk membatalkan transaksi terkait terlebih dahulu.' },
        { status: 400 }
      );
    }

    // Check if item has realisasi
    if (Number(existing.realisasi) > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus item yang sudah memiliki realisasi' },
        { status: 400 }
      );
    }

    // Delete item
    await prisma.programItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: 'Item berhasil dihapus',
    });
  } catch (error) {
    console.error('Program item DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete program item' },
      { status: 500 }
    );
  }
}
