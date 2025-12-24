import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateTransactionCode } from '@/utils/keuangan';
import { Prisma } from '@prisma/client';

// GET /api/keuangan/transactions - List transactions with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const bidang = searchParams.get('bidang') || '';
    const unit = searchParams.get('unit') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Build where clause
    const where: Prisma.TransactionWhereInput = {
      isVoided: false,
    };

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && (type === 'income' || type === 'expense')) {
      where.type = type;
    }

    if (bidang) {
      where.bidangKode = bidang;
    }

    if (unit) {
      where.unitKerjaKode = unit;
    }

    if (startDate) {
      where.transactionDate = {
        ...(where.transactionDate as Prisma.DateTimeFilter || {}),
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.transactionDate = {
        ...(where.transactionDate as Prisma.DateTimeFilter || {}),
        lte: new Date(endDate),
      };
    }

    // Get fiscal period for year filter
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: { year },
    });

    if (fiscalPeriod) {
      where.fiscalPeriodId = fiscalPeriod.id;
    }

    // Count total
    const total = await prisma.transaction.count({ where });

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        bidang: true,
        unitKerja: true,
        programKerja: true,
      },
    });

    return NextResponse.json({
      data: transactions.map(trx => ({
        id: trx.id,
        code: trx.code,
        date: trx.transactionDate,
        description: trx.description,
        amount: Number(trx.amount),
        type: trx.type,
        paymentMethod: trx.paymentMethod,
        bidang: trx.bidang ? { kode: trx.bidang.kode, nama: trx.bidang.nama } : null,
        unit: trx.unitKerja ? { kode: trx.unitKerja.kode, nama: trx.unitKerja.nama } : null,
        programKerja: trx.programKerja ? { id: trx.programKerja.id, nama: trx.programKerja.nama } : null,
        notes: trx.notes,
        createdAt: trx.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Transactions GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionDate,
      type,
      bidangKode,
      unitKerjaKode,
      programKerjaId,
      amount,
      description,
      paymentMethod,
      notes,
    } = body;

    // Validate required fields
    if (!transactionDate || !type || !bidangKode || !unitKerjaKode || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get fiscal period for the transaction date
    const txDate = new Date(transactionDate);
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: {
        year: txDate.getFullYear(),
        isActive: true,
        isClosed: false,
      },
    });

    if (!fiscalPeriod) {
      return NextResponse.json(
        { error: 'No active fiscal period found for this date' },
        { status: 400 }
      );
    }

    // Generate transaction code
    const code = generateTransactionCode(txDate);

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        code,
        transactionDate: txDate,
        type,
        amount: new Prisma.Decimal(amount),
        description,
        paymentMethod: paymentMethod || 'bank',
        notes: notes || null,
        fiscalPeriodId: fiscalPeriod.id,
        bidangKode,
        unitKerjaKode,
        programKerjaId: programKerjaId || null,
      },
      include: {
        bidang: true,
        unitKerja: true,
      },
    });

    // TODO: Create journal entries automatically

    return NextResponse.json({
      success: true,
      data: {
        id: transaction.id,
        code: transaction.code,
        date: transaction.transactionDate,
        description: transaction.description,
        amount: Number(transaction.amount),
        type: transaction.type,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Transaction POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
