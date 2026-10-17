import { MetadataRoute } from 'next';
import { getArticles, getCategories } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';
  
  // Prefer fresh DB articles if available, fallback to local articles.json
  const dbArticles = await getArticlesFromDB().catch(() => null);
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  const categories = getCategories();

  // 1. Static main pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/write-for-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. Individual Article / Blog Post Pages (Only active, non-deleted articles)
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.date || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Category Archive Pages with new clean /category/[slug] format
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.slug !== 'home')
    .map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

  return [...staticPages, ...articlePages, ...categoryPages];
}
