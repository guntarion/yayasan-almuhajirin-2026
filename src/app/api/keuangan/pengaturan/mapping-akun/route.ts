import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, JenisProgram } from '@prisma/client';

// GET /api/keuangan/pengaturan/mapping-akun - Get all program items with their account mappings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unitKerjaKode = searchParams.get('unitKerjaKode');
    const bidangKode = searchParams.get('bidangKode');
    const jenis = searchParams.get('jenis'); // 'pendapatan' or 'pengeluaran'
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Get active fiscal period
    const activePeriod = await prisma.fiscalPeriod.findFirst({
      where: { isActive: true },
      select: { year: true },
    });
    const fiscalYear = activePeriod?.year || new Date().getFullYear();

    // Build where clause
    const programWhere: Prisma.ProgramKerjaWhereInput = {
      fiscalYear,
      status: 'aktif',
    };

    if (unitKerjaKode) {
      programWhere.unitKerjaKode = unitKerjaKode;
    }
    if (bidangKode) {
      programWhere.bidangKode = bidangKode;
    }
    if (jenis) {
      programWhere.jenis = jenis as JenisProgram;
    }

    // Build item where clause for search
    const itemWhere: Prisma.ProgramItemWhereInput = {};
    if (search) {
      itemWhere.OR = [
        { namaItem: { contains: search, mode: 'insensitive' } },
        { kodeItem: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get programs with their items
    const programs = await prisma.programKerja.findMany({
      where: programWhere,
      include: {
        items: {
          where: itemWhere,
          include: {
            akun: {
              select: {
                kode: true,
                nama: true,
                kategori: true,
                normalBalance: true,
              },
            },
          },
          orderBy: { kodeItem: 'asc' },
        },
        bidang: { select: { kode: true, nama: true } },
        unitKerja: { select: { kode: true, nama: true } },
      },
      orderBy: { nama: 'asc' },
    });

    // Flatten items with program info
    const allItems = programs.flatMap(program =>
      program.items.map(item => ({
        id: item.id,
        programId: program.id,
        programKode: program.kode,
        programNama: program.nama,
        programJenis: program.jenis,
        kodeItem: item.kodeItem,
        namaItem: item.namaItem,
        kodeAkun: item.kodeAkun,
        akun: item.akun ? {
          kode: item.akun.kode,
          nama: item.akun.nama,
          kategori: item.akun.kategori,
          normalBalance: item.akun.normalBalance,
        } : null,
        bidang: {
          kode: program.bidang.kode,
          nama: program.bidang.nama,
        },
        unit: {
          kode: program.unitKerja.kode,
          nama: program.unitKerja.nama,
        },
      }))
    );

    // Pagination
    const total = allItems.length;
    const paginatedItems = allItems.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: paginatedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Mapping akun GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mapping data' },
      { status: 500 }
    );
  }
}

// PUT /api/keuangan/pengaturan/mapping-akun - Bulk update account mappings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { mappings } = body; // Array of { itemId, kodeAkun }

    if (!mappings || !Array.isArray(mappings)) {
      return NextResponse.json(
        { error: 'mappings harus berupa array' },
        { status: 400 }
      );
    }

    // Validate all account codes exist
    const uniqueKodes = [...new Set(mappings.map(m => m.kodeAkun).filter(Boolean))];
    if (uniqueKodes.length > 0) {
      const existingAkun = await prisma.kodeAkun.findMany({
        where: { kode: { in: uniqueKodes } },
        select: { kode: true },
      });
      const existingKodes = new Set(existingAkun.map(a => a.kode));
      const invalidKodes = uniqueKodes.filter(k => !existingKodes.has(k));
      if (invalidKodes.length > 0) {
        return NextResponse.json(
          { error: `Kode akun tidak ditemukan: ${invalidKodes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Update each mapping
    const updates = await prisma.$transaction(
      mappings.map(({ itemId, kodeAkun }) =>
        prisma.programItem.update({
          where: { id: itemId },
          data: { kodeAkun },
        })
      )
    );

    return NextResponse.json({
      success: true,
      updated: updates.length,
    });
  } catch (error) {
    console.error('Mapping akun PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update mappings' },
      { status: 500 }
    );
  }
}
