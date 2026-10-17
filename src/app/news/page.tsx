import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { CATEGORIES, getCategorySlug } from '@/data/categories';
import NewsClient from './NewsClient';

interface NewsPageProps {
  searchParams: Promise<{
    category?: string;
    sub?: string;
    region?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';
  const rawCat = params.category?.trim();
  const sub = params.sub?.trim();

  if (rawCat && rawCat.toLowerCase() !== 'all') {
    const slug = getCategorySlug(rawCat);
    const catObj = CATEGORIES.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === rawCat.toLowerCase()
    );
    const catName = catObj?.name || rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
    const canonicalUrl = sub
      ? `${baseUrl}/news?category=${slug}&sub=${encodeURIComponent(sub)}`
      : `${baseUrl}/news?category=${slug}`;

    const title = `${catName} Archive & Executive Stories | ApexChief`;
    const description = catObj?.description || `Explore latest ${catName} reporting, industry investigations, CEO perspectives, and executive intelligence on ApexChief.`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'ApexChief',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  }

  const archiveUrl = `${baseUrl}/news`;
  const defaultTitle = 'News Archive & Editorial Intelligence | ApexChief';
  const defaultDescription = 'Explore all investigative journalism, market analysis, technology breakthroughs, exclusive interviews, and executive leadership stories on ApexChief.';

  return {
    title: defaultTitle,
    description: defaultDescription,
    alternates: {
      canonical: archiveUrl,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: archiveUrl,
      siteName: 'ApexChief',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';
  const rawCat = params.category?.trim();
  const sub = params.sub?.trim();

  let pageTitle = 'News Archive & Editorial Intelligence | ApexChief';
  let pageDescription = 'Explore all investigative journalism, market analysis, technology breakthroughs, exclusive interviews, and executive leadership stories on ApexChief.';
  let pageUrl = `${baseUrl}/news`;

  if (rawCat && rawCat.toLowerCase() !== 'all') {
    const slug = getCategorySlug(rawCat);
    const catObj = CATEGORIES.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === rawCat.toLowerCase()
    );
    const catName = catObj?.name || rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
    pageUrl = sub
      ? `${baseUrl}/news?category=${slug}&sub=${encodeURIComponent(sub)}`
      : `${baseUrl}/news?category=${slug}`;
    pageTitle = `${catName} Archive & Executive Stories | ApexChief`;
    pageDescription = catObj?.description || `Explore latest ${catName} reporting, industry investigations, CEO perspectives, and executive intelligence on ApexChief.`;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'ApexChief',
          url: baseUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'News Archive',
            item: `${baseUrl}/news`,
          },
          ...(rawCat && rawCat.toLowerCase() !== 'all'
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: rawCat,
                  item: pageUrl,
                },
              ]
            : []),
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="py-16 text-center">
            <div className="font-serif text-lg font-bold text-[#0a0a0a] dark:text-white">
              Loading ApexChief Newsroom Archive...
            </div>
            <p className="text-xs font-mono text-gray-500 mt-2">
              Fetching editorial intelligence &amp; dispatches...
            </p>
          </div>
        }
      >
        <NewsClient />
      </Suspense>
    </>
  );
}
