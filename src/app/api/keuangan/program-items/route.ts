import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, JenisProgram } from '@prisma/client';

// GET /api/keuangan/program-items - Get program items by unit for transaction lookup
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unitKerjaKode = searchParams.get('unitKerjaKode');
    const bidangKode = searchParams.get('bidangKode');
    const jenis = searchParams.get('jenis'); // 'pendapatan' or 'pengeluaran'
    let fiscalYear = searchParams.get('fiscalYear')
      ? parseInt(searchParams.get('fiscalYear')!)
      : null;

    // If no fiscal year specified, get from active fiscal period
    if (!fiscalYear) {
      const activePeriod = await prisma.fiscalPeriod.findFirst({
        where: { isActive: true },
        select: { year: true },
      });
      fiscalYear = activePeriod?.year || new Date().getFullYear();
    }

    if (!unitKerjaKode && !bidangKode) {
      return NextResponse.json(
        { error: 'unitKerjaKode atau bidangKode harus diisi' },
        { status: 400 }
      );
    }

    // Build where clause for programs
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

    // Get programs with their items
    const programs = await prisma.programKerja.findMany({
      where: programWhere,
      include: {
        items: {
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
    const items = programs.flatMap(program =>
      program.items.map(item => ({
        id: item.id,
        programId: program.id,
        programKode: program.kode,
        programNama: program.nama,
        programJenis: program.jenis,
        kodeItem: item.kodeItem,
        namaItem: item.namaItem,
        keterangan: item.keterangan,
        volume: Number(item.volume),
        satuan: item.satuan,
        hargaSatuan: Number(item.hargaSatuan),
        jumlah: Number(item.jumlah),
        realisasi: Number(item.realisasi),
        sisaAnggaran: Number(item.jumlah) - Number(item.realisasi),
        progress: Number(item.jumlah) > 0
          ? Math.round((Number(item.realisasi) / Number(item.jumlah)) * 100)
          : 0,
        kodeAkun: item.kodeAkun,
        akun: item.akun ? {
          kode: item.akun.kode,
          nama: item.akun.nama,
          kategori: item.akun.kategori,
          normalBalance: item.akun.normalBalance,
        } : null,
        bidang: program.bidang.nama,
        unit: program.unitKerja.nama,
      }))
    );

    return NextResponse.json({
      data: items,
      count: items.length,
    });
  } catch (error) {
    console.error('Program items GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program items' },
      { status: 500 }
    );
  }
}
