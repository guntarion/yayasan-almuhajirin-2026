// src/app/api/kbtk/siswa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateNomorInduk, SiswaFormData } from '@/types/kbtk';

// GET - List siswa with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const kelompokLevel = searchParams.get('kelompokLevel') || '';
    const kelompokKelas = searchParams.get('kelompokKelas') || '';
    const tahunAjaran = searchParams.get('tahunAjaran') || '';
    const status = searchParams.get('status') || '';
    const noPendaftaran = searchParams.get('noPendaftaran') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    // Filter siswa without pendaftaran
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

    if (kelompokLevel && kelompokLevel !== 'all') {
      where.kelompokLevel = kelompokLevel;
    }

    if (kelompokKelas && kelompokKelas !== 'all') {
      where.kelompokKelas = kelompokKelas;
    }

    if (tahunAjaran && tahunAjaran !== 'all') {
      where.tahunAjaran = tahunAjaran;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Build stats where clause (use tahunAjaran filter for stats)
    const statsWhere: Record<string, unknown> = {};
    if (tahunAjaran && tahunAjaran !== 'all') {
      statsWhere.tahunAjaran = tahunAjaran;
    }

    // Fetch data with count and stats
    const [data, total, countByLevel, countByStatus] = await Promise.all([
      prisma.kbtkSiswa.findMany({
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
              tagihanSpp: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.kbtkSiswa.count({ where }),
      prisma.kbtkSiswa.groupBy({
        by: ['kelompokLevel'],
        where: statsWhere,
        _count: true,
      }),
      prisma.kbtkSiswa.groupBy({
        by: ['status'],
        where: statsWhere,
        _count: true,
      }),
    ]);

    // Calculate stats
    const stats = {
      total: countByLevel.reduce((acc, item) => acc + item._count, 0),
      kb: countByLevel.find(item => item.kelompokLevel === 'KB')?._count || 0,
      tk: countByLevel.find(item => item.kelompokLevel === 'TK')?._count || 0,
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
    console.error('Error fetching siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    );
  }
}

// POST - Create new siswa
export async function POST(request: NextRequest) {
  try {
    const body: SiswaFormData = await request.json();

    // Validate required fields
    if (!body.namaLengkap || !body.jenisKelamin || !body.kelompokLevel || !body.tahunAjaran) {
      return NextResponse.json(
        { error: 'Nama lengkap, jenis kelamin, kelompok level, dan tahun ajaran wajib diisi' },
        { status: 400 }
      );
    }

    // Generate nomor induk
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const countThisMonth = await prisma.kbtkSiswa.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const nomorInduk = generateNomorInduk(countThisMonth + 1);

    // Create siswa with orang tua in a transaction
    const siswa = await prisma.$transaction(async (tx) => {
      // Create siswa
      const newSiswa = await tx.kbtkSiswa.create({
        data: {
          nomorInduk,
          namaLengkap: body.namaLengkap,
          namaPanggilan: body.namaPanggilan || null,
          jenisKelamin: body.jenisKelamin,
          tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
          tempatLahir: body.tempatLahir || null,
          foto: body.foto || null,
          kelompokLevel: body.kelompokLevel,
          kelompokKelas: body.kelompokKelas || 'A',
          tahunAjaran: body.tahunAjaran,
          tanggalMasuk: body.tanggalMasuk ? new Date(body.tanggalMasuk) : new Date(),
          status: body.status || 'aktif',
          alamat: body.alamat || null,
          catatanKhusus: body.catatanKhusus || null,
        },
      });

      // Create orang tua if provided
      if (body.orangTua && body.orangTua.length > 0) {
        await tx.kbtkOrangTua.createMany({
          data: body.orangTua.map((ot, index) => ({
            siswaId: newSiswa.id,
            nama: ot.nama,
            relasi: ot.relasi,
            nomorHP: ot.nomorHP || null,
            email: ot.email || null,
            pekerjaan: ot.pekerjaan || null,
            alamat: ot.alamat || null,
            isPrimary: ot.isPrimary ?? index === 0,
          })),
        });
      }

      return newSiswa;
    });

    // Fetch the created siswa with relations
    const result = await prisma.kbtkSiswa.findUnique({
      where: { id: siswa.id },
      include: {
        orangTua: true,
        pendaftaran: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating siswa:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data siswa' },
      { status: 500 }
    );
  }
}
