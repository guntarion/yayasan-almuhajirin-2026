'use client';

import Link from 'next/link';
import type { Category } from '@prisma/client';

interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'slug' | 'color'>;
  unitSlug?: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export function CategoryBadge({
  category,
  unitSlug,
  size = 'md',
  clickable = true,
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const badgeStyle = {
    backgroundColor: (category.color || '#6b7280') + '20',
    color: category.color || '#6b7280',
  };

  const badgeClasses = `
    inline-flex items-center font-medium rounded-full
    ${sizeClasses[size]}
    ${clickable ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''}
  `;

  if (clickable && unitSlug) {
    return (
      <Link
        href={`/units/${unitSlug}/kategori/${category.slug}`}
        className={badgeClasses}
        style={badgeStyle}
      >
        {category.name}
      </Link>
    );
  }

  return (
    <span className={badgeClasses} style={badgeStyle}>
      {category.name}
    </span>
  );
}

export default CategoryBadge;
