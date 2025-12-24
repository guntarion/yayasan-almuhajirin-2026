import { prisma } from '@/utils/prisma';
import { ArticleStatus } from '@prisma/client';
import type { ArticleFilters, ArticleListItem, ArticleWithRelations } from '@/types/blog';

// ============================================
// ARTICLE QUERIES
// ============================================

/**
 * Get paginated list of articles
 */
export async function getArticles(filters: ArticleFilters = {}) {
  const {
    unitId,
    categoryId,
    tagId,
    authorId,
    status = 'PUBLISHED',
    search,
    page = 1,
    limit = 10,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = filters;

  const skip = (page - 1) * limit;

  const where = {
    ...(unitId && { unitId }),
    ...(categoryId && { categoryId }),
    ...(authorId && { authorId }),
    ...(status && { status: status as ArticleStatus }),
    ...(tagId && {
      tags: {
        some: { tagId },
      },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { excerpt: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        unit: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { tags: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: articles as ArticleListItem[],
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get single article by slug and unit
 */
export async function getArticleBySlug(
  slug: string,
  unitId: string
): Promise<ArticleWithRelations | null> {
  return prisma.article.findUnique({
    where: {
      slug_unitId: { slug, unitId },
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
  }) as Promise<ArticleWithRelations | null>;
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<ArticleWithRelations | null> {
  return prisma.article.findUnique({
    where: { id },
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
  }) as Promise<ArticleWithRelations | null>;
}

/**
 * Check if article slug exists in unit
 */
export async function articleSlugExists(slug: string, unitId: string, excludeId?: string): Promise<boolean> {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      unitId,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });
  return !!article;
}

/**
 * Increment article view count
 */
export async function incrementViewCount(id: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

/**
 * Get related articles (same category, different article)
 */
export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  unitId: string,
  limit: number = 4
) {
  return prisma.article.findMany({
    where: {
      categoryId,
      unitId,
      status: 'PUBLISHED',
      NOT: { id: articleId },
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      category: {
        select: { id: true, name: true, slug: true, color: true },
      },
      unit: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

/**
 * Get recent articles
 */
export async function getRecentArticles(unitId?: string, limit: number = 5) {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      ...(unitId && { unitId }),
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      category: {
        select: { id: true, name: true, slug: true, color: true },
      },
      unit: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

/**
 * Get popular articles (by view count)
 */
export async function getPopularArticles(unitId?: string, limit: number = 5) {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      ...(unitId && { unitId }),
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      category: {
        select: { id: true, name: true, slug: true, color: true },
      },
      unit: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { viewCount: 'desc' },
    take: limit,
  });
}

// ============================================
// CATEGORY QUERIES
// ============================================

/**
 * Get all categories for a unit (including global)
 */
export async function getCategoriesForUnit(unitId?: string) {
  return prisma.category.findMany({
    where: {
      OR: [{ isGlobal: true }, { unitId }],
    },
    include: {
      _count: {
        select: { articles: true },
      },
      children: true,
    },
    orderBy: { order: 'asc' },
  });
}

/**
 * Get global categories only
 */
export async function getGlobalCategories() {
  return prisma.category.findMany({
    where: { isGlobal: true },
    include: {
      _count: {
        select: { articles: true },
      },
    },
    orderBy: { order: 'asc' },
  });
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string, unitId?: string | null) {
  if (unitId) {
    return prisma.category.findUnique({
      where: {
        slug_unitId: { slug, unitId },
      },
      include: {
        _count: {
          select: { articles: true },
        },
        children: true,
        parent: true,
      },
    });
  }
  return prisma.category.findFirst({
    where: {
      slug,
      unitId: null,
      isGlobal: true,
    },
    include: {
      _count: {
        select: { articles: true },
      },
      children: true,
      parent: true,
    },
  });
}

// ============================================
// TAG QUERIES
// ============================================

/**
 * Get all tags with article count
 */
export async function getAllTags(limit?: number) {
  return prisma.tag.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    ...(limit && { take: limit }),
  });
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });
}

/**
 * Get or create tag
 */
export async function getOrCreateTag(name: string, slug: string) {
  return prisma.tag.upsert({
    where: { slug },
    create: { name, slug },
    update: {},
  });
}

// ============================================
// UNIT QUERIES
// ============================================

/**
 * Get all units
 */
export async function getAllUnits() {
  return prisma.unit.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          articles: true,
          galleries: true,
          media: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get unit by slug/subdomain
 */
export async function getUnitBySlug(slug: string) {
  return prisma.unit.findFirst({
    where: {
      OR: [{ slug }, { subdomain: slug }],
      isActive: true,
    },
    include: {
      _count: {
        select: {
          articles: true,
          galleries: true,
        },
      },
    },
  });
}

// ============================================
// GALLERY QUERIES
// ============================================

/**
 * Get galleries for a unit
 */
export async function getGalleriesForUnit(unitId: string, page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;

  const [galleries, total] = await Promise.all([
    prisma.gallery.findMany({
      where: {
        unitId,
        isPublished: true,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        unit: true,
        _count: {
          select: { media: true },
        },
      },
      orderBy: { eventDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.gallery.count({
      where: { unitId, isPublished: true },
    }),
  ]);

  return {
    data: galleries,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get gallery by slug
 */
export async function getGalleryBySlug(slug: string, unitId: string) {
  return prisma.gallery.findUnique({
    where: {
      slug_unitId: { slug, unitId },
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      unit: true,
      media: {
        include: { media: true },
        orderBy: { order: 'asc' },
      },
    },
  });
}

// ============================================
// MEDIA QUERIES
// ============================================

/**
 * Get media for a unit
 */
export async function getMediaForUnit(
  unitId: string,
  options: { page?: number; limit?: number; folder?: string; mimeType?: string } = {}
) {
  const { page = 1, limit = 24, folder, mimeType } = options;
  const skip = (page - 1) * limit;

  const where = {
    unitId,
    ...(folder && { folder }),
    ...(mimeType && { mimeType: { startsWith: mimeType } }),
  };

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  return {
    data: media,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
