import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { CategorySchema } from '@/lib/blog/validators';
import { generateSlug } from '@/lib/blog/utils';
import { getCategoriesForUnit, getGlobalCategories } from '@/lib/blog/queries';

// GET /api/blog/categories - List categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');
    const globalOnly = searchParams.get('global') === 'true';

    let categories;

    if (globalOnly) {
      categories = await getGlobalCategories();
    } else if (unitId) {
      categories = await getCategoriesForUnit(unitId);
    } else {
      // Get all categories
      categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { articles: true },
          },
          children: true,
          unit: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: [{ isGlobal: 'desc' }, { order: 'asc' }, { name: 'asc' }],
      });
    }

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch categories' } },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Only admin can create categories
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Only admin can create categories' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = CategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: validation.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const slug = data.slug || generateSlug(data.name);

    // Check if slug exists for the unit
    const existingCategory = data.unitId
      ? await prisma.category.findUnique({
          where: {
            slug_unitId: { slug, unitId: data.unitId },
          },
        })
      : await prisma.category.findFirst({
          where: { slug, unitId: null, isGlobal: true },
        });

    if (existingCategory) {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: 'Category slug already exists' } },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        isGlobal: data.isGlobal,
        order: data.order,
        unitId: data.unitId,
        parentId: data.parentId,
      },
      include: {
        _count: {
          select: { articles: true },
        },
        unit: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create category' } },
      { status: 500 }
    );
  }
}
