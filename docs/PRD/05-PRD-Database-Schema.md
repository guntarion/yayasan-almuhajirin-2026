# PRD-05: Database Schema - Website Blog Yayasan Al Muhajirin

**Versi**: 1.0
**Tanggal**: Desember 2024
**Status**: Draft
**Parent Document**: [PRD-01: Overview](./01-PRD-Overview.md)

---

## 1. Ringkasan

Dokumen ini menjelaskan skema database untuk fitur blog pada website Yayasan Al Muhajirin. Database menggunakan PostgreSQL dengan Prisma ORM dan terintegrasi dengan skema user yang sudah ada.

---

## 2. Database Overview

### 2.1 Database Technology
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Connection**: Via Prisma Client

### 2.2 Schema Namespace
Blog-related tables menggunakan prefix untuk memudahkan identifikasi:
- `article_*` - Artikel/posting
- `media_*` - Media/file
- `blog_*` - Konfigurasi blog

---

## 3. Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   articles   │     │  categories  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │◄────│ authorId     │     │ id           │
│ name         │     │ categoryId   │────►│ name         │
│ email        │     │ unitId       │     │ slug         │
│ role         │     │ title        │     │ description  │
│ unitId       │     │ slug         │     │ parentId     │
└──────────────┘     │ content      │     └──────────────┘
                     │ excerpt      │            ▲
┌──────────────┐     │ featuredImage│            │
│    units     │     │ status       │     ┌──────┴───────┐
├──────────────┤     │ viewCount    │     │ (self-ref)   │
│ id           │◄────│ publishedAt  │     │ sub-category │
│ name         │     │ createdAt    │     └──────────────┘
│ slug         │     │ updatedAt    │
│ description  │     └──────┬───────┘
└──────────────┘            │
                            │ N:M
                     ┌──────┴───────┐
                     │    tags      │
                     ├──────────────┤
                     │ id           │
                     │ name         │
                     │ slug         │
                     └──────────────┘

┌──────────────┐     ┌──────────────┐
│    media     │     │  galleries   │
├──────────────┤     ├──────────────┤
│ id           │     │ id           │
│ filename     │     │ title        │
│ originalName │     │ description  │
│ url          │     │ coverImage   │
│ thumbnailUrl │     │ unitId       │
│ mimeType     │     │ authorId     │
│ size         │     │ createdAt    │
│ uploadedById │     └──────┬───────┘
│ unitId       │            │ N:M
│ createdAt    │     ┌──────┴───────┐
└──────────────┘     │ gallery_media│
                     └──────────────┘
```

---

## 4. Prisma Schema

### 4.1 Units Table

```prisma
model Unit {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  subdomain   String   @unique
  logo        String?
  color       String?  @default("#0ea5e9")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  users       User[]
  articles    Article[]
  categories  Category[]
  media       Media[]
  galleries   Gallery[]

  @@map("units")
}
```

### 4.2 Category Table

```prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String
  description String?
  icon        String?
  color       String?   @default("#6b7280")
  order       Int       @default(0)
  isGlobal    Boolean   @default(false) // Available for all units
  unitId      String?
  parentId    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  unit        Unit?     @relation(fields: [unitId], references: [id], onDelete: Cascade)
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  articles    Article[]

  @@unique([slug, unitId])
  @@index([unitId])
  @@index([parentId])
  @@map("categories")
}
```

### 4.3 Tag Table

```prisma
model Tag {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  articles  ArticleTag[]

  @@map("tags")
}
```

### 4.4 Article Table

```prisma
enum ArticleStatus {
  DRAFT
  IN_REVIEW
  SCHEDULED
  PUBLISHED
  ARCHIVED
  REJECTED
}

