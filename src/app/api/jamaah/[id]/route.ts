// src/app/api/jamaah/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { SebutanJamaah, AlamatRW, AlamatWilayah, Gender } from '@prisma/client';

// GET /api/jamaah/[id] - Get single jamaah with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jamaah = await prisma.jamaah.findUnique({
      where: { id },
      include: {
        riwayatKlinik: {
          orderBy: { tanggalKunjungan: 'desc' },
          take: 10,
        },
        donasiLazmu: {
          orderBy: { tanggalDonasi: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            riwayatKlinik: true,
            donasiLazmu: true,
          },
        },
      },
    });

    if (!jamaah) {
      return NextResponse.json(
        { error: 'Jamaah tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate total donasi
    const totalDonasi = await prisma.donasiJamaah.aggregate({
      where: { jamaahId: id, isVerified: true },
      _sum: { jumlah: true },
    });

    return NextResponse.json({
      data: {
        id: jamaah.id,
        nama: jamaah.nama,
        sebutan: jamaah.sebutan,
        anonymizeDisplay: jamaah.anonymizeDisplay,
        namaDisplay: jamaah.anonymizeDisplay
          ? `${jamaah.sebutan || ''} ${jamaah.nama.charAt(0)}***`.trim()
          : `${jamaah.sebutan || ''} ${jamaah.nama}`.trim(),
        nomerHandphone: jamaah.nomerHandphone,
        email: jamaah.email,
        alamatJalan: jamaah.alamatJalan,
        alamatRW: jamaah.alamatRW,
        alamatRT: jamaah.alamatRT,
        alamatWilayah: jamaah.alamatWilayah,
        alamatDetail: jamaah.alamatDetail,
        alamatLengkap: formatAlamatLengkap(jamaah),
        gender: jamaah.gender,
        tanggalLahir: jamaah.tanggalLahir,
        profesi: jamaah.profesi,
        isJamaahAktif: jamaah.isJamaahAktif,
        isPengunjungKlinik: jamaah.isPengunjungKlinik,
        isDonatur: jamaah.isDonatur,
        catatan: jamaah.catatan,
        createdAt: jamaah.createdAt,
        updatedAt: jamaah.updatedAt,
        // Stats
        jumlahKunjunganKlinik: jamaah._count.riwayatKlinik,
        jumlahDonasi: jamaah._count.donasiLazmu,
        totalDonasiVerified: totalDonasi._sum.jumlah || 0,
        // Recent records
        riwayatKlinikTerbaru: jamaah.riwayatKlinik,
        donasiTerbaru: jamaah.donasiLazmu,
      },
    });
  } catch (error) {
    console.error('Jamaah GET [id] error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data jamaah' },
      { status: 500 }
    );
  }
}

