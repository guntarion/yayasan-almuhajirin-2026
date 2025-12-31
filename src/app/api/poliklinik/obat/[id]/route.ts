// src/app/api/poliklinik/obat/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single obat with stock history
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const obat = await prisma.masterObat.findUnique({
      where: { id },
      include: {
        stokMasukList: {
          orderBy: { tanggal: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            resep: true,
            stokMasukList: true,
          },
        },
      },
    });

    if (!obat) {
      return NextResponse.json(
        { error: 'Obat tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(obat);
  } catch (error) {
    console.error('Error fetching obat:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data obat' },
      { status: 500 }
    );
  }
}

// PUT - Update obat
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if obat exists
    const existing = await prisma.masterObat.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Obat tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if kode is being changed and already exists
    if (body.kode && body.kode !== existing.kode) {
      const duplicateKode = await prisma.masterObat.findUnique({
        where: { kode: body.kode },
      });

      if (duplicateKode) {
        return NextResponse.json(
          { error: 'Kode obat sudah digunakan' },
          { status: 400 }
        );
      }
    }

    // Update obat
    const obat = await prisma.masterObat.update({
      where: { id },
      data: {
        kode: body.kode !== undefined ? body.kode : existing.kode,
        nama: body.nama !== undefined ? body.nama : existing.nama,
        namaGenerik: body.namaGenerik !== undefined ? body.namaGenerik : existing.namaGenerik,
        satuan: body.satuan !== undefined ? body.satuan : existing.satuan,
        stokMinimum: body.stokMinimum !== undefined ? body.stokMinimum : existing.stokMinimum,
        kategori: body.kategori !== undefined ? body.kategori : existing.kategori,
        keterangan: body.keterangan !== undefined ? body.keterangan : existing.keterangan,
        isAktif: body.isAktif !== undefined ? body.isAktif : existing.isAktif,
      },
    });

    return NextResponse.json(obat);
  } catch (error) {
    console.error('Error updating obat:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data obat' },
      { status: 500 }
    );
  }
}

// POST - Add stok masuk
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if obat exists
    const existing = await prisma.masterObat.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Obat tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate jumlah
    if (!body.jumlah || body.jumlah <= 0) {
      return NextResponse.json(
        { error: 'Jumlah stok masuk harus lebih dari 0' },
        { status: 400 }
      );
    }

    // Create stok masuk and update stock
    const [stokMasuk, updatedObat] = await prisma.$transaction([
      prisma.stokObatMasuk.create({
        data: {
          obatId: id,
          jumlah: body.jumlah,
          tanggal: body.tanggal ? new Date(body.tanggal) : new Date(),
          sumber: body.sumber || null,
          keterangan: body.keterangan || null,
          createdBy: body.createdBy || null,
        },
      }),
      prisma.masterObat.update({
        where: { id },
        data: {
          stokMasuk: { increment: body.jumlah },
          stokSaatIni: { increment: body.jumlah },
        },
      }),
    ]);

    return NextResponse.json({
      stokMasuk,
      obat: updatedObat,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding stok:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan stok' },
      { status: 500 }
    );
  }
}

// DELETE - Delete obat (only if never used in resep)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if obat exists and has been used
    const existing = await prisma.masterObat.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            resep: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Obat tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing._count.resep > 0) {
      return NextResponse.json(
        { error: `Tidak dapat menghapus obat yang sudah digunakan dalam ${existing._count.resep} resep. Silakan nonaktifkan obat ini sebagai gantinya.` },
        { status: 400 }
      );
    }

    // Delete obat and related stok masuk
    await prisma.masterObat.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Obat berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting obat:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus obat' },
      { status: 500 }
    );
  }
}