model Article {
  id            String        @id @default(cuid())
  title         String
  slug          String
  content       String        @db.Text
  excerpt       String?       @db.VarChar(500)
  featuredImage String?
  status        ArticleStatus @default(DRAFT)
  viewCount     Int           @default(0)
  readingTime   Int?          // in minutes
  isPinned      Boolean       @default(false)
  isFeatured    Boolean       @default(false)

  // SEO fields
  metaTitle       String?     @db.VarChar(70)
  metaDescription String?     @db.VarChar(160)
  metaKeywords    String?
  canonicalUrl    String?

  // Scheduling
  publishedAt   DateTime?
  scheduledAt   DateTime?

  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Foreign keys
  authorId      String
  categoryId    String
  unitId        String

  // Relations
  author        User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category      Category @relation(fields: [categoryId], references: [id])
  unit          Unit     @relation(fields: [unitId], references: [id], onDelete: Cascade)
  tags          ArticleTag[]
  galleries     ArticleGallery[]
  revisions     ArticleRevision[]

  @@unique([slug, unitId])
  @@index([unitId])
  @@index([authorId])
  @@index([categoryId])
  @@index([status])
  @@index([publishedAt])
  @@index([createdAt])
  @@map("articles")
}
```

### 4.5 Article-Tag Junction Table

```prisma
model ArticleTag {
  articleId String
  tagId     String

  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([articleId, tagId])
  @@map("article_tags")
}
```

### 4.6 Article Revision Table

```prisma
model ArticleRevision {
  id        String   @id @default(cuid())
  articleId String
  title     String
  content   String   @db.Text
  excerpt   String?  @db.VarChar(500)
  editedById String
  createdAt DateTime @default(now())

  // Relations
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  editedBy  User    @relation(fields: [editedById], references: [id])

  @@index([articleId])
  @@map("article_revisions")
}
```

### 4.7 Media Table

```prisma
model Media {
  id           String   @id @default(cuid())
  filename     String
  originalName String
  url          String
  thumbnailUrl String?
  mimeType     String
  size         Int      // in bytes
  width        Int?
  height       Int?
  alt          String?
  caption      String?
  folder       String?  @default("uploads")
  uploadedById String
  unitId       String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  uploadedBy   User     @relation(fields: [uploadedById], references: [id])
  unit         Unit     @relation(fields: [unitId], references: [id], onDelete: Cascade)
  galleryMedia GalleryMedia[]

  @@index([unitId])
  @@index([uploadedById])
  @@index([mimeType])
  @@index([folder])
  @@map("media")
}
```

### 4.8 Gallery Table

```prisma
model Gallery {
  id          String   @id @default(cuid())
  title       String
  slug        String
  description String?  @db.Text
  coverImage  String?
  eventDate   DateTime?
  isPublished Boolean  @default(false)
  authorId    String
  unitId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  author      User     @relation(fields: [authorId], references: [id])
  unit        Unit     @relation(fields: [unitId], references: [id], onDelete: Cascade)
  media       GalleryMedia[]
  articles    ArticleGallery[]

  @@unique([slug, unitId])
  @@index([unitId])
  @@index([authorId])
  @@index([isPublished])
  @@map("galleries")
}
```

### 4.9 Gallery-Media Junction Table

```prisma
model GalleryMedia {
  galleryId String
  mediaId   String
  order     Int    @default(0)
  caption   String?

  gallery   Gallery @relation(fields: [galleryId], references: [id], onDelete: Cascade)
  media     Media   @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  @@id([galleryId, mediaId])
  @@map("gallery_media")
}
```

### 4.10 Article-Gallery Junction Table

```prisma
model ArticleGallery {
  articleId String
  galleryId String

  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  gallery   Gallery @relation(fields: [galleryId], references: [id], onDelete: Cascade)

  @@id([articleId, galleryId])
  @@map("article_galleries")
}
```

### 4.11 Updated User Model

```prisma
// Add these relations to existing User model

