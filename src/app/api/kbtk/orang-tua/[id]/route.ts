// src/app/api/kbtk/orang-tua/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { OrangTuaFormData } from '@/types/kbtk';

// GET - Get orang tua detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const orangTua = await prisma.kbtkOrangTua.findUnique({
      where: { id },
      include: {
        siswa: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            namaPanggilan: true,
            kelompokLevel: true,
            kelompokKelas: true,
            tahunAjaran: true,
            status: true,
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
    const body: OrangTuaFormData = await request.json();

    // Check if orang tua exists
    const existingOrangTua = await prisma.kbtkOrangTua.findUnique({
      where: { id },
    });

    if (!existingOrangTua) {
      return NextResponse.json(
        { error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    // If setting isPrimary to true, set other orang tua's isPrimary to false
    if (body.isPrimary) {
      await prisma.kbtkOrangTua.updateMany({
        where: {
          siswaId: existingOrangTua.siswaId,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    // Update orang tua
    const orangTua = await prisma.kbtkOrangTua.update({
      where: { id },
      data: {
        nama: body.nama,
        relasi: body.relasi,
        nomorHP: body.nomorHP || null,
        email: body.email || null,
        pekerjaan: body.pekerjaan || null,
        alamat: body.alamat || null,
        isPrimary: body.isPrimary ?? false,
      },
      include: {
        siswa: {
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
    const existingOrangTua = await prisma.kbtkOrangTua.findUnique({
      where: { id },
    });

    if (!existingOrangTua) {
      return NextResponse.json(
        { error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if this is the only orang tua for the siswa
    const countOrangTua = await prisma.kbtkOrangTua.count({
      where: { siswaId: existingOrangTua.siswaId },
    });

    if (countOrangTua <= 1) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus. Siswa harus memiliki minimal satu orang tua/wali' },
        { status: 400 }
      );
    }

    // Delete orang tua
    await prisma.kbtkOrangTua.delete({
      where: { id },
    });

    // If the deleted orang tua was primary, set another one as primary
    if (existingOrangTua.isPrimary) {
      const anotherOrangTua = await prisma.kbtkOrangTua.findFirst({
        where: { siswaId: existingOrangTua.siswaId },
      });
      if (anotherOrangTua) {
        await prisma.kbtkOrangTua.update({
          where: { id: anotherOrangTua.id },
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
