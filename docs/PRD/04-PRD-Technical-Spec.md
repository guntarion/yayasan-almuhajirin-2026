# PRD-04: Spesifikasi Teknis - Website Blog Yayasan Al Muhajirin

**Versi**: 1.0
**Tanggal**: Desember 2024
**Status**: Draft
**Parent Document**: [PRD-01: Overview](./01-PRD-Overview.md)

---

## 1. Ringkasan

Dokumen ini menjelaskan spesifikasi teknis untuk implementasi fitur blog pada website Yayasan Al Muhajirin, termasuk arsitektur sistem, API design, dan komponen teknis lainnya.

---

## 2. Tech Stack

### 2.1 Current Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 15.x |
| UI Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui + Radix UI | Latest |
| Database | PostgreSQL | 15.x |
| ORM | Prisma | Latest |
| Authentication | NextAuth.js | Latest |
| File Storage | DigitalOcean Spaces/AWS S3 | - |

### 2.2 Additional Dependencies for Blog

| Purpose | Package | Reason |
|---------|---------|--------|
| Rich Text Editor | Tiptap / Editor.js | Extensible, modern editor |
| Image Processing | Sharp | Server-side image optimization |
| Markdown | remark + rehype | MDX support |
| Search | Prisma Full-Text / Algolia | Fast search |
| Sitemap | next-sitemap | Auto sitemap generation |
| SEO | next-seo | Meta tags management |
| Date | date-fns | Date formatting |
| Slug | slugify | URL slug generation |
| Validation | zod | Schema validation |
| File Upload | react-dropzone | Drag & drop uploads |

---

## 3. Arsitektur Sistem

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN (Vercel Edge)                        │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Application                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages/    │  │     API     │  │      Middleware         │  │
│  │   Routes    │  │   Routes    │  │   (Subdomain Router)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────┐    ┌─────────────┐       ┌─────────────┐
│   Prisma    │    │  NextAuth   │       │   Sharp     │
│    ORM      │    │   Session   │       │   (Image)   │
└─────────────┘    └─────────────┘       └─────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────┐    ┌─────────────┐       ┌─────────────┐
│ PostgreSQL  │    │   Redis     │       │  S3/Spaces  │
│  Database   │    │  (Session)  │       │   Storage   │
└─────────────┘    └─────────────┘       └─────────────┘
```

### 3.2 Subdomain Routing Flow

```
Request: https://masjid.muhajirinrewwin.or.id/artikel/slug
                            │
                            ▼
                    ┌───────────────┐
                    │   Middleware  │
                    └───────────────┘
                            │
              Extract subdomain: "masjid"
                            │
                            ▼
              Rewrite to: /units/masjid/artikel/slug
                            │
                            ▼
                    ┌───────────────┐
                    │  Page Router  │
                    │  /units/masjid│
                    └───────────────┘
