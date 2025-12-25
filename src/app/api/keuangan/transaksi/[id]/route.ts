import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// GET /api/keuangan/transaksi/[id] - Get transaction detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        bidang: true,
        unitKerja: true,
        programKerja: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
        programItem: {
          select: {
            id: true,
            kodeItem: true,
            namaItem: true,
            jumlah: true,
            realisasi: true,
          },
        },
        journalEntries: {
          include: {
            akun: {
              select: { kode: true, nama: true, kategori: true },
            },
          },
        },
        fiscalPeriod: {
          select: { id: true, year: true, name: true },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: transaction.id,
        code: transaction.code,
        transactionDate: transaction.transactionDate,
        type: transaction.type,
        amount: Number(transaction.amount),
        description: transaction.description,
        entityName: transaction.entityName,
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes,
        isVoided: transaction.isVoided,
        voidReason: transaction.voidReason,
        bidang: transaction.bidang ? {
          kode: transaction.bidang.kode,
          nama: transaction.bidang.nama,
        } : null,
        unitKerja: transaction.unitKerja ? {
          kode: transaction.unitKerja.kode,
          nama: transaction.unitKerja.nama,
        } : null,
        programKerja: transaction.programKerja,
        programItem: transaction.programItem ? {
          id: transaction.programItem.id,
          kodeItem: transaction.programItem.kodeItem,
          namaItem: transaction.programItem.namaItem,
          jumlah: Number(transaction.programItem.jumlah),
          realisasi: Number(transaction.programItem.realisasi),
        } : null,
        journalEntries: transaction.journalEntries.map(je => ({
          id: je.id,
          entryType: je.entryType,
          amount: Number(je.amount),
          description: je.description,
          akun: je.akun,
        })),
        fiscalPeriod: transaction.fiscalPeriod,
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

// PUT /api/keuangan/transaksi/[id] - Update transaction
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
      amount,
      description,
      entityName,
      paymentMethod,
      notes,
      bidangKode,
      unitKerjaKode,
      programItemId,
      debitAccountCode,
      creditAccountCode,
    } = body;

    // Get existing transaction
    const existing = await prisma.transaction.findUnique({
      where: { id },
      include: {
        journalEntries: true,
        programItem: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.isVoided) {
      return NextResponse.json(
        { error: 'Transaksi yang sudah dibatalkan tidak dapat diedit' },
        { status: 400 }
      );
    }

    const oldAmount = Number(existing.amount);
    const newAmount = amount !== undefined ? Number(amount) : oldAmount;
    const amountDiff = newAmount - oldAmount;

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update main transaction
      const updated = await tx.transaction.update({
        where: { id },
        data: {
          ...(transactionDate && { transactionDate: new Date(transactionDate) }),
          ...(type && { type }),
          ...(amount !== undefined && { amount: new Prisma.Decimal(amount) }),
          ...(description && { description }),
          ...(entityName !== undefined && { entityName: entityName || null }),
          ...(paymentMethod && { paymentMethod }),
          ...(notes !== undefined && { notes: notes || null }),
          ...(bidangKode !== undefined && { bidangKode: bidangKode || null }),
          ...(unitKerjaKode !== undefined && { unitKerjaKode: unitKerjaKode || null }),
          ...(programItemId !== undefined && { programItemId: programItemId || null }),
        },
      });

      // Update journal entries if amount changed
      if (amount !== undefined && amountDiff !== 0) {
        // Delete old journal entries
        await tx.journalEntry.deleteMany({
          where: { transactionId: id },
        });

        // Determine account codes
        // Matches kode-akun.ts: 1101=Kas, 1102=Bank Rekening Umum
        const txType = type || existing.type;
        const cashBankAccount = (paymentMethod || existing.paymentMethod) === 'cash' ? '1101' : '1102';

        let debitCode: string;
        let creditCode: string;

        if (txType === 'expense') {
          // Default expense: 5290 (Beban Lain-lain)
          debitCode = debitAccountCode || existing.journalEntries.find(je => je.entryType === 'debit')?.kodeAkun || '5290';
          creditCode = creditAccountCode || cashBankAccount;
        } else {
          // Default income: 4190 (Pendapatan Lain-lain)
          debitCode = debitAccountCode || cashBankAccount;
          creditCode = creditAccountCode || existing.journalEntries.find(je => je.entryType === 'credit')?.kodeAkun || '4190';
        }

        // Create new journal entries
        await tx.journalEntry.createMany({
          data: [
            {
              transactionId: id,
              entryType: 'debit',
              kodeAkun: debitCode,
              amount: new Prisma.Decimal(newAmount),
              description: `${txType === 'expense' ? 'Beban' : 'Kas/Bank'}: ${description || existing.description}`,
            },
            {
              transactionId: id,
              entryType: 'credit',
              kodeAkun: creditCode,
              amount: new Prisma.Decimal(newAmount),
              description: `${txType === 'expense' ? 'Kas/Bank' : 'Pendapatan'}: ${description || existing.description}`,
            },
          ],
        });
      }

      // Update realisasi on program item if needed
      if (amountDiff !== 0) {
        // If program item changed
        if (programItemId !== undefined && programItemId !== existing.programItemId) {
          // Decrease old item realisasi
          if (existing.programItemId) {
            await tx.programItem.update({
              where: { id: existing.programItemId },
              data: {
                realisasi: {
                  decrement: new Prisma.Decimal(oldAmount),
                },
              },
            });
          }
          // Increase new item realisasi
          if (programItemId) {
            await tx.programItem.update({
              where: { id: programItemId },
              data: {
                realisasi: {
                  increment: new Prisma.Decimal(newAmount),
                },
              },
            });
          }
        } else if (existing.programItemId) {
          // Same item, just update the difference
          await tx.programItem.update({
            where: { id: existing.programItemId },
            data: {
              realisasi: {
                increment: new Prisma.Decimal(amountDiff),
              },
            },
          });
        }
      }

      return updated;
    });

    // Fetch updated transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id },
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
        amount: Number(transaction!.amount),
        description: transaction!.description,
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

// DELETE /api/keuangan/transaksi/[id] - Void transaction (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    const existing = await prisma.transaction.findUnique({
      where: { id },
      include: { programItem: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.isVoided) {
      return NextResponse.json(
        { error: 'Transaksi sudah dibatalkan' },
        { status: 400 }
      );
    }

    // Void transaction and reverse realisasi
    await prisma.$transaction(async (tx) => {
      // Void the transaction
      await tx.transaction.update({
        where: { id },
        data: {
          isVoided: true,
          voidReason: reason || 'Dibatalkan',
          voidedAt: new Date(),
        },
      });

      // Reverse realisasi on program item
      if (existing.programItemId) {
        await tx.programItem.update({
          where: { id: existing.programItemId },
          data: {
            realisasi: {
              decrement: existing.amount,
            },
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil dibatalkan',
    });
  } catch (error) {
    console.error('Transaction DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to void transaction' },
      { status: 500 }
    );
  }
}
