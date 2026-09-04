import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/news/${slug}`);
}
