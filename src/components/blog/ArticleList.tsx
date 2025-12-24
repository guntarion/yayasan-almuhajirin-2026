'use client';

import { ArticleCard } from './ArticleCard';
import type { ArticleListItem } from '@/types/blog';

interface ArticleListProps {
  articles: ArticleListItem[];
  layout?: 'grid' | 'list';
  showUnit?: boolean;
  emptyMessage?: string;
}

export function ArticleList({
  articles,
  layout = 'grid',
  showUnit = false,
  emptyMessage = 'Belum ada artikel',
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            layout="list"
            showUnit={showUnit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          layout="card"
          showUnit={showUnit}
        />
      ))}
    </div>
  );
}

export default ArticleList;
