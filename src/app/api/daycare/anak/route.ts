// src/app/api/daycare/anak/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateNomorIndukDaycare, AnakFormData } from '@/types/daycare';

// GET - List anak with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const paketLayanan = searchParams.get('paketLayanan') || '';
    const status = searchParams.get('status') || '';
    const noPendaftaran = searchParams.get('noPendaftaran') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    // Filter anak without pendaftaran
    if (noPendaftaran === 'true') {
      where.pendaftaran = null;
    }

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { nomorInduk: { contains: search, mode: 'insensitive' } },
        { namaPanggilan: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (paketLayanan && paketLayanan !== 'all') {
      where.paketLayanan = paketLayanan;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Build stats where clause
    const statsWhere: Record<string, unknown> = {};

    // Fetch data with count and stats
    const [data, total, countByPaket, countByStatus] = await Promise.all([
      prisma.daycareAnak.findMany({
        where,
        include: {
          orangTua: {
            where: { isPrimary: true },
            take: 1,
          },
          pendaftaran: {
            select: {
              id: true,
              status: true,
              biayaPendaftaran: true,
            },
          },
          _count: {
            select: {
              orangTua: true,
              tagihanBulanan: true,
              dailyReports: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.daycareAnak.count({ where }),
      prisma.daycareAnak.groupBy({
        by: ['paketLayanan'],
        where: statsWhere,
        _count: true,
      }),
      prisma.daycareAnak.groupBy({
        by: ['status'],
        where: statsWhere,
        _count: true,
      }),
    ]);

    // Calculate stats
    const stats = {
      total: countByPaket.reduce((acc, item) => acc + item._count, 0),
      fullday: countByPaket.find(item => item.paketLayanan === 'FULLDAY')?._count || 0,
      afterSchool: countByPaket.find(item => item.paketLayanan === 'AFTER_SCHOOL')?._count || 0,
      harian: countByPaket.find(item => item.paketLayanan === 'HARIAN')?._count || 0,
      aktif: countByStatus.find(item => item.status === 'aktif')?._count || 0,
    };

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats,
    });
  } catch (error) {
    console.error('Error fetching anak:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data anak' },
      { status: 500 }
    );
  }
}

// POST - Create new anak
export async function POST(request: NextRequest) {
  try {
    const body: AnakFormData = await request.json();

    // Validate required fields
    if (!body.namaLengkap || !body.jenisKelamin || !body.paketLayanan || !body.tanggalLahir) {
      return NextResponse.json(
        { error: 'Nama lengkap, jenis kelamin, tanggal lahir, dan paket layanan wajib diisi' },
        { status: 400 }
      );
    }

    // Generate nomor induk (DC-YYMM-XXXX)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const countThisMonth = await prisma.daycareAnak.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const nomorInduk = generateNomorIndukDaycare(
      now.getFullYear(),
      now.getMonth() + 1,
      countThisMonth + 1
    );

    // Create anak
    const anak = await prisma.daycareAnak.create({
      data: {
        nomorInduk,
        namaLengkap: body.namaLengkap,
        namaPanggilan: body.namaPanggilan || null,
        jenisKelamin: body.jenisKelamin,
        tanggalLahir: new Date(body.tanggalLahir),
        tempatLahir: body.tempatLahir || null,
        foto: body.foto || null,
        paketLayanan: body.paketLayanan,
        tanggalMulai: body.tanggalMulai ? new Date(body.tanggalMulai) : new Date(),
        status: 'aktif',
        alamat: body.alamat || null,
        alergiMakanan: body.alergiMakanan || null,
        catatanKesehatan: body.catatanKesehatan || null,
        kebiasaanTidur: body.kebiasaanTidur || null,
        catatanKhusus: body.catatanKhusus || null,
      },
    });

    // Fetch the created anak with relations
    const result = await prisma.daycareAnak.findUnique({
      where: { id: anak.id },
      include: {
        orangTua: true,
        pendaftaran: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating anak:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data anak' },
      { status: 500 }
    );
  }
}
