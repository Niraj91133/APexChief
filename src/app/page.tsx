'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AmbientImage from '@/components/AmbientImage';
import ArticleCard from '@/components/ArticleCard';
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
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
      })
      .catch(() => {});
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
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {});
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Big Lead Story (7 cols) */}
          <div className="lg:col-span-7 group flex flex-col h-full lg:border-r lg:border-[#211d1d]/20 lg:pr-8">
            <Link
              href={`/news/${newsMain.slug}`}
              className="block overflow-hidden relative w-full aspect-[3/2] max-h-[340px] mb-4 rounded-xs"
            >
              <AmbientImage
                src={newsMain.image}
                alt={newsMain.title}
                priority
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
            <div className="flex items-center justify-between pt-3 border-t border-[#211d1d]/10">
              <div className="text-[11px] font-serif text-[#575757]">
                {newsMain.date}
              </div>
              <Link
                href={`/news/${newsMain.slug}`}
                className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-xs"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: Top Horizontal + Bottom 2-Col Grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Top: Horizontal Card */}
            <div className="group flex items-start space-x-6 pb-6 border-b border-[#211d1d]/20">
              <Link
                href={`/news/${newsRightTop.slug}`}
                className="w-[45%] aspect-[3/2] relative flex-shrink-0 overflow-hidden rounded-xs"
              >
                <AmbientImage
                  src={newsRightTop.image}
                  alt={newsRightTop.title}
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
                  className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-xs mt-3 w-fit"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3" />
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
                    className="block overflow-hidden relative aspect-[3/2] mb-3 rounded-xs"
                  >
                    <AmbientImage
                      src={newsRightBottom.image}
                      alt={newsRightBottom.title}
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
                  className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-xs mt-2 w-fit"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Bottom Right Card */}
              <div className="group flex flex-col justify-between sm:pl-6 h-full">
                <div>
                  <Link
                    href={`/news/${newsRightBottom2.slug}`}
                    className="block overflow-hidden relative aspect-[3/2] mb-3 rounded-xs"
                  >
                    <AmbientImage
                      src={newsRightBottom2.image}
                      alt={newsRightBottom2.title}
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
                  className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-xs mt-2 w-fit"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3" />
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
            className="lg:col-span-5 block overflow-hidden relative w-full aspect-[3/2] max-h-[300px] rounded-xs"
          >
            <AmbientImage
              src={currentBestArticle.image}
              alt={currentBestArticle.title}
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
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs font-serif italic text-[#575757]">
                  {currentBestArticle.date}
                </div>
                <Link
                  href={`/news/${currentBestArticle.slug}`}
                  className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-all shadow-xs"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
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
      <section className="w-full bg-[#faf8f2] dark:bg-[#151922] text-[#0a0a0a] dark:text-[#fefdf3] p-8 sm:p-12 text-center relative overflow-hidden border border-[#211d1d]/20 dark:border-white/15 shadow-xs">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-3.5 py-1 text-xs font-mono uppercase tracking-widest font-bold mb-4">
            <Mail className="w-3.5 h-3.5 text-[#f7413e]" />
            <span>Weekly Editorial Briefing</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-1 mb-3 text-[#0a0a0a] dark:text-white">
            Curated Journalism Delivered Directly
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-[#4a4a4a] dark:text-[#d1d5db] leading-relaxed mb-6 font-sans">
            Join over 45,000 discerning readers receiving our weekly digest of original reporting, investigative cultural essays, and global industry intelligence every Friday.
          </p>

          {newsletterSubscribed ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 text-emerald-800 dark:text-emerald-300 p-4 font-sans text-sm inline-flex items-center justify-center space-x-2 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">Thank you for subscribing! Your briefing will arrive every Friday.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="bg-white dark:bg-[#0d1117] text-[#0a0a0a] dark:text-white border border-[#211d1d]/30 dark:border-white/20 px-4 py-3 text-xs sm:text-sm rounded-none focus:outline-none focus:border-[#f7413e] focus:ring-1 focus:ring-[#f7413e] flex-1 font-sans placeholder:text-[#737373] dark:placeholder:text-[#9ca3af]"
              />
              <button
                type="submit"
                className="bg-[#f7413e] hover:bg-[#d92d2a] text-white font-oswald text-xs uppercase px-6 py-3 font-bold tracking-widest transition-all rounded-none cursor-pointer shadow-xs shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#211d1d]/10 dark:border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs text-[#525252] dark:text-[#a3a3a3] font-mono">
            <span>✓ Every Friday Edition</span>
            <span>✓ 100% Free &amp; No Spam</span>
            <span>✓ One-Click Unsubscribe</span>
          </div>
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
        href={`/category/${cat.slug}`}
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
                  className="w-20 sm:w-24 aspect-[3/2] relative shrink-0 overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                >
                  <AmbientImage
                    src={art.image}
                    alt={art.title}
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
                    className="w-20 sm:w-24 aspect-[3/2] relative shrink-0 overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                  >
                    <AmbientImage
                      src={art.image}
                      alt={art.title}
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
            href={`/category/top-list`}
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
                  className="w-full sm:w-52 aspect-[3/2] relative shrink-0 overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                >
                  <AmbientImage
                    src={leadOpinion.image}
                    alt={leadOpinion.title}
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
                className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-xs"
              >
                <span>Read Essay</span>
                <ArrowRight className="w-3 h-3" />
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
                  <Link href={`/news/${art.slug}`} className="inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all shadow-xs">
                    <span>Read</span>
                    <ArrowRight className="w-2.5 h-2.5" />
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
  // Standardized Category Card Grid (Uniform 3-Column Card Layout)
  // Ensures ALL category containers have identical dimensions (aspect-[3/2]).
  // Single-article categories (like Health) take 1 column (~380px) instead of 100% width.
  // =========================================================================
  const displayList = categoryArticles.slice(0, 3);

  return (
    <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
      {renderHeader()}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((art) => (
          <ArticleCard key={art.slug} article={art} variant="standard" />
        ))}
      </div>
    </section>
  );
}
