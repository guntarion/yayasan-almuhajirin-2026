import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET /api/keuangan/transactions/[id] - Get single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Get related data separately to avoid type issues
    const [bidang, unitKerja, programKerja, fiscalPeriod] = await Promise.all([
      transaction.bidangKode
        ? prisma.bidang.findUnique({ where: { kode: transaction.bidangKode } })
        : null,
      transaction.unitKerjaKode
        ? prisma.unitKerja.findUnique({ where: { kode: transaction.unitKerjaKode } })
        : null,
      transaction.programKerjaId
        ? prisma.programKerja.findUnique({ where: { id: transaction.programKerjaId } })
        : null,
      prisma.fiscalPeriod.findUnique({ where: { id: transaction.fiscalPeriodId } }),
    ]);

    const journalEntries = await prisma.journalEntry.findMany({
      where: { transactionId: id },
      include: { akun: true },
    });

    return NextResponse.json({
      data: {
        id: transaction.id,
        code: transaction.code,
        date: transaction.transactionDate,
        description: transaction.description,
        amount: Number(transaction.amount),
        type: transaction.type,
        paymentMethod: transaction.paymentMethod,
        bidang: bidang ? { kode: bidang.kode, nama: bidang.nama } : null,
        unit: unitKerja ? { kode: unitKerja.kode, nama: unitKerja.nama } : null,
        programKerja: programKerja ? { id: programKerja.id, nama: programKerja.nama } : null,
        fiscalPeriod: fiscalPeriod ? { year: fiscalPeriod.year, name: fiscalPeriod.name } : null,
        notes: transaction.notes,
        isVoided: transaction.isVoided,
        voidReason: transaction.voidReason,
        journalEntries: journalEntries.map(je => ({
          id: je.id,
          kodeAkun: je.kodeAkun,
          namaAkun: je.akun.nama,
          type: je.entryType,
          amount: Number(je.amount),
        })),
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    });
  } catch (error) {
    console.error('Transaction GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/keuangan/transactions/[id] - Update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if transaction exists and is not voided
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (existing.isVoided) {
      return NextResponse.json(
        { error: 'Cannot update a voided transaction' },
        { status: 400 }
      );
    }

    // Build update data using unchecked input for direct FK assignment
    const updateData: Prisma.TransactionUncheckedUpdateInput = {};

    if (transactionDate) {
      updateData.transactionDate = new Date(transactionDate);
    }
    if (type) {
      updateData.type = type;
    }
    if (bidangKode !== undefined) {
      updateData.bidangKode = bidangKode || null;
    }
    if (unitKerjaKode !== undefined) {
      updateData.unitKerjaKode = unitKerjaKode || null;
    }
    if (programKerjaId !== undefined) {
      updateData.programKerjaId = programKerjaId || null;
    }
    if (amount !== undefined) {
      updateData.amount = new Prisma.Decimal(amount);
    }
    if (description) {
      updateData.description = description;
    }
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }
    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

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
    });
  } catch (error) {
    console.error('Transaction PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/transactions/[id] - Void transaction (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    // Check if transaction exists
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (existing.isVoided) {
      return NextResponse.json(
        { error: 'Transaction is already voided' },
        { status: 400 }
      );
    }

    // Void the transaction (soft delete)
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        isVoided: true,
        voidReason: reason || 'Deleted by user',
        voidedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Transaction voided successfully',
      data: {
        id: transaction.id,
        code: transaction.code,
        isVoided: transaction.isVoided,
      },
    });
  } catch (error) {
    console.error('Transaction DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to void transaction' },
      { status: 500 }
    );
  }
}
