import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { TagSchema } from '@/lib/blog/validators';
import { generateSlug } from '@/lib/blog/utils';
import { getAllTags } from '@/lib/blog/queries';

// GET /api/blog/tags - List tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const tags = await getAllTags(limit);

    return NextResponse.json(tags, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch tags' } },
      { status: 500 }
    );
  }
}

// POST /api/blog/tags - Create tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const allowedRoles = ['admin', 'editor', 'moderator'];
    if (!allowedRoles.includes(session.user.role || '')) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = TagSchema.safeParse(body);

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

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: 'Tag already exists' } },
        { status: 409 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug,
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create tag' } },
      { status: 500 }
    );
  }
}
