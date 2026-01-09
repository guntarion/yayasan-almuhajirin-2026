import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// DELETE endpoint - Remove a registration (admin only)
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
    const existingRegistration = await prisma.runMadanRegistrant.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
    }

    // Delete the registration (participants will be cascade deleted)
    await prisma.runMadanRegistrant.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dihapus',
      data: {
        id: existingRegistration.id,
        nomorRegistrasi: existingRegistration.nomorRegistrasi,
        nama: existingRegistration.nama,
        deletedBy: session.user.email,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus pendaftaran' },
      { status: 500 }
    );
  }
}

// PATCH endpoint - Update payment status (admin only)
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
    const { statusPembayaran } = body;

    // Validate status
    const validStatuses = ['belum_bayar', 'menunggu_konfirmasi', 'lunas', 'ditolak'];
    if (!statusPembayaran || !validStatuses.includes(statusPembayaran)) {
      return NextResponse.json(
        { error: 'Status pembayaran tidak valid. Valid values: belum_bayar, menunggu_konfirmasi, lunas, ditolak' },
        { status: 400 }
      );
    }

    // Check if registration exists
    const existingRegistration = await prisma.runMadanRegistrant.findUnique({
      where: { id },
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
    }

    // Update the registration
    const updatedRegistration = await prisma.runMadanRegistrant.update({
      where: { id },
      data: {
        statusPembayaran,
        tanggalBayar: statusPembayaran === 'lunas' ? new Date() : existingRegistration.tanggalBayar,
      },
      include: {
        participants: true,
      },
    });

    // Auto-assign BIB numbers when status becomes 'lunas'
    if (statusPembayaran === 'lunas' && updatedRegistration.participants.length > 0) {
      // Extract registration sequence number from nomorRegistrasi (e.g., "RM-2026-0005" -> "0005")
      const regNumberMatch = updatedRegistration.nomorRegistrasi.match(/\d{4}$/);
      const regSequence = regNumberMatch ? regNumberMatch[0] : '0000';

      // Assign BIB numbers to participants that don't have one yet
      const bibAssignments = updatedRegistration.participants
        .filter(p => !p.nomorBib) // Only assign to participants without BIB
        .map((participant) => {
          const participantNumber = updatedRegistration.participants.indexOf(participant) + 1;
          const nomorBib = `${regSequence}-${participantNumber}`;

          return prisma.runMadanParticipant.update({
            where: { id: participant.id },
            data: { nomorBib },
          });
        });

      // Execute all BIB assignments
      if (bibAssignments.length > 0) {
        await Promise.all(bibAssignments);
      }

      // Refresh registration data with updated BIB numbers
      const finalRegistration = await prisma.runMadanRegistrant.findUnique({
        where: { id },
        include: { participants: true },
      });

      return NextResponse.json({
        success: true,
        message: 'Status pembayaran berhasil diupdate dan nomor BIB telah ditetapkan',
        data: {
          id: finalRegistration!.id,
          nomorRegistrasi: finalRegistration!.nomorRegistrasi,
          nama: finalRegistration!.nama,
          statusPembayaran: finalRegistration!.statusPembayaran,
          tanggalBayar: finalRegistration!.tanggalBayar,
          participants: finalRegistration!.participants.map(p => ({
            namaLengkap: p.namaLengkap,
            nomorBib: p.nomorBib,
          })),
          updatedBy: session.user.email,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Status pembayaran berhasil diupdate',
      data: {
        id: updatedRegistration.id,
        nomorRegistrasi: updatedRegistration.nomorRegistrasi,
        nama: updatedRegistration.nama,
        statusPembayaran: updatedRegistration.statusPembayaran,
        tanggalBayar: updatedRegistration.tanggalBayar,
        updatedBy: session.user.email,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate status pembayaran' },
      { status: 500 }
    );
  }
}
