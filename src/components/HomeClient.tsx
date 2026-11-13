'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AmbientImage from '@/components/AmbientImage';
import ArticleCard from '@/components/ArticleCard';
import HorizontalSlideTrack from '@/components/HorizontalSlideTrack';
import { ARTICLES } from '@/data/articles';
import { getBlogUrl } from '@/lib/blogUrl';
import { getCleanPlainExcerpt } from '@/lib/linkify';
import { Article, CategoryInfo } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import HeroSection3Grid from '@/components/HeroSection3Grid';

interface HomeClientProps {
  initialArticles?: Article[];
  initialCategories?: CategoryInfo[];
}

const getPlainExcerpt = (art: Article): string =>
  getCleanPlainExcerpt(
    null,
    art.excerpt,
    art.content || (Array.isArray(art.paragraphs) ? art.paragraphs[0] : '')
  ) || art.title;

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export default function HomeClient({ initialArticles, initialCategories }: HomeClientProps = {}) {
  const [articles, setArticles] = useState<Article[]>(
    initialArticles && initialArticles.length > 0 ? initialArticles : ARTICLES
  );

  // Fetch lightweight article summaries only if not supplied by server
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) return;
    fetch('/api/articles?summary=1')
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
  }, [initialArticles]);

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

  // Guarantee 4 distinct, non-duplicate articles for Latest News
  const selectedLatest: Article[] = [];
  const usedSlugs = new Set<string>();

  // Add explicit latest articles first
  for (const art of explicitLatest) {
    if (art && art.slug && !usedSlugs.has(art.slug)) {
      usedSlugs.add(art.slug);
      selectedLatest.push(art);
    }
  }

  // If fewer than 4, fill with remaining distinct articles from `articles`
  for (const art of articles) {
    if (selectedLatest.length >= 4) break;
    if (art && art.slug && !usedSlugs.has(art.slug)) {
      usedSlugs.add(art.slug);
      selectedLatest.push(art);
    }
  }

  // Prioritize UAE Space Programme as newsMain if present
  const uaeSpace = selectedLatest.find((a) => a.slug === 'uae-space-programme-rashid-rover-hope-probe');
  if (uaeSpace && selectedLatest[0]?.slug !== 'uae-space-programme-rashid-rover-hope-probe') {
    const idx = selectedLatest.indexOf(uaeSpace);
    if (idx > 0) {
      const temp = selectedLatest[0];
      selectedLatest[0] = uaeSpace;
      selectedLatest[idx] = temp;
    }
  }

  const newsMain = selectedLatest[0] || articles[0];
  const newsRightTop = selectedLatest[1] || articles[1] || articles[0];
  const newsRightBottom = selectedLatest[2] || articles[2] || articles[0];
  const newsRightBottom2 = selectedLatest[3] || articles[3] || articles[0];
  const extraLatestSlides = chunkArray(selectedLatest.slice(4), 6);

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

  // Fetch dynamic categories on mount only if not pre-supplied by server
  const [categories, setCategories] = useState<any[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : []
  );

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;
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
  }, [initialCategories]);

  return (
    <div className="w-full space-y-16">
      {/* ========================================================================= */}
      {/* 0. HERO 3-GRID: LEFT TOP 10 + CENTER HERO LEAD + RIGHT INTERVIEW SLIDER   */}
      {/* ========================================================================= */}
      <HeroSection3Grid articles={articles} heroLeadArticle={hero1} />

      {/* ========================================================================= */}
      {/* 1. LATEST NEWS                                                            */}
      {/* ========================================================================= */}
      <section id="latest-news" className="w-full border-b border-[#211d1d]/15 dark:border-white/15 pb-7">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#211d1d]/15 dark:border-white/15 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-7 bg-[#f7413e] rounded-xs inline-block" />
            <h2 className="font-bebas text-3xl sm:text-4xl lg:text-[42px] font-normal uppercase tracking-wider text-[#0a0a0a] dark:text-white leading-none">
              LATEST NEWS
            </h2>
            <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-widest text-[#575757] dark:text-gray-400 border-l border-[#211d1d]/20 dark:border-white/20 pl-2.5">
              Fresh Dispatches
            </span>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center space-x-1.5 text-xs font-oswald uppercase text-[#f7413e] hover:text-black dark:hover:text-white font-bold tracking-wider transition-colors"
          >
            <span>Full Editorial Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HorizontalSlideTrack
          ariaLabel="Latest News dispatches"
          className="grid grid-flow-col auto-cols-[100%] gap-6 items-stretch"
        >
          <div className="snap-start grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Left Column: Balanced Featured Lead Dispatch (6 cols) */}
            <article className="lg:col-span-6 group flex flex-col justify-between bg-white dark:bg-[#1a1a1a] border border-[#211d1d]/15 dark:border-white/15 rounded-xs p-3.5 shadow-2xs">
              <div className="flex-1 flex flex-col">
                <Link
                  href={getBlogUrl(newsMain)}
                  className="block overflow-hidden relative w-full aspect-[3/2] max-h-[300px] mb-3 rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                >
                  <AmbientImage
                    src={newsMain.image}
                    alt={newsMain.title}
                    priority
                    sizes="(max-width: 1024px) 100vw, 560px"
                  >
                    <div className="absolute top-2 left-2 z-20 flex items-center space-x-1 pointer-events-none">
                      <span className="bg-[#f7413e] text-white text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs shadow-xs">
                        Lead News
                      </span>
                      <span className="bg-black/85 text-white text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs shadow-xs">
                        {newsMain.tag || newsMain.category}
                      </span>
                    </div>
                    {newsMain.readTime && (
                      <span className="absolute bottom-2 right-2 z-20 bg-black/80 text-white text-[9.5px] font-mono px-1.5 py-0.5 rounded-xs pointer-events-none">
                        {newsMain.readTime}
                      </span>
                    )}
                  </AmbientImage>
                </Link>

                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#575757] dark:text-gray-400 mb-1.5">
                  <span className="text-[#f7413e] font-bold text-sm leading-none">•</span>
                  <span className="font-semibold uppercase tracking-wide">
                    {newsMain.tag || newsMain.category}
                  </span>
                </div>

                <Link href={getBlogUrl(newsMain)}>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mb-2">
                    {newsMain.title}
                  </h3>
                </Link>

                <p className="font-sans text-xs sm:text-[13px] text-[#575757] dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                  {getPlainExcerpt(newsMain)}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 border-t border-[#211d1d]/10 dark:border-white/10">
                <span className="text-[11px] font-mono text-[#575757] dark:text-gray-400 truncate">
                  By {newsMain.author} • {newsMain.date}
                </span>
                <Link
                  href={getBlogUrl(newsMain)}
                  className="shrink-0 inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10.5px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xs transition-all shadow-2xs"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>

            {/* Right Column: Compact Horizontal Feature + Balanced 2-Card Row (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-4">
              {/* Top: Horizontal Card */}
              <article className="group bg-white dark:bg-[#1a1a1a] border border-[#211d1d]/15 dark:border-white/15 rounded-xs p-3 shadow-2xs flex flex-col sm:flex-row gap-3.5 items-stretch">
                <Link
                  href={getBlogUrl(newsRightTop)}
                  className="w-full sm:w-[42%] aspect-[3/2] relative flex-shrink-0 overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                >
                  <AmbientImage
                    src={newsRightTop.image}
                    alt={newsRightTop.title}
                    sizes="(max-width: 640px) 100vw, 240px"
                  >
                    {newsRightTop.readTime && (
                      <span className="absolute bottom-1.5 right-1.5 z-20 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-xs pointer-events-none">
                        {newsRightTop.readTime}
                      </span>
                    )}
                  </AmbientImage>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5 text-[10.5px] font-mono text-[#575757] dark:text-gray-400">
                      <span className="text-[#f7413e] font-bold text-sm leading-none">•</span>
                      <span className="uppercase font-semibold tracking-wide">
                        {newsRightTop.tag || newsRightTop.category}
                      </span>
                    </div>
                    <Link href={getBlogUrl(newsRightTop)}>
                      <h4 className="font-serif text-base sm:text-[17px] font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-1.5 line-clamp-2">
                        {newsRightTop.title}
                      </h4>
                    </Link>
                    <p className="font-sans text-xs text-[#575757] dark:text-gray-300 leading-relaxed line-clamp-2 mb-2">
                      {getPlainExcerpt(newsRightTop)}
                    </p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-[#211d1d]/10 dark:border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-mono text-[#575757] dark:text-gray-400 truncate">
                      {newsRightTop.date}
                    </span>
                    <Link
                      href={getBlogUrl(newsRightTop)}
                      className="shrink-0 inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs transition-all shadow-2xs"
                    >
                      <span>Read more</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>

              {/* Bottom Grid: 2 Matched Framed Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {[newsRightBottom, newsRightBottom2].map((art, cardIdx) => (
                  <article
                    key={`${art.slug}-${cardIdx}`}
                    className="group bg-white dark:bg-[#1a1a1a] border border-[#211d1d]/15 dark:border-white/15 rounded-xs p-3 shadow-2xs flex flex-col justify-between h-full"
                  >
                    <div className="flex-1 flex flex-col">
                      <Link
                        href={getBlogUrl(art)}
                        className="block overflow-hidden relative aspect-[3/2] mb-2.5 rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                      >
                        <AmbientImage
                          src={art.image}
                          alt={art.title}
                          sizes="(max-width: 640px) 100vw, 260px"
                        >
                          <span className="absolute top-1.5 left-1.5 z-20 bg-black/80 text-white text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs pointer-events-none">
                            {art.tag || art.category}
                          </span>
                          {art.readTime && (
                            <span className="absolute bottom-1.5 right-1.5 z-20 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-xs pointer-events-none">
                              {art.readTime}
                            </span>
                          )}
                        </AmbientImage>
                      </Link>

                      <Link href={getBlogUrl(art)}>
                        <h4 className="font-serif text-[15px] sm:text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mb-1.5 line-clamp-2">
                          {art.title}
                        </h4>
                      </Link>

                      <p className="font-sans text-xs text-[#575757] dark:text-gray-300 leading-relaxed line-clamp-2 mb-2.5">
                        {getPlainExcerpt(art)}
                      </p>
                    </div>

                    <div className="mt-auto pt-2 border-t border-[#211d1d]/10 dark:border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[10.5px] font-mono text-[#575757] dark:text-gray-400 truncate">
                        {art.date}
                      </span>
                      <Link
                        href={getBlogUrl(art)}
                        className="shrink-0 inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs transition-all shadow-2xs"
                      >
                        <span>Read more</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {extraLatestSlides.map((slideGroup, slideIdx) => (
            <div
              key={`latest-slide-${slideIdx}`}
              className="snap-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
            >
              {slideGroup.map((art) => (
                <ArticleCard key={art.slug} article={art} variant="standard" />
              ))}
            </div>
          ))}
        </HorizontalSlideTrack>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#fefdf3] dark:bg-[#181818] border border-[#211d1d]/20 dark:border-white/15 p-6 sm:p-8 relative">
          {/* Left: Large Image (5 cols) */}
          <Link
            href={getBlogUrl(currentBestArticle)}
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
              <Link href={getBlogUrl(currentBestArticle)}>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] dark:text-white hover:text-[#f7413e] dark:hover:text-[#f7413e] transition-colors leading-tight mt-2 mb-3">
                  {currentBestArticle.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] dark:text-gray-300 leading-relaxed mb-6 max-w-xl">
                {getPlainExcerpt(currentBestArticle)}
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs font-serif italic text-[#575757] dark:text-gray-400">
                  {currentBestArticle.date}
                </div>
                <Link
                  href={getBlogUrl(currentBestArticle)}
                  className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-white dark:text-black dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] dark:hover:text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-all shadow-xs"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-[#211d1d]/10 dark:border-white/10">
              <button
                onClick={() =>
                  setCarouselIndex((prev) =>
                    prev === 0 ? bestThisMonthArticles.length - 1 : prev - 1
                  )
                }
                className="w-8 h-8 bg-[#211d1d] dark:bg-white/10 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[#fefdf3] dark:text-white flex items-center justify-center rounded-none transition-colors"
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
                className="w-8 h-8 bg-[#211d1d] dark:bg-white/10 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[#fefdf3] dark:text-white flex items-center justify-center rounded-none transition-colors"
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
  // 0. TOP - LIST: EDITORIAL POWER INDEX (3 Left + 3 Right per view, Slidable)
  // =========================================================================
  if (cat.slug === 'top-list' || cat.slug === 'top10' || cat.name?.toLowerCase().includes('top - list')) {
    const topListArticles: Article[] = [];
    const seenSlugs = new Set<string>();

    const normalizeImg = (art: Article): Article => ({
      ...art,
      image: art.image ? art.image.replace(/&amp;/g, '&') : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
      authorAvatar: art.authorAvatar ? art.authorAvatar.replace(/&amp;/g, '&') : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    });

    // 1. Primary Top - List category articles first
    for (const art of categoryArticles) {
      if (art?.slug && !seenSlugs.has(art.slug)) {
        seenSlugs.add(art.slug);
        topListArticles.push(art);
      }
    }

    // 2. Supplement with placement === 'top10' articles
    const top10Placed = [...articles]
      .filter((a) => a?.placement === 'top10' && !a.excludeFromPopularPosts)
      .sort((a, b) => (b.top10VisitCount || b.viewsCount || 0) - (a.top10VisitCount || a.viewsCount || 0));
    for (const art of top10Placed) {
      if (art?.slug && !seenSlugs.has(art.slug)) {
        seenSlugs.add(art.slug);
        topListArticles.push(normalizeImg(art));
      }
    }

    // 3. Ensure at least 6 items so Left (01-03) & Right (04-06) columns stay full
    if (topListArticles.length < 6) {
      const topRankedFallback = [...articles]
        .filter((a) => a?.slug && !a.excludeFromPopularPosts && !seenSlugs.has(a.slug))
        .sort((a, b) => (b.top10VisitCount || b.viewsCount || 0) - (a.top10VisitCount || a.viewsCount || 0));
      for (const art of topRankedFallback) {
        if (topListArticles.length >= 6) break;
        seenSlugs.add(art.slug);
        topListArticles.push(normalizeImg(art));
      }
    }

    // Split strictly into columns of 3 items: 01-03 Left, 04-06 Right, 07-09 / 10-12+ Slidable
    const topColumns = chunkArray(topListArticles, 3);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}

        <HorizontalSlideTrack
          ariaLabel={`${cat.name} power index`}
          className="grid grid-flow-col auto-cols-[100%] lg:auto-cols-[calc((100%-24px)/2)] gap-6 items-start"
        >
          {topColumns.map((colItems, colIdx) => (
            <div key={`toplist-col-${colIdx}`} className="snap-start space-y-3">
              {colItems.map((art, rowIdx) => {
                const actualRank = colIdx * 3 + rowIdx + 1;
                const rankLabel = actualRank < 10 ? `0${actualRank}` : String(actualRank);
                const isLeadColumn = colIdx === 0;
                return (
                  <div
                    key={art.slug}
                    className="flex items-center gap-3.5 p-3 bg-white dark:bg-[#151922] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all group shadow-2xs"
                  >
                    {/* Big Rank Number Badge */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 ${
                        isLeadColumn
                          ? 'bg-[#211d1d] dark:bg-white text-white dark:text-black'
                          : 'bg-[#eff0e0] dark:bg-white/10 text-[#211d1d] dark:text-gray-200'
                      } group-hover:bg-[#f7413e] group-hover:text-white transition-colors flex items-center justify-center font-oswald text-sm sm:text-base font-bold shrink-0`}
                    >
                      {rankLabel}
                    </div>

                    {/* Compact Thumbnail */}
                    <Link
                      href={getBlogUrl(art)}
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
                      <Link href={getBlogUrl(art)}>
                        <h4 className="font-oswald text-sm sm:text-[15px] font-medium text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-1 mb-1">
                          {art.title}
                        </h4>
                      </Link>
                      <p className="font-sans text-[11px] sm:text-xs text-[#575757] dark:text-gray-300 line-clamp-1">
                        {getPlainExcerpt(art)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </HorizontalSlideTrack>

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
  // A. OPINION & COMMENTARY CUSTOM COMPACT SECTION (Slidable when > 4)
  // =========================================================================
  if (cat.slug === 'opinion') {
    const leadOpinion = categoryArticles[0];
    const otherOpinions = categoryArticles.slice(1, 4);
    const extraOpinionSlides = chunkArray(categoryArticles.slice(4), 3);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
        {renderHeader()}
        <HorizontalSlideTrack
          ariaLabel="Opinion commentary essays"
          className="grid grid-flow-col auto-cols-[100%] gap-6 items-stretch"
        >
          <div className="snap-start grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
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
                    href={getBlogUrl(leadOpinion)}
                    className="w-full sm:w-52 aspect-[3/2] relative shrink-0 overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10"
                  >
                    <AmbientImage
                      src={leadOpinion.image}
                      alt={leadOpinion.title}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={getBlogUrl(leadOpinion)}>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mb-2">
                        {leadOpinion.title}
                      </h3>
                    </Link>
                    <p className="font-sans text-xs text-[#575757] dark:text-gray-300 leading-relaxed line-clamp-3">
                      {getPlainExcerpt(leadOpinion)}
                    </p>
                  </div>
                </div>

                {/* Author & Pullquote Card */}
                <div className="bg-white dark:bg-[#1c2230] border-l-2 border-[#f7413e] p-3 mt-3 text-xs italic font-serif text-[#211d1d] dark:text-gray-200">
                  “{getPlainExcerpt(leadOpinion).slice(0, 140) ? getPlainExcerpt(leadOpinion).slice(0, 140) + '...' : 'Thought leadership and strategic analysis from leaders shaping global enterprise.'}”
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
                  href={getBlogUrl(leadOpinion)}
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
                    <Link href={getBlogUrl(art)}>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#0a0a0a] dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#211d1d]/10 dark:border-white/10 text-[11px]">
                    <span className="font-serif italic text-gray-600 dark:text-gray-400">By {art.author}</span>
                    <Link href={getBlogUrl(art)} className="inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all shadow-xs">
                      <span>Read</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {extraOpinionSlides.map((slideGroup, slideIdx) => (
            <div
              key={`opinion-slide-${slideIdx}`}
              className="snap-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
            >
              {slideGroup.map((art) => (
                <ArticleCard key={art.slug} article={art} variant="standard" />
              ))}
            </div>
          ))}
        </HorizontalSlideTrack>
      </section>
    );
  }

  // =========================================================================
  // Standardized Category Card Track (Uniform 3-Column Card Width, Slidable R->L)
  // Renders 3 full columns per viewport without visible sliders or scrollbars;
  // additional cards slide horizontally right-to-left when overflow occurs.
  // =========================================================================
  return (
    <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 dark:border-white/15 pb-8 scroll-mt-20">
      {renderHeader()}
      <HorizontalSlideTrack
        ariaLabel={`${cat.name} stories`}
        className={`grid grid-flow-col ${
          categoryArticles.length === 1
            ? 'auto-cols-[100%] sm:auto-cols-[calc((100%-24px)/2)] lg:auto-cols-[calc((100%-48px)/3)]'
            : 'auto-cols-[88%] sm:auto-cols-[calc((100%-24px)/2)] lg:auto-cols-[calc((100%-48px)/3)]'
        } gap-6 items-stretch`}
      >
        {categoryArticles.map((art) => (
          <div key={art.slug} className="snap-start h-full">
            <ArticleCard article={art} variant="standard" />
          </div>
        ))}
      </HorizontalSlideTrack>
    </section>
  );
}
