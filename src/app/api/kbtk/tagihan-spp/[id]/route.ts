// src/app/api/kbtk/tagihan-spp/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET - Get single tagihan by ID with payment history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tagihan = await prisma.kbtkTagihanSpp.findUnique({
      where: { id },
      include: {
        siswa: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            namaPanggilan: true,
            kelompokLevel: true,
            kelompokKelas: true,
            tahunAjaran: true,
            foto: true,
          },
        },
        pembayaran: {
          orderBy: { tanggalBayar: 'desc' },
        },
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate totals
    const totalBayar = tagihan.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const sisaTagihan = Number(tagihan.totalTagihan) - totalBayar;

    return NextResponse.json({
      ...tagihan,
      _totalBayar: totalBayar,
      _sisaTagihan: sisaTagihan > 0 ? sisaTagihan : 0,
    });
  } catch (error) {
    console.error('Error fetching tagihan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tagihan' },
      { status: 500 }
    );
  }
}

// PUT - Update tagihan (edit nominal, diskon, catatan)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if tagihan exists
    const existing = await prisma.kbtkTagihanSpp.findUnique({
      where: { id },
      include: { pembayaran: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate new total
    const nominal = body.nominal !== undefined ? body.nominal : Number(existing.nominal);
    const diskon = body.diskon !== undefined ? body.diskon : Number(existing.diskon);
    const totalTagihan = nominal - diskon;

    // Calculate current paid amount
    const totalBayar = existing.pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );

    // Determine status
    let status = existing.status;
    if (totalBayar >= totalTagihan) {
      status = 'lunas';
    } else if (totalBayar > 0) {
      status = 'bayar_sebagian';
    } else {
      status = 'belum_bayar';
    }

    const tagihan = await prisma.kbtkTagihanSpp.update({
      where: { id },
      data: {
        nominal: body.nominal,
        diskon: body.diskon,
        totalTagihan,
        catatan: body.catatan,
        tanggalJatuhTempo: body.tanggalJatuhTempo
          ? new Date(body.tanggalJatuhTempo)
          : existing.tanggalJatuhTempo,
        status,
      },
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
    });

    return NextResponse.json({
      ...tagihan,
      _totalBayar: totalBayar,
      _sisaTagihan: totalTagihan - totalBayar > 0 ? totalTagihan - totalBayar : 0,
    });
  } catch (error) {
    console.error('Error updating tagihan:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate tagihan' },
      { status: 500 }
    );
  }
}
