import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ArticleCreateSchema, PaginationSchema } from '@/lib/blog/validators';
import { generateSlug, calculateReadingTime, generateExcerpt } from '@/lib/blog/utils';
import { getArticles, articleSlugExists, getOrCreateTag } from '@/lib/blog/queries';
import { ArticleStatus } from '@prisma/client';

// GET /api/blog/articles - List articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      unitId: searchParams.get('unitId') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tagId: searchParams.get('tagId') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      status: (searchParams.get('status') as ArticleStatus) || ArticleStatus.PUBLISHED,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as 'createdAt' | 'publishedAt' | 'viewCount' | 'title') || 'publishedAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    // Validate pagination
    const pagination = PaginationSchema.safeParse(filters);
    if (!pagination.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: pagination.error.message } },
        { status: 400 }
      );
    }

    const result = await getArticles(filters);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch articles' } },
      { status: 500 }
    );
  }
}

// POST /api/blog/articles - Create article
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Check role permissions
    const allowedRoles = ['admin', 'editor', 'moderator'];
    if (!allowedRoles.includes(session.user.role || '')) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = ArticleCreateSchema.safeParse(body);

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

    // Generate slug if not provided
    let slug = data.slug || generateSlug(data.title);

    // Ensure unique slug
    let counter = 1;
    while (await articleSlugExists(slug, data.unitId)) {
      slug = `${generateSlug(data.title)}-${counter}`;
      counter++;
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(data.content);

    // Generate excerpt if not provided
    const excerpt = data.excerpt || generateExcerpt(data.content);

    // Handle tags
    const tagConnections = [];
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tagSlug = generateSlug(tagName);
        const tag = await getOrCreateTag(tagName, tagSlug);
        tagConnections.push({ tagId: tag.id });
      }
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt,
        featuredImage: data.featuredImage || null,
        status: data.status || 'DRAFT',
        readingTime,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : data.publishedAt,
        scheduledAt: data.scheduledAt,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        authorId: session.user.id,
        categoryId: data.categoryId,
        unitId: data.unitId,
        tags: {
          create: tagConnections,
        },
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: true,
        unit: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create article' } },
      { status: 500 }
    );
  }
}
