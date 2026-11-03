import { permanentRedirect } from 'next/navigation';
import { getArticleBySlug } from '@/data/db';
import { getCategorySlug } from '@/data/categories';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const catSlug = article?.category ? getCategorySlug(article.category) : 'news';
  permanentRedirect(`/${catSlug}/${slug}`);
}
