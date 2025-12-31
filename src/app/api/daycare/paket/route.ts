// src/app/api/daycare/paket/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DaycarePaketLayanan } from '@prisma/client';

interface PaketFormData {
  nama: string;
  tipePaket: DaycarePaketLayanan;
  deskripsi?: string;
  rentangUsia?: string;
  jamLayanan?: string;
  sistemPembayaran?: string;
  hargaDefault: number;
  fiturLayanan?: string[];
  isActive?: boolean;
}

// GET - List all paket layanan
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const data = await prisma.daycarePaket.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    // Parse fiturLayanan JSON for each paket
    const parsedData = data.map(paket => ({
      ...paket,
      fiturLayanan: paket.fiturLayanan ? JSON.parse(paket.fiturLayanan) : [],
    }));

    return NextResponse.json({ data: parsedData });
  } catch (error) {
    console.error('Error fetching paket:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data paket' },
      { status: 500 }
    );
  }
}

// POST - Create new paket
export async function POST(request: NextRequest) {
  try {
    const body: PaketFormData = await request.json();

    // Validate required fields
    if (!body.nama || !body.tipePaket || body.hargaDefault === undefined) {
      return NextResponse.json(
        { error: 'Nama, tipe paket, dan harga default wajib diisi' },
        { status: 400 }
      );
    }

    // Check if tipePaket already exists (it's unique)
    const existingPaket = await prisma.daycarePaket.findUnique({
      where: { tipePaket: body.tipePaket },
    });

    if (existingPaket) {
      return NextResponse.json(
        { error: `Paket dengan tipe ${body.tipePaket} sudah ada` },
        { status: 400 }
      );
    }

    // Create paket
    const paket = await prisma.daycarePaket.create({
      data: {
        nama: body.nama,
        tipePaket: body.tipePaket,
        deskripsi: body.deskripsi || null,
        rentangUsia: body.rentangUsia || null,
        jamLayanan: body.jamLayanan || null,
        sistemPembayaran: body.sistemPembayaran || null,
        hargaDefault: body.hargaDefault,
        fiturLayanan: body.fiturLayanan ? JSON.stringify(body.fiturLayanan) : null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({
      ...paket,
      fiturLayanan: paket.fiturLayanan ? JSON.parse(paket.fiturLayanan) : [],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating paket:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data paket' },
      { status: 500 }
    );
  }
}

// PUT - Update paket (batch update for all paket)
export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & PaketFormData = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID paket wajib diisi' },
        { status: 400 }
      );
    }

    // Check if paket exists
    const existingPaket = await prisma.daycarePaket.findUnique({
      where: { id: body.id },
    });

    if (!existingPaket) {
      return NextResponse.json(
        { error: 'Paket tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update paket
    const paket = await prisma.daycarePaket.update({
      where: { id: body.id },
      data: {
        nama: body.nama ?? existingPaket.nama,
        deskripsi: body.deskripsi ?? existingPaket.deskripsi,
        rentangUsia: body.rentangUsia ?? existingPaket.rentangUsia,
        jamLayanan: body.jamLayanan ?? existingPaket.jamLayanan,
        sistemPembayaran: body.sistemPembayaran ?? existingPaket.sistemPembayaran,
        hargaDefault: body.hargaDefault ?? existingPaket.hargaDefault,
        fiturLayanan: body.fiturLayanan
          ? JSON.stringify(body.fiturLayanan)
          : existingPaket.fiturLayanan,
        isActive: body.isActive ?? existingPaket.isActive,
      },
    });

    return NextResponse.json({
      ...paket,
      fiturLayanan: paket.fiturLayanan ? JSON.parse(paket.fiturLayanan) : [],
    });
  } catch (error) {
    console.error('Error updating paket:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data paket' },
      { status: 500 }
    );
  }
}
