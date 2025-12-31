// src/app/api/daycare/pembayaran-bulanan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, DaycareStatusTagihan } from '@prisma/client';

// GET - List pembayaran bulanan with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const tagihanId = searchParams.get('tagihanId') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycarePembayaranBulananWhereInput = {};

    if (tagihanId) {
      where.tagihanId = tagihanId;
    }

    if (search) {
      where.tagihan = {
        anak: {
          OR: [
            { namaLengkap: { contains: search, mode: 'insensitive' } },
            { nomorInduk: { contains: search, mode: 'insensitive' } },
          ],
        },
      };
    }

    // Fetch data
    const [data, total] = await Promise.all([
      prisma.daycarePembayaranBulanan.findMany({
        where,
        include: {
          tagihan: {
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
          },
        },
        orderBy: { tanggalBayar: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.daycarePembayaranBulanan.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching pembayaran bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// Helper function to determine status based on payments
function calculateTagihanStatus(
  totalTagihan: number,
  totalBayar: number
): DaycareStatusTagihan {
  if (totalBayar >= totalTagihan) {
    return 'lunas';
  } else if (totalBayar > 0) {
    return 'bayar_sebagian';
  }
  return 'belum_bayar';
}

// POST - Create new pembayaran bulanan with auto status update
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
    const tagihan = await prisma.daycareTagihanBulanan.findUnique({
      where: { id: body.tagihanId },
      include: {
        pembayaran: true,
        anak: true,
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate current total paid
    const currentTotalPaid = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const totalTagihan = Number(tagihan.totalTagihan);
    const remainingAmount = totalTagihan - currentTotalPaid;
    const paymentAmount = Number(body.nominal);

    // Warn if payment exceeds remaining amount (but still allow)
    if (paymentAmount > remainingAmount && remainingAmount > 0) {
      console.warn(`Payment amount ${paymentAmount} exceeds remaining amount ${remainingAmount}`);
    }

    // Create pembayaran with transaction to handle status update
    const result = await prisma.$transaction(async (tx) => {
      // Create pembayaran
      const pembayaran = await tx.daycarePembayaranBulanan.create({
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
              anak: true,
            },
          },
        },
      });

      // Calculate new total and determine status
      const newTotalPaid = currentTotalPaid + paymentAmount;
      const newStatus = calculateTagihanStatus(totalTagihan, newTotalPaid);

      // Update tagihan status
      await tx.daycareTagihanBulanan.update({
        where: { id: body.tagihanId },
        data: { status: newStatus },
      });

      return { pembayaran, newStatus, newTotalPaid };
    });

    return NextResponse.json({
      ...result.pembayaran,
      _totalBayar: result.newTotalPaid,
      _sisaTagihan: Math.max(0, totalTagihan - result.newTotalPaid),
      _newStatus: result.newStatus,
      _isFullyPaid: result.newStatus === 'lunas',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pembayaran bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pembayaran' },
      { status: 500 }
    );
  }
}
