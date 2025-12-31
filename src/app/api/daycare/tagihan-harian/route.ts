// src/app/api/daycare/tagihan-harian/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, DaycareStatusTagihan } from '@prisma/client';

// GET - List tagihan harian with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const tanggal = searchParams.get('tanggal') || '';
    const tanggalStart = searchParams.get('tanggalStart') || '';
    const tanggalEnd = searchParams.get('tanggalEnd') || '';
    const anakId = searchParams.get('anakId') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycareTagihanHarianWhereInput = {};

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

    if (status && status !== 'all') {
      where.status = status as DaycareStatusTagihan;
    }

    if (search) {
      // Search via kehadiran -> anak
      where.kehadiran = {
        some: {
          anak: {
            OR: [
              { namaLengkap: { contains: search, mode: 'insensitive' } },
              { nomorInduk: { contains: search, mode: 'insensitive' } },
              { namaPanggilan: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    // Fetch data with pagination
    const [data, total] = await Promise.all([
      prisma.daycareTagihanHarian.findMany({
        where,
        include: {
          kehadiran: {
            include: {
              anak: {
                select: {
                  id: true,
                  nomorInduk: true,
                  namaLengkap: true,
                  namaPanggilan: true,
                  foto: true,
                  paketLayanan: true,
                  orangTua: {
                    where: { isPrimary: true },
                    select: {
                      id: true,
                      nama: true,
                      nomorHP: true,
                    },
                    take: 1,
                  },
                },
              },
            },
          },
          pembayaran: {
            orderBy: { tanggalBayar: 'desc' },
          },
        },
        orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.daycareTagihanHarian.count({ where }),
    ]);

    // Calculate total bayar for each tagihan
    const enrichedData = data.map((tagihan) => {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const sisaTagihan = Number(tagihan.nominal) - totalBayar;

      // Get anak info from kehadiran
      const anak = tagihan.kehadiran[0]?.anak || null;

      return {
        ...tagihan,
        anak,
        _totalBayar: totalBayar,
        _sisaTagihan: Math.max(0, sisaTagihan),
      };
    });

    // Calculate stats
    const allTagihan = await prisma.daycareTagihanHarian.findMany({
      where,
      include: { pembayaran: true },
    });

    const statsData = allTagihan.reduce(
      (acc, t) => {
        const totalBayar = t.pembayaran.reduce((sum, p) => sum + Number(p.nominal), 0);
        const totalTagihan = Number(t.nominal);
        const sisa = Math.max(0, totalTagihan - totalBayar);

        acc.totalTagihan += totalTagihan;
        acc.totalTerbayar += totalBayar;
        acc.totalTunggakan += sisa;

        if (t.status === 'lunas') acc.totalLunas++;
        else acc.totalBelumBayar++;

        return acc;
      },
      {
        totalTagihan: 0,
        totalTerbayar: 0,
        totalTunggakan: 0,
        totalLunas: 0,
        totalBelumBayar: 0,
      }
    );

    return NextResponse.json({
      data: enrichedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: statsData,
    });
  } catch (error) {
    console.error('Error fetching tagihan harian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tagihan harian' },
      { status: 500 }
    );
  }
}

// POST - Generate tagihan harian from kehadiran records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate: Either tanggal (specific date) or tanggalStart+tanggalEnd (range)
    if (!body.tanggal && (!body.tanggalStart || !body.tanggalEnd)) {
      return NextResponse.json(
        { error: 'Tanggal atau rentang tanggal wajib diisi' },
        { status: 400 }
      );
    }

    // Determine date range
    let startDate: Date;
    let endDate: Date;

    if (body.tanggal) {
      startDate = new Date(body.tanggal);
      endDate = new Date(body.tanggal);
      endDate.setDate(endDate.getDate() + 1);
    } else {
      startDate = new Date(body.tanggalStart);
      endDate = new Date(body.tanggalEnd);
      endDate.setDate(endDate.getDate() + 1); // Include end date
    }

    // Get harga from DaycarePaket where tipePaket = 'HARIAN'
    const paketHarian = await prisma.daycarePaket.findUnique({
      where: { tipePaket: 'HARIAN' },
    });

    if (!paketHarian) {
      return NextResponse.json(
        { error: 'Paket HARIAN tidak ditemukan. Silakan setup harga paket terlebih dahulu.' },
        { status: 400 }
      );
    }

    const hargaHarian = Number(paketHarian.hargaDefault);

    // Build kehadiran filter
    const kehadiranWhere: Prisma.DaycareKehadiranHarianWhereInput = {
      tanggal: {
        gte: startDate,
        lt: endDate,
      },
      isHadir: true, // Only for attended days
      tagihanId: null, // Not yet linked to tagihan
    };

    // Optional: Filter by specific anakId
    if (body.anakId) {
      kehadiranWhere.anakId = body.anakId;
    }

    // Get kehadiran records that haven't been billed yet
    const kehadiranRecords = await prisma.daycareKehadiranHarian.findMany({
      where: kehadiranWhere,
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            paketLayanan: true,
          },
        },
      },
      orderBy: { tanggal: 'asc' },
    });

    // Filter only HARIAN package children
    const harianKehadiran = kehadiranRecords.filter(
      (k) => k.anak.paketLayanan === 'HARIAN'
    );

    if (harianKehadiran.length === 0) {
      return NextResponse.json({
        message: 'Tidak ada kehadiran yang perlu di-generate tagihannya',
        generated: 0,
        skipped: kehadiranRecords.length,
      });
    }

    // Group kehadiran by anak and date to create tagihan
    const tagihanToCreate: {
      anakId: string;
      tanggal: Date;
      kehadiranIds: string[];
    }[] = [];

    // Each kehadiran should have its own tagihan (one per anak per day)
    for (const kehadiran of harianKehadiran) {
      const dateKey = kehadiran.tanggal.toISOString().split('T')[0];

      // Check if tagihan already exists for this anak and date
      const existingTagihan = await prisma.daycareTagihanHarian.findUnique({
        where: {
          anakId_tanggal: {
            anakId: kehadiran.anakId,
            tanggal: kehadiran.tanggal,
          },
        },
      });

      if (!existingTagihan) {
        const existing = tagihanToCreate.find(
          (t) => t.anakId === kehadiran.anakId &&
                 t.tanggal.toISOString().split('T')[0] === dateKey
        );

        if (existing) {
          existing.kehadiranIds.push(kehadiran.id);
        } else {
          tagihanToCreate.push({
            anakId: kehadiran.anakId,
            tanggal: kehadiran.tanggal,
            kehadiranIds: [kehadiran.id],
          });
        }
      }
    }

    if (tagihanToCreate.length === 0) {
      return NextResponse.json({
        message: 'Semua kehadiran sudah memiliki tagihan',
        generated: 0,
        skipped: harianKehadiran.length,
      });
    }

    // Generate tagihan in transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdTagihan = [];

      for (const item of tagihanToCreate) {
        // Create tagihan
        const tagihan = await tx.daycareTagihanHarian.create({
          data: {
            anakId: item.anakId,
            tanggal: item.tanggal,
            nominal: hargaHarian,
            status: 'belum_bayar',
          },
        });

        // Link kehadiran to tagihan
        await tx.daycareKehadiranHarian.updateMany({
          where: {
            id: { in: item.kehadiranIds },
          },
          data: {
            tagihanId: tagihan.id,
          },
        });

        createdTagihan.push(tagihan);
      }

      return createdTagihan;
    });

    return NextResponse.json({
      message: `Berhasil generate ${result.length} tagihan harian`,
      generated: result.length,
      skipped: harianKehadiran.length - result.length,
      hargaPerHari: hargaHarian,
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating tagihan harian:', error);
    return NextResponse.json(
      { error: 'Gagal generate tagihan harian' },
      { status: 500 }
    );
  }
}
