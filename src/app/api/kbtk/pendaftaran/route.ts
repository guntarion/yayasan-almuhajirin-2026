// src/app/api/kbtk/pendaftaran/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET - List pendaftaran with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const tahunAjaran = searchParams.get('tahunAjaran') || '';
    const program = searchParams.get('program') || '';
    const status = searchParams.get('status') || '';
    const lunas = searchParams.get('lunas') || '';

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.KbtkPendaftaranWhereInput = {};

    if (search) {
      where.siswa = {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nomorInduk: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (tahunAjaran && tahunAjaran !== 'all') {
      where.tahunAjaran = tahunAjaran;
    }

    if (program && program !== 'all') {
      where.program = program as 'KB' | 'TK';
    }

    if (status && status !== 'all') {
      where.status = status as 'daftar' | 'diterima' | 'batal';
    }

    // Fetch data with relations
    const [rawData, total] = await Promise.all([
      prisma.kbtkPendaftaran.findMany({
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
          pembayaran: {
            select: {
              id: true,
              nominal: true,
              tanggalBayar: true,
              metodePembayaran: true,
            },
            orderBy: { tanggalBayar: 'desc' },
          },
        },
        orderBy: { tanggalDaftar: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.kbtkPendaftaran.count({ where }),
    ]);

    // Calculate totals and add computed fields
    const data = rawData.map((pendaftaran) => {
      const totalBayar = pendaftaran.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      const sisaTagihan = Number(pendaftaran.biayaPendaftaran) - totalBayar;

      return {
        ...pendaftaran,
        _totalBayar: totalBayar,
        _sisaTagihan: sisaTagihan,
      };
    });

    // Filter by lunas status if specified
    let filteredData = data;
    if (lunas === 'lunas') {
      filteredData = data.filter((d) => d._sisaTagihan <= 0);
    } else if (lunas === 'belum') {
      filteredData = data.filter((d) => d._sisaTagihan > 0);
    }

    // Calculate stats
    const allPendaftaran = await prisma.kbtkPendaftaran.findMany({
      where: tahunAjaran && tahunAjaran !== 'all' ? { tahunAjaran } : {},
      include: {
        pembayaran: {
          select: { nominal: true },
        },
      },
    });

    const stats = {
      totalPendaftaran: allPendaftaran.length,
      totalDiterima: allPendaftaran.filter((p) => p.status === 'diterima').length,
      totalBelumLunas: allPendaftaran.filter((p) => {
        const totalBayar = p.pembayaran.reduce((sum, pay) => sum + Number(pay.nominal), 0);
        return Number(p.biayaPendaftaran) - totalBayar > 0;
      }).length,
      totalPemasukan: allPendaftaran.reduce((sum, p) => {
        const totalBayar = p.pembayaran.reduce((s, pay) => s + Number(pay.nominal), 0);
        return sum + totalBayar;
      }, 0),
    };

    return NextResponse.json({
      data: filteredData,
      total: lunas ? filteredData.length : total,
      page,
      pageSize,
      totalPages: Math.ceil((lunas ? filteredData.length : total) / pageSize),
      stats,
    });
  } catch (error) {
    console.error('Error fetching pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// POST - Create new pendaftaran
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.siswaId) {
      return NextResponse.json(
        { error: 'Siswa wajib dipilih' },
        { status: 400 }
      );
    }

    if (!body.biayaPendaftaran || Number(body.biayaPendaftaran) <= 0) {
      return NextResponse.json(
        { error: 'Biaya pendaftaran wajib diisi dan harus lebih dari 0' },
        { status: 400 }
      );
    }

    // Check if siswa already has pendaftaran
    const existingPendaftaran = await prisma.kbtkPendaftaran.findUnique({
      where: { siswaId: body.siswaId },
    });

    if (existingPendaftaran) {
      return NextResponse.json(
        { error: 'Siswa ini sudah memiliki data pendaftaran' },
        { status: 400 }
      );
    }

    // Get siswa data
    const siswa = await prisma.kbtkSiswa.findUnique({
      where: { id: body.siswaId },
    });

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Create pendaftaran with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create pendaftaran
      const pendaftaran = await tx.kbtkPendaftaran.create({
        data: {
          siswaId: body.siswaId,
          tahunAjaran: body.tahunAjaran || siswa.tahunAjaran,
          tanggalDaftar: body.tanggalDaftar ? new Date(body.tanggalDaftar) : new Date(),
          program: body.program || siswa.kelompokLevel,
          biayaPendaftaran: body.biayaPendaftaran,
          schemaPembayaran: body.schemaPembayaran || 'lunas',
          status: 'daftar',
          catatan: body.catatan || null,
        },
        include: {
          siswa: true,
        },
      });

      // If schema is lunas and payment info provided, create payment immediately
      if (body.schemaPembayaran === 'lunas' && body.pembayaranAwal) {
        const nominal = Number(body.pembayaranAwal.nominal || body.biayaPendaftaran);

        await tx.kbtkPembayaranPendaftaran.create({
          data: {
            pendaftaranId: pendaftaran.id,
            tanggalBayar: body.pembayaranAwal.tanggalBayar
              ? new Date(body.pembayaranAwal.tanggalBayar)
              : new Date(),
            nominal: nominal,
            metodePembayaran: body.pembayaranAwal.metodePembayaran || 'cash',
            buktiTransfer: body.pembayaranAwal.buktiTransfer || null,
            catatan: body.pembayaranAwal.catatan || null,
          },
        });

        // If fully paid, update status
        if (nominal >= Number(body.biayaPendaftaran)) {
          await tx.kbtkPendaftaran.update({
            where: { id: pendaftaran.id },
            data: {
              status: 'diterima',
              tanggalDiterima: new Date(),
            },
          });

          // Update siswa status to aktif
          await tx.kbtkSiswa.update({
            where: { id: body.siswaId },
            data: { status: 'aktif' },
          });
        }
      }

      // Fetch the complete pendaftaran with relations
      return tx.kbtkPendaftaran.findUnique({
        where: { id: pendaftaran.id },
        include: {
          siswa: true,
          pembayaran: true,
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating pendaftaran:', error);
    return NextResponse.json(
      { error: 'Gagal membuat data pendaftaran' },
      { status: 500 }
    );
  }
}
