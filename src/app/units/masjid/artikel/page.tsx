// src/app/units/masjid/artikel/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getArticles, getCategoriesForUnit, getUnitBySlug } from '@/lib/blog/queries';
import { ArticleList, Pagination } from '@/components/blog';
import Link from 'next/link';
import { Newspaper, Filter } from 'lucide-react';

type CategoryItem = Awaited<ReturnType<typeof getCategoriesForUnit>>[number];

export const metadata: Metadata = {
  title: 'Artikel & Berita - Masjid Al Muhajirin',
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
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-[#00BCD4]" />
          <span className="font-semibold text-gray-900">Kategori</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/artikel"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              !categorySlug
                ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </Link>
          {categories.map((category: CategoryItem) => (
            <Link
              key={category.id}
              href={`/artikel?kategori=${category.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                categorySlug === category.slug
                  ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category._count.articles})
            </Link>
          ))}
        </div>
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
            baseUrl="/artikel"
          />
        </div>
      )}
    </>
  );
}

export default async function ArtikelMasjidPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] via-[#00838F] to-[#00BCD4]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Newspaper className="h-5 w-5" />
              <span className="text-sm font-medium">Artikel & Berita</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Informasi Terkini
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Berita, artikel, dan informasi seputar kegiatan Masjid Al Muhajirin Rewwin
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<ArticleListSkeleton />}>
              <ArticleListSection searchParams={params} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArticleListSkeleton() {
  return (
    <>
      {/* Filter Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