```

---

## 4. Folder Structure

### 4.1 Blog-Related Structure

```
src/
├── app/
│   ├── (DashboardLayout)/
│   │   └── dashboard/
│   │       └── blog/
│   │           ├── page.tsx              # Blog management list
│   │           ├── create/
│   │           │   └── page.tsx          # Create article
│   │           ├── edit/
│   │           │   └── [id]/
│   │           │       └── page.tsx      # Edit article
│   │           ├── categories/
│   │           │   └── page.tsx          # Category management
│   │           ├── tags/
│   │           │   └── page.tsx          # Tag management
│   │           └── media/
│   │               └── page.tsx          # Media library
│   │
│   ├── units/
│   │   └── [unit]/
│   │       ├── layout.tsx                # Unit layout with SEO
│   │       ├── page.tsx                  # Unit homepage
│   │       ├── artikel/
│   │       │   ├── page.tsx              # Article listing
│   │       │   └── [slug]/
│   │       │       └── page.tsx          # Single article
│   │       ├── kategori/
│   │       │   └── [slug]/
│   │       │       └── page.tsx          # Category archive
│   │       ├── tag/
│   │       │   └── [slug]/
│   │       │       └── page.tsx          # Tag archive
│   │       ├── galeri/
│   │       │   ├── page.tsx              # Gallery listing
│   │       │   └── [slug]/
│   │       │       └── page.tsx          # Single gallery
│   │       └── arsip/
│   │           └── [year]/
│   │               └── [month]/
│   │                   └── page.tsx      # Monthly archive
│   │
│   └── api/
│       └── blog/
│           ├── articles/
│           │   ├── route.ts              # GET, POST articles
│           │   └── [id]/
│           │       └── route.ts          # GET, PUT, DELETE article
│           ├── categories/
│           │   └── route.ts              # CRUD categories
│           ├── tags/
│           │   └── route.ts              # CRUD tags
│           ├── media/
│           │   ├── route.ts              # Upload, list media
│           │   └── [id]/
│           │       └── route.ts          # Delete, update media
│           ├── galleries/
│           │   └── route.ts              # CRUD galleries
│           └── search/
│               └── route.ts              # Search endpoint
│
├── components/
│   └── blog/
│       ├── ArticleCard.tsx               # Article preview card
│       ├── ArticleList.tsx               # Article listing
│       ├── ArticleContent.tsx            # Article body renderer
│       ├── ArticleForm.tsx               # Create/edit form
│       ├── RichTextEditor.tsx            # Tiptap editor
│       ├── MediaUploader.tsx             # File upload component
│       ├── MediaLibrary.tsx              # Media browser
│       ├── GalleryGrid.tsx               # Photo gallery
│       ├── CategoryBadge.tsx             # Category label
│       ├── TagCloud.tsx                  # Tag display
│       ├── ShareButtons.tsx              # Social sharing
│       ├── RelatedArticles.tsx           # Related content
│       ├── AuthorCard.tsx                # Author info
│       ├── Breadcrumb.tsx                # Navigation breadcrumb
│       ├── SearchBox.tsx                 # Search component
│       ├── Pagination.tsx                # Page navigation
│       └── SEO/
│           ├── ArticleMeta.tsx           # Article meta tags
│           ├── JsonLd.tsx                # Structured data
│           └── OpenGraph.tsx             # OG tags
│
├── lib/
│   └── blog/
│       ├── actions.ts                    # Server actions
│       ├── queries.ts                    # Database queries
│       ├── utils.ts                      # Helper functions
│       ├── constants.ts                  # Blog constants
│       └── validators.ts                 # Zod schemas
│
├── types/
│   └── blog.ts                           # TypeScript types
│
└── hooks/
    └── blog/
        ├── useArticles.ts                # Article hooks
        ├── useMedia.ts                   # Media hooks
        └── useSearch.ts                  # Search hooks
