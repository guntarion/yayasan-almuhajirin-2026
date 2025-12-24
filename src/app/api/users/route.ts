// src/app/api/users/route.ts
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

/**
 * API route to get all users
 * Only accessible by admins
 *
 * Force dynamic to ensure proper authentication checks
 */
export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching all users
 * This is protected by admin role check
 */
export async function GET() {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get all users from PostgreSQL via Prisma
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        namaPanggilan: true,
        nomerHandphone: true,
        gender: true,
        tanggalLahir: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