// PUT /api/jamaah/[id] - Update jamaah
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      nama,
      sebutan,
      anonymizeDisplay,
      nomerHandphone,
      email,
      alamatJalan,
      alamatRW,
      alamatRT,
      alamatWilayah,
      alamatDetail,
      gender,
      tanggalLahir,
      profesi,
      isJamaahAktif,
      isPengunjungKlinik,
      isDonatur,
      catatan,
    } = body;

    // Check if jamaah exists
    const existingJamaah = await prisma.jamaah.findUnique({
      where: { id },
    });

    if (!existingJamaah) {
      return NextResponse.json(
        { error: 'Jamaah tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (nama !== undefined && (!nama || nama.trim() === '')) {
      return NextResponse.json(
        { error: 'Nama jamaah wajib diisi' },
        { status: 400 }
      );
    }

    // Validate enums
    if (sebutan !== undefined && sebutan !== null && !Object.values(SebutanJamaah).includes(sebutan)) {
      return NextResponse.json(
        { error: 'Sebutan tidak valid' },
        { status: 400 }
      );
    }

    if (alamatRW !== undefined && alamatRW !== null && !Object.values(AlamatRW).includes(alamatRW)) {
      return NextResponse.json(
        { error: 'Alamat RW tidak valid' },
        { status: 400 }
      );
    }

    if (alamatWilayah !== undefined && alamatWilayah !== null && !Object.values(AlamatWilayah).includes(alamatWilayah)) {
      return NextResponse.json(
        { error: 'Alamat wilayah tidak valid' },
        { status: 400 }
      );
    }

    if (gender !== undefined && gender !== null && !Object.values(Gender).includes(gender)) {
      return NextResponse.json(
        { error: 'Gender tidak valid' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (nama !== undefined) updateData.nama = nama.trim();
    if (sebutan !== undefined) updateData.sebutan = sebutan || null;
    if (anonymizeDisplay !== undefined) updateData.anonymizeDisplay = anonymizeDisplay;
    if (nomerHandphone !== undefined) updateData.nomerHandphone = nomerHandphone || null;
    if (email !== undefined) updateData.email = email || null;
    if (alamatJalan !== undefined) updateData.alamatJalan = alamatJalan || null;
    if (alamatRW !== undefined) updateData.alamatRW = alamatRW || null;
    if (alamatRT !== undefined) updateData.alamatRT = alamatRT || null;
    if (alamatWilayah !== undefined) updateData.alamatWilayah = alamatWilayah || null;
    if (alamatDetail !== undefined) updateData.alamatDetail = alamatDetail || null;
    if (gender !== undefined) updateData.gender = gender || null;
    if (tanggalLahir !== undefined) updateData.tanggalLahir = tanggalLahir ? new Date(tanggalLahir) : null;
    if (profesi !== undefined) updateData.profesi = profesi || null;
    if (isJamaahAktif !== undefined) updateData.isJamaahAktif = isJamaahAktif;
    if (isPengunjungKlinik !== undefined) updateData.isPengunjungKlinik = isPengunjungKlinik;
    if (isDonatur !== undefined) updateData.isDonatur = isDonatur;
    if (catatan !== undefined) updateData.catatan = catatan || null;

    // Update jamaah
    const jamaah = await prisma.jamaah.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: jamaah.id,
        nama: jamaah.nama,
      },
      message: 'Jamaah berhasil diperbarui',
    });
  } catch (error) {
    console.error('Jamaah PUT error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui jamaah' },
      { status: 500 }
    );
  }
}

// DELETE /api/jamaah/[id] - Delete jamaah
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if jamaah exists
    const existingJamaah = await prisma.jamaah.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            riwayatKlinik: true,
            donasiLazmu: true,
          },
        },
      },
    });

    if (!existingJamaah) {
      return NextResponse.json(
        { error: 'Jamaah tidak ditemukan' },
        { status: 404 }
      );
    }

    // Warning if jamaah has related records
    if (existingJamaah._count.riwayatKlinik > 0 || existingJamaah._count.donasiLazmu > 0) {
      return NextResponse.json(
        {
          error: 'Jamaah memiliki riwayat klinik atau donasi. Data terkait akan ikut terhapus.',
          hasRelatedRecords: true,
          riwayatKlinik: existingJamaah._count.riwayatKlinik,
          donasiLazmu: existingJamaah._count.donasiLazmu,
        },
        { status: 400 }
      );
    }

    // Delete jamaah (cascade will delete related records)
    await prisma.jamaah.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Jamaah berhasil dihapus',
    });
  } catch (error) {
    console.error('Jamaah DELETE error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus jamaah' },
      { status: 500 }
    );
  }
}

// Helper function to format alamat
function formatAlamatLengkap(jamaah: {
  alamatJalan?: string | null;
  alamatRT?: string | null;
  alamatRW?: string | null;
  alamatWilayah?: string | null;
  alamatDetail?: string | null;
}): string {
  const parts: string[] = [];

  if (jamaah.alamatJalan) parts.push(jamaah.alamatJalan);
  if (jamaah.alamatRT) parts.push(`RT ${jamaah.alamatRT}`);
  if (jamaah.alamatRW) {
    const rwMap: Record<string, string> = {
      RW6: 'RW 6',
      RW8: 'RW 8',
      RW9: 'RW 9',
      RWLainnya: 'RW Lainnya',
    };
    parts.push(rwMap[jamaah.alamatRW] || jamaah.alamatRW);
  }
  if (jamaah.alamatWilayah === 'Rewwin') {
    parts.push('Rewwin, Waru, Sidoarjo');
  } else if (jamaah.alamatWilayah === 'Lainnya' && jamaah.alamatDetail) {
    parts.push(jamaah.alamatDetail);
  }

  return parts.join(', ');
}
