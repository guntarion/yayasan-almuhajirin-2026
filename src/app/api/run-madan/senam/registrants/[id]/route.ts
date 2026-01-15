import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// DELETE endpoint - Remove a senam registration (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Login required' }, { status: 401 });
    }

    // Check role (admin, sekretariat, or moderator)
    const allowedRoles = ['admin', 'sekretariat', 'moderator'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Check if registration exists
    const existingRegistration = await prisma.senamRegistrant.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Pendaftaran senam tidak ditemukan' }, { status: 404 });
    }

    // Delete the registration (participants will be cascade deleted)
    await prisma.senamRegistrant.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran senam berhasil dihapus',
      data: {
        id: existingRegistration.id,
        nomorRegistrasi: existingRegistration.nomorRegistrasi,
        nama: existingRegistration.nama,
        deletedBy: session.user.email,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Delete senam registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus pendaftaran senam' },
      { status: 500 }
    );
  }
}

// PATCH endpoint - Update confirmation status (admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Login required' }, { status: 401 });
    }

    // Check role (admin, sekretariat, or moderator)
    const allowedRoles = ['admin', 'sekretariat', 'moderator'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { statusKonfirmasi } = body;

    // Validate status
    const validStatuses = ['belum_terkonfirmasi', 'terkonfirmasi'];
    if (!statusKonfirmasi || !validStatuses.includes(statusKonfirmasi)) {
      return NextResponse.json(
        { error: 'Status konfirmasi tidak valid. Valid values: belum_terkonfirmasi, terkonfirmasi' },
        { status: 400 }
      );
    }

    // Check if registration exists
    const existingRegistration = await prisma.senamRegistrant.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Pendaftaran senam tidak ditemukan' }, { status: 404 });
    }

    // Update the registration
    const updatedRegistration = await prisma.senamRegistrant.update({
      where: { id },
      data: {
        statusKonfirmasi,
        tanggalKonfirmasi: statusKonfirmasi === 'terkonfirmasi' ? new Date() : null,
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: statusKonfirmasi === 'terkonfirmasi'
        ? 'Pendaftaran berhasil dikonfirmasi'
        : 'Status konfirmasi berhasil diubah',
      data: {
        id: updatedRegistration.id,
        nomorRegistrasi: updatedRegistration.nomorRegistrasi,
        nama: updatedRegistration.nama,
        statusKonfirmasi: updatedRegistration.statusKonfirmasi,
        tanggalKonfirmasi: updatedRegistration.tanggalKonfirmasi,
        participants: updatedRegistration.participants.map(p => ({
          namaLengkap: p.namaLengkap,
          nomorKupon: p.nomorKupon,
        })),
        updatedBy: session.user.email,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Update senam confirmation status error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate status konfirmasi' },
      { status: 500 }
    );
  }
}
