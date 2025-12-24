import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/keuangan/lookups - Get lookup data for dropdowns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    // If specific type is requested
    if (type) {
      switch (type) {
        case 'bidang': {
          const bidang = await prisma.bidang.findMany({
            where: { isActive: true },
            orderBy: { kode: 'asc' },
          });
          return NextResponse.json({
            data: bidang.map(b => ({
              value: b.kode,
              label: b.nama,
            })),
          });
        }

        case 'unit': {
          const bidangKode = searchParams.get('bidang');
          const units = await prisma.unitKerja.findMany({
            where: {
              isActive: true,
              ...(bidangKode ? { bidangKode } : {}),
            },
            orderBy: { kode: 'asc' },
            include: { bidang: true },
          });
          return NextResponse.json({
            data: units.map(u => ({
              value: u.kode,
              label: u.nama,
              bidang: u.bidang.kode,
            })),
          });
        }

        case 'kodeAkun': {
          const kategori = searchParams.get('kategori');
          const accounts = await prisma.kodeAkun.findMany({
            where: {
              isActive: true,
              ...(kategori ? { kategori: kategori as never } : {}),
            },
            orderBy: { kode: 'asc' },
          });
          return NextResponse.json({
            data: accounts.map(a => ({
              value: a.kode,
              label: `${a.kode} - ${a.nama}`,
              kategori: a.kategori,
              normalBalance: a.normalBalance,
            })),
          });
        }

        case 'fiscalPeriod': {
          const periods = await prisma.fiscalPeriod.findMany({
            orderBy: { year: 'desc' },
          });
          return NextResponse.json({
            data: periods.map(p => ({
              value: p.id,
              label: p.name,
              year: p.year,
              isActive: p.isActive,
              isClosed: p.isClosed,
            })),
          });
        }

        case 'programs': {
          const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
          const bidangKode = searchParams.get('bidang');
          const programs = await prisma.programKerja.findMany({
            where: {
              fiscalYear: year,
              status: { in: ['aktif', 'draft'] },
              ...(bidangKode ? { bidangKode } : {}),
            },
            orderBy: { kode: 'asc' },
            include: {
              bidang: true,
              unitKerja: true,
            },
          });
          return NextResponse.json({
            data: programs.map(p => ({
              value: p.id,
              label: `${p.kode} - ${p.nama}`,
              kode: p.kode,
              jenis: p.jenis,
              bidang: p.bidang.kode,
              unit: p.unitKerja.kode,
            })),
          });
        }

        default:
          return NextResponse.json(
            { error: 'Invalid lookup type' },
            { status: 400 }
          );
      }
    }

    // Return all lookups
    const [bidang, units, kodeAkun, fiscalPeriods] = await Promise.all([
      prisma.bidang.findMany({
        where: { isActive: true },
        orderBy: { kode: 'asc' },
        include: { unitKerja: { where: { isActive: true } } },
      }),
      prisma.unitKerja.findMany({
        where: { isActive: true },
        orderBy: { kode: 'asc' },
      }),
      prisma.kodeAkun.findMany({
        where: { isActive: true },
        orderBy: { kode: 'asc' },
      }),
      prisma.fiscalPeriod.findMany({
        orderBy: { year: 'desc' },
      }),
    ]);

    return NextResponse.json({
      bidang: bidang.map(b => ({
        value: b.kode,
        label: b.nama,
        units: b.unitKerja.map(u => ({
          value: u.kode,
          label: u.nama,
        })),
      })),
      units: units.map(u => ({
        value: u.kode,
        label: u.nama,
        bidang: u.bidangKode,
      })),
      kodeAkun: kodeAkun.map(a => ({
        value: a.kode,
        label: `${a.kode} - ${a.nama}`,
        kategori: a.kategori,
        normalBalance: a.normalBalance,
      })),
      fiscalPeriods: fiscalPeriods.map(p => ({
        value: p.id,
        label: p.name,
        year: p.year,
        isActive: p.isActive,
        isClosed: p.isClosed,
      })),
    });
  } catch (error) {
    console.error('Lookups GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lookups' },
      { status: 500 }
    );
  }
}
