import { z } from 'zod';

// Article Status enum for validation
export const ArticleStatusEnum = z.enum([
  'DRAFT',
  'IN_REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'REJECTED',
]);

// Article Create Schema
export const ArticleCreateSchema = z.object({
  title: z
    .string()
    .min(5, 'Judul minimal 5 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
    .optional(),
  content: z.string().min(50, 'Konten minimal 50 karakter'),
  excerpt: z.string().max(500, 'Ringkasan maksimal 500 karakter').optional(),
  featuredImage: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Kategori harus dipilih'),
  tags: z.array(z.string()).max(10, 'Maksimal 10 tag').optional(),
  unitId: z.string().min(1, 'Unit harus dipilih'),
  status: ArticleStatusEnum.optional().default('DRAFT'),
  publishedAt: z.coerce.date().optional().nullable(),
  scheduledAt: z.coerce.date().optional().nullable(),
  metaTitle: z.string().max(70, 'Meta title maksimal 70 karakter').optional(),
  metaDescription: z.string().max(160, 'Meta description maksimal 160 karakter').optional(),
  metaKeywords: z.string().max(200, 'Meta keywords maksimal 200 karakter').optional(),
});

// Article Update Schema (partial)
export const ArticleUpdateSchema = ArticleCreateSchema.partial().extend({
  id: z.string().min(1, 'ID artikel diperlukan'),
});

// Category Schema
export const CategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(50, 'Nama kategori maksimal 50 karakter'),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .max(50, 'Slug maksimal 50 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
    .optional(),
  description: z.string().max(200, 'Deskripsi maksimal 200 karakter').optional(),
  icon: z.string().max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna harus hex (#RRGGBB)')
    .optional(),
  isGlobal: z.boolean().optional().default(false),
  unitId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  order: z.number().int().min(0).optional().default(0),
});

// Tag Schema
export const TagSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama tag minimal 2 karakter')
    .max(30, 'Nama tag maksimal 30 karakter'),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .max(30, 'Slug maksimal 30 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
    .optional(),
});

// Gallery Schema
export const GallerySchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
    .optional(),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  coverImage: z.string().url('URL gambar tidak valid').optional(),
  eventDate: z.coerce.date().optional(),
  isPublished: z.boolean().optional().default(false),
  unitId: z.string().min(1, 'Unit harus dipilih'),
  mediaIds: z.array(z.string()).optional(),
});

// Media Upload Schema
export const MediaUploadSchema = z.object({
  file: z.any(), // File object
  alt: z.string().max(125, 'Alt text maksimal 125 karakter').optional(),
  caption: z.string().max(500, 'Caption maksimal 500 karakter').optional(),
  folder: z.string().max(100).optional().default('uploads'),
  unitId: z.string().min(1, 'Unit harus dipilih'),
});

// Search Query Schema
export const SearchQuerySchema = z.object({
  q: z.string().min(2, 'Query minimal 2 karakter').max(100),
  unitId: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.enum(['createdAt', 'publishedAt', 'viewCount', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Type exports
export type ArticleCreateInput = z.infer<typeof ArticleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof ArticleUpdateSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type TagInput = z.infer<typeof TagSchema>;
export type GalleryInput = z.infer<typeof GallerySchema>;
export type MediaUploadInput = z.infer<typeof MediaUploadSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