model User {
  // ... existing fields ...

  // Add unit relation
  unitId          String?
  unit            Unit?    @relation(fields: [unitId], references: [id])

  // Blog relations
  articles        Article[]
  galleries       Gallery[]
  media           Media[]
  articleRevisions ArticleRevision[]
}
```

---

## 5. Sample Data

### 5.1 Units Seed Data

```typescript
const units = [
  { id: 'masjid', name: 'Ketakmiran Masjid', slug: 'masjid', subdomain: 'masjid' },
  { id: 'remas', name: 'Remaskidz', slug: 'remas', subdomain: 'remas' },
  { id: 'tpq', name: 'TPQ Al Muhajirin', slug: 'tpq', subdomain: 'tpq' },
  { id: 'kemuslimatan', name: 'Kemuslimatan', slug: 'kemuslimatan', subdomain: 'kemuslimatan' },
  { id: 'kbtk', name: 'KBTK Al Muhajirin', slug: 'kbtk', subdomain: 'kbtk' },
  { id: 'daycare', name: 'Daycare Al Muhajirin', slug: 'daycare', subdomain: 'daycare' },
  { id: 'pool', name: 'Kolam Renang', slug: 'pool', subdomain: 'pool' },
  { id: 'poliklinik', name: 'Poliklinik', slug: 'poliklinik', subdomain: 'poliklinik' },
  { id: 'lazmu', name: 'LAZ Muhajirin', slug: 'lazmu', subdomain: 'lazmu' },
  { id: 'wafmu', name: 'Wakaf Muhajirin', slug: 'wafmu', subdomain: 'wafmu' },
  { id: 'ambulans', name: 'Ambulans', slug: 'ambulans', subdomain: 'ambulans' },
  { id: 'usaha', name: 'Usaha & Pengadaan', slug: 'usaha', subdomain: 'usaha' },
];
```

### 5.2 Global Categories Seed Data

```typescript
const globalCategories = [
  { name: 'Berita', slug: 'berita', icon: 'newspaper', isGlobal: true },
  { name: 'Kegiatan', slug: 'kegiatan', icon: 'calendar', isGlobal: true },
  { name: 'Pengumuman', slug: 'pengumuman', icon: 'megaphone', isGlobal: true },
  { name: 'Artikel', slug: 'artikel', icon: 'book', isGlobal: true },
  { name: 'Galeri', slug: 'galeri', icon: 'images', isGlobal: true },
  { name: 'Laporan', slug: 'laporan', icon: 'file-text', isGlobal: true },
];
```

### 5.3 Unit-Specific Categories

```typescript
const unitCategories = [
  // Masjid
  { name: 'Jadwal Sholat', slug: 'jadwal-sholat', unitId: 'masjid' },
  { name: 'Kajian', slug: 'kajian', unitId: 'masjid' },
  { name: 'Khutbah', slug: 'khutbah', unitId: 'masjid' },

  // KBTK
  { name: 'Kurikulum', slug: 'kurikulum', unitId: 'kbtk' },
  { name: 'Prestasi', slug: 'prestasi', unitId: 'kbtk' },
  { name: 'Pendaftaran', slug: 'pendaftaran', unitId: 'kbtk' },

  // TPQ
  { name: 'Jadwal Mengaji', slug: 'jadwal-mengaji', unitId: 'tpq' },
  { name: 'Wisuda', slug: 'wisuda', unitId: 'tpq' },
  { name: 'Tahfidz', slug: 'tahfidz', unitId: 'tpq' },

  // LAZMU
  { name: 'Zakat', slug: 'zakat', unitId: 'lazmu' },
  { name: 'Infaq', slug: 'infaq', unitId: 'lazmu' },
  { name: 'Penyaluran', slug: 'penyaluran', unitId: 'lazmu' },

  // Pool
  { name: 'Jadwal Berenang', slug: 'jadwal-berenang', unitId: 'pool' },
  { name: 'Promo', slug: 'promo', unitId: 'pool' },
  { name: 'Event', slug: 'event', unitId: 'pool' },
];
```

---

## 6. Indexes & Performance

### 6.1 Primary Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| articles | (unitId, status, publishedAt) | Unit articles listing |
| articles | (slug, unitId) | Unique slug per unit |
| articles | (categoryId, status) | Category filtering |
| categories | (slug, unitId) | Category lookup |
| tags | (slug) | Tag lookup |
| media | (unitId, folder) | Media library |

### 6.2 Full-Text Search Index

```sql
-- PostgreSQL full-text search
CREATE INDEX articles_search_idx ON articles
USING GIN (to_tsvector('indonesian', title || ' ' || COALESCE(excerpt, '') || ' ' || content));
```

### 6.3 Query Performance Notes

1. **Article Listing**: Always filter by `status = 'PUBLISHED'` and index by `publishedAt`
2. **Category Pages**: Use compound index on `(categoryId, status, publishedAt)`
3. **Tag Pages**: Join through `article_tags` with indexed foreign keys
4. **Media Library**: Paginate and filter by `unitId` and `folder`

---

## 7. Database Migrations

### 7.1 Initial Migration

```bash
# Generate migration
npx prisma migrate dev --name add_blog_schema

