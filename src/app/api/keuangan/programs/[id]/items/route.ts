import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// POST /api/keuangan/programs/[id]/items - Add item to program
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;
    const body = await request.json();
    const {
      kodeItem,
      namaItem,
      keterangan,
      volume,
      satuan,
      hargaSatuan,
      kodeAkun,
      kodeAkunPasangan: _kodeAkunPasangan,
    } = body;

    // Validate required fields
    if (!kodeItem || !namaItem || !volume || !satuan || !hargaSatuan) {
      return NextResponse.json(
        { error: 'Kode item, nama item, volume, satuan, dan harga satuan harus diisi' },
        { status: 400 }
      );
    }

    // Check if program exists
    const program = await prisma.programKerja.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if kodeItem already exists in this program
    const existingItem = await prisma.programItem.findFirst({
      where: {
        programId: programId,
        kodeItem,
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: `Kode item "${kodeItem}" sudah digunakan dalam program ini` },
        { status: 400 }
      );
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

    // Calculate jumlah
    const jumlah = new Prisma.Decimal(volume).mul(new Prisma.Decimal(hargaSatuan));

    // Create item
    const item = await prisma.programItem.create({
      data: {
        programId: programId,
        kodeItem,
        namaItem,
        keterangan: keterangan || null,
        volume: new Prisma.Decimal(volume),
        satuan,
        hargaSatuan: new Prisma.Decimal(hargaSatuan),
        jumlah,
        kodeAkun: kodeAkun || '51101', // Default to general expense if not provided
      },
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
    }, { status: 201 });
  } catch (error) {
    console.error('Program item POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add program item' },
      { status: 500 }
    );
  }
}
