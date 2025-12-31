// src/app/api/daycare/daily-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DailyReportFormData } from '@/types/daycare';

// GET - List daily reports with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const tanggal = searchParams.get('tanggal') || '';
    const tanggalStart = searchParams.get('tanggalStart') || '';
    const tanggalEnd = searchParams.get('tanggalEnd') || '';
    const anakId = searchParams.get('anakId') || '';
    const search = searchParams.get('search') || '';

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

    if (search) {
      where.anak = {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nomorInduk: { contains: search, mode: 'insensitive' } },
          { namaPanggilan: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    // Fetch data with count
    const [data, total] = await Promise.all([
      prisma.daycareDailyReport.findMany({
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
      prisma.daycareDailyReport.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data daily report' },
      { status: 500 }
    );
  }
}

// POST - Create new daily report
export async function POST(request: NextRequest) {
  try {
    const body: DailyReportFormData = await request.json();

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

    // Check if report already exists for this anak and date
    const tanggal = new Date(body.tanggal);
    const existingReport = await prisma.daycareDailyReport.findUnique({
      where: {
        anakId_tanggal: {
          anakId: body.anakId,
          tanggal,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'Daily report untuk anak ini pada tanggal tersebut sudah ada' },
        { status: 400 }
      );
    }

    // Create daily report
    const dailyReport = await prisma.daycareDailyReport.create({
      data: {
        anakId: body.anakId,
        tanggal,
        guruPengisi: body.guruPengisi || null,
        // Perilaku
        moodSikap: body.moodSikap || null,
        interaksiTeman: body.interaksiTeman || null,
        catatanPerilaku: body.catatanPerilaku || null,
        // Aktivitas
        partisipasiBelajar: body.partisipasiBelajar || null,
        responBermain: body.responBermain || null,
        catatanAktivitas: body.catatanAktivitas || null,
        // Makan
        makanSiang: body.makanSiang || null,
        snack: body.snack || null,
        catatanMakan: body.catatanMakan || null,
        // Tidur
        tidurSiang: body.tidurSiang || null,
        durasiTidur: body.durasiTidur || null,
        catatanTidur: body.catatanTidur || null,
        // Kegiatan
        kegiatanHariIni: body.kegiatanHariIni
          ? JSON.stringify(body.kegiatanHariIni)
          : null,
        // Catatan
        catatanGuru: body.catatanGuru || null,
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

    return NextResponse.json(dailyReport, { status: 201 });
  } catch (error) {
    console.error('Error creating daily report:', error);
    return NextResponse.json(
      { error: 'Gagal membuat daily report' },
      { status: 500 }
    );
  }
}
