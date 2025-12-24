'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={currentPage === 1}
        asChild={currentPage !== 1}
      >
        {currentPage === 1 ? (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-9 h-9"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            variant={isActive ? 'default' : 'outline'}
            size="icon"
            className="h-9 w-9"
            asChild={!isActive}
          >
            {isActive ? (
              <span>{page}</span>
            ) : (
              <Link href={getPageUrl(page)}>{page}</Link>
            )}
          </Button>
        );
      })}

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={currentPage === totalPages}
        asChild={currentPage !== totalPages}
      >
        {currentPage === totalPages ? (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={getPageUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </nav>
  );
}

export default Pagination;
