import type {
  Article,
  Category,
  Tag,
  Gallery,
  Media,
  Unit,
  User,
  ArticleTag,
  GalleryMedia,
  ArticleStatus,
} from '@prisma/client';

// Re-export ArticleStatus enum
export { ArticleStatus };

// Article with all relations
export type ArticleWithRelations = Article & {
  author: Pick<User, 'id' | 'name' | 'image'>;
  category: Category;
  tags: (ArticleTag & { tag: Tag })[];
  unit: Unit;
};

// Article for list display (lighter)
export type ArticleListItem = Pick<
  Article,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'featuredImage'
  | 'status'
  | 'viewCount'
  | 'readingTime'
  | 'publishedAt'
  | 'createdAt'
  | 'unitId'
> & {
  author: Pick<User, 'id' | 'name' | 'image'>;
  category: Pick<Category, 'id' | 'name' | 'slug' | 'color'>;
  unit: Pick<Unit, 'id' | 'name' | 'slug'>;
  _count?: {
    tags: number;
  };
};

// Gallery with media
export type GalleryWithMedia = Gallery & {
  media: (GalleryMedia & { media: Media })[];
  author: Pick<User, 'id' | 'name' | 'image'>;
  unit: Unit;
};

// Category with children and article count
export type CategoryWithChildren = Category & {
  children: Category[];
  parent?: Category | null;
  _count: { articles: number };
};

// Tag with article count
export type TagWithCount = Tag & {
  _count: { articles: number };
};

// Unit with counts
export type UnitWithCounts = Unit & {
  _count: {
    articles: number;
    galleries: number;
    media: number;
  };
};

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type ArticleListResponse = PaginatedResponse<ArticleListItem>;

export interface ArticleFilters {
  unitId?: string;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  status?: ArticleStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Form input types
export interface ArticleCreateInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId: string;
  tags?: string[];
  unitId: string;
  status?: ArticleStatus;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface ArticleUpdateInput extends Partial<ArticleCreateInput> {
  id: string;
}

export interface CategoryCreateInput {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  isGlobal?: boolean;
  unitId?: string;
  parentId?: string;
  order?: number;
}

export interface TagCreateInput {
  name: string;
  slug?: string;
}

export interface GalleryCreateInput {
  title: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  eventDate?: Date;
  isPublished?: boolean;
  unitId: string;
  mediaIds?: string[];
}

export interface MediaUploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}
