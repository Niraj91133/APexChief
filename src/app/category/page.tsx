import React, { Suspense } from 'react';
import { Metadata } from 'next';
import NewsClient from '@/app/news/NewsClient';
import { CATEGORY_SEO_DATA } from '@/data/categorySeo';

const seo = CATEGORY_SEO_DATA.all;

export const metadata: Metadata = {
  title: seo.metaTitle,
  description: seo.metaDescription,
  keywords: seo.keywords,
  alternates: {
    canonical: 'https://www.apexchief.com/category',
  },
  openGraph: {
    title: `${seo.metaTitle} | ApexChief`,
    description: seo.metaDescription,
    url: 'https://www.apexchief.com/category',
    siteName: 'ApexChief',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${seo.metaTitle} | ApexChief`,
    description: seo.metaDescription,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://www.apexchief.com/category#collection',
      url: 'https://www.apexchief.com/category',
      name: seo.h1,
      description: seo.metaDescription,
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.apexchief.com/#website',
        name: 'ApexChief',
        url: 'https://www.apexchief.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.apexchief.com/category#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.apexchief.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://www.apexchief.com/category',
        },
      ],
    },
  ],
};

export default function CategoryIndexPage() {
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
            <span>ApexChief Editorial Categories</span>
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
                Loading Categories...
              </div>
            </div>
          }
        >
          <NewsClient defaultCategory="all" />
        </Suspense>
      </div>
    </>
  );
}
