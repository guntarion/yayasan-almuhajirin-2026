'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, User } from 'lucide-react';
import { formatDate, formatRelativeTime, formatViewCount, truncateText } from '@/lib/blog/utils';
import type { ArticleListItem } from '@/types/blog';

interface ArticleCardProps {
  article: ArticleListItem;
  layout?: 'card' | 'list' | 'featured';
  showUnit?: boolean;
}

export function ArticleCard({ article, layout = 'card', showUnit = false }: ArticleCardProps) {
  const articleUrl = `/units/${article.unit.slug}/artikel/${article.slug}`;

  if (layout === 'list') {
    return (
      <article className="flex gap-4 p-4 bg-card rounded-lg border hover:shadow-md transition-shadow">
        {article.featuredImage && (
          <Link href={articleUrl} className="shrink-0">
            <div className="relative w-32 h-24 md:w-40 md:h-28 rounded-md overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: (article.category.color ?? '#6b7280') + '20', color: article.category.color ?? '#6b7280' }}
            >
              {article.category.name}
            </span>
            {showUnit && (
              <span className="text-xs text-muted-foreground">
                {article.unit.name}
              </span>
            )}
          </div>
          <Link href={articleUrl}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {truncateText(article.excerpt, 120)}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {article.publishedAt ? formatRelativeTime(article.publishedAt) : 'Draft'}
            </span>
            {article.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViewCount(article.viewCount)}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (layout === 'featured') {
    return (
      <article className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden group">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/90"
              style={{ color: article.category.color ?? '#6b7280' }}
            >
              {article.category.name}
            </span>
            {showUnit && (
              <span className="text-xs text-white/80 bg-black/30 px-2 py-1 rounded-full">
                {article.unit.name}
              </span>
            )}
          </div>
          <Link href={articleUrl}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-2 hover:underline">
              {article.title}
            </h2>
          </Link>
          {article.excerpt && (
            <p className="text-white/80 mb-4 line-clamp-2 max-w-2xl">
              {truncateText(article.excerpt, 180)}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.publishedAt ? formatDate(article.publishedAt) : 'Draft'}
            </span>
            {article.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readingTime} menit
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Default card layout
  return (
    <article className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={articleUrl} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-4xl text-muted-foreground/50">📝</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: (article.category.color ?? '#6b7280') + '20', color: article.category.color ?? '#6b7280' }}
          >
            {article.category.name}
          </span>
          {showUnit && (
            <span className="text-xs text-muted-foreground">
              {article.unit.name}
            </span>
          )}
        </div>
        <Link href={articleUrl}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {truncateText(article.excerpt, 100)}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-2">
            {article.author.image ? (
              <Image
                src={article.author.image}
                alt={article.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
            )}
            <span>{article.author.name}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {article.publishedAt ? formatRelativeTime(article.publishedAt) : 'Draft'}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
