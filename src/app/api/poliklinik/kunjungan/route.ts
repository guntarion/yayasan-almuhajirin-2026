// src/app/api/poliklinik/kunjungan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateNomorKunjungan } from '@/types/poliklinik';

// GET - List kunjungan with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const tanggal = searchParams.get('tanggal') || ''; // Format: YYYY-MM-DD
    const status = searchParams.get('status') || '';
    const dokter = searchParams.get('dokter') || '';
    const pasienId = searchParams.get('pasienId') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nomorKunjungan: { contains: search, mode: 'insensitive' } },
        { pasien: { namaLengkap: { contains: search, mode: 'insensitive' } } },
        { pasien: { nomorRM: { contains: search, mode: 'insensitive' } } },
        { keluhanUtama: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tanggal) {
      const date = new Date(tanggal);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.tanggalKunjungan = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (status && status !== 'all') {
      where.statusKunjungan = status;
    }

    if (dokter && dokter !== 'all') {
      where.dokter = dokter;
    }

    if (pasienId) {
      where.pasienId = pasienId;
    }

    // Fetch data with count
    const [data, total] = await Promise.all([
      prisma.kunjunganKlinik.findMany({
        where,
        include: {
          pasien: {
            select: {
              id: true,
              nomorRM: true,
              namaLengkap: true,
              jenisKelamin: true,
              tanggalLahir: true,
              riwayatAlergi: true,
            },
          },
          rekamMedis: {
            select: {
              id: true,
              diagnosisUtama: true,
            },
          },
        },
        orderBy: [
          { tanggalKunjungan: 'desc' },
          { nomorAntrian: 'asc' },
        ],
        skip,
        take: pageSize,
      }),
      prisma.kunjunganKlinik.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching kunjungan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kunjungan' },
      { status: 500 }
    );
  }
}

// POST - Create new kunjungan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.pasienId) {
      return NextResponse.json(
        { error: 'Pasien wajib dipilih' },
        { status: 400 }
      );
    }

    // Check if pasien exists
    const pasien = await prisma.pasienKlinik.findUnique({
      where: { id: body.pasienId },
    });

    if (!pasien) {
      return NextResponse.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate nomor kunjungan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const countToday = await prisma.kunjunganKlinik.count({
      where: {
        tanggalKunjungan: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const nomorKunjungan = generateNomorKunjungan(countToday + 1);
    const nomorAntrian = countToday + 1;

    // Create kunjungan
    const kunjungan = await prisma.kunjunganKlinik.create({
      data: {
        nomorKunjungan,
        pasienId: body.pasienId,
        tanggalKunjungan: body.tanggalKunjungan ? new Date(body.tanggalKunjungan) : new Date(),
        jenisPelayanan: body.jenisPelayanan || 'umum',
        dokter: body.dokter || null,
        keluhanUtama: body.keluhanUtama || null,
        statusKunjungan: 'menunggu',
        nomorAntrian,
      },
      include: {
        pasien: {
          select: {
            id: true,
            nomorRM: true,
            namaLengkap: true,
            jenisKelamin: true,
            tanggalLahir: true,
            riwayatAlergi: true,
          },
        },
      },
    });

    return NextResponse.json(kunjungan, { status: 201 });
  } catch (error) {
    console.error('Error creating kunjungan:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data kunjungan' },
      { status: 500 }
    );
  }
}

// GET today's queue stats
export async function HEAD() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [menunggu, dalamPemeriksaan, selesai, total] = await Promise.all([
      prisma.kunjunganKlinik.count({
        where: {
          tanggalKunjungan: { gte: today, lt: tomorrow },
          statusKunjungan: 'menunggu',
        },
      }),
      prisma.kunjunganKlinik.count({
        where: {
          tanggalKunjungan: { gte: today, lt: tomorrow },
          statusKunjungan: 'dalam_pemeriksaan',
        },
      }),
      prisma.kunjunganKlinik.count({
        where: {
          tanggalKunjungan: { gte: today, lt: tomorrow },
          statusKunjungan: 'selesai',
        },
      }),
      prisma.kunjunganKlinik.count({
        where: {
          tanggalKunjungan: { gte: today, lt: tomorrow },
        },
      }),
    ]);

    return new NextResponse(null, {
      headers: {
        'X-Queue-Menunggu': menunggu.toString(),
        'X-Queue-DalamPemeriksaan': dalamPemeriksaan.toString(),
        'X-Queue-Selesai': selesai.toString(),
        'X-Queue-Total': total.toString(),
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
