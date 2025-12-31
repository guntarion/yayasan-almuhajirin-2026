// src/app/api/daycare/pembayaran-harian/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, DaycareStatusTagihan } from '@prisma/client';

// GET - List pembayaran harian with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const tagihanId = searchParams.get('tagihanId') || '';
    const tanggalStart = searchParams.get('tanggalStart') || '';
    const tanggalEnd = searchParams.get('tanggalEnd') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycarePembayaranHarianWhereInput = {};

    if (tagihanId) {
      where.tagihanId = tagihanId;
    }

    if (tanggalStart && tanggalEnd) {
      where.tanggalBayar = {
        gte: new Date(tanggalStart),
        lte: new Date(tanggalEnd),
      };
    }

    if (search) {
      where.tagihan = {
        kehadiran: {
          some: {
            anak: {
              OR: [
                { namaLengkap: { contains: search, mode: 'insensitive' } },
                { nomorInduk: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      };
    }

    // Fetch data
    const [data, total] = await Promise.all([
      prisma.daycarePembayaranHarian.findMany({
        where,
        include: {
          tagihan: {
            include: {
              kehadiran: {
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
                take: 1,
              },
            },
          },
        },
        orderBy: { tanggalBayar: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.daycarePembayaranHarian.count({ where }),
    ]);

    // Enrich data with anak info
    const enrichedData = data.map((pembayaran) => ({
      ...pembayaran,
      anak: pembayaran.tagihan.kehadiran[0]?.anak || null,
    }));

    return NextResponse.json({
      data: enrichedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching pembayaran harian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// Helper function to determine status - Harian only supports belum_bayar or lunas
function calculateTagihanHarianStatus(
  totalTagihan: number,
  totalBayar: number
): DaycareStatusTagihan {
  if (totalBayar >= totalTagihan) {
    return 'lunas';
  }
  return 'belum_bayar';
}

// POST - Create pembayaran harian (auto update tagihan status)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.tagihanId) {
      return NextResponse.json(
        { error: 'Tagihan ID wajib diisi' },
        { status: 400 }
      );
    }

    if (!body.nominal || Number(body.nominal) <= 0) {
      return NextResponse.json(
        { error: 'Nominal wajib diisi dan harus lebih dari 0' },
        { status: 400 }
      );
    }

    // Get tagihan with existing payments
    const tagihan = await prisma.daycareTagihanHarian.findUnique({
      where: { id: body.tagihanId },
      include: {
        pembayaran: true,
        kehadiran: {
          include: {
            anak: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (tagihan.status === 'lunas') {
      return NextResponse.json(
        { error: 'Tagihan sudah lunas' },
        { status: 400 }
      );
    }

    // Calculate current total paid
    const currentTotalPaid = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const totalTagihan = Number(tagihan.nominal);
    const paymentAmount = Number(body.nominal);

    // For harian, typically pay in full, but allow partial payment that gets rounded up
    // Status will be determined after calculating total payments

    // Create pembayaran with transaction to handle status update
    const result = await prisma.$transaction(async (tx) => {
      // Create pembayaran
      const pembayaran = await tx.daycarePembayaranHarian.create({
        data: {
          tagihanId: body.tagihanId,
          tanggalBayar: body.tanggalBayar ? new Date(body.tanggalBayar) : new Date(),
          nominal: paymentAmount,
          metodePembayaran: body.metodePembayaran || 'cash',
          buktiTransfer: body.buktiTransfer || null,
          catatan: body.catatan || null,
          createdBy: body.createdBy || null,
        },
        include: {
          tagihan: {
            include: {
              kehadiran: {
                include: {
                  anak: true,
                },
                take: 1,
              },
            },
          },
        },
      });

      // Calculate new total and determine status
      const newTotalPaid = currentTotalPaid + paymentAmount;
      const newStatus = calculateTagihanHarianStatus(totalTagihan, newTotalPaid);

      // Update tagihan status
      await tx.daycareTagihanHarian.update({
        where: { id: body.tagihanId },
        data: { status: newStatus },
      });

      return { pembayaran, newStatus, newTotalPaid };
    });

    return NextResponse.json({
      ...result.pembayaran,
      anak: result.pembayaran.tagihan.kehadiran[0]?.anak || null,
      _totalBayar: result.newTotalPaid,
      _sisaTagihan: Math.max(0, totalTagihan - result.newTotalPaid),
      _newStatus: result.newStatus,
      _isFullyPaid: result.newStatus === 'lunas',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pembayaran harian:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pembayaran' },
      { status: 500 }
    );
  }
}
