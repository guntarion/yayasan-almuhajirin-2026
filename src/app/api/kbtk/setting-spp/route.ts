// src/app/api/kbtk/setting-spp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { SettingSppFormData } from '@/types/kbtk';

// GET - List all SPP settings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tahunAjaran = searchParams.get('tahunAjaran') || '';
    const kelompokLevel = searchParams.get('kelompokLevel') || '';
    const isActive = searchParams.get('isActive');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (tahunAjaran && tahunAjaran !== 'all') {
      where.tahunAjaran = tahunAjaran;
    }

    if (kelompokLevel && kelompokLevel !== 'all') {
      where.kelompokLevel = kelompokLevel;
    }

    if (isActive !== null && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    const data = await prisma.kbtkSettingSpp.findMany({
      where,
      orderBy: [{ tahunAjaran: 'desc' }, { kelompokLevel: 'asc' }],
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching SPP settings:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pengaturan SPP' },
      { status: 500 }
    );
  }
}

// POST - Create new SPP setting
export async function POST(request: NextRequest) {
  try {
    const body: SettingSppFormData = await request.json();

    // Validate required fields
    if (!body.tahunAjaran || !body.kelompokLevel || body.nominalSpp === undefined) {
      return NextResponse.json(
        { error: 'Tahun ajaran, kelompok level, dan nominal SPP wajib diisi' },
        { status: 400 }
      );
    }

    // Check if setting already exists
    const existing = await prisma.kbtkSettingSpp.findUnique({
      where: {
        tahunAjaran_kelompokLevel: {
          tahunAjaran: body.tahunAjaran,
          kelompokLevel: body.kelompokLevel,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Pengaturan SPP untuk tahun ajaran dan kelompok ini sudah ada' },
        { status: 400 }
      );
    }

    const setting = await prisma.kbtkSettingSpp.create({
      data: {
        tahunAjaran: body.tahunAjaran,
        kelompokLevel: body.kelompokLevel,
        nominalSpp: body.nominalSpp,
        keterangan: body.keterangan || null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error('Error creating SPP setting:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pengaturan SPP' },
      { status: 500 }
    );
  }
}

// PUT - Update SPP setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID pengaturan wajib diisi' },
        { status: 400 }
      );
    }

    // Check if setting exists
    const existing = await prisma.kbtkSettingSpp.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Pengaturan SPP tidak ditemukan' },
        { status: 404 }
      );
    }

    // If changing tahunAjaran or kelompokLevel, check for duplicates
    if (
      (updateData.tahunAjaran && updateData.tahunAjaran !== existing.tahunAjaran) ||
      (updateData.kelompokLevel && updateData.kelompokLevel !== existing.kelompokLevel)
    ) {
      const duplicate = await prisma.kbtkSettingSpp.findUnique({
        where: {
          tahunAjaran_kelompokLevel: {
            tahunAjaran: updateData.tahunAjaran || existing.tahunAjaran,
            kelompokLevel: updateData.kelompokLevel || existing.kelompokLevel,
          },
        },
      });

      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: 'Pengaturan SPP untuk tahun ajaran dan kelompok ini sudah ada' },
          { status: 400 }
        );
      }
    }

    const setting = await prisma.kbtkSettingSpp.update({
      where: { id },
      data: {
        tahunAjaran: updateData.tahunAjaran,
        kelompokLevel: updateData.kelompokLevel,
        nominalSpp: updateData.nominalSpp,
        keterangan: updateData.keterangan,
        isActive: updateData.isActive,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error updating SPP setting:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate pengaturan SPP' },
      { status: 500 }
    );
  }
}
