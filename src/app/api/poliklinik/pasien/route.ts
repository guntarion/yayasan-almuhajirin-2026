// src/app/api/poliklinik/pasien/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateNomorRM } from '@/types/poliklinik';

// GET - List pasien with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const jenisKelamin = searchParams.get('jenisKelamin') || '';
    const isAktif = searchParams.get('isAktif');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { nomorRM: { contains: search, mode: 'insensitive' } },
        { nomorHP: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (jenisKelamin && jenisKelamin !== 'all') {
      where.jenisKelamin = jenisKelamin;
    }

    if (isAktif !== null && isAktif !== 'all') {
      where.isAktif = isAktif === 'true';
    }

    // Fetch data with count
    const [data, total] = await Promise.all([
      prisma.pasienKlinik.findMany({
        where,
        include: {
          jamaah: {
            select: {
              id: true,
              nama: true,
              sebutan: true,
            },
          },
          _count: {
            select: {
              kunjungan: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.pasienKlinik.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching pasien:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pasien' },
      { status: 500 }
    );
  }
}

// POST - Create new pasien
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.namaLengkap || !body.jenisKelamin) {
      return NextResponse.json(
        { error: 'Nama lengkap dan jenis kelamin wajib diisi' },
        { status: 400 }
      );
    }

    // Generate nomor RM
    // Get the count for the current month to generate sequence
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const countThisMonth = await prisma.pasienKlinik.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const nomorRM = generateNomorRM(countThisMonth + 1);

    // Check if jamaahId already linked to another pasien
    if (body.jamaahId) {
      const existingPasien = await prisma.pasienKlinik.findUnique({
        where: { jamaahId: body.jamaahId },
      });

      if (existingPasien) {
        return NextResponse.json(
          { error: 'Jamaah ini sudah terdaftar sebagai pasien dengan nomor RM: ' + existingPasien.nomorRM },
          { status: 400 }
        );
      }
    }

    // Create pasien
    const pasien = await prisma.pasienKlinik.create({
      data: {
        nomorRM,
        jamaahId: body.jamaahId || null,
        namaLengkap: body.namaLengkap,
        jenisKelamin: body.jenisKelamin,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
        tempatLahir: body.tempatLahir || null,
        golonganDarah: body.golonganDarah || null,
        alamat: body.alamat || null,
        nomorHP: body.nomorHP || null,
        nomorHPDarurat: body.nomorHPDarurat || null,
        statusPernikahan: body.statusPernikahan || null,
        pekerjaan: body.pekerjaan || null,
        penanggungJawab: body.penanggungJawab || null,
        hubunganPenanggungJawab: body.hubunganPenanggungJawab || null,
        riwayatAlergi: body.riwayatAlergi || null,
        riwayatPenyakitKronis: body.riwayatPenyakitKronis || null,
        catatanKhusus: body.catatanKhusus || null,
        createdBy: body.createdBy || null,
      },
      include: {
        jamaah: {
          select: {
            id: true,
            nama: true,
            sebutan: true,
          },
        },
      },
    });

    // If jamaahId is provided, update jamaah's isPengunjungKlinik flag
    if (body.jamaahId) {
      await prisma.jamaah.update({
        where: { id: body.jamaahId },
        data: { isPengunjungKlinik: true },
      });
    }

    return NextResponse.json(pasien, { status: 201 });
  } catch (error) {
    console.error('Error creating pasien:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pasien' },
      { status: 500 }
    );
  }
}
