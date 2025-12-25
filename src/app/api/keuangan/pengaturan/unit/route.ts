import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/keuangan/pengaturan/unit - List all units
export async function GET() {
  try {
    const units = await prisma.unitKerja.findMany({
      orderBy: [{ bidangKode: 'asc' }, { kode: 'asc' }],
      include: {
        bidang: true,
      },
    });

    return NextResponse.json({
      data: units.map(u => ({
        kode: u.kode,
        nama: u.nama,
        kepalaUnit: null, // Field not in schema
        bidangKode: u.bidangKode,
        bidangNama: u.bidang.nama,
        isActive: u.isActive,
      })),
    });
  } catch (error) {
    console.error('Unit GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/pengaturan/unit - Create new unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, nama, bidangKode } = body;

    if (!kode || !nama || !bidangKode) {
      return NextResponse.json(
        { error: 'Kode, nama, dan bidang harus diisi' },
        { status: 400 }
      );
    }

    // Check if bidang exists
    const bidang = await prisma.bidang.findUnique({
      where: { kode: bidangKode },
    });

    if (!bidang) {
      return NextResponse.json(
        { error: 'Bidang tidak ditemukan' },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const existing = await prisma.unitKerja.findUnique({
      where: { kode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Kode unit sudah digunakan' },
        { status: 400 }
      );
    }

    const unit = await prisma.unitKerja.create({
      data: {
        kode,
        nama,
        bidangKode,
      },
    });

    return NextResponse.json({
      success: true,
      data: { kode: unit.kode, nama: unit.nama },
    }, { status: 201 });
  } catch (error) {
    console.error('Unit POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create unit' },
      { status: 500 }
    );
  }
}
