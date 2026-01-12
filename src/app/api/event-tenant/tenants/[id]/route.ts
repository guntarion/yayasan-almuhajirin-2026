import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { StatusPembayaran } from '@prisma/client';

// DELETE endpoint - Remove a tenant registration (admin only)
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

    // Check if tenant exists
    const existingTenant = await prisma.eventTenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan' }, { status: 404 });
    }

    // Delete the tenant
    await prisma.eventTenant.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Data tenant berhasil dihapus',
      data: {
        id: existingTenant.id,
        nomorRegistrasi: existingTenant.nomorRegistrasi,
        namaTenant: existingTenant.namaTenant,
        deletedBy: session.user.email,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Delete tenant error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus data tenant' },
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
    const { statusPembayaran, lokasiStan } = body;

    // Validate status if provided
    if (statusPembayaran) {
      const validStatuses = ['belum_bayar', 'menunggu_konfirmasi', 'lunas', 'ditolak'];
      if (!validStatuses.includes(statusPembayaran)) {
        return NextResponse.json(
          { error: 'Status pembayaran tidak valid. Valid values: belum_bayar, menunggu_konfirmasi, lunas, ditolak' },
          { status: 400 }
        );
      }
    }

    // Check if tenant exists
    const existingTenant = await prisma.eventTenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan' }, { status: 404 });
    }

    // Build update data
    const updateData: {
      statusPembayaran?: StatusPembayaran;
      tanggalBayar?: Date | null;
      lokasiStan?: string;
    } = {};

    if (statusPembayaran) {
      updateData.statusPembayaran = statusPembayaran as StatusPembayaran;
      updateData.tanggalBayar = statusPembayaran === 'lunas' ? new Date() : existingTenant.tanggalBayar;
    }

    if (lokasiStan !== undefined) {
      updateData.lokasiStan = lokasiStan;
    }

    // Update the tenant
    const updatedTenant = await prisma.eventTenant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Data tenant berhasil diupdate',
      data: {
        id: updatedTenant.id,
        nomorRegistrasi: updatedTenant.nomorRegistrasi,
        namaTenant: updatedTenant.namaTenant,
        statusPembayaran: updatedTenant.statusPembayaran,
        tanggalBayar: updatedTenant.tanggalBayar,
        lokasiStan: updatedTenant.lokasiStan,
        updatedBy: session.user.email,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate data tenant' },
      { status: 500 }
    );
  }
}
