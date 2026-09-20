'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Article, Category } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import {
  Search,
  Newspaper,
  ArrowLeft,
  Layers,
  Tag,
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// Category resolution helper with robust slug aliases
const resolveCategoryAndSub = (catParam: string, subParam: string | null) => {
  const norm = (catParam || '').toLowerCase().trim();
  const normSub = (subParam || '').toLowerCase().trim();

  // Backward-compat aliases & clean slug normalization
  if (norm === 'ai' || norm === 'artificial-intelligence') {
    return { category: 'technology', sub: 'ai', region: null };
  }
  if (norm === 'real-estate' || norm === 'realestate' || norm === 'realstate' || norm === 'real-state') {
    return { category: 'real-state', sub: normSub || null, region: null };
  }
  if (norm === 'startup' || norm === 'startups' || norm === 'start-up') {
    return { category: 'start-up', sub: normSub || null, region: null };
  }
  if (norm === 'top-list' || norm === 'top10' || norm === 'top-10' || norm === 'top - list') {
    return { category: 'top-list', sub: normSub || null, region: null };
  }
  if (norm === 'medical' || norm === 'bard-powerport-lawsuit') {
    return { category: 'health', sub: normSub || 'healthtech', region: null };
  }
  if (norm === 'innovation') {
    return { category: 'technology', sub: 'innovation', region: null };
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterDrawerOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setActiveCategory('all');
    setActiveSub(null);
    setActiveRegion(null);
    setDisplayCount(12);
    router.push('/news', { scroll: false });
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
        if (artCat === normCat) return true;
        if (normCat === 'interview' && (a.placement === 'interview' || a.tag.toLowerCase().includes('interview') || a.title.toLowerCase().startsWith('interview:'))) {
          return true;
        }
        if ((normCat === 'toplist' || normCat === 'top10') && (a.placement === 'top10' || a.tag.toLowerCase().includes('top 10') || a.title.toLowerCase().includes('top 10'))) {
          return true;
        }
        if ((normCat === 'realstate' || normCat === 'realestate') && (artCat === 'realstate' || artCat === 'realestate' || a.tag.toLowerCase().includes('real estate'))) {
          return true;
        }
        if ((normCat === 'startup' || normCat === 'startups') && (artCat === 'startup' || artCat === 'startups' || a.tag.toLowerCase().includes('startup') || a.tag.toLowerCase().includes('scaleup'))) {
          return true;
        }
        return false;
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

  const hasActiveFilters = activeCategory !== 'all' || !!activeSub || !!activeRegion || !!searchQuery.trim();
  const activeFiltersCount = [
    activeCategory !== 'all',
    !!activeSub,
    !!activeRegion,
    !!searchQuery.trim(),
  ].filter(Boolean).length;

  return (
    <div className="w-full pt-1">
      {/* Sleek Minimal 1-Line Breadcrumb / Label Header */}
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 px-0.5">
        <div className="flex items-center space-x-1.5 truncate">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/news" className="text-[#f7413e] font-semibold hover:underline">
            Editorial Archive
          </Link>
          {activeCategory !== 'all' && currentCategoryObj && (
            <>
              <span>/</span>
              <span className="text-black dark:text-white font-bold truncate">{currentCategoryObj.name}</span>
            </>
          )}
          {activeSub && (
            <>
              <span>/</span>
              <span className="text-[#f7413e] font-bold truncate">{activeSub}</span>
            </>
          )}
        </div>
        <div className="shrink-0 text-gray-400 dark:text-gray-500 font-mono text-[11px] hidden sm:block">
          {filteredArticles.length} Stories
        </div>
      </div>

      {/* Ultra Clean & Simple 1-Line Filter Control Bar */}
      <div className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-md p-2 sm:p-2.5 mb-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Corner: Filter Button & Quick Active Tags */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5 flex-1 min-w-0">
            {/* Filter Drawer Trigger Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-oswald uppercase tracking-wider transition-all cursor-pointer shadow-xs shrink-0 ${
                hasActiveFilters
                  ? 'bg-[#f7413e] text-white font-bold hover:bg-[#d63431]'
                  : 'bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-gray-800 dark:hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-white/25 text-white text-[10px] rounded-full font-mono font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active Category Pill (quick dismiss) */}
            {activeCategory !== 'all' && currentCategoryObj && (
              <button
                onClick={() => handleCategoryChange('all')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-gray-200 dark:bg-white/10 text-black dark:text-white hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors shrink-0 group cursor-pointer"
                title="Remove category filter"
              >
                <span className="font-semibold">{currentCategoryObj.name}</span>
                <X className="w-3 h-3 text-gray-500 group-hover:text-red-600" />
              </button>
            )}

            {/* Active Subcategory Pill (quick dismiss) */}
            {activeSub && (
              <button
                onClick={() => handleSubChange(null)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-gray-200 dark:bg-white/10 text-black dark:text-white hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors shrink-0 group cursor-pointer"
                title="Remove topic filter"
              >
                <span className="uppercase font-semibold">{activeSub}</span>
                <X className="w-3 h-3 text-gray-500 group-hover:text-red-600" />
              </button>
            )}

            {/* Active Search Pill (quick dismiss) */}
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-gray-200 dark:bg-white/10 text-black dark:text-white hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors shrink-0 group cursor-pointer"
                title="Clear search"
              >
                <span className="truncate max-w-[100px] font-semibold">&quot;{searchQuery}&quot;</span>
                <X className="w-3 h-3 text-gray-500 group-hover:text-red-600" />
              </button>
            )}

            {/* Quick Reset Button if multiple filters active */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-mono text-gray-400 hover:text-red-500 transition-colors shrink-0 underline cursor-pointer hidden md:inline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Right Side: Quick Search & Sort */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Quick Search on Desktop */}
            <div className="relative hidden sm:block w-36 md:w-48">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white dark:bg-[#222222] text-xs text-black dark:text-white pl-8 pr-2.5 py-1.5 rounded border border-gray-300 dark:border-white/15 focus:outline-none focus:border-[#f7413e]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'title')}
              className="bg-white dark:bg-[#222222] text-xs text-black dark:text-white px-2.5 py-1.5 rounded border border-gray-300 dark:border-white/15 focus:outline-none font-mono cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="title">A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Slide-Over Drawer Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-[90vw] sm:w-screen max-w-md bg-white dark:bg-[#141414] shadow-2xl border-r border-gray-200 dark:border-white/10 flex flex-col z-[99999] animate-in slide-in-from-left duration-200">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#f7413e]" />
                  <h2 className="font-oswald text-base sm:text-lg font-bold uppercase tracking-wider text-black dark:text-white">
                    Filters & Categories
                  </h2>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 rounded text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                {/* Search in Drawer */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">
                    Search Articles
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type keywords, companies, topics..."
                      className="w-full bg-gray-50 dark:bg-[#202020] text-sm text-black dark:text-white pl-9 pr-8 py-2.5 rounded border border-gray-300 dark:border-white/15 focus:outline-none focus:border-[#f7413e]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories Pillar Section */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                      Editorial Category
                    </label>
                    <span className="text-[11px] font-mono text-gray-400">
                      {categories.length + 1} categories
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {/* All Stories Button */}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-oswald uppercase tracking-wider text-left transition-all cursor-pointer ${
                        activeCategory === 'all' && !activeRegion
                          ? 'bg-[#f7413e] text-white font-bold shadow-xs'
                          : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#262626]'
                      }`}
                    >
                      <span className="truncate">All Stories</span>
                      <span className="text-[11px] font-mono opacity-80 ml-2">({articles.length})</span>
                    </button>

                    {/* Category Buttons */}
                    {categories.map((cat) => {
                      const norm = cat.slug.toLowerCase().trim().replace(/[-\s]/g, '');
                      const isActive = activeCategory.toLowerCase().trim() === cat.slug.toLowerCase().trim() && !activeRegion;
                      const count = articles.filter((a) => {
                        const artCat = a.category.toLowerCase().trim().replace(/[-\s]/g, '');
                        if (artCat === norm) return true;
                        if (norm === 'interview' && (a.placement === 'interview' || a.tag.toLowerCase().includes('interview') || a.title.toLowerCase().startsWith('interview:'))) return true;
                        if ((norm === 'toplist' || norm === 'top10') && (a.placement === 'top10' || a.tag.toLowerCase().includes('top 10') || a.title.toLowerCase().includes('top 10'))) return true;
                        if ((norm === 'realstate' || norm === 'realestate') && (artCat === 'realstate' || artCat === 'realestate' || a.tag.toLowerCase().includes('real estate'))) return true;
                        if ((norm === 'startup' || norm === 'startups') && (artCat === 'startup' || artCat === 'startups' || a.tag.toLowerCase().includes('startup') || a.tag.toLowerCase().includes('scaleup'))) return true;
                        return false;
                      }).length;

                      return (
                        <button
                          key={cat.slug}
                          onClick={() => handleCategoryChange(cat.slug)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-oswald uppercase tracking-wider text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#f7413e] text-white font-bold shadow-xs'
                              : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#262626]'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[11px] font-mono opacity-80 ml-2">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subcategory / Topics Section */}
                {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 font-bold">
                      <Layers className="w-3.5 h-3.5 text-[#f7413e]" />
                      <span>{currentCategoryObj.name} Topics</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleSubChange(null)}
                        className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          activeSub === null
                            ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                            : 'bg-gray-100 dark:bg-[#202020] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:border-black dark:hover:border-white'
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
                            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                                : 'bg-gray-100 dark:bg-[#202020] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:border-black dark:hover:border-white'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sort Order */}
                <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">
                    Sort Stories
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`px-3 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                        sortBy === 'newest'
                          ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                          : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
                      }`}
                    >
                      {sortBy === 'newest' && <Check className="w-3.5 h-3.5" />}
                      <span>Latest First</span>
                    </button>

                    <button
                      onClick={() => setSortBy('title')}
                      className={`px-3 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                        sortBy === 'title'
                          ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                          : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
                      }`}
                    >
                      {sortBy === 'title' && <Check className="w-3.5 h-3.5" />}
                      <span>Alphabetical</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 sm:p-5 pb-6 sm:pb-5 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 py-2.5 px-3 rounded border border-gray-300 dark:border-white/20 text-xs font-oswald uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-[2] py-2.5 px-4 rounded bg-[#f7413e] hover:bg-[#d63431] text-white text-xs font-oswald uppercase tracking-wider font-bold shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Show {filteredArticles.length} Stories</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      {displayedArticles.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/15 rounded-md p-8">
          <Newspaper className="w-12 h-12 text-gray-400 dark:text-white/40 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-black dark:text-white">
            No matching editorial stories found
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or selecting a different category or topic.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 btn-load-more px-5 py-2.5 text-xs font-oswald uppercase tracking-widest rounded transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article, idx) => (
            <div key={article.slug} className="relative group/rank-card">
              {activeCategory === 'top-list' && (
                <div className="absolute top-2 left-2 z-20 bg-[#f7413e] text-white font-oswald text-xs font-bold px-2 py-0.5 shadow-md flex items-center space-x-1">
                  <span>RANK 0{idx + 1}</span>
                </div>
              )}
              <ArticleCard article={article} variant="standard" />
            </div>
          ))}
        </div>
      )}

      {/* Load More Pagination */}
      {hasMore && (
        <div className="text-center mt-10 pt-6 border-t border-gray-200 dark:border-white/15">
          <button
            onClick={() => setDisplayCount((prev) => prev + 12)}
            className="btn-load-more font-oswald text-xs font-bold uppercase tracking-widest px-8 py-3 rounded transition-all inline-flex items-center space-x-2 cursor-pointer shadow-xs"
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
    <Suspense fallback={<div className="py-12 text-center font-serif text-sm">Loading news archive...</div>}>
      <NewsContent />
    </Suspense>
  );
}
