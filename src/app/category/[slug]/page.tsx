import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategorySlug } from '@/data/categories';
import NewsClient from '@/app/news/NewsClient';

interface CategoryPageProps {
  params: Promise<{
    slug?: string;
  }>;
  searchParams: Promise<{
    sub?: string;
    region?: string;
  }>;
}

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== 'home').map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { sub } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  const rawSlug = slug?.trim();
  const catSlug = rawSlug ? getCategorySlug(rawSlug) : '';
  const catObj = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === catSlug.toLowerCase() || c.name.toLowerCase() === rawSlug?.toLowerCase()
  );

  if (!catObj && rawSlug) {
    return {
      title: 'Category Not Found | ApexChief',
      description: 'The requested category could not be found.',
    };
  }

  const catName = catObj?.name || (rawSlug ? rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1) : 'News');
  const canonicalUrl = sub
    ? `${baseUrl}/category/${catSlug}?sub=${encodeURIComponent(sub)}`
    : `${baseUrl}/category/${catSlug}`;

  const title = `${catName} Archive & Executive Stories | ApexChief`;
  const description =
    catObj?.description ||
    `Explore latest ${catName} reporting, industry investigations, CEO perspectives, and executive intelligence on ApexChief.`;

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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  const rawSlug = slug?.trim();
  const catSlug = rawSlug ? getCategorySlug(rawSlug) : '';
  const catObj = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === catSlug.toLowerCase() || c.name.toLowerCase() === rawSlug?.toLowerCase()
  );

  if (!catObj && rawSlug) {
    notFound();
  }

  const catName = catObj?.name || (rawSlug ? rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1) : 'News');
  const pageUrl = sub
    ? `${baseUrl}/category/${catSlug}?sub=${encodeURIComponent(sub)}`
    : `${baseUrl}/category/${catSlug}`;
  const pageTitle = `${catName} Archive & Executive Stories | ApexChief`;
  const pageDescription =
    catObj?.description ||
    `Explore latest ${catName} reporting, industry investigations, CEO perspectives, and executive intelligence on ApexChief.`;

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
            name: 'Category Archive',
            item: `${baseUrl}/category`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: catName,
            item: pageUrl,
          },
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
              Loading ApexChief {catName} Category...
            </div>
            <p className="text-xs font-mono text-gray-500 mt-2">
              Fetching editorial intelligence &amp; dispatches...
            </p>
          </div>
        }
      >
        <NewsClient defaultCategory={catSlug} />
      </Suspense>
    </>
  );
}
