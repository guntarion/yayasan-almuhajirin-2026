// src/app/api/daycare/orang-tua/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { OrangTuaFormData } from '@/types/daycare';

// GET - Get orang tua detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const orangTua = await prisma.daycareOrangTua.findUnique({
      where: { id },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            namaPanggilan: true,
            paketLayanan: true,
            status: true,
            tanggalLahir: true,
            foto: true,
          },
        },
      },
    });

    if (!orangTua) {
      return NextResponse.json(
        { error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(orangTua);
  } catch (error) {
    console.error('Error fetching orang tua:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data orang tua' },
      { status: 500 }
    );
  }
}

// PUT - Update orang tua
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<OrangTuaFormData> = await request.json();

    // Check if orang tua exists
    const existingOrangTua = await prisma.daycareOrangTua.findUnique({
      where: { id },
    });

    if (!existingOrangTua) {
      return NextResponse.json(
        { error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    // If setting as primary, unset other primaries first
    if (body.isPrimary) {
      await prisma.daycareOrangTua.updateMany({
        where: {
          anakId: existingOrangTua.anakId,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    // Update orang tua
    const orangTua = await prisma.daycareOrangTua.update({
      where: { id },
      data: {
        nama: body.nama,
        relasi: body.relasi,
        nomorHP: body.nomorHP ?? existingOrangTua.nomorHP,
        nomorHPDarurat: body.nomorHPDarurat ?? existingOrangTua.nomorHPDarurat,
        email: body.email ?? existingOrangTua.email,
        pekerjaan: body.pekerjaan ?? existingOrangTua.pekerjaan,
        alamat: body.alamat ?? existingOrangTua.alamat,
        isPrimary: body.isPrimary ?? existingOrangTua.isPrimary,
      },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
          },
        },
      },
    });

    return NextResponse.json(orangTua);
  } catch (error) {
    console.error('Error updating orang tua:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data orang tua' },
      { status: 500 }
    );
  }
}

// DELETE - Delete orang tua
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if orang tua exists
    const existingOrangTua = await prisma.daycareOrangTua.findUnique({
      where: { id },
    });

    if (!existingOrangTua) {
      return NextResponse.json(
        { error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if this is the only orang tua for the anak
    const orangTuaCount = await prisma.daycareOrangTua.count({
      where: { anakId: existingOrangTua.anakId },
    });

    if (orangTuaCount === 1) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus satu-satunya data orang tua. Anak harus memiliki minimal satu orang tua.' },
        { status: 400 }
      );
    }

    // Delete orang tua
    await prisma.daycareOrangTua.delete({
      where: { id },
    });

    // If deleted one was primary, set another as primary
    if (existingOrangTua.isPrimary) {
      const firstOrangTua = await prisma.daycareOrangTua.findFirst({
        where: { anakId: existingOrangTua.anakId },
        orderBy: { createdAt: 'asc' },
      });

      if (firstOrangTua) {
        await prisma.daycareOrangTua.update({
          where: { id: firstOrangTua.id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({ message: 'Orang tua berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting orang tua:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data orang tua' },
      { status: 500 }
    );
  }
}
