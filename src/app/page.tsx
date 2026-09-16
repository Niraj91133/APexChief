'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ARTICLES } from '@/data/articles';
import { Article } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import HeroSection3Grid from '@/components/HeroSection3Grid';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

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

  const getArt = (slug: string): Article => {
    const art = articles.find((a) => a.slug === slug || a.id === slug);
    if (!art) {
      const fallback = articles[0] || ARTICLES[0] || {
        id: 'default-art',
        slug: 'enterprise-ai-reshapes-global-supply-chain-logistics',
        title: 'Enterprise AI Reshapes Global Supply Chain Logistics',
        category: 'Business',
        tag: 'Business',
        date: 'Sep 02, 2026',
        author: 'Elena Rostova',
        authorRole: 'Editor',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        readTime: '5 min read',
        excerpt: 'Global supply chain transformation powered by predictive AI.',
        paragraphs: [],
        sections: [],
      };
      return fallback;
    }

    const cleanImage = art.image
      ? art.image.replace(/&amp;/g, '&')
      : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200';
    const cleanAvatar = art.authorAvatar
      ? art.authorAvatar.replace(/&amp;/g, '&')
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300';

    return {
      ...art,
      image: cleanImage,
      authorAvatar: cleanAvatar,
    };
  };

  // Carousel state for "BEST THIS MONTH"
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  // Dynamic Placements with fallback
  const top3Assigned = articles.filter((a) => a.placement === 'top3');
  const hero1 = top3Assigned[0] || getArt('enterprise-ai-reshapes-global-supply-chain-logistics');
  const hero2 = top3Assigned[1] || getArt('the-rise-of-fractional-executives-in-modern-workforce');
  const hero3 = top3Assigned[2] || getArt('how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams');

  // Latest News dynamic assignments: strictly pull placement === 'latest-news' OR category === 'News'
  const explicitLatest = articles.filter(
    (a) =>
      a.placement === 'latest-news' ||
      a.category?.toLowerCase() === 'news' ||
      a.category?.toLowerCase() === 'latest news' ||
      a.tag?.toLowerCase() === 'news'
  );

  const defaultLatestFallbacks = [
    getArt('space-agencies-plan-joint-lunar-exploration-mission'),
    getArt('interview-sarah-chen-on-building-ai-native-operating-systems'),
    getArt('programmatic-brand-storytelling-in-the-age-of-algorithmic-feeds'),
    getArt('corporate-treasuries-diversify-into-green-infrastructure-bonds'),
  ];

  const latestPool = [
    ...explicitLatest,
    ...defaultLatestFallbacks.filter((fb) => !explicitLatest.some((l) => l.id === fb.id || l.slug === fb.slug)),
  ];

  const newsMain = latestPool[0] || defaultLatestFallbacks[0];
  const newsRightTop = latestPool[1] || defaultLatestFallbacks[1];
  const newsRightBottom = latestPool[2] || defaultLatestFallbacks[2];
  const newsRightBottom2 = latestPool[3] || defaultLatestFallbacks[3];

  // Best This Month dynamic assignments: strictly placement === 'best-month'
  const bestAssigned = articles.filter((a) => a.placement === 'best-month');
  const bestThisMonthArticles = bestAssigned.length > 0 ? bestAssigned : [
    getArt('how-bootstrapped-b2b-saas-startups-are-reaching-10m-arr-with-lean-teams'),
    getArt('interview-sarah-chen-on-building-ai-native-operating-systems'),
  ];

  const currentBestArticle = bestThisMonthArticles[carouselIndex] || bestThisMonthArticles[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // Fetch dynamic categories on mount
  const [categories, setCategories] = useState<any[]>([]);

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

  return (
    <div className="w-full space-y-16">
      {/* ========================================================================= */}
      {/* 0. HERO 3-GRID: LEFT TOP 10 + CENTER HERO LEAD + RIGHT INTERVIEW SLIDER   */}
      {/* ========================================================================= */}
      <HeroSection3Grid articles={articles} heroLeadArticle={hero1} />

      {/* ========================================================================= */}
      {/* 1. LATEST NEWS                                                            */}
      {/* ========================================================================= */}
      <section id="latest-news" className="w-full border-b border-[#211d1d]/20 pb-8">
        <div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
            LATEST NEWS
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
          >
            <span>Full Editorial Archive</span>
            <span className="text-base leading-none">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Big Lead Story (7 cols) */}
          <div className="lg:col-span-7 group flex flex-col lg:border-r lg:border-[#211d1d]/20 lg:pr-8">
            <Link
              href={`/news/${newsMain.slug}`}
              className="block overflow-hidden relative aspect-[16/11] mb-4 bg-[#eff0e0]"
            >
              <Image
                src={newsMain.image}
                alt={newsMain.title}
                fill
                priority
                className="object-cover transition-opacity duration-300"
              />
            </Link>
            <div className="flex items-center space-x-1.5 text-xs text-[#575757] font-sans mb-1.5">
              <span className="text-[#002b5c] font-bold text-sm leading-none">•</span>
              <span className="font-serif italic text-[13px] text-[#575757]">
                {newsMain.tag || newsMain.category}
              </span>
            </div>
            <Link href={`/news/${newsMain.slug}`}>
              <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-medium tracking-wide text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mb-3">
                {newsMain.title}
              </h3>
            </Link>
            <p className="font-sans text-xs sm:text-sm text-[#575757] leading-relaxed mb-4 line-clamp-3">
              {newsMain.excerpt}
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[#211d1d]/10">
              <div className="text-[11px] font-serif text-[#575757]">
                {newsMain.date}
              </div>
            </div>
          </div>

          {/* Right Column: Top Horizontal + Bottom 2-Col Grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            {/* Top: Horizontal Card */}
            <div className="group flex items-start space-x-6 pb-6 border-b border-[#211d1d]/20 mb-6">
              <Link
                href={`/news/${newsRightTop.slug}`}
                className="w-[40%] aspect-square relative flex-shrink-0 bg-[#eff0e0] overflow-hidden"
              >
                <Image
                  src={newsRightTop.image}
                  alt={newsRightTop.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#575757] font-sans">
                    <span className="text-[#002b5c] font-bold text-sm leading-none">•</span>
                    <span className="font-serif italic text-[13px] text-[#575757]">
                      {newsRightTop.tag || newsRightTop.category}
                    </span>
                  </div>
                  <Link href={`/news/${newsRightTop.slug}`}>
                    <h4 className="font-oswald text-[18px] sm:text-[22px] font-medium tracking-wide text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-2">
                      {newsRightTop.title}
                    </h4>
                  </Link>
                  <div className="text-[12px] font-serif italic text-[#575757] mt-1">
                    {newsRightTop.date}
                  </div>
                </div>
                <Link
                  href={`/news/${newsRightTop.slug}`}
                  className="inline-block text-[12px] font-serif italic text-[#002b5c] hover:text-[#f7413e] transition-colors font-medium mt-3"
                >
                  Read more
                </Link>
              </div>
            </div>

            {/* Bottom Grid: 2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bottom Left Card */}
              <div className="group flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-[#211d1d]/20 pb-6 sm:pb-0 sm:pr-6 h-full">
                <div>
                  <Link
                    href={`/news/${newsRightBottom.slug}`}
                    className="block overflow-hidden relative aspect-[4/3] mb-3 bg-[#eff0e0]"
                  >
                    <Image
                      src={newsRightBottom.image}
                      alt={newsRightBottom.title}
                      fill
                      className="object-cover transition-opacity duration-300"
                    />
                  </Link>
                  <div className="flex items-center space-x-1.5 text-xs text-[#575757] font-sans">
                    <span className="text-[#002b5c] font-bold text-sm leading-none">•</span>
                    <span className="font-serif italic text-[13px] text-[#575757]">
                      {newsRightBottom.tag || newsRightBottom.category}
                    </span>
                  </div>
                  <Link href={`/news/${newsRightBottom.slug}`}>
                    <h4 className="font-oswald text-[15px] sm:text-[17px] font-medium tracking-wide text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-2">
                      {newsRightBottom.title}
                    </h4>
                  </Link>
                </div>
                <Link
                  href={`/news/${newsRightBottom.slug}`}
                  className="inline-block text-[12px] font-serif italic text-[#002b5c] hover:text-[#f7413e] transition-colors font-medium mt-2"
                >
                  Read more
                </Link>
              </div>

              {/* Bottom Right Card */}
              <div className="group flex flex-col justify-between sm:pl-6 h-full">
                <div>
                  <Link
                    href={`/news/${newsRightBottom2.slug}`}
                    className="block overflow-hidden relative aspect-[4/3] mb-3 bg-[#eff0e0]"
                  >
                    <Image
                      src={newsRightBottom2.image}
                      alt={newsRightBottom2.title}
                      fill
                      className="object-cover transition-opacity duration-300"
                    />
                  </Link>
                  <div className="flex items-center space-x-1.5 text-xs text-[#575757] font-sans">
                    <span className="text-[#002b5c] font-bold text-sm leading-none">•</span>
                    <span className="font-serif italic text-[13px] text-[#575757]">
                      {newsRightBottom2.tag || newsRightBottom2.category}
                    </span>
                  </div>
                  <Link href={`/news/${newsRightBottom2.slug}`}>
                    <h4 className="font-oswald text-[15px] sm:text-[17px] font-medium tracking-wide text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-2">
                      {newsRightBottom2.title}
                    </h4>
                  </Link>
                </div>
                <Link
                  href={`/news/${newsRightBottom2.slug}`}
                  className="inline-block text-[12px] font-serif italic text-[#002b5c] hover:text-[#f7413e] transition-colors font-medium mt-2"
                >
                  Read more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORY SECTIONS */}
      {categories
        .filter((cat) => cat.isVisible !== false)
        .map((cat) => (
          <CategorySection key={cat.slug} cat={cat} articles={articles} />
        ))}

      {/* ========================================================================= */}
      {/* 9. BEST THIS MONTH (Interactive Carousel Card)                            */}
      {/* ========================================================================= */}
      <section id="best-this-month" className="w-full pt-4 border-b border-[#211d1d]/20 pb-8">
        <div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
          <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
            Best This Month
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
          >
            <span>Editorial Archive</span>
            <span className="text-base leading-none">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#fefdf3] border border-[#211d1d]/20 p-6 sm:p-8 relative">
          {/* Left: Large Image (5 cols) */}
          <Link
            href={`/news/${currentBestArticle.slug}`}
            className="lg:col-span-5 block overflow-hidden relative aspect-[4/3] bg-[#eff0e0]"
          >
            <Image
              src={currentBestArticle.image}
              alt={currentBestArticle.title}
              fill
              className="object-cover transition-opacity duration-300"
            />
          </Link>

          {/* Right: Article Details + Carousel Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                {currentBestArticle.tag}
              </span>
              <Link href={`/news/${currentBestArticle.slug}`}>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] hover:text-[#f7413e] transition-colors leading-tight mt-2 mb-3">
                  {currentBestArticle.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] leading-relaxed mb-6 max-w-xl">
                {currentBestArticle.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757]">
                {currentBestArticle.date}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-[#211d1d]/10">
              <button
                onClick={() =>
                  setCarouselIndex((prev) =>
                    prev === 0 ? bestThisMonthArticles.length - 1 : prev - 1
                  )
                }
                className="w-8 h-8 bg-[#211d1d] hover:bg-[#f7413e] text-[#fefdf3] flex items-center justify-center rounded-none transition-colors"
                aria-label="Previous article"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCarouselIndex((prev) =>
                    prev === bestThisMonthArticles.length - 1 ? 0 : prev + 1
                  )
                }
                className="w-8 h-8 bg-[#211d1d] hover:bg-[#f7413e] text-[#fefdf3] flex items-center justify-center rounded-none transition-colors"
                aria-label="Next article"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. NEWSLETTER DISPATCH BANNER                                            */}
      {/* ========================================================================= */}
      <section className="w-full bg-white dark:bg-[#1a1d26] text-[#211d1d] dark:text-[#fefdf3] p-8 sm:p-12 text-center relative overflow-hidden border border-[#211d1d]/15 dark:border-white/10 shadow-xs">
        <div className="max-w-2xl mx-auto relative z-10">
          <Mail className="w-8 h-8 text-[#f7413e] mx-auto mb-3 animate-bounce" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#f7413e] font-bold">
            Weekly Editorial Briefing
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 text-[#211d1d] dark:text-[#fefdf3]">
            Curated Journalism Delivered Directly
          </h3>
          <p className="text-xs sm:text-sm text-[#575757] dark:text-[#eff0e0]/80 leading-relaxed mb-6 font-sans">
            Join over 45,000 discerning readers receiving our weekly digest of original reporting, investigative cultural essays, and global industry intelligence.
          </p>

          {newsletterSubscribed ? (
            <div className="bg-emerald-50 dark:bg-[#f7413e]/20 border border-emerald-500 dark:border-[#f7413e] p-4 text-sm text-emerald-800 dark:text-[#fefdf3] flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#f7413e]" />
              <span>Thank you for subscribing! Your briefing will arrive every Friday.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="bg-[#faf8f2] dark:bg-[#111318] text-[#211d1d] dark:text-[#fefdf3] border border-[#211d1d]/20 dark:border-white/20 px-4 py-3 text-xs rounded-none focus:outline-none focus:ring-2 focus:ring-[#f7413e] flex-1 font-sans placeholder:text-[#575757]/60 dark:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-[#f7413e] hover:bg-[#d92d2a] text-[#fefdf3] font-oswald text-xs uppercase px-6 py-3 font-bold tracking-widest transition-colors rounded-none cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

// =========================================================================
// DYNAMIC CATEGORY SECTION DISPATCHER COMPONENT
// =========================================================================
function CategorySection({ cat, articles }: { cat: any; articles: Article[] }) {
  // Filter articles in this category case-insensitively (checking category, subcategory, and tag)
  const categoryArticles = articles.filter((art) => {
    const normArtCat = (art.category || '').toLowerCase().trim().replace(/[-\s]/g, '');
    const normArtSub = (art.subcategory || '').toLowerCase().trim().replace(/[-\s]/g, '');
    const normCatSlug = (cat.slug || '').toLowerCase().trim().replace(/[-\s]/g, '');
    const normCatName = (cat.name || '').toLowerCase().trim().replace(/[-\s]/g, '');
    
    return (
      normArtCat === normCatSlug ||
      normArtCat === normCatName ||
      normArtSub === normCatSlug ||
      normArtSub === normCatName
    );
  }).map((art) => ({
    ...art,
    image: art.image ? art.image.replace(/&amp;/g, '&') : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    authorAvatar: art.authorAvatar ? art.authorAvatar.replace(/&amp;/g, '&') : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
  }));

  // If there are 0 articles, hide the section entirely
  if (categoryArticles.length === 0) {
    return null;
  }

  const layout = cat.layout || 'world-layout';

  // Section Header with red direct link to archive
  const renderHeader = () => (
    <div className="flex items-end justify-between pb-2 border-b border-gray-200 dark:border-white/20 mb-6">
      <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
        {cat.name}
      </h2>
      <Link
        href={`/news?category=${cat.slug}`}
        className="inline-flex items-center space-x-1 text-xs sm:text-sm font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider"
      >
        <span>Explore {cat.name} Archive</span>
        <span className="text-base leading-none">→</span>
      </Link>
    </div>
  );

  // =========================================================================
  // 0. TOP - LIST: EDITORIAL POWER INDEX (TOP 10 FULL SHOWCASE)
  // =========================================================================
  if (cat.slug === 'top-list' || cat.slug === 'top10' || cat.name?.toLowerCase().includes('top - list')) {
    const top10Articles = categoryArticles.slice(0, 10);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        
        {/* Top 10 Power Index Grid: 2 Columns of 5 Rows each for extreme readability & compact height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
          {/* Column 1: Ranks 01 to 05 */}
          <div className="space-y-3">
            {top10Articles.slice(0, 5).map((art, idx) => (
              <div
                key={art.slug}
                className="flex items-center gap-3.5 p-3 bg-white dark:bg-[#151922] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all group shadow-2xs"
              >
                {/* Big Rank Number Badge */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#211d1d] dark:bg-white text-white dark:text-black group-hover:bg-[#f7413e] group-hover:text-white transition-colors flex items-center justify-center font-oswald text-sm sm:text-base font-bold shrink-0">
                  0{idx + 1}
                </div>

                {/* Compact Thumbnail */}
                <Link
                  href={`/news/${art.slug}`}
                  className="w-20 sm:w-24 h-16 sm:h-18 relative shrink-0 overflow-hidden bg-[#eff0e0] dark:bg-[#222] border border-[#211d1d]/10 dark:border-white/10"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                </Link>

                {/* Content Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[#575757] dark:text-gray-400 mb-0.5">
                    <span className="uppercase text-[#f7413e] font-bold">
                      {art.tag || art.category}
                    </span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{art.date}</span>
                  </div>
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="font-oswald text-sm sm:text-[15px] font-medium text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-1 mb-1">
                      {art.title}
                    </h4>
                  </Link>
                  <p className="font-sans text-[11px] sm:text-xs text-[#575757] dark:text-gray-300 line-clamp-1">
                    {art.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Ranks 06 to 10 */}
          <div className="space-y-3">
            {top10Articles.slice(5, 10).map((art, idx) => {
              const actualRank = idx + 6;
              return (
                <div
                  key={art.slug}
                  className="flex items-center gap-3.5 p-3 bg-white dark:bg-[#151922] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all group shadow-2xs"
                >
                  {/* Big Rank Number Badge */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#eff0e0] dark:bg-white/10 text-[#211d1d] dark:text-gray-200 group-hover:bg-[#f7413e] group-hover:text-white transition-colors flex items-center justify-center font-oswald text-sm sm:text-base font-bold shrink-0">
                    {actualRank < 10 ? `0${actualRank}` : actualRank}
                  </div>

                  {/* Compact Thumbnail */}
                  <Link
                    href={`/news/${art.slug}`}
                    className="w-20 sm:w-24 h-16 sm:h-18 relative shrink-0 overflow-hidden bg-[#eff0e0] dark:bg-[#222] border border-[#211d1d]/10 dark:border-white/10"
                  >
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover transition-opacity duration-300"
                    />
                  </Link>

                  {/* Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-[#575757] dark:text-gray-400 mb-0.5">
                      <span className="uppercase text-[#f7413e] font-bold">
                        {art.tag || art.category}
                      </span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{art.date}</span>
                    </div>
                    <Link href={`/news/${art.slug}`}>
                      <h4 className="font-oswald text-sm sm:text-[15px] font-medium text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-1 mb-1">
                        {art.title}
                      </h4>
                    </Link>
                    <p className="font-sans text-[11px] sm:text-xs text-[#575757] dark:text-gray-300 line-clamp-1">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 10 Power Index Strip */}
        <div className="mt-4 p-3 bg-[#faf8f2] dark:bg-[#111318] border border-[#211d1d]/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2 text-[#211d1d] dark:text-gray-300">
            <span className="text-[#f7413e] font-bold">🏆 EDITORIAL POWER INDEX:</span>
            <span className="text-gray-600 dark:text-gray-400">Complete 10-tier global enterprise rankings &amp; institutional leaderboards.</span>
          </div>
          <Link
            href={`/news?category=top-list`}
            className="text-[#f7413e] hover:underline font-bold uppercase tracking-wider shrink-0 flex items-center space-x-1"
          >
            <span>Explore All 10 Rankings</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    );
  }

  // =========================================================================
  // A. OPINION & COMMENTARY CUSTOM COMPACT SECTION
  // =========================================================================
  if (cat.slug === 'opinion') {
    const leadOpinion = categoryArticles[0];
    const otherOpinions = categoryArticles.slice(1, 4);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Lead Essay (7 Cols): Compact Horizontal Layout */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 bg-[#faf8f2] dark:bg-[#151922] border border-[#211d1d]/15 dark:border-white/10 group">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#f7413e] font-bold mb-2">
                <span>Featured Column</span>
                <span>•</span>
                <span>{leadOpinion.tag || 'Executive Essay'}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-3">
                <Link
                  href={`/news/${leadOpinion.slug}`}
                  className="w-full sm:w-44 h-36 relative shrink-0 bg-[#eff0e0] dark:bg-[#222] overflow-hidden border border-[#211d1d]/10 dark:border-white/10"
                >
                  <Image
                    src={leadOpinion.image}
                    alt={leadOpinion.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/news/${leadOpinion.slug}`}>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mb-2">
                      {leadOpinion.title}
                    </h3>
                  </Link>
                  <p className="font-sans text-xs text-[#575757] dark:text-gray-300 leading-relaxed line-clamp-3">
                    {leadOpinion.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Pullquote Card */}
              <div className="bg-white dark:bg-[#1c2230] border-l-2 border-[#f7413e] p-3 mt-3 text-xs italic font-serif text-[#211d1d] dark:text-gray-200">
                “{leadOpinion.excerpt ? leadOpinion.excerpt.slice(0, 140) + '...' : 'Thought leadership and strategic analysis from leaders shaping global enterprise.'}”
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#211d1d]/10 dark:border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                <Image
                  src={leadOpinion.authorAvatar}
                  alt={leadOpinion.author}
                  width={24}
                  height={24}
                  className="rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <span className="font-medium text-[#0a0a0a] dark:text-white font-serif">{leadOpinion.author}</span>
                <span className="text-gray-400">•</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{leadOpinion.authorRole || 'Contributor'}</span>
              </div>
              <Link
                href={`/news/${leadOpinion.slug}`}
                className="text-xs font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e] transition-colors font-semibold"
              >
                Read Essay →
              </Link>
            </div>
          </div>

          {/* Right Column (5 Cols): Secondary Stacked Columns */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
            {otherOpinions.map((art, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white dark:bg-[#171b26] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#575757] dark:text-gray-400 mb-1">
                    <span className="text-[#f7413e] font-bold uppercase">{art.tag || 'Perspective'}</span>
                    <span>{art.readTime || '4 min read'}</span>
                  </div>
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                  </Link>
                </div>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#211d1d]/10 dark:border-white/10 text-[11px]">
                  <span className="font-serif italic text-gray-600 dark:text-gray-400">By {art.author}</span>
                  <Link href={`/news/${art.slug}`} className="font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e]">
                    Read →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // B. RETAIL & COMMERCE CUSTOM COMPACT SECTION
  // =========================================================================
  if (cat.slug === 'retail') {
    const displayList = categoryArticles.slice(0, 3);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {displayList.map((art, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between p-4 bg-[#faf8f2] dark:bg-[#151922] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all"
            >
              <div>
                <Link
                  href={`/news/${art.slug}`}
                  className="block overflow-hidden relative w-full h-[160px] sm:h-[175px] mb-3 bg-[#eff0e0] dark:bg-[#202020]"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono uppercase px-2 py-0.5 font-bold">
                      {art.tag || 'Retail Tech'}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center space-x-1 text-[11px] font-mono text-[#f7413e] font-bold mb-1">
                  <span>MARKET PULSE</span>
                </div>

                <Link href={`/news/${art.slug}`}>
                  <h3 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                </Link>
                <p className="font-sans text-xs text-[#575757] dark:text-gray-300 line-clamp-2 leading-relaxed mb-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#211d1d]/10 dark:border-white/10 text-[11px]">
                <span className="font-serif italic text-[#575757] dark:text-gray-400">{art.date}</span>
                <Link href={`/news/${art.slug}`} className="font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e] font-semibold">
                  Read Report →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Retail Sector Pulse Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-[#161a24] border border-[#211d1d]/10 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <span className="text-[#f7413e] font-bold">🏷️ Flagship Tech:</span>
            <span className="truncate">Luxury boutiques deploy spatial styling lounges</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#f7413e] font-bold">⚡ Micro-Hubs:</span>
            <span className="truncate">Autonomous urban sub-30 min order replenishment</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#f7413e] font-bold">📈 DTC Ownership:</span>
            <span className="truncate">+42% revenue shift to proprietary VIP commerce apps</span>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // C. HOSPITALITY & TRAVEL CUSTOM COMPACT SECTION
  // =========================================================================
  if (cat.slug === 'hospitality') {
    const leadHosp = categoryArticles[0];
    const sideHosp = categoryArticles.slice(1, 3);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-5">
          {/* Left Feature Destination Card (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-4 bg-[#faf8f2] dark:bg-[#151922] border border-[#211d1d]/15 dark:border-white/10 group">
            <div>
              <Link
                href={`/news/${leadHosp.slug}`}
                className="block overflow-hidden relative w-full h-[180px] sm:h-[195px] mb-3 bg-[#eff0e0] dark:bg-[#202020]"
              >
                <Image
                  src={leadHosp.image}
                  alt={leadHosp.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-2">
                  <span className="bg-[#f7413e] text-white text-[10px] font-mono uppercase px-2 py-0.5 font-bold shadow-xs">
                    Curated Destination
                  </span>
                  <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 font-semibold">
                    ★★★★★ Ultra-Luxury
                  </span>
                </div>
              </Link>
              <span className="text-[11px] font-mono uppercase text-[#575757] dark:text-gray-400 font-semibold">
                📍 {leadHosp.tag || 'Luxury Travel'}
              </span>
              <Link href={`/news/${leadHosp.slug}`}>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-2">
                  {leadHosp.title}
                </h3>
              </Link>
              <p className="font-sans text-xs text-[#575757] dark:text-gray-300 line-clamp-2 leading-relaxed">
                {leadHosp.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#211d1d]/10 dark:border-white/10 text-xs">
              <span className="font-serif italic text-gray-500 dark:text-gray-400">By {leadHosp.author} • {leadHosp.date}</span>
              <Link href={`/news/${leadHosp.slug}`} className="font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e] font-semibold">
                Explore Destination →
              </Link>
            </div>
          </div>

          {/* Right Two Horizontal Destination Cards (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {sideHosp.map((art, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch gap-4 p-4 bg-white dark:bg-[#161a24] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all group flex-1"
              >
                <Link
                  href={`/news/${art.slug}`}
                  className="w-full sm:w-44 h-36 sm:h-auto relative shrink-0 bg-[#eff0e0] dark:bg-[#202020] overflow-hidden"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono uppercase px-1.5 py-0.5">
                      {art.tag || 'Hideaway'}
                    </span>
                  </div>
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#f7413e] font-bold uppercase">
                      📍 Destination Report
                    </span>
                    <Link href={`/news/${art.slug}`}>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mt-0.5 mb-1.5">
                        {art.title}
                      </h4>
                    </Link>
                    <p className="font-sans text-[11px] text-[#575757] dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#211d1d]/10 dark:border-white/10 text-[11px] mt-2">
                    <span className="font-serif italic text-gray-500 dark:text-gray-400">{art.date}</span>
                    <Link href={`/news/${art.slug}`} className="font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e] font-medium">
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitality Intelligence Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-[#161a24] border border-[#211d1d]/10 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <span className="text-[#f7413e] font-bold">✈️ Private Corridors:</span>
            <span className="truncate">Sovereign biometric sky-lounges expand worldwide</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#f7413e] font-bold">🌿 Eco-Retreats:</span>
            <span className="truncate">100% off-grid solar and geothermal desert architecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#f7413e] font-bold">🍽️ Haute Cuisine:</span>
            <span className="truncate">Michelin-standard farm-to-table culinary residences</span>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // 1. World & News Layout (Hero banner on top + cards below)
  // =========================================================================
  if (layout === 'world-layout' || layout === 'news-layout') {
    const featured = categoryArticles[0];
    const subArticles = categoryArticles.slice(1, 4);
    
    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        {/* Top Wide Featured Banner with controlled height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-[#211d1d]/20 dark:border-white/15 mb-6 group items-center">
          <Link
            href={`/news/${featured.slug}`}
            className="lg:col-span-6 block overflow-hidden relative w-full h-[200px] sm:h-[220px] bg-[#eff0e0] dark:bg-[#202020]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-opacity duration-300"
            />
          </Link>
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-mono uppercase font-semibold text-[#575757] dark:text-gray-400">
              {featured.tag || featured.category}
            </span>
            <Link href={`/news/${featured.slug}`}>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-2">
                {featured.title}
              </h3>
            </Link>
            <p className="font-sans text-xs sm:text-sm text-[#575757] dark:text-gray-300 leading-relaxed mb-3 line-clamp-2">
              {featured.excerpt}
            </p>
            <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400">
              {featured.date}
            </div>
          </div>
        </div>

        {/* Bottom Cards Row if more articles exist */}
        {subArticles.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, subArticles.length)} gap-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25 dark:divide-white/15`}>
            {subArticles.map((col, idx) => (
              <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-6 md:pb-0' : idx === 1 ? 'py-6 md:py-0 md:px-6' : 'pt-6 md:pt-0 md:pl-6'}`}>
                <Link
                  href={`/news/${col.slug}`}
                  className="block overflow-hidden relative w-full h-[150px] sm:h-[165px] mb-3 bg-[#eff0e0] dark:bg-[#202020]"
                >
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                </Link>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#575757] dark:text-gray-400 font-semibold">
                    {col.tag || col.category}
                  </span>
                  <Link href={`/news/${col.slug}`}>
                    <h4 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5 line-clamp-2">
                      {col.title}
                    </h4>
                  </Link>
                  <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400 mt-1.5">
                    {col.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // =========================================================================
  // 2. Tech / Innovation / Technology / Start Up layout (Split list + Right lead)
  // =========================================================================
  if (layout === 'tech-layout') {
    if (categoryArticles.length === 1) {
      const art = categoryArticles[0];
      return (
        <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
          {renderHeader()}
          <div className="group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <Link
              href={`/news/${art.slug}`}
              className="lg:col-span-6 block overflow-hidden relative w-full h-[180px] sm:h-[200px] bg-[#eff0e0] dark:bg-[#202020]"
            >
              <Image
                src={art.image}
                alt={art.title}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </Link>
            <div className="lg:col-span-6">
              <span className="text-xs font-mono uppercase text-[#575757] dark:text-gray-400 font-semibold">
                {art.tag || art.category}
              </span>
              <Link href={`/news/${art.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-2">
                  {art.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] dark:text-gray-300 line-clamp-2 mb-3">
                {art.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400">
                {art.date}
              </div>
            </div>
          </div>
        </section>
      );
    }

    const sideArticles = categoryArticles.slice(0, 2);
    const mainLead = categoryArticles[2] || categoryArticles[0];

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#211d1d]/20 dark:divide-white/15">
          <div className="lg:col-span-5 space-y-3 divide-y divide-[#211d1d]/15 dark:divide-white/10 pb-4 lg:pb-0">
            {sideArticles.map((art, idx) => (
              <div key={idx} className={`${idx === 0 ? 'pt-0' : 'pt-3'} group flex items-start space-x-3`}>
                <Link
                  href={`/news/${art.slug}`}
                  className="w-20 h-20 relative shrink-0 bg-[#eff0e0] dark:bg-[#202020] overflow-hidden"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                </Link>
                <div className="flex-1">
                  <span className="text-[10px] font-mono uppercase text-[#575757] dark:text-gray-400">
                    {art.tag || art.category}
                  </span>
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                  </Link>
                  <div className="text-[11px] font-serif italic text-[#575757] dark:text-gray-400 mt-0.5">
                    {art.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 lg:pl-6 group flex flex-col justify-between">
            <Link
              href={`/news/${mainLead.slug}`}
              className="block overflow-hidden relative w-full h-[180px] sm:h-[200px] mb-3 bg-[#eff0e0] dark:bg-[#202020]"
            >
              <Image
                src={mainLead.image}
                alt={mainLead.title}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </Link>
            <div>
              <span className="text-xs font-mono uppercase text-[#575757] dark:text-gray-400 font-semibold">
                {mainLead.tag || mainLead.category}
              </span>
              <Link href={`/news/${mainLead.slug}`}>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-1.5">
                  {mainLead.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] dark:text-gray-300 line-clamp-2 mb-2">
                {mainLead.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400">
                {mainLead.date}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // 3. Business / Real Estate / Lifestyle layout
  // =========================================================================
  if (layout === 'business-layout' || layout === 'lifestyle-layout') {
    const displayList = categoryArticles.slice(0, 3);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, displayList.length)} gap-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/20 dark:divide-white/15`}>
          {displayList.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-4 md:pb-0' : idx === 1 ? 'py-4 md:py-0 md:px-6' : 'pt-4 md:pt-0 md:pl-6'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative w-full h-[160px] sm:h-[180px] mb-3 bg-[#eff0e0] dark:bg-[#202020]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
              </Link>
              <div>
                <span className="text-xs font-mono uppercase text-[#575757] dark:text-gray-400 font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-1.5 line-clamp-2">
                    {art.title}
                  </h3>
                </Link>
                <p className="font-sans text-xs text-[#575757] dark:text-gray-300 line-clamp-2 mb-2">
                  {art.excerpt}
                </p>
                <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400">
                  {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================================================================
  // 4. Default / Culture / Health (Compact 3-Column Grid)
  // =========================================================================
  const displayList = categoryArticles.slice(0, 3);

  return (
    <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
      {renderHeader()}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, displayList.length)} gap-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/20 dark:divide-white/15`}>
        {displayList.map((art, idx) => (
          <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-4 md:pb-0' : idx === 1 ? 'py-4 md:py-0 md:px-6' : 'pt-4 md:pt-0 md:pl-6'}`}>
            <Link
              href={`/news/${art.slug}`}
              className="block overflow-hidden relative w-full h-[155px] sm:h-[170px] mb-3 bg-[#eff0e0] dark:bg-[#202020]"
            >
              <Image
                src={art.image}
                alt={art.title}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] dark:text-gray-400 font-semibold">
                {art.tag || art.category}
              </span>
              <Link href={`/news/${art.slug}`}>
                <h3 className="font-serif text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-1.5 line-clamp-2">
                  {art.title}
                </h3>
              </Link>
              <p className="font-sans text-xs text-[#575757] dark:text-gray-300 line-clamp-2 mb-2">
                {art.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400">
                {art.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
