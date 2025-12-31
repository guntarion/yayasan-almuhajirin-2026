// src/app/api/daycare/orang-tua/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { OrangTuaFormData } from '@/types/daycare';
import { Prisma } from '@prisma/client';

// GET - List orang tua with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const anakId = searchParams.get('anakId') || '';
    const relasi = searchParams.get('relasi') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycareOrangTuaWhereInput = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nomorHP: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (anakId) {
      where.anakId = anakId;
    }

    if (relasi && relasi !== 'all') {
      where.relasi = relasi as 'ayah' | 'ibu' | 'wali';
    }

    // Fetch data
    const [data, total] = await Promise.all([
      prisma.daycareOrangTua.findMany({
        where,
        include: {
          anak: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              paketLayanan: true,
              status: true,
            },
          },
        },
        orderBy: [
          { isPrimary: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: pageSize,
      }),
      prisma.daycareOrangTua.count({ where }),
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
    const body: OrangTuaFormData = await request.json();

    // Validate required fields
    if (!body.anakId || !body.nama || !body.relasi) {
      return NextResponse.json(
        { error: 'Anak ID, nama, dan relasi wajib diisi' },
        { status: 400 }
      );
    }

    // Check if anak exists
    const anak = await prisma.daycareAnak.findUnique({
      where: { id: body.anakId },
    });

    if (!anak) {
      return NextResponse.json(
        { error: 'Anak tidak ditemukan' },
        { status: 404 }
      );
    }

    // If this is primary, unset other primaries first
    if (body.isPrimary) {
      await prisma.daycareOrangTua.updateMany({
        where: { anakId: body.anakId },
        data: { isPrimary: false },
      });
    }

    // Check if this is the first orang tua for this anak
    const existingCount = await prisma.daycareOrangTua.count({
      where: { anakId: body.anakId },
    });

    // Create orang tua
    const orangTua = await prisma.daycareOrangTua.create({
      data: {
        anakId: body.anakId,
        nama: body.nama,
        relasi: body.relasi,
        nomorHP: body.nomorHP || null,
        nomorHPDarurat: body.nomorHPDarurat || null,
        email: body.email || null,
        pekerjaan: body.pekerjaan || null,
        alamat: body.alamat || null,
        isPrimary: body.isPrimary ?? existingCount === 0, // First one is primary by default
      },
      include: {
        anak: {
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
