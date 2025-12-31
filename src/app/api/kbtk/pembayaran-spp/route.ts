// src/app/api/kbtk/pembayaran-spp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { PembayaranSppFormData } from '@/types/kbtk';

// GET - List pembayaran SPP (optional filter by tagihanId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagihanId = searchParams.get('tagihanId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (tagihanId) {
      where.tagihanId = tagihanId;
    }

    const [data, total] = await Promise.all([
      prisma.kbtkPembayaranSpp.findMany({
        where,
        include: {
          tagihan: {
            include: {
              siswa: {
                select: {
                  id: true,
                  nomorInduk: true,
                  namaLengkap: true,
                  kelompokLevel: true,
                  kelompokKelas: true,
                },
              },
            },
          },
        },
        orderBy: { tanggalBayar: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.kbtkPembayaranSpp.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching pembayaran SPP:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran SPP' },
      { status: 500 }
    );
  }
}

// POST - Create new payment
export async function POST(request: NextRequest) {
  try {
    const body: PembayaranSppFormData = await request.json();

    // Validate required fields
    if (!body.tagihanId || body.nominal === undefined) {
      return NextResponse.json(
        { error: 'Tagihan ID dan nominal wajib diisi' },
        { status: 400 }
      );
    }

    // Get the tagihan with existing payments
    const tagihan = await prisma.kbtkTagihanSpp.findUnique({
      where: { id: body.tagihanId },
      include: { pembayaran: true },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate current total paid
    const currentTotalBayar = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const newTotalBayar = currentTotalBayar + body.nominal;
    const totalTagihan = Number(tagihan.totalTagihan);

    // Validate payment amount
    if (body.nominal <= 0) {
      return NextResponse.json(
        { error: 'Nominal pembayaran harus lebih dari 0' },
        { status: 400 }
      );
    }

    // Create payment and update tagihan status in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment
      const pembayaran = await tx.kbtkPembayaranSpp.create({
        data: {
          tagihanId: body.tagihanId,
          tanggalBayar: body.tanggalBayar ? new Date(body.tanggalBayar) : new Date(),
          nominal: body.nominal,
          metodePembayaran: body.metodePembayaran || 'cash',
          buktiTransfer: body.buktiTransfer || null,
          catatan: body.catatan || null,
        },
      });

      // Determine new status
      let newStatus: 'lunas' | 'bayar_sebagian' | 'belum_bayar';
      if (newTotalBayar >= totalTagihan) {
        newStatus = 'lunas';
      } else if (newTotalBayar > 0) {
        newStatus = 'bayar_sebagian';
      } else {
        newStatus = 'belum_bayar';
      }

      // Update tagihan status
      await tx.kbtkTagihanSpp.update({
        where: { id: body.tagihanId },
        data: { status: newStatus },
      });

      return pembayaran;
    });

    // Fetch the complete payment with relations
    const pembayaran = await prisma.kbtkPembayaranSpp.findUnique({
      where: { id: result.id },
      include: {
        tagihan: {
          include: {
            siswa: {
              select: {
                id: true,
                nomorInduk: true,
                namaLengkap: true,
                kelompokLevel: true,
                kelompokKelas: true,
              },
            },
            pembayaran: true,
          },
        },
      },
    });

    return NextResponse.json(pembayaran, { status: 201 });
  } catch (error) {
    console.error('Error creating pembayaran SPP:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pembayaran SPP' },
      { status: 500 }
    );
  }
}
