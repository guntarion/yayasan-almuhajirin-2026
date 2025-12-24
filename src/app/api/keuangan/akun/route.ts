import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma, AccountCategory, NormalBalance, RestrictionType } from '@prisma/client';

// GET /api/keuangan/akun - List accounts with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const kategori = searchParams.get('kategori') || '';
    const normalBalance = searchParams.get('normalBalance') || '';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Build where clause
    const where: Prisma.KodeAkunWhereInput = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { kode: { contains: search, mode: 'insensitive' } },
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (kategori && Object.values(AccountCategory).includes(kategori as AccountCategory)) {
      where.kategori = kategori as AccountCategory;
    }

    if (normalBalance && Object.values(NormalBalance).includes(normalBalance as NormalBalance)) {
      where.normalBalance = normalBalance as NormalBalance;
    }

    const accounts = await prisma.kodeAkun.findMany({
      where,
      orderBy: { kode: 'asc' },
    });

    return NextResponse.json({
      data: accounts.map(acc => ({
        kode: acc.kode,
        nama: acc.nama,
        kategori: acc.kategori,
        subKategori: acc.subKategori,
        normalBalance: acc.normalBalance,
        isContraAccount: acc.isContraAccount,
        isRestricted: acc.isRestricted,
        restrictionType: acc.restrictionType,
        deskripsi: acc.deskripsi,
        isActive: acc.isActive,
      })),
    });
  } catch (error) {
    console.error('Akun GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/akun - Create new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      kode,
      nama,
      kategori,
      subKategori,
      normalBalance,
      isContraAccount,
      isRestricted,
      restrictionType,
      deskripsi,
    } = body;

    // Validate required fields
    if (!kode || !nama || !kategori || !normalBalance) {
      return NextResponse.json(
        { error: 'Kode, nama, kategori, dan normal balance wajib diisi' },
        { status: 400 }
      );
    }

    // Validate enums
    if (!Object.values(AccountCategory).includes(kategori)) {
      return NextResponse.json(
        { error: 'Kategori tidak valid' },
        { status: 400 }
      );
    }

    if (!Object.values(NormalBalance).includes(normalBalance)) {
      return NextResponse.json(
        { error: 'Normal balance tidak valid' },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const existing = await prisma.kodeAkun.findUnique({
      where: { kode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Kode akun sudah digunakan' },
        { status: 400 }
      );
    }

    // Create account
    const account = await prisma.kodeAkun.create({
      data: {
        kode,
        nama,
        kategori: kategori as AccountCategory,
        subKategori: subKategori || null,
        normalBalance: normalBalance as NormalBalance,
        isContraAccount: isContraAccount || false,
        isRestricted: isRestricted || false,
        restrictionType: isRestricted && restrictionType
          ? restrictionType as RestrictionType
          : null,
        deskripsi: deskripsi || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        kode: account.kode,
        nama: account.nama,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Akun POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
