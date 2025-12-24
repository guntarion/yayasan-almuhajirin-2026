import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET /api/keuangan/programs - List programs with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const jenis = searchParams.get('jenis') || '';
    const status = searchParams.get('status') || '';
    const bidang = searchParams.get('bidang') || '';
    const unit = searchParams.get('unit') || '';
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Build where clause
    const where: Prisma.ProgramKerjaWhereInput = {
      fiscalYear: year,
    };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { kode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (jenis && (jenis === 'pendapatan' || jenis === 'pengeluaran')) {
      where.jenis = jenis;
    }

    if (status) {
      where.status = status as Prisma.EnumStatusProgramFilter['equals'];
    }

    if (bidang) {
      where.bidangKode = bidang;
    }

    if (unit) {
      where.unitKerjaKode = unit;
    }

    // Count total
    const total = await prisma.programKerja.count({ where });

    // Get programs with items
    const programs = await prisma.programKerja.findMany({
      where,
      orderBy: [{ bidangKode: 'asc' }, { kode: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        bidang: true,
        unitKerja: true,
        items: true,
      },
    });

    // Calculate totals for each program
    const data = programs.map(program => {
      const totalAnggaran = program.items.reduce(
        (sum, item) => sum + Number(item.jumlah),
        0
      );
      const totalRealisasi = program.items.reduce(
        (sum, item) => sum + Number(item.realisasi),
        0
      );
      const progress = totalAnggaran > 0
        ? Math.round((totalRealisasi / totalAnggaran) * 100)
        : 0;

      return {
        id: program.id,
        kode: program.kode,
        nama: program.nama,
        jenis: program.jenis,
        sifat: program.sifat,
        status: program.status,
        bidang: { kode: program.bidang.kode, nama: program.bidang.nama },
        unit: { kode: program.unitKerja.kode, nama: program.unitKerja.nama },
        totalAnggaran,
        totalRealisasi,
        progress,
        itemCount: program.items.length,
      };
    });

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Programs GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/programs - Create new program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      kode,
      nama,
      jenis,
      sifat,
      bidangKode,
      unitKerjaKode,
      fiscalYear,
      deskripsi,
      items,
    } = body;

    // Validate required fields
    if (!kode || !nama || !jenis || !bidangKode || !unitKerjaKode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const year = fiscalYear || new Date().getFullYear();

    // Check if code already exists
    const existing = await prisma.programKerja.findFirst({
      where: { kode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Program code already exists' },
        { status: 400 }
      );
    }

    // Get fiscal period
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: { year },
    });

    if (!fiscalPeriod) {
      return NextResponse.json(
        { error: 'Fiscal period not found for this year' },
        { status: 400 }
      );
    }

    // Create program with items
    const program = await prisma.programKerja.create({
      data: {
        kode,
        nama,
        jenis,
        sifat: sifat || 'rutin',
        status: 'draft',
        fiscalYear: year,
        fiscalPeriodId: fiscalPeriod.id,
        deskripsi: deskripsi || null,
        bidangKode,
        unitKerjaKode,
        items: items && items.length > 0 ? {
          create: items.map((item: {
            kodeItem: string;
            namaItem: string;
            keterangan?: string;
            volume?: number;
            satuan?: string;
            hargaSatuan: number;
            kodeAkun: string;
            jan?: number;
            feb?: number;
            mar?: number;
            apr?: number;
            mei?: number;
            jun?: number;
            jul?: number;
            agu?: number;
            sep?: number;
            okt?: number;
            nov?: number;
            des?: number;
          }) => {
            const volume = item.volume || 1;
            const hargaSatuan = item.hargaSatuan || 0;
            const jumlah = volume * hargaSatuan;

            return {
              kodeItem: item.kodeItem,
              namaItem: item.namaItem,
              keterangan: item.keterangan || null,
              volume: new Prisma.Decimal(volume),
              satuan: item.satuan || 'unit',
              hargaSatuan: new Prisma.Decimal(hargaSatuan),
              jumlah: new Prisma.Decimal(jumlah),
              kodeAkun: item.kodeAkun,
              jan: item.jan ? new Prisma.Decimal(item.jan) : null,
              feb: item.feb ? new Prisma.Decimal(item.feb) : null,
              mar: item.mar ? new Prisma.Decimal(item.mar) : null,
              apr: item.apr ? new Prisma.Decimal(item.apr) : null,
              mei: item.mei ? new Prisma.Decimal(item.mei) : null,
              jun: item.jun ? new Prisma.Decimal(item.jun) : null,
              jul: item.jul ? new Prisma.Decimal(item.jul) : null,
              agu: item.agu ? new Prisma.Decimal(item.agu) : null,
              sep: item.sep ? new Prisma.Decimal(item.sep) : null,
              okt: item.okt ? new Prisma.Decimal(item.okt) : null,
              nov: item.nov ? new Prisma.Decimal(item.nov) : null,
              des: item.des ? new Prisma.Decimal(item.des) : null,
            };
          }),
        } : undefined,
      },
      include: {
        bidang: true,
        unitKerja: true,
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: program.id,
        kode: program.kode,
        nama: program.nama,
        jenis: program.jenis,
        status: program.status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Program POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
