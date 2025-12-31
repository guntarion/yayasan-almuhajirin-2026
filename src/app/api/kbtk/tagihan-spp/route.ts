// src/app/api/kbtk/tagihan-spp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

// GET - List tagihan SPP with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const bulan = searchParams.get('bulan') || '';
    const tahun = searchParams.get('tahun') || '';
    const kelompokLevel = searchParams.get('kelompokLevel') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.siswa = {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nomorInduk: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (bulan && bulan !== 'all') {
      where.bulan = parseInt(bulan);
    }

    if (tahun && tahun !== 'all') {
      where.tahun = parseInt(tahun);
    }

    if (kelompokLevel && kelompokLevel !== 'all') {
      where.siswa = {
        ...((where.siswa as Record<string, unknown>) || {}),
        kelompokLevel,
      };
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Fetch data with count
    const [data, total] = await Promise.all([
      prisma.kbtkTagihanSpp.findMany({
        where,
        include: {
          siswa: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              kelompokLevel: true,
              kelompokKelas: true,
              tahunAjaran: true,
            },
          },
          pembayaran: {
            orderBy: { tanggalBayar: 'desc' },
          },
        },
        orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.kbtkTagihanSpp.count({ where }),
    ]);

    // Calculate totals for each tagihan
    const enrichedData = data.map((tagihan) => {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const sisaTagihan = Number(tagihan.totalTagihan) - totalBayar;
      return {
        ...tagihan,
        _totalBayar: totalBayar,
        _sisaTagihan: sisaTagihan > 0 ? sisaTagihan : 0,
      };
    });

    // Calculate summary stats
    const [statsResult] = await Promise.all([
      prisma.kbtkTagihanSpp.groupBy({
        by: ['status'],
        where,
        _sum: {
          totalTagihan: true,
        },
        _count: true,
      }),
    ]);

    // Get total tunggakan (all unpaid amounts)
    const allTagihan = await prisma.kbtkTagihanSpp.findMany({
      where: {
        ...where,
        status: { not: 'lunas' },
      },
      include: {
        pembayaran: true,
      },
    });

    const totalTunggakan = allTagihan.reduce((sum, t) => {
      const paid = t.pembayaran.reduce((s, p) => s + Number(p.nominal), 0);
      return sum + (Number(t.totalTagihan) - paid);
    }, 0);

    const stats = {
      totalTagihan: statsResult.reduce(
        (sum, s) => sum + Number(s._sum.totalTagihan || 0),
        0
      ),
      lunas: statsResult.find((s) => s.status === 'lunas')?._count || 0,
      belumBayar: statsResult.find((s) => s.status === 'belum_bayar')?._count || 0,
      bayarSebagian:
        statsResult.find((s) => s.status === 'bayar_sebagian')?._count || 0,
      totalTunggakan,
    };

    return NextResponse.json({
      data: enrichedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats,
    });
  } catch (error) {
    console.error('Error fetching tagihan SPP:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tagihan SPP' },
      { status: 500 }
    );
  }
}

// POST - Generate tagihan for multiple students (batch generate)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bulan, tahun, siswaIds } = body;

    // Validate required fields
    if (!bulan || !tahun) {
      return NextResponse.json(
        { error: 'Bulan dan tahun wajib diisi' },
        { status: 400 }
      );
    }

    // Build siswa query
    const siswaWhere: Record<string, unknown> = {
      status: 'aktif',
    };

    if (siswaIds && siswaIds.length > 0) {
      siswaWhere.id = { in: siswaIds };
    }

    // Get all active students
    const students = await prisma.kbtkSiswa.findMany({
      where: siswaWhere,
      select: {
        id: true,
        kelompokLevel: true,
        tahunAjaran: true,
      },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada siswa aktif yang ditemukan' },
        { status: 400 }
      );
    }

    // Get SPP settings
    const sppSettings = await prisma.kbtkSettingSpp.findMany({
      where: {
        isActive: true,
      },
    });

    if (sppSettings.length === 0) {
      return NextResponse.json(
        { error: 'Belum ada pengaturan SPP yang aktif' },
        { status: 400 }
      );
    }

    // Create a map of settings by kelompokLevel and tahunAjaran
    const settingsMap = new Map<string, typeof sppSettings[0]>();
    for (const setting of sppSettings) {
      const key = `${setting.tahunAjaran}-${setting.kelompokLevel}`;
      settingsMap.set(key, setting);
    }

    // Generate tagihan for each student
    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const student of students) {
      // Find matching SPP setting
      const settingKey = `${student.tahunAjaran}-${student.kelompokLevel}`;
      const setting = settingsMap.get(settingKey);

      if (!setting) {
        results.errors.push(
          `Tidak ada pengaturan SPP untuk ${student.kelompokLevel} tahun ${student.tahunAjaran}`
        );
        continue;
      }

      // Check if tagihan already exists
      const existing = await prisma.kbtkTagihanSpp.findUnique({
        where: {
          siswaId_bulan_tahun: {
            siswaId: student.id,
            bulan: parseInt(bulan),
            tahun: parseInt(tahun),
          },
        },
      });

      if (existing) {
        results.skipped++;
        continue;
      }

      // Create tagihan
      try {
        await prisma.kbtkTagihanSpp.create({
          data: {
            siswaId: student.id,
            bulan: parseInt(bulan),
            tahun: parseInt(tahun),
            nominal: setting.nominalSpp,
            diskon: new Decimal(0),
            totalTagihan: setting.nominalSpp,
            status: 'belum_bayar',
          },
        });
        results.created++;
      } catch {
        results.errors.push(`Gagal membuat tagihan untuk siswa ${student.id}`);
      }
    }

    return NextResponse.json({
      message: `Berhasil membuat ${results.created} tagihan, ${results.skipped} dilewati`,
      ...results,
    });
  } catch (error) {
    console.error('Error generating tagihan SPP:', error);
    return NextResponse.json(
      { error: 'Gagal membuat tagihan SPP' },
      { status: 500 }
    );
  }
}
