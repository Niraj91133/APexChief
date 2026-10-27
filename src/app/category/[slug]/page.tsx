import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategorySlug } from '@/data/categories';
import { getCategorySeo } from '@/data/categorySeo';
import { getArticles } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
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
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const seo = getCategorySeo(catSlug);
  const canonicalUrl = sub
    ? `${baseUrl}/category/${catSlug}?sub=${encodeURIComponent(sub)}`
    : `${baseUrl}/category/${catSlug}`;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${seo.metaTitle} | ApexChief`,
      description: seo.metaDescription,
      url: canonicalUrl,
      siteName: 'ApexChief',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${seo.metaTitle} | ApexChief`,
      description: seo.metaDescription,
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
  const seo = getCategorySeo(catSlug);
  const pageUrl = sub
    ? `${baseUrl}/category/${catSlug}?sub=${encodeURIComponent(sub)}`
    : `${baseUrl}/category/${catSlug}`;

  const dbArticles = await getArticlesFromDB();
  const allArticles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  const normCat = catSlug.replace(/[-\s]/g, '').toLowerCase();
  const categoryArticles = allArticles.filter((a) => {
    const artCat = (a.category || '').replace(/[-\s]/g, '').toLowerCase();
    return artCat === normCat;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: seo.h1,
        description: seo.metaDescription,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'ApexChief',
          url: baseUrl,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#itemlist`,
        name: `${catName} Articles`,
        numberOfItems: categoryArticles.length,
        itemListElement: categoryArticles.slice(0, 10).map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: art.title,
          url: `${baseUrl}/news/${art.slug}`,
        })),
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
            name: 'Categories',
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Category SEO Masthead with H1 Header & Content */}
        <header className="mb-6 pb-6 border-b border-[#211d1d]/15 dark:border-white/15">
          <div className="inline-flex items-center space-x-2 bg-[#0a0a0a] dark:bg-white text-[#fefdf3] dark:text-black text-[10px] font-oswald uppercase px-2.5 py-1 tracking-widest font-bold mb-3">
            <span>ApexChief {catName} Dossier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0a0a0a] dark:text-white tracking-tight mb-3">
            {seo.h1}
          </h1>
          <p className="font-sans text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
            {seo.introContent}
          </p>
        </header>

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
      </div>
    </>
  );
}
