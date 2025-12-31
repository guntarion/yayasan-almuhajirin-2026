// src/app/api/kbtk/orang-tua/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { OrangTuaFormData } from '@/types/kbtk';

// GET - List orang tua with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const siswaId = searchParams.get('siswaId') || '';
    const relasi = searchParams.get('relasi') || '';
    const isPrimary = searchParams.get('isPrimary');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nomorHP: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (siswaId) {
      where.siswaId = siswaId;
    }

    if (relasi && relasi !== 'all') {
      where.relasi = relasi;
    }

    if (isPrimary !== null && isPrimary !== undefined && isPrimary !== 'all') {
      where.isPrimary = isPrimary === 'true';
    }

    // Fetch data with count
    const [data, total] = await Promise.all([
      prisma.kbtkOrangTua.findMany({
        where,
        include: {
          siswa: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              kelompokLevel: true,
              kelompokKelas: true,
              status: true,
            },
          },
        },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.kbtkOrangTua.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching orang tua:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data orang tua' },
      { status: 500 }
    );
  }
}

// POST - Create new orang tua
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siswaId, ...orangTuaData }: OrangTuaFormData & { siswaId: string } = body;

    // Validate required fields
    if (!siswaId || !orangTuaData.nama || !orangTuaData.relasi) {
      return NextResponse.json(
        { error: 'Siswa ID, nama, dan relasi wajib diisi' },
        { status: 400 }
      );
    }

    // Check if siswa exists
    const siswa = await prisma.kbtkSiswa.findUnique({
      where: { id: siswaId },
    });

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // If isPrimary is true, set other orang tua isPrimary to false
    if (orangTuaData.isPrimary) {
      await prisma.kbtkOrangTua.updateMany({
        where: { siswaId },
        data: { isPrimary: false },
      });
    }

    // Create orang tua
    const orangTua = await prisma.kbtkOrangTua.create({
      data: {
        siswaId,
        nama: orangTuaData.nama,
        relasi: orangTuaData.relasi,
        nomorHP: orangTuaData.nomorHP || null,
        email: orangTuaData.email || null,
        pekerjaan: orangTuaData.pekerjaan || null,
        alamat: orangTuaData.alamat || null,
        isPrimary: orangTuaData.isPrimary ?? false,
      },
      include: {
        siswa: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
          },
        },
      },
    });

    return NextResponse.json(orangTua, { status: 201 });
  } catch (error) {
    console.error('Error creating orang tua:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data orang tua' },
      { status: 500 }
    );
  }
}
