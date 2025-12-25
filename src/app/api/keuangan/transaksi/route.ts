import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// Default cash/bank account codes for double-entry
// Matches kode-akun.ts: 1101=Kas, 1102=Bank Rekening Umum
const DEFAULT_CASH_ACCOUNT = '1101'; // Kas
const DEFAULT_BANK_ACCOUNT = '1102'; // Bank - Rekening Umum

// GET /api/keuangan/transaksi - List transactions with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');
    const bidangKode = searchParams.get('bidangKode');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      isVoided: false,
    };

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { entityName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate) {
      where.transactionDate = {
        ...(where.transactionDate as object),
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.transactionDate = {
        ...(where.transactionDate as object),
        lte: new Date(endDate + 'T23:59:59'),
      };
    }

    if (type && (type === 'income' || type === 'expense')) {
      where.type = type;
    }

    if (bidangKode) {
      where.bidangKode = bidangKode;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: [
          { transactionDate: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
        include: {
          bidang: true,
          unitKerja: true,
          programItem: {
            select: {
              kodeItem: true,
              namaItem: true,
            },
          },
          journalEntries: {
            include: {
              akun: {
                select: { kode: true, nama: true },
              },
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: transactions.map(t => ({
        id: t.id,
        code: t.code,
        date: t.transactionDate,
        description: t.description,
        amount: Number(t.amount),
        type: t.type,
        paymentMethod: t.paymentMethod,
        bidang: t.bidang?.nama || '-',
        bidangKode: t.bidangKode,
        unit: t.unitKerja?.nama || '-',
        unitKode: t.unitKerjaKode,
        entityName: t.entityName,
        notes: t.notes,
        programItem: t.programItem ? {
          kodeItem: t.programItem.kodeItem,
          namaItem: t.programItem.namaItem,
        } : null,
        journalEntries: t.journalEntries.map(je => ({
          type: je.entryType,
          amount: Number(je.amount),
          akun: je.akun,
        })),
        createdAt: t.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Transaction GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/keuangan/transaksi - Create new transaction with double-entry journal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionDate,
      type,
      amount,
      description,
      bidangKode,
      unitKerjaKode,
      paymentMethod = 'bank',
      entityName,
      notes,
      programKerjaId,
      programItemId,
      // For double-entry bookkeeping
      debitAccountCode,
      creditAccountCode,
    } = body;

    // Validation
    if (!transactionDate || !type || !amount || !description) {
      return NextResponse.json(
        { error: 'Tanggal, jenis, jumlah, dan deskripsi harus diisi' },
        { status: 400 }
      );
    }

    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { error: 'Jenis transaksi harus income atau expense' },
        { status: 400 }
      );
    }

    // Get active fiscal period
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: { isActive: true },
    });

    if (!fiscalPeriod) {
      return NextResponse.json(
        { error: 'Tidak ada periode fiskal aktif' },
        { status: 400 }
      );
    }

    // Determine account codes for double-entry
    let debitCode: string;
    let creditCode: string;

    // Get cash/bank account based on payment method
    const cashBankAccount = paymentMethod === 'cash' ? DEFAULT_CASH_ACCOUNT : DEFAULT_BANK_ACCOUNT;

    if (type === 'expense') {
      // Expense: Debit expense account, Credit cash/bank
      // Default expense: 5290 (Beban Lain-lain)
      debitCode = debitAccountCode || (programItemId ? await getAccountFromItem(programItemId) : '5290');
      creditCode = creditAccountCode || cashBankAccount;
    } else {
      // Income: Debit cash/bank, Credit income account
      // Default income: 4190 (Pendapatan Lain-lain)
      debitCode = debitAccountCode || cashBankAccount;
      creditCode = creditAccountCode || (programItemId ? await getAccountFromItem(programItemId) : '4190');
    }

    // Validate account codes exist
    const [debitAccount, creditAccount] = await Promise.all([
      prisma.kodeAkun.findUnique({ where: { kode: debitCode } }),
      prisma.kodeAkun.findUnique({ where: { kode: creditCode } }),
    ]);

    if (!debitAccount) {
      return NextResponse.json(
        { error: `Kode akun debit tidak ditemukan: ${debitCode}` },
        { status: 400 }
      );
    }

    if (!creditAccount) {
      return NextResponse.json(
        { error: `Kode akun kredit tidak ditemukan: ${creditCode}` },
        { status: 400 }
      );
    }

    // Generate transaction code
    const year = new Date(transactionDate).getFullYear();
    const month = String(new Date(transactionDate).getMonth() + 1).padStart(2, '0');
    const prefix = `TRX-${year}${month}`;

    const lastTransaction = await prisma.transaction.findFirst({
      where: {
        code: { startsWith: prefix },
      },
      orderBy: { code: 'desc' },
    });

    let sequence = 1;
    if (lastTransaction) {
      const lastSequence = parseInt(lastTransaction.code.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    const code = `${prefix}-${String(sequence).padStart(3, '0')}`;

    // Create transaction with journal entries in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          code,
          transactionDate: new Date(transactionDate),
          type,
          amount: new Prisma.Decimal(amount),
          description,
          paymentMethod: paymentMethod || 'bank',
          entityName: entityName || null,
          notes: notes || null,
          fiscalPeriodId: fiscalPeriod.id,
          bidangKode: bidangKode || null,
          unitKerjaKode: unitKerjaKode || null,
          programKerjaId: programKerjaId || null,
          programItemId: programItemId || null,
        },
      });

      // Create journal entries (double-entry)
      await tx.journalEntry.createMany({
        data: [
          {
            transactionId: transaction.id,
            entryType: 'debit',
            kodeAkun: debitCode,
            amount: new Prisma.Decimal(amount),
            description: `${type === 'expense' ? 'Beban' : 'Kas/Bank'}: ${description}`,
          },
          {
            transactionId: transaction.id,
            entryType: 'credit',
            kodeAkun: creditCode,
            amount: new Prisma.Decimal(amount),
            description: `${type === 'expense' ? 'Kas/Bank' : 'Pendapatan'}: ${description}`,
          },
        ],
      });

      // Update realisasi on program item if linked
      if (programItemId) {
        await tx.programItem.update({
          where: { id: programItemId },
          data: {
            realisasi: {
              increment: new Prisma.Decimal(amount),
            },
          },
        });
      }

      return transaction;
    });

    // Fetch complete transaction with relations
    const transaction = await prisma.transaction.findUnique({
      where: { id: result.id },
      include: {
        bidang: true,
        unitKerja: true,
        journalEntries: {
          include: {
            akun: { select: { kode: true, nama: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: transaction!.id,
        code: transaction!.code,
        date: transaction!.transactionDate,
        description: transaction!.description,
        amount: Number(transaction!.amount),
        type: transaction!.type,
        bidang: transaction!.bidang?.nama,
        unit: transaction!.unitKerja?.nama,
        journalEntries: transaction!.journalEntries.map(je => ({
          type: je.entryType,
          amount: Number(je.amount),
          akun: je.akun,
        })),
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

// Helper function to get account code from program item
async function getAccountFromItem(programItemId: string): Promise<string> {
  const item = await prisma.programItem.findUnique({
    where: { id: programItemId },
    select: { kodeAkun: true },
  });
  return item?.kodeAkun || '5290'; // Default to Beban Lain-lain
}
