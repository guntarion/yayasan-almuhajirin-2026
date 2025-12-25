import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/keuangan/pengaturan/bidang - List all bidang
export async function GET() {
  try {
    const bidang = await prisma.bidang.findMany({
      orderBy: { kode: 'asc' },
    });

    return NextResponse.json({
      data: bidang.map(b => ({
        kode: b.kode,
        nama: b.nama,
        kepalaNama: null, // Field not in schema
        isActive: b.isActive,
      })),
    });
  } catch (error) {
    console.error('Bidang GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bidang' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/pengaturan/bidang - Create new bidang
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, nama, kepalaNama: _kepalaNama } = body;

    if (!kode || !nama) {
      return NextResponse.json(
        { error: 'Kode dan nama harus diisi' },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const existing = await prisma.bidang.findUnique({
      where: { kode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Kode bidang sudah digunakan' },
        { status: 400 }
      );
    }

    const bidang = await prisma.bidang.create({
      data: {
        kode,
        nama,
      },
    });

    return NextResponse.json({
      success: true,
      data: { kode: bidang.kode, nama: bidang.nama },
    }, { status: 201 });
  } catch (error) {
    console.error('Bidang POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create bidang' },
      { status: 500 }
    );
  }
}
