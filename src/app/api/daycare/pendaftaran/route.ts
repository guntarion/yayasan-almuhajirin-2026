// src/app/api/daycare/pendaftaran/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { PendaftaranFormData } from '@/types/daycare';
import { Prisma } from '@prisma/client';

// GET - List pendaftaran with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const paketDipilih = searchParams.get('paketDipilih') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycarePendaftaranWhereInput = {};

    if (search) {
      where.anak = {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nomorInduk: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (status && status !== 'all') {
      where.status = status as 'terdaftar' | 'aktif' | 'batal';
    }

    if (paketDipilih && paketDipilih !== 'all') {
      where.paketDipilih = paketDipilih as 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN';
    }

    // Fetch data
    const [data, total] = await Promise.all([
      prisma.daycarePendaftaran.findMany({
        where,
        include: {
          anak: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              namaPanggilan: true,
              paketLayanan: true,
              status: true,
              foto: true,
            },
          },
          pembayaran: {
            orderBy: { tanggalBayar: 'desc' },
          },
        },
        orderBy: { tanggalDaftar: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.daycarePendaftaran.count({ where }),
    ]);

    // Add payment summary to each pendaftaran
    const dataWithSummary = data.map((pendaftaran) => {
      const totalBayar = pendaftaran.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      return {
        ...pendaftaran,
        _totalBayar: totalBayar,
        _sisaTagihan: Number(pendaftaran.biayaPendaftaran) - totalBayar,
      };
    });

    return NextResponse.json({
      data: dataWithSummary,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// POST - Create new pendaftaran
export async function POST(request: NextRequest) {
  try {
    const body: PendaftaranFormData = await request.json();

    // Validate required fields
    if (!body.anakId || !body.paketDipilih || body.biayaPendaftaran === undefined) {
      return NextResponse.json(
        { error: 'Anak ID, paket dipilih, dan biaya pendaftaran wajib diisi' },
        { status: 400 }
      );
    }

    // Check if anak exists
    const anak = await prisma.daycareAnak.findUnique({
      where: { id: body.anakId },
      include: { pendaftaran: true },
    });

    if (!anak) {
      return NextResponse.json(
        { error: 'Anak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if anak already has pendaftaran
    if (anak.pendaftaran) {
      return NextResponse.json(
        { error: 'Anak sudah memiliki data pendaftaran' },
        { status: 400 }
      );
    }

    // Create pendaftaran
    const pendaftaran = await prisma.daycarePendaftaran.create({
      data: {
        anakId: body.anakId,
        tanggalDaftar: new Date(),
        tanggalMulai: body.tanggalMulai ? new Date(body.tanggalMulai) : null,
        paketDipilih: body.paketDipilih,
        biayaPendaftaran: body.biayaPendaftaran,
        schemaPembayaran: body.schemaPembayaran || 'lunas',
        status: 'terdaftar',
        catatan: body.catatan || null,
      },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
          },
        },
      },
    });

    return NextResponse.json(pendaftaran, { status: 201 });
  } catch (error) {
    console.error('Error creating pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pendaftaran' },
      { status: 500 }
    );
  }
}
