'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu, X, Moon, Sun, ChevronDown, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Category, Article } from '@/types';

function HeaderNav({
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  categories,
}: {
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  categories: Category[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentSub = searchParams.get('sub');

  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredCat(null);
  }, [pathname, currentCategory, currentSub, setMobileMenuOpen]);

  const handleMouseEnter = (slug: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredCat(slug);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCat(null);
    }, 180);
  };

  const activeCategoryObj = categories.find((c) => c.slug === hoveredCat);

  return (
    <div
      className="category-nav-bar w-full bg-black text-white border-b border-black transition-all relative z-40"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 sm:py-2.5">
        {/* Mobile-Only Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#f7413e] transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Navigation Links with Smart Width Adjustment */}
        <nav className="hidden lg:flex items-center justify-between w-full py-0.5 space-x-0.5 xl:space-x-1">
          <Link
            href="/news"
            className="px-2 xl:px-2.5 py-1 text-[11px] xl:text-xs font-bold uppercase tracking-wider text-white/95 hover:text-[#f7413e] transition-colors whitespace-nowrap"
          >
            All Stories
          </Link>

          {/* Primary 7-8 visible categories */}
          {categories.slice(0, 8).map((cat) => {
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
            const isHovered = hoveredCat === cat.slug;
            const isActive = currentCategory?.toLowerCase() === cat.slug.toLowerCase();

            return (
              <div
                key={cat.slug}
                className="relative group py-1"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
              >
                <Link
                  href={`/news?category=${cat.slug}`}
                  className={`inline-flex items-center space-x-1 px-2 xl:px-2.5 py-1 rounded text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#f7413e] bg-white/10'
                      : isHovered
                      ? 'text-[#f7413e] bg-white/5'
                      : 'text-white/90 hover:text-[#f7413e]'
                  }`}
                >
                  <span>{cat.name}</span>
                  {hasSubs && (
                    <ChevronDown
                      className={`w-2.5 h-2.5 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-[#f7413e]' : 'text-white/40 group-hover:text-[#f7413e]'
                      }`}
                    />
                  )}
                </Link>
              </div>
            );
          })}

          {/* If there are more than 8 categories, show sleek More dropdown */}
          {categories.length > 8 && (
            <div
              className="relative group py-1"
              onMouseEnter={() => handleMouseEnter('more-categories')}
            >
              <button
                type="button"
                className={`inline-flex items-center space-x-1 px-2 xl:px-2.5 py-1 rounded text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  hoveredCat === 'more-categories'
                    ? 'text-[#f7413e] bg-white/10'
                    : 'text-white/90 hover:text-[#f7413e]'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-2.5 h-2.5 transition-transform duration-200 ${
                    hoveredCat === 'more-categories' ? 'rotate-180 text-[#f7413e]' : 'text-white/40 group-hover:text-[#f7413e]'
                  }`}
                />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile search indicator */}
        <div className="lg:hidden">
          <button onClick={onOpenSearch} className="p-2 text-white hover:text-[#f7413e]">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hover Subcategory Mega Dropdown Panel */}
      {hoveredCat && activeCategoryObj && activeCategoryObj.subcategories && (
        <div
          className="absolute top-full left-0 w-full bg-[#0a0a0a] text-white border-b-2 border-[#f7413e] shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left Column: Pillar Title & Description */}
              <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                  <span>Editorial Pillar</span>
                </div>
                <Link
                  href={`/news?category=${activeCategoryObj.slug}`}
                  className="font-serif text-2xl font-bold text-white hover:text-[#f7413e] transition-colors block mt-1"
                >
                  {activeCategoryObj.name}
                </Link>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-sans">
                  {activeCategoryObj.description}
                </p>
                <Link
                  href={`/news?category=${activeCategoryObj.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase text-[#f7413e] hover:underline font-bold mt-3"
                >
                  <span>Explore All {activeCategoryObj.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Right Column: Subcategory Grid Items */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                {activeCategoryObj.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/news?category=${activeCategoryObj.slug}&sub=${sub.slug}`}
                    className="group flex flex-col p-2.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#f7413e]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-oswald text-xs uppercase font-bold text-white group-hover:text-[#f7413e] tracking-wider transition-colors">
                        {sub.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-[#f7413e] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    {sub.description && (
                      <span className="text-[11px] text-gray-400 mt-1 line-clamp-1 font-sans leading-tight">
                        {sub.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Categories Mega Dropdown Panel */}
      {hoveredCat === 'more-categories' && categories.length > 8 && (
        <div
          className="absolute top-full left-0 w-full bg-[#0a0a0a] text-white border-b-2 border-[#f7413e] shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                Additional Editorial Sections & Special Topics
              </span>
              <Link
                href="/news"
                className="text-xs font-mono uppercase text-gray-400 hover:text-white transition-colors"
              >
                View Full Archive →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.slice(8).map((cat) => (
                <div
                  key={cat.slug}
                  className="p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#f7413e]/40 transition-all space-y-1.5"
                >
                  <Link
                    href={`/news?category=${cat.slug}`}
                    className="font-serif text-base font-bold text-white hover:text-[#f7413e] transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#f7413e]" />
                  </Link>
                  {cat.description && (
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed font-sans">
                      {cat.description}
                    </p>
                  )}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/news?category=${cat.slug}&sub=${sub.slug}`}
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#f7413e] hover:text-white text-[9px] font-mono uppercase text-gray-300 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [todayDate, setTodayDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [config, setConfig] = useState(siteConfig);

  // Initialize and compute dynamic real-time today date
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setTodayDate(formatted);
  }, []);

  // Initialize and handle light / dark mode toggle (Default is Light Mode)
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        if (!storedTheme) {
          localStorage.setItem('theme', 'light');
        }
      }
    } catch (e) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        console.error('Error toggling theme', e);
      }
      return next;
    });
  };

  // Fetch dynamic categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const visibleCategories = data.filter((cat) => cat.isVisible !== false);
          setCategories(visibleCategories);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch dynamic config on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setConfig(data);
        }
      })
      .catch((err) => console.error('Failed to load site config', err));
  }, []);

  // Fetch dynamic articles for breaking ticker
  const [liveArticles, setLiveArticles] = useState<Article[]>([]);
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLiveArticles(data);
      })
      .catch((err) => console.error('Failed to load breaking articles', err));
  }, []);

  const breakingDynamic = liveArticles.filter((a) => a.isBreaking);
  const breakingArticles = breakingDynamic.length > 0 
    ? [...breakingDynamic, ...ARTICLES.filter((a) => !breakingDynamic.some((b) => b.slug === a.slug))].slice(0, 6)
    : ARTICLES.slice(0, 5);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#121212] shadow-md transition-colors duration-200">
      {/* 1. Main Header Masthead Bar */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        {/* Left: Mobile-only menu button + Live Today's Date */}
        <div className="flex items-center space-x-3 text-xs font-sans font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          {/* Mobile hamburger icon only */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1 text-black dark:text-white hover:text-[#f7413e] transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Live Today's Date */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[11px] sm:text-xs font-sans tracking-wide text-black dark:text-white font-semibold">
              {todayDate || config.currentDate}
            </span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono tracking-wider">
              DAILY GLOBAL EDITION
            </span>
          </div>
          <span className="sm:hidden text-[11px] font-sans tracking-wide text-black dark:text-white font-semibold">
            {todayDate ? todayDate.split(',')[0] : 'Today'}
          </span>
        </div>

        {/* Center: ApexChief Logo */}
        <div className="flex items-center justify-center text-center px-2">
          <Link href="/" className="inline-block group">
            <h1 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-black dark:text-white uppercase leading-none transition-colors group-hover:text-[#f7413e]">
              {config.name}
            </h1>
          </Link>
        </div>

        {/* Right: Search Box & Working Light/Dark Mode Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Box Mockup (clickable) */}
          <button
            onClick={openSearch}
            className="hidden md:flex items-center bg-gray-100 dark:bg-[#202020] hover:bg-gray-200/80 dark:hover:bg-[#282828] border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-400 transition-colors font-sans tracking-wide cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 mr-2 text-gray-500 dark:text-gray-400" />
            <span>Search stories...</span>
            <span className="ml-3 bg-white dark:bg-[#333333] border border-gray-200 dark:border-transparent dark:text-white/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-500">/</span>
          </button>
          
          <button
            onClick={openSearch}
            className="md:hidden p-1.5 text-black dark:text-white hover:text-[#f7413e] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 hover:text-[#f7413e] dark:hover:text-[#eab308] transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-transparent"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#facc15]" />
            ) : (
              <Moon className="w-4 h-4 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Category Navigation Bar with Subcategory Hover Menus */}
      <Suspense
        fallback={
          <div className="w-full bg-black py-3 text-center text-xs font-mono text-white">
            Loading navigation...
          </div>
        }
      >
        <HeaderNav
          onOpenSearch={openSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          categories={categories}
        />
      </Suspense>

      {/* 3. Breaking News Scrolling Marquee Bar */}
      <div className="w-full bg-black text-white flex items-center overflow-hidden border-b border-gray-200 dark:border-white/10 h-9 sm:h-10 select-none">
        {/* Red Badge */}
        <div className="bg-[#f7413e] text-white px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shrink-0 z-10 border-r border-black/20 h-full">
          <span className="text-white animate-pulse">⚡</span>
          <span>BREAKING</span>
        </div>

        {/* Scrolling items */}
        <div className="flex-1 overflow-hidden relative flex items-center h-full">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-12 text-xs font-sans font-medium text-white/90">
            {breakingArticles.map((art) => (
              <span key={art.slug} className="inline-flex items-center">
                <Link href={`/news/${art.slug}`} className="hover:text-[#f7413e] hover:underline transition-colors">
                  {art.title}
                </Link>
                <span className="mx-2 text-white/40">•</span>
                <span className="text-gray-300 font-mono text-[10px]">{art.date}</span>
                <span className="ml-2.5 text-[#fbbf24] font-semibold text-[10px] uppercase font-mono">[{art.category}]</span>
              </span>
            ))}
            {/* Duplicate for loop */}
            {breakingArticles.map((art) => (
              <span key={`${art.slug}-dup`} className="inline-flex items-center">
                <Link href={`/news/${art.slug}`} className="hover:text-[#f7413e] hover:underline transition-colors">
                  {art.title}
                </Link>
                <span className="mx-2 text-white/40">•</span>
                <span className="text-gray-300 font-mono text-[10px]">{art.date}</span>
                <span className="ml-2.5 text-[#fbbf24] font-semibold text-[10px] uppercase font-mono">[{art.category}]</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with Accordion Subcategories */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-[#161616] p-6 shadow-2xl flex flex-col justify-between border-r border-gray-200 dark:border-white/10 transition-colors overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="font-bebas text-2xl tracking-wider text-black dark:text-white">{config.name}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#f7413e] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
                <nav className="flex flex-col space-y-1">
                  <Link
                    href="/news"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-bold uppercase rounded text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    All Stories
                  </Link>
                  {categories.map((cat) => {
                    const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    const isExpanded = expandedMobileCat === cat.slug;

                    return (
                      <div key={cat.slug} className="border-b border-gray-100 dark:border-white/5 pb-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/news?category=${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm font-bold uppercase text-gray-900 dark:text-gray-100 hover:text-[#f7413e] transition-colors flex-1"
                          >
                            {cat.name}
                          </Link>
                          {hasSubs && (
                            <button
                              onClick={() => setExpandedMobileCat(isExpanded ? null : cat.slug)}
                              className="p-2 text-gray-500 hover:text-[#f7413e] cursor-pointer"
                              aria-label="Toggle subcategories"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-[#f7413e]' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Accordion Subcategories */}
                        {hasSubs && isExpanded && (
                          <div className="pl-5 pr-2 py-1 space-y-1 bg-gray-50 dark:bg-white/[0.03] rounded">
                            {cat.subcategories?.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/news?category=${cat.slug}&sub=${sub.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1.5 px-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#f7413e] transition-colors"
                              >
                                • {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between mt-6">
              <span className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400">
                {todayDate || config.currentDate}
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-[#facc15]" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
