import { Suspense } from 'react';
import { Metadata } from 'next';
import { getArticles, getCategoriesForUnit, getUnitBySlug } from '@/lib/blog/queries';
import { ArticleList, Pagination } from '@/components/blog';
import Link from 'next/link';

type CategoryItem = Awaited<ReturnType<typeof getCategoriesForUnit>>[number];

export const metadata: Metadata = {
  title: 'Artikel - Masjid Al Muhajirin',
  description: 'Artikel, berita, dan informasi terkini dari Ketakmiran Masjid Al Muhajirin Rewwin',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ArticleListSection({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const categorySlug = searchParams.kategori as string | undefined;

  const unit = await getUnitBySlug('masjid');
  if (!unit) return null;

  const categories = await getCategoriesForUnit(unit.id);
  const selectedCategory = categorySlug
    ? categories.find((c: CategoryItem) => c.slug === categorySlug)
    : undefined;

  const { data: articles, meta } = await getArticles({
    unitId: unit.id,
    categoryId: selectedCategory?.id,
    status: 'PUBLISHED',
    page,
    limit: 12,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/units/masjid/artikel"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categorySlug
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          Semua
        </Link>
        {categories.map((category: CategoryItem) => (
          <Link
            key={category.id}
            href={`/units/masjid/artikel?kategori=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categorySlug === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {category.name} ({category._count.articles})
          </Link>
        ))}
      </div>

      {/* Articles Grid */}
      <ArticleList
        articles={articles}
        layout="grid"
        emptyMessage="Belum ada artikel di kategori ini"
      />

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            baseUrl="/units/masjid/artikel"
          />
        </div>
      )}
    </>
  );
}

export default async function ArtikelMasjidPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Artikel & Berita</h1>
          <p className="text-muted-foreground">
            Informasi terkini dari Ketakmiran Masjid Al Muhajirin
          </p>
        </div>

        <Suspense fallback={<ArticleListSkeleton />}>
          <ArticleListSection searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border overflow-hidden animate-pulse">
          <div className="aspect-[16/10] bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
