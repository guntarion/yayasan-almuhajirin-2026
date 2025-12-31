// src/app/api/daycare/kehadiran-harian/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { KehadiranFormData } from '@/types/daycare';

// GET - List kehadiran with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const tanggal = searchParams.get('tanggal') || '';
    const tanggalStart = searchParams.get('tanggalStart') || '';
    const tanggalEnd = searchParams.get('tanggalEnd') || '';
    const anakId = searchParams.get('anakId') || '';
    const search = searchParams.get('search') || '';
    const isHadir = searchParams.get('isHadir');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (tanggal) {
      // Specific date filter
      const date = new Date(tanggal);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.tanggal = {
        gte: date,
        lt: nextDay,
      };
    } else if (tanggalStart && tanggalEnd) {
      // Date range filter
      where.tanggal = {
        gte: new Date(tanggalStart),
        lte: new Date(tanggalEnd),
      };
    }

    if (anakId) {
      where.anakId = anakId;
    }

    if (isHadir !== null && isHadir !== undefined && isHadir !== '') {
      where.isHadir = isHadir === 'true';
    }

    if (search) {
      where.anak = {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nomorInduk: { contains: search, mode: 'insensitive' } },
          { namaPanggilan: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    // Fetch data with count and stats
    const [data, total, statsData] = await Promise.all([
      prisma.daycareKehadiranHarian.findMany({
        where,
        include: {
          anak: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              namaPanggilan: true,
              foto: true,
              paketLayanan: true,
            },
          },
        },
        orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.daycareKehadiranHarian.count({ where }),
      // Get stats for the current filter
      prisma.daycareKehadiranHarian.groupBy({
        by: ['isHadir'],
        where,
        _count: true,
      }),
    ]);

    const stats = {
      total,
      hadir: statsData.find((s) => s.isHadir === true)?._count || 0,
      tidakHadir: statsData.find((s) => s.isHadir === false)?._count || 0,
    };

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats,
    });
  } catch (error) {
    console.error('Error fetching kehadiran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kehadiran' },
      { status: 500 }
    );
  }
}

// POST - Record kehadiran
export async function POST(request: NextRequest) {
  try {
    const body: KehadiranFormData = await request.json();

    // Validate required fields
    if (!body.anakId || !body.tanggal) {
      return NextResponse.json(
        { error: 'Anak dan tanggal wajib diisi' },
        { status: 400 }
      );
    }

    // Check if anak exists
    const anak = await prisma.daycareAnak.findUnique({
      where: { id: body.anakId },
    });

    if (!anak) {
      return NextResponse.json(
        { error: 'Anak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if kehadiran already exists for this anak and date
    const tanggal = new Date(body.tanggal);
    const existingKehadiran = await prisma.daycareKehadiranHarian.findUnique({
      where: {
        anakId_tanggal: {
          anakId: body.anakId,
          tanggal,
        },
      },
    });

    if (existingKehadiran) {
      return NextResponse.json(
        { error: 'Kehadiran untuk anak ini pada tanggal tersebut sudah ada' },
        { status: 400 }
      );
    }

    // Create kehadiran
    const kehadiran = await prisma.daycareKehadiranHarian.create({
      data: {
        anakId: body.anakId,
        tanggal,
        jamMasuk: body.jamMasuk ? new Date(body.jamMasuk) : null,
        jamPulang: body.jamPulang ? new Date(body.jamPulang) : null,
        isHadir: body.isHadir !== undefined ? body.isHadir : true,
        catatan: body.catatan || null,
      },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            foto: true,
          },
        },
      },
    });

    return NextResponse.json(kehadiran, { status: 201 });
  } catch (error) {
    console.error('Error creating kehadiran:', error);
    return NextResponse.json(
      { error: 'Gagal mencatat kehadiran' },
      { status: 500 }
    );
  }
}
