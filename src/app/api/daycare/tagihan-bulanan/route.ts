// src/app/api/daycare/tagihan-bulanan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, DaycarePaketLayanan, DaycareStatusTagihan } from '@prisma/client';

// GET - List tagihan bulanan with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const bulan = searchParams.get('bulan');
    const tahun = searchParams.get('tahun');
    const status = searchParams.get('status');
    const paket = searchParams.get('paket');
    const anakId = searchParams.get('anakId');
    const search = searchParams.get('search');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.DaycareTagihanBulananWhereInput = {};

    if (bulan) {
      where.bulan = parseInt(bulan);
    }

    if (tahun) {
      where.tahun = parseInt(tahun);
    }

    if (status && status !== 'all') {
      where.status = status as DaycareStatusTagihan;
    }

    if (paket && paket !== 'all') {
      where.paket = paket as DaycarePaketLayanan;
    }

    if (anakId) {
      where.anakId = anakId;
    }

    if (search) {
      where.anak = {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nomorInduk: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    // Fetch data with pembayaran
    const [data, total] = await Promise.all([
      prisma.daycareTagihanBulanan.findMany({
        where,
        include: {
          anak: {
            select: {
              id: true,
              nomorInduk: true,
              namaLengkap: true,
              namaPanggilan: true,
              paketLayanan: true,
              foto: true,
              orangTua: {
                where: { isPrimary: true },
                select: {
                  id: true,
                  nama: true,
                  nomorHP: true,
                },
                take: 1,
              },
            },
          },
          pembayaran: {
            orderBy: { tanggalBayar: 'desc' },
          },
        },
        orderBy: [
          { tahun: 'desc' },
          { bulan: 'desc' },
          { anak: { namaLengkap: 'asc' } },
        ],
        skip,
        take: pageSize,
      }),
      prisma.daycareTagihanBulanan.count({ where }),
    ]);

    // Calculate total bayar and sisa for each tagihan
    const enrichedData = data.map((tagihan) => {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const sisaTagihan = Number(tagihan.totalTagihan) - totalBayar;

      return {
        ...tagihan,
        _totalBayar: totalBayar,
        _sisaTagihan: Math.max(0, sisaTagihan),
      };
    });

    // Calculate summary stats
    const allTagihan = await prisma.daycareTagihanBulanan.findMany({
      where,
      include: { pembayaran: true },
    });

    const statsData = allTagihan.reduce(
      (acc, t) => {
        const totalBayar = t.pembayaran.reduce((sum, p) => sum + Number(p.nominal), 0);
        const totalTagihan = Number(t.totalTagihan);
        const sisa = Math.max(0, totalTagihan - totalBayar);

        acc.totalTagihan += totalTagihan;
        acc.totalTerbayar += totalBayar;
        acc.totalTunggakan += sisa;

        if (t.status === 'lunas') acc.totalLunas++;
        else if (t.status === 'bayar_sebagian') acc.totalSebagian++;
        else acc.totalBelumBayar++;

        return acc;
      },
      {
        totalTagihan: 0,
        totalTerbayar: 0,
        totalTunggakan: 0,
        totalLunas: 0,
        totalSebagian: 0,
        totalBelumBayar: 0,
      }
    );

    return NextResponse.json({
      data: enrichedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: statsData,
    });
  } catch (error) {
    console.error('Error fetching tagihan bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tagihan bulanan' },
      { status: 500 }
    );
  }
}

// POST - Generate tagihan bulanan untuk semua anak aktif dengan paket FULLDAY/AFTER_SCHOOL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.bulan || !body.tahun) {
      return NextResponse.json(
        { error: 'Bulan dan tahun wajib diisi' },
        { status: 400 }
      );
    }

    const bulan = parseInt(body.bulan);
    const tahun = parseInt(body.tahun);

    if (bulan < 1 || bulan > 12) {
      return NextResponse.json(
        { error: 'Bulan tidak valid (1-12)' },
        { status: 400 }
      );
    }

    // Build filter for anak to generate tagihan
    const anakWhere: Prisma.DaycareAnakWhereInput = {
      status: 'aktif',
      paketLayanan: {
        in: ['FULLDAY', 'AFTER_SCHOOL'],
      },
    };

    // Optional: Filter by specific paket
    if (body.paket && body.paket !== 'all') {
      anakWhere.paketLayanan = body.paket as DaycarePaketLayanan;
    }

    // Get all active anak with FULLDAY or AFTER_SCHOOL packages
    const anakList = await prisma.daycareAnak.findMany({
      where: anakWhere,
      select: {
        id: true,
        paketLayanan: true,
        tagihanBulanan: {
          where: {
            bulan,
            tahun,
          },
        },
      },
    });

    // Get paket prices from DaycarePaket master
    const paketPrices = await prisma.daycarePaket.findMany({
      where: {
        tipePaket: { in: ['FULLDAY', 'AFTER_SCHOOL'] },
        isActive: true,
      },
      select: {
        tipePaket: true,
        hargaDefault: true,
      },
    });

    const priceMap: Record<string, number> = {};
    paketPrices.forEach((p) => {
      priceMap[p.tipePaket] = Number(p.hargaDefault);
    });

    // Filter anak yang belum memiliki tagihan untuk bulan/tahun tersebut
    const anakToGenerate = anakList.filter(
      (anak) => anak.tagihanBulanan.length === 0
    );

    if (anakToGenerate.length === 0) {
      return NextResponse.json({
        message: 'Tidak ada tagihan yang perlu di-generate',
        generated: 0,
        skipped: anakList.length,
      });
    }

    // Calculate tanggal jatuh tempo (default: tanggal 10 bulan berjalan)
    const tanggalJatuhTempo = new Date(tahun, bulan - 1, 10);

    // Generate tagihan in transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdTagihan = [];

      for (const anak of anakToGenerate) {
        const nominal = priceMap[anak.paketLayanan] || 0;

        if (nominal <= 0) {
          console.warn(`Harga tidak ditemukan untuk paket ${anak.paketLayanan}`);
          continue;
        }

        const diskon = 0; // Default no discount
        const totalTagihan = nominal - diskon;

        const tagihan = await tx.daycareTagihanBulanan.create({
          data: {
            anakId: anak.id,
            bulan,
            tahun,
            paket: anak.paketLayanan,
            nominal,
            diskon,
            totalTagihan,
            status: 'belum_bayar',
            tanggalJatuhTempo,
          },
        });

        createdTagihan.push(tagihan);
      }

      return createdTagihan;
    });

    return NextResponse.json({
      message: `Berhasil generate ${result.length} tagihan`,
      generated: result.length,
      skipped: anakList.length - anakToGenerate.length,
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating tagihan bulanan:', error);
    return NextResponse.json(
      { error: 'Gagal generate tagihan bulanan' },
      { status: 500 }
    );
  }
}
