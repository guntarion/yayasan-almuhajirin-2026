'use client';

import { useEffect, useRef } from 'react';

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add target="_blank" to external links
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll('a');
      links.forEach((link) => {
        if (link.hostname !== window.location.hostname) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`
        prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-foreground
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:text-muted-foreground prose-ol:text-muted-foreground
        prose-li:marker:text-primary
        prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1
        prose-img:rounded-lg prose-img:shadow-md
        prose-pre:bg-muted prose-pre:text-foreground
        prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default ArticleContent;
