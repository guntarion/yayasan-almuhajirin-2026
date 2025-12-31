// src/app/api/poliklinik/obat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET - List obat with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const kategori = searchParams.get('kategori') || '';
    const isAktif = searchParams.get('isAktif');
    const stokRendah = searchParams.get('stokRendah') === 'true';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { kode: { contains: search, mode: 'insensitive' } },
        { nama: { contains: search, mode: 'insensitive' } },
        { namaGenerik: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (kategori && kategori !== 'all') {
      where.kategori = kategori;
    }

    if (isAktif !== null && isAktif !== 'all') {
      where.isAktif = isAktif === 'true';
    }

    // Fetch data with count
    const [data, total] = await Promise.all([
      prisma.masterObat.findMany({
        where,
        include: {
          _count: {
            select: {
              resep: true,
              stokMasukList: true,
            },
          },
        },
        orderBy: [
          { kategori: 'asc' },
          { nama: 'asc' },
        ],
        skip,
        take: pageSize,
      }),
      prisma.masterObat.count({ where }),
    ]);

    // Filter stok rendah in memory (stokSaatIni <= stokMinimum)
    let filteredData = data;
    if (stokRendah) {
      filteredData = data.filter(obat => obat.stokSaatIni <= obat.stokMinimum);
    }

    // Get low stock count for alert
    const lowStockCount = await prisma.masterObat.count({
      where: {
        isAktif: true,
        stokSaatIni: {
          lte: prisma.masterObat.fields.stokMinimum,
        },
      },
    });

    return NextResponse.json({
      data: stokRendah ? filteredData : data,
      total: stokRendah ? filteredData.length : total,
      page,
      pageSize,
      totalPages: Math.ceil((stokRendah ? filteredData.length : total) / pageSize),
      lowStockCount,
    });
  } catch (error) {
    console.error('Error fetching obat:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data obat' },
      { status: 500 }
    );
  }
}

// POST - Create new obat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.kode || !body.nama) {
      return NextResponse.json(
        { error: 'Kode dan nama obat wajib diisi' },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const existing = await prisma.masterObat.findUnique({
      where: { kode: body.kode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Kode obat sudah digunakan' },
        { status: 400 }
      );
    }

    // Create obat
    const obat = await prisma.masterObat.create({
      data: {
        kode: body.kode,
        nama: body.nama,
        namaGenerik: body.namaGenerik || null,
        satuan: body.satuan || 'tablet',
        stokAwal: body.stokAwal || 0,
        stokSaatIni: body.stokAwal || 0,
        stokMinimum: body.stokMinimum || 10,
        kategori: body.kategori || null,
        keterangan: body.keterangan || null,
      },
    });

    return NextResponse.json(obat, { status: 201 });
  } catch (error) {
    console.error('Error creating obat:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data obat' },
      { status: 500 }
    );
  }
}
