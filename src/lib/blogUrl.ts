import { getCategorySlug } from '@/data/categories';

export function getBlogUrl(article: { category?: string; slug: string }): string {
  if (!article || !article.slug) return '/news';
  const catSlug = article.category ? getCategorySlug(article.category) : 'news';
  return `/${catSlug}/${article.slug}`;
}
