import slugify from 'slugify';
import { format, formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'id',
    trim: true,
  });
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 300): string {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Trim and limit length
  if (text.length <= maxLength) {
    return text;
  }
  // Find last space before maxLength
  const lastSpace = text.lastIndexOf(' ', maxLength);
  return text.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: idLocale });
}

/**
 * Format relative time (e.g., "2 hari yang lalu")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: idLocale });
}

/**
 * Sanitize HTML content (basic version - for full sanitization use DOMPurify on client)
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  // Remove javascript: urls
  sanitized = sanitized.replace(/href\s*=\s*(['"])javascript:[^'"]*\1/gi, 'href="#"');
  return sanitized;
}

/**
 * Build article URL
 */
export function buildArticleUrl(unitSlug: string, articleSlug: string): string {
  return `/units/${unitSlug}/artikel/${articleSlug}`;
}

/**
 * Build category URL
 */
export function buildCategoryUrl(unitSlug: string, categorySlug: string): string {
  return `/units/${unitSlug}/kategori/${categorySlug}`;
}

/**
 * Build tag URL
 */
export function buildTagUrl(unitSlug: string, tagSlug: string): string {
  return `/units/${unitSlug}/tag/${tagSlug}`;
}

/**
 * Build gallery URL
 */
export function buildGalleryUrl(unitSlug: string, gallerySlug: string): string {
  return `/units/${unitSlug}/galeri/${gallerySlug}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get unique slug (add suffix if needed)
 */
export async function getUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagString: string): string[] {
  return tagString
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0)
    .slice(0, 10); // Max 10 tags
}

/**
 * Format view count with K/M suffix
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

/**
 * Check if image URL is valid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const ext = parsed.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|svg)$/.test(ext) || url.includes('images.unsplash.com');
  } catch {
    return false;
  }
}
