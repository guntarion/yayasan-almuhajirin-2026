// src/app/api/daycare/kehadiran-harian/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { KehadiranFormData } from '@/types/daycare';

// GET - Get kehadiran detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const kehadiran = await prisma.daycareKehadiranHarian.findUnique({
      where: { id },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            namaPanggilan: true,
            foto: true,
            paketLayanan: true,
          },
        },
        tagihan: true,
      },
    });

    if (!kehadiran) {
      return NextResponse.json(
        { error: 'Kehadiran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(kehadiran);
  } catch (error) {
    console.error('Error fetching kehadiran:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kehadiran' },
      { status: 500 }
    );
  }
}

// PUT - Update kehadiran
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: KehadiranFormData = await request.json();

    // Check if kehadiran exists
    const existingKehadiran = await prisma.daycareKehadiranHarian.findUnique({
      where: { id },
    });

    if (!existingKehadiran) {
      return NextResponse.json(
        { error: 'Kehadiran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update kehadiran
    const updatedKehadiran = await prisma.daycareKehadiranHarian.update({
      where: { id },
      data: {
        jamMasuk: body.jamMasuk ? new Date(body.jamMasuk) : null,
        jamPulang: body.jamPulang ? new Date(body.jamPulang) : null,
        isHadir: body.isHadir !== undefined ? body.isHadir : true,
        catatan: body.catatan || null,
      },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            foto: true,
          },
        },
      },
    });

    return NextResponse.json(updatedKehadiran);
  } catch (error) {
    console.error('Error updating kehadiran:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate kehadiran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete kehadiran
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if kehadiran exists
    const existingKehadiran = await prisma.daycareKehadiranHarian.findUnique({
      where: { id },
    });

    if (!existingKehadiran) {
      return NextResponse.json(
        { error: 'Kehadiran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete kehadiran
    await prisma.daycareKehadiranHarian.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kehadiran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting kehadiran:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kehadiran' },
      { status: 500 }
    );
  }
}
