import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { AccountCategory, NormalBalance, RestrictionType, Prisma } from '@prisma/client';

// GET /api/keuangan/akun/[kode] - Get single account
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;

    const account = await prisma.kodeAkun.findUnique({
      where: { kode },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        kode: account.kode,
        nama: account.nama,
        kategori: account.kategori,
        subKategori: account.subKategori,
        normalBalance: account.normalBalance,
        isContraAccount: account.isContraAccount,
        isRestricted: account.isRestricted,
        restrictionType: account.restrictionType,
        deskripsi: account.deskripsi,
        isActive: account.isActive,
      },
    });
  } catch (error) {
    console.error('Akun GET by kode error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

// PUT /api/keuangan/akun/[kode] - Update account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;
    const body = await request.json();
    const {
      nama,
      kategori,
      subKategori,
      normalBalance,
      isContraAccount,
      isRestricted,
      restrictionType,
      deskripsi,
      isActive,
    } = body;

    // Check if account exists
    const existing = await prisma.kodeAkun.findUnique({
      where: { kode },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Prisma.KodeAkunUpdateInput = {};

    if (nama !== undefined) updateData.nama = nama;
    if (subKategori !== undefined) updateData.subKategori = subKategori || null;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi || null;
    if (isContraAccount !== undefined) updateData.isContraAccount = isContraAccount;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (kategori && Object.values(AccountCategory).includes(kategori)) {
      updateData.kategori = kategori as AccountCategory;
    }

    if (normalBalance && Object.values(NormalBalance).includes(normalBalance)) {
      updateData.normalBalance = normalBalance as NormalBalance;
    }

    if (isRestricted !== undefined) {
      updateData.isRestricted = isRestricted;
      if (isRestricted && restrictionType && Object.values(RestrictionType).includes(restrictionType)) {
        updateData.restrictionType = restrictionType as RestrictionType;
      } else if (!isRestricted) {
        updateData.restrictionType = null;
      }
    }

    const account = await prisma.kodeAkun.update({
      where: { kode },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        kode: account.kode,
        nama: account.nama,
      },
    });
  } catch (error) {
    console.error('Akun PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE /api/keuangan/akun/[kode] - Soft delete (deactivate) account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;

    // Check if account exists
    const existing = await prisma.kodeAkun.findUnique({
      where: { kode },
      include: {
        journalEntries: { take: 1 },
        programItems: { take: 1 },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if account is in use
    if (existing.journalEntries.length > 0 || existing.programItems.length > 0) {
      // Soft delete - just deactivate
      await prisma.kodeAkun.update({
        where: { kode },
        data: { isActive: false },
      });

      return NextResponse.json({
        success: true,
        message: 'Akun berhasil dinonaktifkan',
      });
    }

    // Hard delete if not in use
    await prisma.kodeAkun.delete({
      where: { kode },
    });

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil dihapus',
    });
  } catch (error) {
    console.error('Akun DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

// PATCH /api/keuangan/akun/[kode] - Restore (reactivate) account
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;

    // Check if account exists
    const existing = await prisma.kodeAkun.findUnique({
      where: { kode },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    // Reactivate
    await prisma.kodeAkun.update({
      where: { kode },
      data: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil diaktifkan kembali',
    });
  } catch (error) {
    console.error('Akun PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to restore account' },
      { status: 500 }
    );
  }
}