# Apply to production
npx prisma migrate deploy
```

### 7.2 Migration Files Structure

```
prisma/
├── schema.prisma
└── migrations/
    ├── 20241224_init/
    │   └── migration.sql
    ├── 20241224_add_blog_schema/
    │   └── migration.sql
    └── migration_lock.toml
```

### 7.3 Rollback Strategy

```sql
-- Rollback blog tables (in reverse order)
DROP TABLE IF EXISTS article_galleries;
DROP TABLE IF EXISTS gallery_media;
DROP TABLE IF EXISTS galleries;
DROP TABLE IF EXISTS article_revisions;
DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS units;
```

---

## 8. Data Retention Policy

### 8.1 Retention Rules

| Data Type | Retention Period | Action |
|-----------|------------------|--------|
| Published Articles | Forever | Archive only |
| Draft Articles | 1 year | Auto-delete if not published |
| Rejected Articles | 6 months | Auto-delete |
| Article Revisions | 10 revisions | Keep latest 10 per article |
| Media (used) | Forever | Keep |
| Media (orphaned) | 30 days | Auto-delete |
| Galleries | Forever | Archive only |

### 8.2 Cleanup Jobs

```typescript
// Scheduled job: Clean orphaned media
async function cleanOrphanedMedia() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const orphanedMedia = await prisma.media.findMany({
    where: {
      createdAt: { lt: thirtyDaysAgo },
      galleryMedia: { none: {} },
      // Not used as featured image
    },
  });

  // Delete from storage and database
  for (const media of orphanedMedia) {
    await deleteFromStorage(media.url);
    await prisma.media.delete({ where: { id: media.id } });
  }
}
```

---

## 9. Backup Strategy

### 9.1 Backup Schedule

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Full Database | Daily | 30 days |
| Incremental | Hourly | 7 days |
| Media Files | Daily | 30 days |
| Point-in-time | Continuous | 7 days |

### 9.2 Restore Procedure

```bash
# Restore database from backup
pg_restore -h localhost -U postgres -d almuhajirin_db backup.dump

# Verify data integrity
npx prisma db validate
```

---

## 10. Security Considerations

### 10.1 Data Access Control

```prisma
// Row-level security example
// Implemented via application logic

// User can only see their unit's data
const articles = await prisma.article.findMany({
  where: {
    unitId: user.unitId, // Filter by user's unit
    OR: [
      { authorId: user.id },
      { status: 'PUBLISHED' },
    ],
  },
});
```

### 10.2 Sensitive Data Handling

| Field | Sensitivity | Protection |
|-------|-------------|------------|
| User email | Medium | Encrypt at rest |
| Media URLs | Low | Signed URLs (optional) |
| Article content | Low | Sanitized HTML |

---

## 11. TypeScript Types

### 11.1 Generated Types

Prisma generates types automatically:

```typescript
// types/blog.ts
import type { Article, Category, Tag, Gallery, Media } from '@prisma/client';

export type ArticleWithRelations = Article & {
  author: User;
  category: Category;
  tags: (ArticleTag & { tag: Tag })[];
  unit: Unit;
};

export type GalleryWithMedia = Gallery & {
  media: (GalleryMedia & { media: Media })[];
};

export type CategoryWithChildren = Category & {
  children: Category[];
  _count: { articles: number };
};
```

### 11.2 API Response Types

```typescript
// types/api.ts
export interface ArticleListResponse {
  data: ArticleWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ArticleCreateInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId: string;
  tags?: string[];
  status: ArticleStatus;
  publishedAt?: Date;
}
```

---

## 12. Appendix

### 12.1 Database Naming Conventions

| Convention | Example |
|------------|---------|
| Tables | lowercase, plural, snake_case (articles, article_tags) |
| Columns | camelCase (createdAt, publishedAt) |
| Indexes | table_column_idx (articles_slug_idx) |
| Foreign Keys | camelCase with Id suffix (authorId) |
| Enums | PascalCase (ArticleStatus) |

### 12.2 Related Documents

- [PRD-01: Overview](./01-PRD-Overview.md)
- [PRD-02: Blog Features](./02-PRD-Blog-Features.md)
- [PRD-03: SEO Strategy](./03-PRD-SEO-Strategy.md)
- [PRD-04: Technical Spec](./04-PRD-Technical-Spec.md)
