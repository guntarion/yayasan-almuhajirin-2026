import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, User, ArrowLeft, Tag } from 'lucide-react';
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
        url: `${siteUrl}/logo.png`,
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

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/units/masjid" className="hover:text-foreground">
              Masjid
            </Link>
            <span>/</span>
            <Link href="/units/masjid/artikel" className="hover:text-foreground">
              Artikel
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{article.title}</span>
          </nav>

          {/* Back button */}
          <Link
            href="/units/masjid/artikel"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Artikel
          </Link>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge
                category={article.category}
                unitSlug="masjid"
                size="md"
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="font-medium text-foreground">
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
          <ArticleContent content={article.content} className="mb-8" />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {article.tags.map(({ tag }: { tag: PrismaTag }) => (
                <Link
                  key={tag.id}
                  href={`/units/masjid/artikel?tag=${tag.slug}`}
                  className="px-3 py-1 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share buttons */}
          <div className="flex items-center justify-between py-6 border-y mb-8">
            <ShareButtons
              url={articleUrl}
              title={article.title}
              description={article.excerpt || undefined}
            />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
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
      </article>
    </>
  );
}
