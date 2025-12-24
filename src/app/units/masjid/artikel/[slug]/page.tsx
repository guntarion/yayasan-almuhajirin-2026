// src/app/units/masjid/artikel/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, User, ArrowLeft, Tag, Home, ChevronRight } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles, getUnitBySlug, incrementViewCount } from '@/lib/blog/queries';
import type { Tag as PrismaTag } from '@prisma/client';
import { formatDate, formatViewCount } from '@/lib/blog/utils';
import { ArticleContent, ShareButtons, CategoryBadge, ArticleCard } from '@/components/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getUnitBySlug('masjid');
  if (!unit) return { title: 'Artikel tidak ditemukan' };

  const article = await getArticleBySlug(slug, unit.id);
  if (!article) return { title: 'Artikel tidak ditemukan' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://almuhajirin.or.id';

  return {
    title: article.metaTitle || `${article.title} - Masjid Al Muhajirin`,
    description: article.metaDescription || article.excerpt || '',
    keywords: article.metaKeywords || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.name],
      images: article.featuredImage
        ? [{ url: article.featuredImage, width: 1200, height: 630 }]
        : [],
      url: `${siteUrl}/units/masjid/artikel/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    alternates: {
      canonical: article.canonicalUrl || `${siteUrl}/units/masjid/artikel/${slug}`,
    },
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const unit = await getUnitBySlug('masjid');

  if (!unit) {
    notFound();
  }

  const article = await getArticleBySlug(slug, unit.id);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  // Increment view count
  await incrementViewCount(article.id);

  // Get related articles
  const relatedArticles = await getRelatedArticles(
    article.id,
    article.categoryId,
    unit.id,
    3
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://almuhajirin.or.id';
  const articleUrl = `${siteUrl}/units/masjid/artikel/${slug}`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Masjid Al Muhajirin Rewwin',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/Logo-Yayasan-AlMuhajirin.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="overflow-hidden">
        {/* Hero/Featured Image Section */}
        {article.featuredImage && (
          <section className="relative h-[40vh] md:h-[50vh] bg-gray-900">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover opacity-70"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </section>
        )}

        {/* Content Section */}
        <article className={`${article.featuredImage ? '-mt-32 relative z-10' : 'pt-8'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Article Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Breadcrumb */}
                <div className="px-6 md:px-8 pt-6">
                  <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <Link href="/" className="hover:text-[#00BCD4] flex items-center">
                      <Home className="h-4 w-4" />
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/artikel" className="hover:text-[#00BCD4]">
                      Artikel
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
                  </nav>
                </div>

                {/* Back button */}
                <div className="px-6 md:px-8 pt-4">
                  <Link
                    href="/artikel"
                    className="inline-flex items-center gap-2 text-sm text-[#00BCD4] hover:text-[#006064] font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Artikel
                  </Link>
                </div>

                {/* Article Header */}
                <header className="px-6 md:px-8 py-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CategoryBadge
                      category={article.category}
                      unitSlug="masjid"
                      size="md"
                    />
                  </div>

                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      {article.author.image ? (
                        <Image
                          src={article.author.image}
                          alt={article.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#006064] flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">
                        {article.author.name}
                      </span>
                    </div>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.publishedAt && formatDate(article.publishedAt)}
                    </span>

                    {article.readingTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readingTime} menit baca
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViewCount(article.viewCount + 1)} views
                    </span>
                  </div>
                </header>

                {/* Article Content */}
                <div className="px-6 md:px-8">
                  <ArticleContent content={article.content} className="prose-lg max-w-none" />
                </div>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="px-6 md:px-8 py-6">
                    <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100">
                      <Tag className="w-4 h-4 text-gray-400" />
                      {article.tags.map(({ tag }: { tag: PrismaTag }) => (
                        <Link
                          key={tag.id}
                          href={`/artikel?tag=${tag.slug}`}
                          className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-[#00BCD4]/10 hover:text-[#006064] transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share buttons */}
                <div className="px-6 md:px-8 py-6 bg-gray-50">
                  <ShareButtons
                    url={articleUrl}
                    title={article.title}
                    description={article.excerpt || undefined}
                  />
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-12 mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((related: Awaited<ReturnType<typeof getRelatedArticles>>[number]) => (
                      <ArticleCard
                        key={related.id}
                        article={related as unknown as Parameters<typeof ArticleCard>[0]['article']}
                        layout="card"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