```

---

## 5. API Design

### 5.1 RESTful Endpoints

#### Articles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog/articles | List articles | Public |
| GET | /api/blog/articles/:id | Get single article | Public |
| POST | /api/blog/articles | Create article | Editor+ |
| PUT | /api/blog/articles/:id | Update article | Author/Editor |
| DELETE | /api/blog/articles/:id | Delete article | Editor+ |
| POST | /api/blog/articles/:id/publish | Publish article | Editor+ |

#### Query Parameters (GET /api/blog/articles)

| Param | Type | Description | Default |
|-------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Items per page | 10 |
| unit | string | Filter by unit | - |
| category | string | Filter by category slug | - |
| tag | string | Filter by tag slug | - |
| author | string | Filter by author ID | - |
| status | string | Filter by status | published |
| search | string | Search query | - |
| sort | string | Sort field | createdAt |
| order | string | Sort order (asc/desc) | desc |

#### Request/Response Examples

**Create Article Request:**
```json
POST /api/blog/articles
{
  "title": "Jadwal Kajian Rutin Desember 2024",
  "slug": "jadwal-kajian-desember-2024",
  "content": "<p>Konten artikel...</p>",
  "excerpt": "Ringkasan artikel...",
  "featuredImage": "https://storage.../image.jpg",
  "categoryId": "uuid-category",
  "tags": ["kajian", "rutin", "desember"],
  "unitId": "masjid",
  "status": "draft",
  "publishedAt": null
}
```

**Article Response:**
```json
{
  "id": "uuid",
  "title": "Jadwal Kajian Rutin Desember 2024",
  "slug": "jadwal-kajian-desember-2024",
  "content": "<p>Konten artikel...</p>",
  "excerpt": "Ringkasan artikel...",
  "featuredImage": "https://storage.../image.jpg",
  "category": {
    "id": "uuid",
    "name": "Berita",
    "slug": "berita"
  },
  "tags": [
    { "id": "uuid", "name": "kajian", "slug": "kajian" }
  ],
  "unit": {
    "id": "masjid",
    "name": "Ketakmiran Masjid"
  },
  "author": {
    "id": "uuid",
    "name": "Admin Masjid",
    "image": "https://..."
  },
  "status": "published",
  "viewCount": 150,
  "publishedAt": "2024-12-24T10:00:00Z",
  "createdAt": "2024-12-20T08:00:00Z",
  "updatedAt": "2024-12-24T10:00:00Z"
}
```

#### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog/categories | List categories | Public |
| POST | /api/blog/categories | Create category | Admin |
| PUT | /api/blog/categories/:id | Update category | Admin |
| DELETE | /api/blog/categories/:id | Delete category | Admin |

#### Tags

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog/tags | List tags | Public |
| POST | /api/blog/tags | Create tag | Editor+ |
| PUT | /api/blog/tags/:id | Update tag | Admin |
| DELETE | /api/blog/tags/:id | Delete tag | Admin |

#### Media

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog/media | List media | Editor+ |
| POST | /api/blog/media | Upload media | Editor+ |
| DELETE | /api/blog/media/:id | Delete media | Owner/Admin |

#### Galleries

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog/galleries | List galleries | Public |
| GET | /api/blog/galleries/:id | Get gallery | Public |
| POST | /api/blog/galleries | Create gallery | Editor+ |
| PUT | /api/blog/galleries/:id | Update gallery | Editor+ |
| DELETE | /api/blog/galleries/:id | Delete gallery | Editor+ |

#### Search

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog/search | Search articles | Public |

### 5.2 Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Not authorized |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., slug exists) |
| INTERNAL_ERROR | 500 | Server error |

---

## 6. Component Specifications

### 6.1 Rich Text Editor (Tiptap)

**Features:**
- WYSIWYG editing
- Markdown shortcuts
- Image upload & resize
- Video embed (YouTube, Vimeo)
- Link management
- Table support
- Code blocks with syntax highlighting
- Undo/redo history
- Word count

**Implementation:**
```typescript
// components/blog/RichTextEditor.tsx
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  placeholder?: string;
  editable?: boolean;
}
```

### 6.2 Media Uploader

**Features:**
- Drag & drop support
- Multiple file upload
- Progress indicator
- Image preview
- File type validation
- Size validation (max 5MB)
- Auto-optimization

**Implementation:**
```typescript
// components/blog/MediaUploader.tsx
interface MediaUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
}

interface UploadedFile {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  size: number;
  mimeType: string;
}
```

### 6.3 Article Card

```typescript
// components/blog/ArticleCard.tsx
interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    category: { name: string; slug: string };
    author: { name: string; image?: string };
    publishedAt: Date;
    unit: { id: string; name: string };
  };
  layout?: 'card' | 'list' | 'featured';
  showUnit?: boolean;
}
```

---

## 7. Data Validation

### 7.1 Zod Schemas

```typescript
// lib/blog/validators.ts
import { z } from 'zod';

export const ArticleCreateSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  featuredImage: z.string().url().optional(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).max(10).optional(),
  unitId: z.string(),
  status: z.enum(['draft', 'in_review', 'published', 'scheduled']),
  publishedAt: z.date().optional(),
});

export const ArticleUpdateSchema = ArticleCreateSchema.partial();

export const CategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(200).optional(),
  parentId: z.string().uuid().optional(),
});

export const TagSchema = z.object({
  name: z.string().min(2).max(30),
  slug: z.string().min(2).max(30).regex(/^[a-z0-9-]+$/),
});

export const GallerySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  coverImage: z.string().url(),
  images: z.array(z.string().url()).min(1).max(100),
  unitId: z.string(),
});
```

---

## 8. Caching Strategy

### 8.1 Next.js Caching

```typescript
// Article page - ISR
export const revalidate = 60; // Revalidate every 60 seconds

