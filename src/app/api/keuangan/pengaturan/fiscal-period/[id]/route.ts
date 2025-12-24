import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// PUT /api/keuangan/pengaturan/fiscal-period/[id] - Update fiscal period
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, year, startDate, endDate, isActive, isClosed } = body;

    const existing = await prisma.fiscalPeriod.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Periode tidak ditemukan' },
        { status: 404 }
      );
    }

    // If changing year, check if new year already exists
    if (year && parseInt(year) !== existing.year) {
      const duplicate = await prisma.fiscalPeriod.findFirst({
        where: { year: parseInt(year), id: { not: id } },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Periode untuk tahun ini sudah ada' },
          { status: 400 }
        );
      }
    }

    // If activating this period, deactivate others
    if (isActive === true && !existing.isActive) {
      await prisma.fiscalPeriod.updateMany({
        where: { id: { not: id } },
        data: { isActive: false },
      });
    }

    const period = await prisma.fiscalPeriod.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(year && { year: parseInt(year) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(isActive !== undefined && { isActive }),
        ...(isClosed !== undefined && { isClosed }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: period.id, name: period.name },
    });
  } catch (error) {
    console.error('FiscalPeriod PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update fiscal period' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/pengaturan/fiscal-period/[id] - Delete fiscal period
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.fiscalPeriod.findUnique({
      where: { id },
      include: {
        programs: { take: 1 },
        transactions: { take: 1 },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Periode tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.programs.length > 0 || existing.transactions.length > 0) {
      return NextResponse.json(
        { error: 'Periode yang memiliki program atau transaksi tidak dapat dihapus' },
        { status: 400 }
      );
    }

    await prisma.fiscalPeriod.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Periode berhasil dihapus',
    });
  } catch (error) {
    console.error('FiscalPeriod DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete fiscal period' },
      { status: 500 }
    );
  }
}
