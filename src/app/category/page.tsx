import React, { Suspense } from 'react';
import { Metadata } from 'next';
import NewsClient from '@/app/news/NewsClient';

export const metadata: Metadata = {
  title: 'Categories & Editorial Archive | ApexChief',
  description: 'Explore all reporting, executive intelligence, and industry categories on ApexChief.',
  alternates: {
    canonical: 'https://www.apexchief.com/category',
  },
};

export default function CategoryIndexPage() {
  return (
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
  );
}
