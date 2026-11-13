import React from 'react';
import HomeClient from '@/components/HomeClient';
import { getArticles, getCategories } from '@/data/db';
import { getCachedArticleSummaries, getCachedCategories } from '@/lib/supabaseService';

export const revalidate = 60;

export default async function HomePage() {
  const [dbArticles, dbCategories] = await Promise.all([
    getCachedArticleSummaries().catch(() => []),
    getCachedCategories().catch(() => []),
  ]);

  const initialArticles =
    dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  const initialCategories =
    dbCategories && dbCategories.length > 0 ? dbCategories : getCategories();

  return (
    <HomeClient
      initialArticles={initialArticles}
      initialCategories={initialCategories}
    />
  );
}
