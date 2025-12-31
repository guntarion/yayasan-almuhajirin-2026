// src/app/api/jamaah/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, SebutanJamaah, AlamatRW, AlamatWilayah, Gender } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/jamaah - List jamaah with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const alamatRW = searchParams.get('alamatRW') || '';
    const alamatWilayah = searchParams.get('alamatWilayah') || '';
    const isJamaahAktif = searchParams.get('isJamaahAktif');
    const isPengunjungKlinik = searchParams.get('isPengunjungKlinik');
    const isDonatur = searchParams.get('isDonatur');
    const gender = searchParams.get('gender') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: Prisma.JamaahWhereInput = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nomerHandphone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { alamatJalan: { contains: search, mode: 'insensitive' } },
        { profesi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (alamatRW && Object.values(AlamatRW).includes(alamatRW as AlamatRW)) {
      where.alamatRW = alamatRW as AlamatRW;
    }

    if (alamatWilayah && Object.values(AlamatWilayah).includes(alamatWilayah as AlamatWilayah)) {
      where.alamatWilayah = alamatWilayah as AlamatWilayah;
    }

    if (isJamaahAktif !== null && isJamaahAktif !== undefined) {
      where.isJamaahAktif = isJamaahAktif === 'true';
    }

    if (isPengunjungKlinik !== null && isPengunjungKlinik !== undefined) {
      where.isPengunjungKlinik = isPengunjungKlinik === 'true';
    }

    if (isDonatur !== null && isDonatur !== undefined) {
      where.isDonatur = isDonatur === 'true';
    }

    if (gender && Object.values(Gender).includes(gender as Gender)) {
      where.gender = gender as Gender;
    }

    // Get total count
    const total = await prisma.jamaah.count({ where });

    // Get paginated data
    const jamaah = await prisma.jamaah.findMany({
      where,
      orderBy: { nama: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            riwayatKlinik: true,
            donasiLazmu: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: jamaah.map((j) => ({
        id: j.id,
        nama: j.nama,
        sebutan: j.sebutan,
        anonymizeDisplay: j.anonymizeDisplay,
        namaDisplay: j.anonymizeDisplay
          ? `${j.sebutan || ''} ${j.nama.charAt(0)}***`.trim()
          : `${j.sebutan || ''} ${j.nama}`.trim(),
        nomerHandphone: j.nomerHandphone,
        email: j.email,
        alamatJalan: j.alamatJalan,
        alamatRW: j.alamatRW,
        alamatRT: j.alamatRT,
        alamatWilayah: j.alamatWilayah,
        alamatDetail: j.alamatDetail,
        gender: j.gender,
        tanggalLahir: j.tanggalLahir,
        profesi: j.profesi,
        isJamaahAktif: j.isJamaahAktif,
        isPengunjungKlinik: j.isPengunjungKlinik,
        isDonatur: j.isDonatur,
        catatan: j.catatan,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
        jumlahKunjunganKlinik: j._count.riwayatKlinik,
        jumlahDonasi: j._count.donasiLazmu,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Jamaah GET error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data jamaah' },
      { status: 500 }
    );
  }
}

// POST /api/jamaah - Create new jamaah
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { error: 'Nama jamaah wajib diisi' },
        { status: 400 }
      );
    }

    // Validate enums
    if (sebutan && !Object.values(SebutanJamaah).includes(sebutan)) {
      return NextResponse.json(
        { error: 'Sebutan tidak valid' },
        { status: 400 }
      );
    }

    if (alamatRW && !Object.values(AlamatRW).includes(alamatRW)) {
      return NextResponse.json(
        { error: 'Alamat RW tidak valid' },
        { status: 400 }
      );
    }

    if (alamatWilayah && !Object.values(AlamatWilayah).includes(alamatWilayah)) {
      return NextResponse.json(
        { error: 'Alamat wilayah tidak valid' },
        { status: 400 }
      );
    }

    if (gender && !Object.values(Gender).includes(gender)) {
      return NextResponse.json(
        { error: 'Gender tidak valid' },
        { status: 400 }
      );
    }

    // Create jamaah
    const jamaah = await prisma.jamaah.create({
      data: {
        nama: nama.trim(),
        sebutan: sebutan || null,
        anonymizeDisplay: anonymizeDisplay || false,
        nomerHandphone: nomerHandphone || null,
        email: email || null,
        alamatJalan: alamatJalan || null,
        alamatRW: alamatRW || null,
        alamatRT: alamatRT || null,
        alamatWilayah: alamatWilayah || null,
        alamatDetail: alamatDetail || null,
        gender: gender || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        profesi: profesi || null,
        isJamaahAktif: isJamaahAktif !== undefined ? isJamaahAktif : true,
        isPengunjungKlinik: isPengunjungKlinik || false,
        isDonatur: isDonatur || false,
        catatan: catatan || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: jamaah.id,
          nama: jamaah.nama,
        },
        message: 'Jamaah berhasil ditambahkan',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Jamaah POST error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan jamaah' },
      { status: 500 }
    );
  }
}
