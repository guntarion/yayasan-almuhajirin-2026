import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ArticleUpdateSchema } from '@/lib/blog/validators';
import { generateSlug, calculateReadingTime, generateExcerpt } from '@/lib/blog/utils';
import { getArticleById, articleSlugExists, getOrCreateTag } from '@/lib/blog/queries';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/blog/articles/[id] - Get single article
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Article not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch article' } },
      { status: 500 }
    );
  }
}

// PUT /api/blog/articles/[id] - Update article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existingArticle = await getArticleById(id);

    if (!existingArticle) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Article not found' } },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = session.user.role === 'admin';
    const isEditor = session.user.role === 'editor' || session.user.role === 'moderator';
    const isAuthor = existingArticle.authorId === session.user.id;

    if (!isAdmin && !isEditor && !isAuthor) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = ArticleUpdateSchema.safeParse({ ...body, id });

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

    // Handle slug change
    let slug = existingArticle.slug;
    if (data.slug && data.slug !== existingArticle.slug) {
      slug = data.slug;
      // Check uniqueness
      if (await articleSlugExists(slug, existingArticle.unitId, id)) {
        return NextResponse.json(
          { error: { code: 'CONFLICT', message: 'Slug already exists' } },
          { status: 409 }
        );
      }
    } else if (data.title && data.title !== existingArticle.title && !data.slug) {
      // Auto-generate new slug if title changed
      slug = generateSlug(data.title);
      let counter = 1;
      while (await articleSlugExists(slug, existingArticle.unitId, id)) {
        slug = `${generateSlug(data.title)}-${counter}`;
        counter++;
      }
    }

    // Recalculate reading time if content changed
    const readingTime = data.content
      ? calculateReadingTime(data.content)
      : existingArticle.readingTime;

    // Handle excerpt
    const excerpt = data.excerpt !== undefined
      ? data.excerpt
      : data.content
        ? generateExcerpt(data.content)
        : existingArticle.excerpt;

    // Handle tags
    if (data.tags !== undefined) {
      // Delete existing tags
      await prisma.articleTag.deleteMany({
        where: { articleId: id },
      });

      // Create new tags
      if (data.tags.length > 0) {
        for (const tagName of data.tags) {
          const tagSlug = generateSlug(tagName);
          const tag = await getOrCreateTag(tagName, tagSlug);
          await prisma.articleTag.create({
            data: {
              articleId: id,
              tagId: tag.id,
            },
          });
        }
      }
    }

    // Create revision before updating
    await prisma.articleRevision.create({
      data: {
        articleId: id,
        title: existingArticle.title,
        content: existingArticle.content,
        excerpt: existingArticle.excerpt,
        editedById: session.user.id,
      },
    });

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        slug,
        ...(data.content && { content: data.content }),
        excerpt,
        ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage || null }),
        ...(data.status && { status: data.status }),
        readingTime,
        ...(data.status === 'PUBLISHED' && !existingArticle.publishedAt && { publishedAt: new Date() }),
        ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt }),
        ...(data.scheduledAt !== undefined && { scheduledAt: data.scheduledAt }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.metaKeywords !== undefined && { metaKeywords: data.metaKeywords }),
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

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update article' } },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existingArticle = await getArticleById(id);

    if (!existingArticle) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Article not found' } },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = session.user.role === 'admin';
    const isEditor = session.user.role === 'editor' || session.user.role === 'moderator';
    const isAuthor = existingArticle.authorId === session.user.id;

    if (!isAdmin && !isEditor && !isAuthor) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    // Delete article (cascade will delete related records)
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete article' } },
      { status: 500 }
    );
  }
}
