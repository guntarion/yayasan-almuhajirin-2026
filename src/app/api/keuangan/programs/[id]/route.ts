import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET /api/keuangan/programs/[id] - Get single program
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.programKerja.findUnique({
      where: { id },
      include: {
        bidang: true,
        unitKerja: true,
        fiscalPeriod: true,
        items: {
          include: {
            akun: true,
          },
        },
        transactions: {
          where: { isVoided: false },
          orderBy: { transactionDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Calculate totals
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

    return NextResponse.json({
      data: {
        id: program.id,
        kode: program.kode,
        nama: program.nama,
        jenis: program.jenis,
        sifat: program.sifat,
        status: program.status,
        fiscalYear: program.fiscalYear,
        deskripsi: program.deskripsi,
        bidang: { kode: program.bidang.kode, nama: program.bidang.nama },
        unit: { kode: program.unitKerja.kode, nama: program.unitKerja.nama },
        totalAnggaran,
        totalRealisasi,
        progress,
        items: program.items.map(item => ({
          id: item.id,
          kodeItem: item.kodeItem,
          namaItem: item.namaItem,
          keterangan: item.keterangan,
          volume: Number(item.volume),
          satuan: item.satuan,
          hargaSatuan: Number(item.hargaSatuan),
          jumlah: Number(item.jumlah),
          realisasi: Number(item.realisasi),
          monthlyBudget: {
            jan: item.jan ? Number(item.jan) : null,
            feb: item.feb ? Number(item.feb) : null,
            mar: item.mar ? Number(item.mar) : null,
            apr: item.apr ? Number(item.apr) : null,
            mei: item.mei ? Number(item.mei) : null,
            jun: item.jun ? Number(item.jun) : null,
            jul: item.jul ? Number(item.jul) : null,
            agu: item.agu ? Number(item.agu) : null,
            sep: item.sep ? Number(item.sep) : null,
            okt: item.okt ? Number(item.okt) : null,
            nov: item.nov ? Number(item.nov) : null,
            des: item.des ? Number(item.des) : null,
          },
          kodeAkun: item.akun ? {
            kode: item.akun.kode,
            nama: item.akun.nama,
          } : null,
        })),
        recentTransactions: program.transactions.map(trx => ({
          id: trx.id,
          code: trx.code,
          date: trx.transactionDate,
          description: trx.description,
          amount: Number(trx.amount),
          type: trx.type,
        })),
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
      },
    });
  } catch (error) {
    console.error('Program GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

// PUT /api/keuangan/programs/[id] - Update program
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      nama,
      jenis,
      sifat,
      status,
      deskripsi,
      bidangKode,
      unitKerjaKode,
    } = body;

    // Check if program exists
    const existing = await prisma.programKerja.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Prisma.ProgramKerjaUpdateInput = {};

    if (nama) updateData.nama = nama;
    if (jenis) updateData.jenis = jenis;
    if (sifat) updateData.sifat = sifat;
    if (status) updateData.status = status;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi || null;
    if (bidangKode) updateData.bidang = { connect: { kode: bidangKode } };
    if (unitKerjaKode) updateData.unitKerja = { connect: { kode: unitKerjaKode } };

    const program = await prisma.programKerja.update({
      where: { id },
      data: updateData,
      include: {
        bidang: true,
        unitKerja: true,
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
    });
  } catch (error) {
    console.error('Program PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/programs/[id] - Delete program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if program exists
    const existing = await prisma.programKerja.findUnique({
      where: { id },
      include: {
        transactions: { where: { isVoided: false }, take: 1 },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Check if program has transactions
    if (existing.transactions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete program with existing transactions' },
        { status: 400 }
      );
    }

    // Delete program (items will cascade delete)
    await prisma.programKerja.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    console.error('Program DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}
