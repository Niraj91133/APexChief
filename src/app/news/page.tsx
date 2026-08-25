'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ARTICLES } from '@/data/articles';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Search, Filter, SlidersHorizontal, Newspaper, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function NewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'title'>('newest');
  const [displayCount, setDisplayCount] = useState(12);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  // Sync state if url param changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
  }, [searchParams]);

  // Fetch dynamic articles on mount
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
      })
      .catch((err) => console.error('Failed to load articles', err));
  }, []);

  const [categories, setCategories] = useState<any[]>([]);

  // Fetch dynamic categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setDisplayCount(12);
    if (slug === 'all') {
      router.push('/news', { scroll: false });
    } else {
      router.push(`/news?category=${slug}`, { scroll: false });
    }
  };

  // Filter & sort
  const filteredArticles = useMemo(() => {
    let list = articles;

    if (activeCategory !== 'all') {
      const norm = activeCategory.toLowerCase().trim();
      if (norm === 'ai' || norm === 'ai news') {
        list = articles.filter((a) => a.category.toLowerCase().includes('ai'));
      } else {
        list = articles.filter((a) => a.category.toLowerCase() === norm);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [articles, activeCategory, searchQuery, sortBy]);

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayCount < filteredArticles.length;

  const currentCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="w-full">
      {/* Page Masthead Title */}
      <div className="py-8 pb-6 border-b-2 border-[#211d1d] mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#575757] mb-2">
          <Link href="/" className="hover:text-[#211d1d] flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Front Page</span>
          </Link>
          <span>/</span>
          <span className="text-[#f7413e] font-semibold">Editorial Archive</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] tracking-tight">
          {activeCategory === 'all'
            ? 'All Editorial Stories'
            : currentCategoryObj
            ? `${currentCategoryObj.name} Section`
            : `${activeCategory.toUpperCase()} Section`}
        </h1>

        <p className="font-serif italic text-sm sm:text-base text-[#575757] mt-2 max-w-2xl">
          {currentCategoryObj
            ? currentCategoryObj.description
            : 'Explore our complete publication collection spanning global reporting, culture analysis, and industry trends.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#eff0e0] border border-[#211d1d]/20 p-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1.5 rounded text-xs font-oswald uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#211d1d] text-[#fefdf3] font-bold'
                  : 'bg-[#fefdf3] text-[#211d1d] hover:bg-[#211d1d]/10'
              }`}
            >
              All ({articles.length})
            </button>
            {categories
              .filter((c) => c.isVisible !== false)
              .map((cat) => {
                const norm = cat.slug.toLowerCase().trim();
              const count = articles.filter((a) => {
                if (norm === 'ai' || norm === 'ai news') {
                  return a.category.toLowerCase().includes('ai');
                }
                return a.category.toLowerCase() === norm;
              }).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3 py-1.5 rounded text-xs font-oswald uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeCategory === cat.slug
                      ? 'bg-[#211d1d] text-[#fefdf3] font-bold'
                      : 'bg-[#fefdf3] text-[#211d1d] hover:bg-[#211d1d]/10'
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
              <Search className="w-3.5 h-3.5 text-[#575757] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter stories..."
                className="w-full bg-[#fefdf3] text-xs text-[#211d1d] pl-8 pr-3 py-1.5 rounded border border-[#211d1d]/15 focus:outline-none focus:border-[#211d1d]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'title')}
              className="bg-[#fefdf3] text-xs text-[#211d1d] px-3 py-1.5 rounded border border-[#211d1d]/15 focus:outline-none font-mono"
            >
              <option value="newest">Latest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[#575757] font-mono mb-6 pb-2 border-b border-[#211d1d]/10">
        <div>
          Showing {displayedArticles.length} of {filteredArticles.length} stories
          {searchQuery && ` for &ldquo;${searchQuery}&rdquo;`}
        </div>
        <div>Volume XIV Edition</div>
      </div>

      {/* Article Grid */}
      {displayedArticles.length === 0 ? (
        <div className="py-20 text-center bg-[#eff0e0]/40 border border-[#211d1d]/15 rounded p-8">
          <Newspaper className="w-12 h-12 text-[#575757]/40 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-[#0a0a0a]">
            No matching editorial stories found
          </h3>
          <p className="text-sm text-[#575757] mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="mt-4 bg-[#211d1d] text-[#fefdf3] px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded hover:bg-[#f7413e] transition-colors"
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
        <div className="text-center mt-12 pt-8 border-t border-[#211d1d]/15">
          <button
            onClick={() => setDisplayCount((prev) => prev + 12)}
            className="bg-[#211d1d] hover:bg-[#f7413e] text-[#fefdf3] font-oswald text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded transition-all inline-flex items-center space-x-2"
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