// Static paths
export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
```

### 8.2 API Response Caching

```typescript
// api/blog/articles/route.ts
export async function GET(request: Request) {
  const articles = await getArticles();

  return Response.json(articles, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 8.3 Cache Invalidation

| Event | Action |
|-------|--------|
| Article published | Revalidate article list & single page |
| Article updated | Revalidate single article page |
| Article deleted | Revalidate article list |
| Category updated | Revalidate category pages |
| Media deleted | No cache invalidation needed |

---

## 9. Image Processing

### 9.1 Sharp Configuration

```typescript
// lib/blog/image-processing.ts
import sharp from 'sharp';

export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 768, height: 512 },
  large: { width: 1200, height: 800 },
  og: { width: 1200, height: 630 },
};

export async function processImage(
  buffer: Buffer,
  size: keyof typeof IMAGE_SIZES
) {
  const { width, height } = IMAGE_SIZES[size];

  return sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toBuffer();
}
```

### 9.2 Upload Flow

```
Client Upload → API Route → Validate → Process with Sharp → Upload to S3 → Return URLs
```

---

## 10. Search Implementation

### 10.1 Prisma Full-Text Search

```typescript
// lib/blog/queries.ts
export async function searchArticles(query: string, options: SearchOptions) {
  return prisma.article.findMany({
    where: {
      status: 'published',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      category: true,
      author: true,
      tags: true,
    },
    take: options.limit,
    skip: options.offset,
    orderBy: { publishedAt: 'desc' },
  });
}
```

### 10.2 Future: Algolia Integration (Optional)

```typescript
// lib/blog/search-algolia.ts
import algoliasearch from 'algoliasearch';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex('articles');

export async function indexArticle(article: Article) {
  await index.saveObject({
    objectID: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: stripHtml(article.content),
    category: article.category.name,
    tags: article.tags.map(t => t.name),
    unit: article.unit.name,
    publishedAt: article.publishedAt,
  });
}
```

---

## 11. Security Considerations

### 11.1 Input Sanitization

```typescript
// Sanitize HTML content before saving
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h2', 'h3', 'h4',
                   'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
  });
}
```

### 11.2 Authorization Checks

```typescript
// lib/blog/auth.ts
export async function canEditArticle(userId: string, articleId: string) {
  const user = await getUser(userId);
  const article = await getArticle(articleId);

  if (!user || !article) return false;

  // Admin can edit anything
  if (user.role === 'admin') return true;

  // Editor can edit within their unit
  if (user.role === 'editor' && user.unitId === article.unitId) return true;

  // Author can only edit their own
  if (article.authorId === userId) return true;

  return false;
}
```

### 11.3 Rate Limiting

```typescript
// middleware.ts (rate limiting for API)
const rateLimit = {
  'api/blog/articles': { limit: 100, window: '1m' },
  'api/blog/media': { limit: 20, window: '1m' },
  'api/blog/search': { limit: 50, window: '1m' },
};
```

---

## 12. Testing Strategy

### 12.1 Unit Tests

| Component | Test Focus |
|-----------|------------|
| Validators | Schema validation |
| Utilities | Helper functions |
| Hooks | State management |
| Components | Rendering, interactions |

### 12.2 Integration Tests

| Feature | Test Scenario |
|---------|---------------|
| Article CRUD | Create, read, update, delete flow |
| Media Upload | Upload, process, delete flow |
| Search | Query accuracy, filtering |
| Auth | Permission checks |

### 12.3 E2E Tests

| Flow | Steps |
|------|-------|
| Create Article | Login → Dashboard → Create → Fill form → Publish → View |
| Upload Media | Login → Media Library → Upload → Use in article |
| Public View | Visit article → Check SEO → Share → Related articles |

---

## 13. Deployment Considerations

### 13.1 Environment Variables

```env
# Blog-specific
NEXT_PUBLIC_SITE_URL=https://muhajirinrewwin.or.id
NEXT_PUBLIC_CDN_URL=https://cdn.muhajirinrewwin.or.id

# Storage
S3_BUCKET=almuhajirin-media
S3_REGION=sgp1
S3_ENDPOINT=https://sgp1.digitaloceanspaces.com
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Search (optional)
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_SEARCH_KEY=
```

### 13.2 Vercel Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/api/blog/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

---

## 14. Appendix

### 14.1 References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tiptap Documentation](https://tiptap.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 14.2 Related Documents

- [PRD-01: Overview](./01-PRD-Overview.md)
- [PRD-02: Blog Features](./02-PRD-Blog-Features.md)
- [PRD-03: SEO Strategy](./03-PRD-SEO-Strategy.md)
- [PRD-05: Database Schema](./05-PRD-Database-Schema.md)
