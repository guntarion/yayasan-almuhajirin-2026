import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/keuangan/pengaturan/fiscal-period - List all fiscal periods
export async function GET() {
  try {
    const periods = await prisma.fiscalPeriod.findMany({
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({
      data: periods.map(p => ({
        id: p.id,
        name: p.name,
        year: p.year,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate.toISOString(),
        isActive: p.isActive,
        isClosed: p.isClosed,
      })),
    });
  } catch (error) {
    console.error('FiscalPeriod GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fiscal periods' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/pengaturan/fiscal-period - Create new fiscal period
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, year, startDate, endDate } = body;

    if (!name || !year || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Check if year already exists
    const existing = await prisma.fiscalPeriod.findFirst({
      where: { year: parseInt(year) },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Periode untuk tahun ini sudah ada' },
        { status: 400 }
      );
    }

    const period = await prisma.fiscalPeriod.create({
      data: {
        name,
        year: parseInt(year),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: period.id, name: period.name },
    }, { status: 201 });
  } catch (error) {
    console.error('FiscalPeriod POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create fiscal period' },
      { status: 500 }
    );
  }
}
