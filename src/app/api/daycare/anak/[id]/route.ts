// src/app/api/daycare/anak/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { AnakFormData } from '@/types/daycare';

// GET - Get anak detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const anak = await prisma.daycareAnak.findUnique({
      where: { id },
      include: {
        orangTua: {
          orderBy: { isPrimary: 'desc' },
        },
        pendaftaran: {
          include: {
            pembayaran: {
              orderBy: { tanggalBayar: 'desc' },
            },
          },
        },
        tagihanBulanan: {
          include: {
            pembayaran: {
              orderBy: { tanggalBayar: 'desc' },
            },
          },
          orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }],
        },
        kehadiranHarian: {
          orderBy: { tanggal: 'desc' },
          take: 30,
        },
        dailyReports: {
          orderBy: { tanggal: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            orangTua: true,
            tagihanBulanan: true,
            kehadiranHarian: true,
            dailyReports: true,
          },
        },
      },
    });

    if (!anak) {
      return NextResponse.json(
        { error: 'Anak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate pendaftaran payment summary
    let pendaftaranWithSummary = null;
    if (anak.pendaftaran) {
      const totalBayar = anak.pendaftaran.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      pendaftaranWithSummary = {
        ...anak.pendaftaran,
        _totalBayar: totalBayar,
        _sisaTagihan: Number(anak.pendaftaran.biayaPendaftaran) - totalBayar,
      };
    }

    // Calculate tagihan bulanan summaries
    const tagihanWithSummary = anak.tagihanBulanan.map((tagihan) => {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      return {
        ...tagihan,
        _totalBayar: totalBayar,
        _sisaTagihan: Number(tagihan.totalTagihan) - totalBayar,
      };
    });

    return NextResponse.json({
      ...anak,
      pendaftaran: pendaftaranWithSummary,
      tagihanBulanan: tagihanWithSummary,
    });
  } catch (error) {
    console.error('Error fetching anak:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data anak' },
      { status: 500 }
    );
  }
}

// PUT - Update anak
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: AnakFormData = await request.json();

    // Check if anak exists
    const existingAnak = await prisma.daycareAnak.findUnique({
      where: { id },
    });

    if (!existingAnak) {
      return NextResponse.json(
        { error: 'Anak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update anak
    const updatedAnak = await prisma.daycareAnak.update({
      where: { id },
      data: {
        namaLengkap: body.namaLengkap,
        namaPanggilan: body.namaPanggilan || null,
        jenisKelamin: body.jenisKelamin,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : undefined,
        tempatLahir: body.tempatLahir || null,
        foto: body.foto || null,
        paketLayanan: body.paketLayanan,
        tanggalMulai: body.tanggalMulai ? new Date(body.tanggalMulai) : undefined,
        alamat: body.alamat || null,
        alergiMakanan: body.alergiMakanan || null,
        catatanKesehatan: body.catatanKesehatan || null,
        kebiasaanTidur: body.kebiasaanTidur || null,
        catatanKhusus: body.catatanKhusus || null,
      },
    });

    // Fetch updated anak with relations
    const result = await prisma.daycareAnak.findUnique({
      where: { id: updatedAnak.id },
      include: {
        orangTua: true,
        pendaftaran: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating anak:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data anak' },
      { status: 500 }
    );
  }
}

// DELETE - Delete anak
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if anak exists
    const existingAnak = await prisma.daycareAnak.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tagihanBulanan: true,
          },
        },
      },
    });

    if (!existingAnak) {
      return NextResponse.json(
        { error: 'Anak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check for unpaid tagihan
    const unpaidTagihan = await prisma.daycareTagihanBulanan.count({
      where: {
        anakId: id,
        status: { not: 'lunas' },
      },
    });

    if (unpaidTagihan > 0) {
      return NextResponse.json(
        { error: `Anak masih memiliki ${unpaidTagihan} tagihan yang belum lunas` },
        { status: 400 }
      );
    }

    // Delete anak (cascade will delete orang tua, pendaftaran, tagihan, pembayaran, kehadiran, daily reports)
    await prisma.daycareAnak.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Anak berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting anak:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data anak' },
      { status: 500 }
    );
  }
}
