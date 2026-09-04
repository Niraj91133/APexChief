'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Article, Category } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Search, Newspaper, ArrowLeft, Layers, Tag, MapPin } from 'lucide-react';
import Link from 'next/link';

// Legacy mapping helper
const resolveCategoryAndSub = (catParam: string, subParam: string | null) => {
  const norm = (catParam || '').toLowerCase().trim();
  const normSub = (subParam || '').toLowerCase().trim();

  // Backward-compat aliases
  if (norm === 'ai' || norm === 'artificial-intelligence') {
    return { category: 'technology', sub: 'ai', region: null };
  }
  if (norm === 'real-estate') {
    return { category: 'markets', sub: 'real-estate', region: null };
  }
  if (norm === 'interview') {
    return { category: 'leadership', sub: 'interviews', region: null };
  }
  if (norm === 'biography') {
    return { category: 'leadership', sub: 'profiles', region: null };
  }
  if (norm === 'finance') {
    return { category: 'markets', sub: 'finance', region: null };
  }
  if (norm === 'health' || norm === 'medical' || norm === 'bard-powerport-lawsuit') {
    return { category: 'future', sub: 'healthtech', region: null };
  }
  if (norm === 'innovation') {
    return { category: 'technology', sub: 'innovation', region: null };
  }
  if (norm === 'start-up' || norm === 'startup') {
    return { category: 'startups', sub: normSub || null, region: null };
  }
  if (norm === 'uae') {
    return { category: 'all', sub: null, region: 'UAE' };
  }
  if (norm === 'mena') {
    return { category: 'all', sub: null, region: 'MENA' };
  }

  return { category: norm || 'all', sub: normSub || null, region: null };
};

function NewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCategoryParam = searchParams.get('category') || 'all';
  const rawSubParam = searchParams.get('sub') || null;

  const resolved = useMemo(
    () => resolveCategoryAndSub(rawCategoryParam, rawSubParam),
    [rawCategoryParam, rawSubParam]
  );

  const [activeCategory, setActiveCategory] = useState(resolved.category);
  const [activeSub, setActiveSub] = useState<string | null>(resolved.sub);
  const [activeRegion, setActiveRegion] = useState<string | null>(resolved.region);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'title'>('newest');
  const [displayCount, setDisplayCount] = useState(12);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  // Sync state if url param changes
  useEffect(() => {
    const res = resolveCategoryAndSub(
      searchParams.get('category') || 'all',
      searchParams.get('sub') || null
    );
    setActiveCategory(res.category);
    setActiveSub(res.sub);
    setActiveRegion(res.region);
  }, [searchParams]);

  // Fetch dynamic articles
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch((err) => console.error('Failed to load articles', err));
  }, []);

  // Fetch dynamic categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data.filter((c) => c.isVisible !== false));
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setActiveSub(null);
    setActiveRegion(null);
    setDisplayCount(12);
    if (slug === 'all') {
      router.push('/news', { scroll: false });
    } else {
      router.push(`/news?category=${slug}`, { scroll: false });
    }
  };

  const handleSubChange = (subSlug: string | null) => {
    setActiveSub(subSlug);
    setDisplayCount(12);
    if (!subSlug) {
      router.push(`/news?category=${activeCategory}`, { scroll: false });
    } else {
      router.push(`/news?category=${activeCategory}&sub=${subSlug}`, { scroll: false });
    }
  };

  // Find active category definition object
  const currentCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === activeCategory.toLowerCase()
  );

  // Filter & sort
  const filteredArticles = useMemo(() => {
    let list = articles;

    // Filter by Region if specified
    if (activeRegion) {
      list = list.filter(
        (a) => a.region?.toLowerCase() === activeRegion.toLowerCase() || a.tag.toLowerCase().includes(activeRegion.toLowerCase())
      );
    }

    // Filter by Main Category
    if (activeCategory !== 'all') {
      const normCat = activeCategory.toLowerCase().trim().replace(/[-\s]/g, '');
      list = list.filter((a) => {
        const artCat = a.category.toLowerCase().trim().replace(/[-\s]/g, '');
        return artCat === normCat;
      });
    }

    // Filter by Subcategory
    if (activeSub) {
      const normSub = activeSub.toLowerCase().trim().replace(/[-\s]/g, '');
      list = list.filter((a) => {
        const artSub = (a.subcategory || '').toLowerCase().trim().replace(/[-\s]/g, '');
        const artTag = a.tag.toLowerCase().trim().replace(/[-\s]/g, '');
        return artSub === normSub || artTag.includes(normSub) || a.title.toLowerCase().includes(normSub);
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.subcategory && a.subcategory.toLowerCase().includes(q)) ||
          a.tag.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [articles, activeCategory, activeSub, activeRegion, searchQuery, sortBy]);

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayedArticles.length < filteredArticles.length;

  return (
    <div className="w-full">
      {/* Page Masthead Title */}
      <div className="py-8 pb-6 border-b-2 border-[#211d1d] dark:border-white/30 mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#575757] dark:text-[#a3a3a3] mb-2">
          <Link href="/" className="hover:text-[#211d1d] dark:hover:text-white flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Front Page</span>
          </Link>
          <span>/</span>
          <span className="text-[#f7413e] font-semibold">Editorial Archive</span>
          {activeCategory !== 'all' && currentCategoryObj && (
            <>
              <span>/</span>
              <span className="text-black dark:text-white font-bold">{currentCategoryObj.name}</span>
            </>
          )}
          {activeSub && (
            <>
              <span>/</span>
              <span className="text-[#f7413e] font-bold uppercase">{activeSub}</span>
            </>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] dark:text-[#ffffff] tracking-tight">
          {activeRegion
            ? `${activeRegion} Regional Intelligence`
            : activeCategory === 'all'
            ? 'All Editorial Stories'
            : currentCategoryObj
            ? `${currentCategoryObj.name} Pillar`
            : `${activeCategory.toUpperCase()} Pillar`}
        </h1>

        <p className="font-serif italic text-sm sm:text-base text-[#575757] dark:text-[#a3a3a3] mt-2 max-w-2xl">
          {activeRegion
            ? `Special coverage, economic reports, and market intelligence from ${activeRegion}.`
            : currentCategoryObj
            ? currentCategoryObj.description
            : 'Explore our complete global business publication collection spanning markets, leadership, frontier technology, and emerging enterprise trends.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/15 p-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Main 8 Category Pillar Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded text-xs font-oswald uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all' && !activeRegion ? 'tab-btn-active font-bold shadow-sm' : 'tab-btn-inactive'
              }`}
            >
              All ({articles.length})
            </button>
            {categories.map((cat) => {
              const norm = cat.slug.toLowerCase().trim().replace(/[-\s]/g, '');
              const isActive = activeCategory.toLowerCase().trim() === cat.slug.toLowerCase().trim() && !activeRegion;
              const count = articles.filter((a) => {
                const artCat = a.category.toLowerCase().trim().replace(/[-\s]/g, '');
                return artCat === norm;
              }).length;

              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3.5 py-1.5 rounded text-xs font-oswald uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive ? 'tab-btn-active font-bold shadow-sm' : 'tab-btn-inactive'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Sort Input */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter stories..."
                className="w-full bg-white dark:bg-[#242424] text-xs text-black dark:text-white pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'title')}
              className="bg-white dark:bg-[#242424] text-xs text-black dark:text-white px-3 py-1.5 rounded border border-gray-300 dark:border-white/20 focus:outline-none font-mono cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Subcategory Filter Pills (When a category pillar is selected) */}
        {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-gray-200 dark:border-white/10 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-1 text-[11px] font-mono uppercase text-gray-500 dark:text-gray-400 shrink-0 mr-1">
              <Layers className="w-3 h-3 text-[#f7413e]" />
              <span>Topics:</span>
            </div>

            <button
              onClick={() => handleSubChange(null)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeSub === null
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                  : 'bg-white dark:bg-[#202020] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:border-black dark:hover:border-white'
              }`}
            >
              All {currentCategoryObj.name}
            </button>

            {currentCategoryObj.subcategories.map((sub) => {
              const isSubActive = activeSub === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => handleSubChange(sub.slug)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isSubActive
                      ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                      : 'bg-white dark:bg-[#202020] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-mono mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
        <div>
          Showing {displayedArticles.length} of {filteredArticles.length} stories
          {searchQuery && ` for "${searchQuery}"`}
          {activeSub && ` in "${activeSub}"`}
          {activeRegion && ` in region "${activeRegion}"`}
        </div>
        <div>Volume XIV Edition</div>
      </div>

      {/* Article Grid */}
      {displayedArticles.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/15 rounded p-8">
          <Newspaper className="w-12 h-12 text-gray-400 dark:text-white/40 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-black dark:text-white">
            No matching editorial stories found
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or selecting a different category or topic.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="mt-4 btn-load-more px-5 py-2.5 text-xs font-oswald uppercase tracking-widest rounded transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="standard" />
          ))}
        </div>
      )}

      {/* Load More Pagination */}
      {hasMore && (
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-white/15">
          <button
            onClick={() => setDisplayCount((prev) => prev + 12)}
            className="btn-load-more font-oswald text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded transition-all inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <span>Load More Stories ({filteredArticles.length - displayCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center font-serif">Loading news archive...</div>}>
      <NewsContent />
    </Suspense>
  );
}
