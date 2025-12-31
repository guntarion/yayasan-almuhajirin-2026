// src/app/api/kbtk/pembayaran-pendaftaran/route.ts
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

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.KbtkPembayaranPendaftaranWhereInput = {};

    if (pendaftaranId) {
      where.pendaftaranId = pendaftaranId;
    }

    // Fetch data
    const [data, total] = await Promise.all([
      prisma.kbtkPembayaranPendaftaran.findMany({
        where,
        include: {
          pendaftaran: {
            include: {
              siswa: {
                select: {
                  id: true,
                  nomorInduk: true,
                  namaLengkap: true,
                },
              },
            },
          },
        },
        orderBy: { tanggalBayar: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.kbtkPembayaranPendaftaran.count({ where }),
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

// POST - Create new pembayaran pendaftaran
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
    const pendaftaran = await prisma.kbtkPendaftaran.findUnique({
      where: { id: body.pendaftaranId },
      include: {
        pembayaran: true,
        siswa: true,
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
      const pembayaran = await tx.kbtkPembayaranPendaftaran.create({
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
              siswa: true,
            },
          },
        },
      });

      // Check if fully paid
      const newTotalPaid = currentTotalPaid + paymentAmount;
      const isFullyPaid = newTotalPaid >= Number(pendaftaran.biayaPendaftaran);

      if (isFullyPaid && pendaftaran.status !== 'diterima') {
        // Update pendaftaran status
        await tx.kbtkPendaftaran.update({
          where: { id: body.pendaftaranId },
          data: {
            status: 'diterima',
            tanggalDiterima: new Date(),
          },
        });

        // Update siswa status to aktif
        await tx.kbtkSiswa.update({
          where: { id: pendaftaran.siswaId },
          data: { status: 'aktif' },
        });
      }

      return pembayaran;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating pembayaran pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pembayaran' },
      { status: 500 }
    );
  }
}
