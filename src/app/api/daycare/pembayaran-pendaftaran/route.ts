// src/app/api/daycare/pembayaran-pendaftaran/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET - List pembayaran pendaftaran with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const pendaftaranId = searchParams.get('pendaftaranId') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycarePembayaranPendaftaranWhereInput = {};

    if (pendaftaranId) {
      where.pendaftaranId = pendaftaranId;
    }

    if (search) {
      where.pendaftaran = {
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
      prisma.daycarePembayaranPendaftaran.findMany({
        where,
        include: {
          pendaftaran: {
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
      prisma.daycarePembayaranPendaftaran.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching pembayaran pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran' },
      { status: 500 }
    );
  }
}

// POST - Create new pembayaran pendaftaran with auto status update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.pendaftaranId) {
      return NextResponse.json(
        { error: 'Pendaftaran ID wajib diisi' },
        { status: 400 }
      );
    }

    if (!body.nominal || Number(body.nominal) <= 0) {
      return NextResponse.json(
        { error: 'Nominal wajib diisi dan harus lebih dari 0' },
        { status: 400 }
      );
    }

    // Get pendaftaran with existing payments
    const pendaftaran = await prisma.daycarePendaftaran.findUnique({
      where: { id: body.pendaftaranId },
      include: {
        pembayaran: true,
        anak: true,
      },
    });

    if (!pendaftaran) {
      return NextResponse.json(
        { error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate current total paid
    const currentTotalPaid = pendaftaran.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const remainingAmount = Number(pendaftaran.biayaPendaftaran) - currentTotalPaid;
    const paymentAmount = Number(body.nominal);

    // Warn if payment exceeds remaining amount (but still allow)
    if (paymentAmount > remainingAmount) {
      console.warn(`Payment amount ${paymentAmount} exceeds remaining amount ${remainingAmount}`);
    }

    // Create pembayaran with transaction to handle status update
    const result = await prisma.$transaction(async (tx) => {
      // Create pembayaran
      const pembayaran = await tx.daycarePembayaranPendaftaran.create({
        data: {
          pendaftaranId: body.pendaftaranId,
          tanggalBayar: body.tanggalBayar ? new Date(body.tanggalBayar) : new Date(),
          nominal: paymentAmount,
          metodePembayaran: body.metodePembayaran || 'cash',
          buktiTransfer: body.buktiTransfer || null,
          catatan: body.catatan || null,
          createdBy: body.createdBy || null,
        },
        include: {
          pendaftaran: {
            include: {
              anak: true,
            },
          },
        },
      });

      // Check if fully paid - auto update status to 'aktif'
      const newTotalPaid = currentTotalPaid + paymentAmount;
      const isFullyPaid = newTotalPaid >= Number(pendaftaran.biayaPendaftaran);

      if (isFullyPaid && pendaftaran.status !== 'aktif') {
        // Update pendaftaran status to aktif
        await tx.daycarePendaftaran.update({
          where: { id: body.pendaftaranId },
          data: {
            status: 'aktif',
            tanggalAktif: new Date(),
          },
        });

        // Update anak status to aktif as well
        await tx.daycareAnak.update({
          where: { id: pendaftaran.anakId },
          data: { status: 'aktif' },
        });
      }

      return pembayaran;
    });

    // Calculate updated totals
    const newTotalPaid = currentTotalPaid + paymentAmount;

    return NextResponse.json({
      ...result,
      _totalBayar: newTotalPaid,
      _sisaTagihan: Number(pendaftaran.biayaPendaftaran) - newTotalPaid,
      _isFullyPaid: newTotalPaid >= Number(pendaftaran.biayaPendaftaran),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pembayaran pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pembayaran' },
      { status: 500 }
    );
  }
}
