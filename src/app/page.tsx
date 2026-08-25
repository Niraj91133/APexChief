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

  const getArt = (slug: string) => {
    const art = articles.find((a) => a.slug === slug || a.id === slug);
    if (!art) {
      return {
        slug,
        title: 'Article Not Found',
        category: 'News',
        tag: 'News',
        author: 'Unknown',
        date: 'Jun 28, 2026',
        excerpt: 'Content not found.',
        image: 'https://framerusercontent.com/images/87UsHGxJX2wRJHjboqDkwSmqS8.jpg',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
      };
    }
    
    // Unescape &amp; in image/avatar URLs
    const cleanImage = art.image ? art.image.replace(/&amp;/g, '&') : '';
    const cleanAvatar = art.authorAvatar ? art.authorAvatar.replace(/&amp;/g, '&') : '';

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

  const bestThisMonthArticles = [
    getArt('adventure-tourism-continues-growing-among-young-travelers'),
    getArt('train-travel-sees-renewed-popularity-across-europe'),
  ];

  const currentBestArticle = bestThisMonthArticles[carouselIndex];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const hero1 = getArt('street-photography-exhibitions-gain-growing-public-attention');
  const hero2 = getArt('plant-based-diets-continue-gaining-mainstream-popularity');
  const hero3 = getArt('voice-cloning-technology-raises-new-ethical-questions');

  // Latest News articles
  const newsMain = getArt('space-agencies-plan-joint-lunar-exploration-mission');
  const newsRightTop = getArt('smart-city-projects-expand-across-major-regions');
  const newsRightBottom = getArt('independent-bookstores-experience-surprising-sales-revival');

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
      {/* 0. TOP 3-STORY FEATURE SECTION (Above "Latest News")                       */}
      {/* ========================================================================= */}
      <section className="w-full pb-8 border-b border-[#211d1d]/20">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/20">
          {/* Card 1 (Left) */}
          <div className="md:pr-6 pb-6 md:pb-0 flex flex-col justify-between group">
            <Link
              href={`/news/${hero1.slug}`}
              className="block overflow-hidden relative aspect-square mb-3 bg-[#eff0e0]"
            >
              <Image
                src={hero1.image}
                alt={hero1.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#575757] font-semibold">
                {hero1.tag || hero1.category}
              </span>
              <Link href={`/news/${hero1.slug}`}>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1">
                  {hero1.title}
                </h3>
              </Link>
              <div className="text-xs font-serif italic text-[#575757] mt-2">
                By {hero1.author} • {hero1.date}
              </div>
            </div>
          </div>

          {/* Card 2 (Center) */}
          <div className="md:px-6 py-6 md:py-0 flex flex-col justify-between group">
            <div className="mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#575757] font-semibold">
                {hero2.tag || hero2.category}
              </span>
              <Link href={`/news/${hero2.slug}`}>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1">
                  {hero2.title}
                </h3>
              </Link>
              <div className="text-xs font-serif italic text-[#575757] mt-2">
                By {hero2.author} • {hero2.date}
              </div>
            </div>
            <Link
              href={`/news/${hero2.slug}`}
              className="block overflow-hidden relative aspect-square bg-[#eff0e0]"
            >
              <Image
                src={hero2.image}
                alt={hero2.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Card 3 (Right) */}
          <div className="md:pl-6 pt-6 md:pt-0 flex flex-col justify-between group">
            <Link
              href={`/news/${hero3.slug}`}
              className="block overflow-hidden relative aspect-square mb-3 bg-[#eff0e0]"
            >
              <Image
                src={hero3.image}
                alt={hero3.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#575757] font-semibold">
                {hero3.tag || hero3.category}
              </span>
              <Link href={`/news/${hero3.slug}`}>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1">
                  {hero3.title}
                </h3>
              </Link>
              <div className="text-xs font-serif italic text-[#575757] mt-2">
                By {hero3.author} • {hero3.date}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. LATEST NEWS                                                            */}
      {/* ========================================================================= */}
      <section id="latest-news" className="w-full border-b border-[#211d1d]/20 pb-8">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          Latest News
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Big Lead Story (7 cols) */}
          <div className="lg:col-span-7 group flex flex-col">
            <Link
              href={`/news/${newsMain.slug}`}
              className="block overflow-hidden relative aspect-[16/11] mb-4 bg-[#eff0e0]"
            >
              <Image
                src={newsMain.image}
                alt={newsMain.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-xs font-mono uppercase font-semibold text-[#575757]">
                {newsMain.tag || newsMain.category}
              </span>
              <Link href={`/news/${newsMain.slug}`}>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-2">
                  {newsMain.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] leading-relaxed mb-3">
                {newsMain.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757]">
                By {newsMain.author} • {newsMain.date}
              </div>
            </div>
          </div>

          {/* Right Column: Top Horizontal + Bottom 2-Col Grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            {/* Top: Horizontal Card */}
            <div className="group flex items-start space-x-4 border-b border-[#211d1d]/15 pb-5">
              <div className="flex-1">
                <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                  {newsRightTop.tag || newsRightTop.category}
                </span>
                <Link href={`/news/${newsRightTop.slug}`}>
                  <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5 line-clamp-3">
                    {newsRightTop.title}
                  </h4>
                </Link>
                <Link
                  href={`/news/${newsRightTop.slug}`}
                  className="inline-block text-[11px] font-mono text-[#211d1d] font-bold hover:underline mt-1.5"
                >
                  Read more →
                </Link>
              </div>
              <Link
                href={`/news/${newsRightTop.slug}`}
                className="w-24 h-24 relative flex-shrink-0 bg-[#eff0e0] overflow-hidden"
              >
                <Image
                  src={newsRightTop.image}
                  alt={newsRightTop.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Bottom Grid: 2 Cards */}
            <div className="grid grid-cols-2 gap-4 pt-5">
              {/* Promo Card: Blue Promo Card */}
              <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#002b5c] to-[#001733] text-[#faf8f2] p-4 flex flex-col justify-between border border-[#211d1d]/15">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#eff0e0]/70">
                  Special Edition
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#faf8f2] leading-snug">
                    Explore Weekly In-Depth Dispatches
                  </h4>
                  <Link
                    href="/news"
                    className="inline-block mt-2 bg-[#faf8f2] text-[#002b5c] hover:bg-[#f7413e] hover:text-[#faf8f2] text-[10px] font-oswald uppercase px-3 py-1 font-bold tracking-wider rounded transition-colors"
                  >
                    Read Archive
                  </Link>
                </div>
              </div>

              {/* Bottom Right: Bookstore Story */}
              <div className="group flex flex-col justify-between">
                <Link
                  href={`/news/${newsRightBottom.slug}`}
                  className="block overflow-hidden relative aspect-[4/3] mb-2 bg-[#eff0e0] border border-[#211d1d]/10"
                >
                  <Image
                    src={newsRightBottom.image}
                    alt={newsRightBottom.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#575757] font-semibold">
                    {newsRightBottom.tag || newsRightBottom.category}
                  </span>
                  <Link href={`/news/${newsRightBottom.slug}`}>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mt-0.5">
                      {newsRightBottom.title}
                    </h4>
                  </Link>
                </div>
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
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          Best This Month
        </h2>

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
              className="object-cover transition-transform duration-500 hover:scale-105"
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
                By {currentBestArticle.author} • {currentBestArticle.date}
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
    </div>
  );
}

// =========================================================================
// DYNAMIC CATEGORY SECTION DISPATCHER COMPONENT
// =========================================================================
function CategorySection({ cat, articles }: { cat: any; articles: Article[] }) {
  // Filter articles in this category case-insensitively
  const categoryArticles = articles.filter((art) => {
    const normArtCat = art.category.toLowerCase().trim();
    const normCatName = cat.name.toLowerCase().trim();
    const normCatSlug = cat.slug.toLowerCase().trim();
    
    if (normCatSlug === 'ai' || normCatSlug === 'ai-news' || normCatName === 'ai news') {
      return normArtCat.includes('ai') || normArtCat.includes('artificial');
    }
    return normArtCat === normCatName || normArtCat === normCatSlug;
  });

  // If there are 0 articles, hide the section entirely
  if (categoryArticles.length === 0) {
    return null;
  }

  // Get articles safe getter helper (falls back to placeholder if out of range)
  const getArtAt = (index: number): Article => {
    if (index < categoryArticles.length) {
      const art = categoryArticles[index];
      const cleanImage = art.image ? art.image.replace(/&amp;/g, '&') : 'https://framerusercontent.com/images/87UsHGxJX2wRJHjboqDkwSmqS8.jpg';
      const cleanAvatar = art.authorAvatar ? art.authorAvatar.replace(/&amp;/g, '&') : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300';
      return {
        ...art,
        image: cleanImage,
        authorAvatar: cleanAvatar
      };
    }
    // Return dummy article matching style
    return {
      id: `dummy-${cat.slug}-${index}`,
      slug: '#',
      title: 'Publication Pending',
      category: cat.name,
      tag: cat.name,
      date: 'Jun 28, 2026',
      author: 'Staff Writer',
      authorRole: 'Editorial Staff',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
      image: 'https://framerusercontent.com/images/87UsHGxJX2wRJHjboqDkwSmqS8.jpg',
      readTime: '2 min read',
      excerpt: 'More stories and editorial features in this section are currently being composed for publication.',
      paragraphs: [],
      sections: []
    };
  };

  const layout = cat.layout || 'world-layout';

  // Render correct layout structure
  if (layout === 'world-layout') {
    const featured = getArtAt(0);
    const col1 = getArtAt(1);
    const col2 = getArtAt(2);
    const col3 = getArtAt(3);
    
    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        {/* Top Wide Featured Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-[#211d1d]/20 mb-6 group items-center">
          <Link
            href={`/news/${featured.slug}`}
            className="lg:col-span-6 block overflow-hidden relative aspect-[16/10] bg-[#eff0e0]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-mono uppercase font-semibold text-[#575757]">
              {featured.tag || featured.category}
            </span>
            <Link href={`/news/${featured.slug}`}>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-3">
                {featured.title}
              </h3>
            </Link>
            <p className="font-sans text-xs sm:text-sm text-[#575757] leading-relaxed mb-4">
              {featured.excerpt}
            </p>
            <div className="text-xs font-serif italic text-[#575757]">
              By {featured.author} • {featured.date}
            </div>
          </div>
        </div>
        {/* Bottom 3-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {[col1, col2, col3].map((col, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-6 md:pb-0' : idx === 1 ? 'py-6 md:py-0 md:px-6' : 'pt-6 md:pt-0 md:pl-6'}`}>
              <Link
                href={`/news/${col.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                  {col.tag || col.category}
                </span>
                <Link href={`/news/${col.slug}`}>
                  <h4 className="font-serif text-base font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                    {col.title}
                  </h4>
                </Link>
                <div className="text-xs font-serif italic text-[#575757] mt-1.5">
                  By {col.author} • {col.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'tech-layout') {
    const left1 = getArtAt(0);
    const left2 = getArtAt(1);
    const left3 = getArtAt(2);
    const center = getArtAt(3);
    const right = getArtAt(4);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#211d1d]/20">
          {/* Left Column (3 Horizontal List Cards) - 4 cols */}
          <div className="lg:col-span-4 space-y-4 divide-y divide-[#211d1d]/15 pb-6 lg:pb-0">
            {[left1, left2, left3].map((art, idx) => (
              <div key={idx} className={`${idx === 0 ? 'pt-3 first:pt-0' : 'pt-4'} group flex items-start space-x-3`}>
                <Link
                  href={`/news/${art.slug}`}
                  className="w-24 h-24 relative flex-shrink-0 bg-[#eff0e0] overflow-hidden"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1">
                  <span className="text-[10px] font-mono uppercase text-[#575757] font-semibold">
                    {art.tag || art.category}
                  </span>
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mt-0.5">
                      {art.title}
                    </h4>
                  </Link>
                  <div className="text-[10px] font-serif italic text-[#575757] mt-1">
                    By {art.author}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Column: Big Image Feature - 5 cols */}
          <div className="lg:col-span-5 group flex flex-col justify-between py-6 lg:py-0 lg:px-6">
            <Link
              href={`/news/${center.slug}`}
              className="block overflow-hidden relative aspect-[16/11] mb-3 bg-[#eff0e0]"
            >
              <Image
                src={center.image}
                alt={center.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {center.tag || center.category}
              </span>
              <Link href={`/news/${center.slug}`}>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-2">
                  {center.title}
                </h3>
              </Link>
              <p className="font-sans text-xs text-[#575757] line-clamp-2 leading-relaxed">
                {center.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757] mt-3">
                By {center.author} • {center.date}
              </div>
            </div>
          </div>

          {/* Right Column: Medium Image Feature - 3 cols */}
          <div className="lg:col-span-3 group flex flex-col justify-between pt-6 lg:pt-0 lg:pl-6">
            <Link
              href={`/news/${right.slug}`}
              className="block overflow-hidden relative aspect-[4/3] mb-3 bg-[#eff0e0]"
            >
              <Image
                src={right.image}
                alt={right.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {right.tag || right.category}
              </span>
              <Link href={`/news/${right.slug}`}>
                <h4 className="font-serif text-base font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                  {right.title}
                </h4>
              </Link>
              <p className="font-sans text-xs text-[#575757] line-clamp-2 leading-relaxed mt-1">
                {right.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757] mt-2.5">
                By {right.author} • {right.date}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'culture-layout') {
    const left1 = getArtAt(0);
    const center1 = getArtAt(1);
    const right1 = getArtAt(2);
    const left2 = getArtAt(3);
    const right2 = getArtAt(4);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-[#211d1d]/15 mb-6 divide-y lg:divide-y-0 lg:divide-x divide-[#211d1d]/20">
          <div className="lg:col-span-3 group flex flex-col justify-between pb-6 lg:pb-0">
            <Link
              href={`/news/${left1.slug}`}
              className="block overflow-hidden relative aspect-[4/3] mb-2 bg-[#eff0e0]"
            >
              <Image
                src={left1.image}
                alt={left1.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {left1.tag || left1.category}
              </span>
              <Link href={`/news/${left1.slug}`}>
                <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                  {left1.title}
                </h4>
              </Link>
              <div className="text-[11px] font-serif italic text-[#575757] mt-1">
                By {left1.author}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 group flex flex-col justify-between py-6 lg:py-0 lg:px-6">
            <Link
              href={`/news/${center1.slug}`}
              className="block overflow-hidden relative aspect-[16/9] mb-3 bg-[#eff0e0]"
            >
              <Image
                src={center1.image}
                alt={center1.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-xs font-mono uppercase text-[#575757] font-semibold">
                {center1.tag || center1.category}
              </span>
              <Link href={`/news/${center1.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1">
                  {center1.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] leading-relaxed mt-1">
                {center1.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757] mt-2">
                By {center1.author} • {center1.date}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 group flex flex-col justify-between pt-6 lg:pt-0 lg:pl-6">
            <Link
              href={`/news/${right1.slug}`}
              className="block overflow-hidden relative aspect-[4/3] mb-2 bg-[#eff0e0]"
            >
              <Image
                src={right1.image}
                alt={right1.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {right1.tag || right1.category}
              </span>
              <Link href={`/news/${right1.slug}`}>
                <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                  {right1.title}
                </h4>
              </Link>
              <div className="text-[11px] font-serif italic text-[#575757] mt-1">
                By {right1.author}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#211d1d]/20">
          <div className="lg:col-span-3 group flex flex-col justify-between pb-6 lg:pb-0">
            <Link
              href={`/news/${left2.slug}`}
              className="block overflow-hidden relative aspect-[4/3] mb-2 bg-[#eff0e0]"
            >
              <Image
                src={left2.image}
                alt={left2.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {left2.tag || left2.category}
              </span>
              <Link href={`/news/${left2.slug}`}>
                <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                  {left2.title}
                </h4>
              </Link>
              <div className="text-[11px] font-serif italic text-[#575757] mt-1">
                By {left2.author}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#faf8f2] border border-[#211d1d]/20 p-5 flex flex-col justify-center items-center text-center py-6 lg:py-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#f7413e] font-bold">
              Exclusive Dispatch
            </span>
            <h4 className="font-serif text-base font-bold text-[#0a0a0a] mt-2 max-w-sm leading-snug">
              Curated Community Showcases, Galleries & Global Cultural Reports
            </h4>
            <Link
              href="/news"
              className="mt-3.5 border border-[#211d1d] hover:bg-[#211d1d] hover:text-[#fefdf3] text-[#211d1d] font-oswald text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 transition-colors"
            >
              See All Reviews
            </Link>
          </div>

          <div className="lg:col-span-3 group flex flex-col justify-between pt-6 lg:pt-0 lg:pl-6">
            <Link
              href={`/news/${right2.slug}`}
              className="block overflow-hidden relative aspect-[4/3] mb-2 bg-[#eff0e0]"
            >
              <Image
                src={right2.image}
                alt={right2.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {right2.tag || right2.category}
              </span>
              <Link href={`/news/${right2.slug}`}>
                <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                  {right2.title}
                </h4>
              </Link>
              <div className="text-[11px] font-serif italic text-[#575757] mt-1">
                By {right2.author}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'business-layout') {
    const row1 = [getArtAt(0), getArtAt(1), getArtAt(2)];
    const row2 = [getArtAt(3), getArtAt(4), getArtAt(5)];

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-[#211d1d]/15 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {row1.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-6 md:pb-0' : idx === 1 ? 'py-6 md:py-0 md:px-6' : 'pt-6 md:pt-0 md:pl-6'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h4 className="font-serif text-base font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                    {art.title}
                  </h4>
                </Link>
                <div className="text-xs font-serif italic text-[#575757] mt-1.5">
                  By {art.author} • {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {row2.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-6 md:pb-0' : idx === 1 ? 'py-6 md:py-0 md:px-6' : 'pt-6 md:pt-0 md:pl-6'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h4 className="font-serif text-base font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                    {art.title}
                  </h4>
                </Link>
                <div className="text-xs font-serif italic text-[#575757] mt-1.5">
                  By {art.author} • {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'lifestyle-layout') {
    const main = getArtAt(0);
    const r1 = getArtAt(1);
    const r2 = getArtAt(2);
    const b1 = getArtAt(3);
    const b2 = getArtAt(4);
    const b3 = getArtAt(5);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-6 border-b border-[#211d1d]/15 mb-6">
          <div className="lg:col-span-8 group flex flex-col justify-between">
            <Link
              href={`/news/${main.slug}`}
              className="block overflow-hidden relative aspect-[16/9] mb-3 bg-[#eff0e0]"
            >
              <Image
                src={main.image}
                alt={main.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-xs font-mono uppercase text-[#575757] font-semibold">
                {main.tag || main.category}
              </span>
              <Link href={`/news/${main.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-tight mt-1 mb-2">
                  {main.title}
                </h3>
              </Link>
              <p className="font-sans text-xs sm:text-sm text-[#575757] leading-relaxed mb-3">
                {main.excerpt}
              </p>
              <div className="text-xs font-serif italic text-[#575757]">
                By {main.author} • {main.date}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 divide-y divide-[#211d1d]/15 pl-0 lg:pl-6 lg:border-l border-[#211d1d]/20">
            {[r1, r2].map((art, idx) => (
              <div key={idx} className={`${idx === 0 ? 'pt-0' : 'pt-4'} group flex flex-col justify-between`}>
                <Link
                  href={`/news/${art.slug}`}
                  className="block overflow-hidden relative aspect-[16/10] mb-2 bg-[#eff0e0]"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#575757] font-semibold">
                    {art.tag || art.category}
                  </span>
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mt-0.5">
                      {art.title}
                    </h4>
                  </Link>
                  <div className="text-[10px] font-serif italic text-[#575757] mt-1">
                    By {art.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {[b1, b2, b3].map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-6 md:pb-0' : idx === 1 ? 'py-6 md:py-0 md:px-6' : 'pt-6 md:pt-0 md:pl-6'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-2 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2 mt-0.5">
                    {art.title}
                  </h4>
                </Link>
                <div className="text-[10px] font-serif italic text-[#575757] mt-1.5">
                  By {art.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'travel-layout') {
    const col1 = getArtAt(0);
    const col2 = getArtAt(1);
    const col3 = getArtAt(2);

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 flex flex-col divide-y divide-[#211d1d]/15 pr-0 lg:pr-8">
            {[col1, col2, col3].map((art, idx) => (
              <div key={idx} className={`${idx === 0 ? 'pb-6' : idx === 1 ? 'py-6' : 'pt-6'} group flex flex-col sm:flex-row items-start gap-4`}>
                <Link
                  href={`/news/${art.slug}`}
                  className="w-full sm:w-48 h-36 relative flex-shrink-0 bg-[#eff0e0] overflow-hidden"
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                      {art.tag || art.category}
                    </span>
                    <Link href={`/news/${art.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="font-sans text-xs text-[#575757] line-clamp-2 leading-relaxed mt-1.5">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="text-xs font-serif italic text-[#575757] mt-3">
                    By {art.author} • {art.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 relative aspect-[9/16] max-h-[500px] w-full overflow-hidden bg-[#1f3822] border border-[#211d1d]/20 pt-6 lg:pt-0 lg:pl-8">
            <Image
              src="https://framerusercontent.com/images/sMKkUwn9argwO6dfwsjAilgVX64.jpg?width=2000&height=3395"
              alt="Green Nature / Travel Guide"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'health-layout') {
    const row1 = [getArtAt(0), getArtAt(1)];
    const row2 = [getArtAt(2), getArtAt(3), getArtAt(4), getArtAt(5)];

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-[#211d1d]/20 mb-6 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {row1.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-6 md:pb-0' : 'pt-6 md:pt-0 md:pl-8'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-xs font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-2">
                    {art.title}
                  </h3>
                </Link>
                <p className="font-sans text-xs sm:text-sm text-[#575757] line-clamp-2 leading-relaxed mb-3">
                  {art.excerpt}
                </p>
                <div className="text-xs font-serif italic text-[#575757]">
                  By {art.author} • {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {row2.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between pb-6 sm:pb-0 ${idx > 0 ? (idx === 1 ? 'sm:pl-6 sm:border-l' : idx === 2 ? 'lg:pl-6 lg:border-l' : 'sm:pl-6 sm:border-l lg:border-l') : ''} border-[#211d1d]/20`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[4/3] mb-2 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h4 className="font-serif text-sm font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5 line-clamp-2">
                    {art.title}
                  </h4>
                </Link>
                <div className="text-[11px] font-serif italic text-[#575757] mt-1">
                  By {art.author} • {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'ai-layout') {
    const row1 = [getArtAt(0), getArtAt(1)];
    const row2 = [getArtAt(2), getArtAt(3)];

    return (
      <section id={`${cat.slug}-section`} className="w-full pt-4 pb-8 scroll-mt-20">
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
          {cat.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-[#211d1d]/15 mb-8 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {row1.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-8 md:pb-0' : 'pt-8 md:pt-0 md:pl-8'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-xs font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-2">
                    {art.title}
                  </h3>
                </Link>
                <p className="font-sans text-xs sm:text-sm text-[#575757] line-clamp-2 leading-relaxed mb-3">
                  {art.excerpt}
                </p>
                <div className="text-xs font-serif italic text-[#575757]">
                  By {art.author} • {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#211d1d]/25">
          {row2.map((art, idx) => (
            <div key={idx} className={`group flex flex-col justify-between ${idx === 0 ? 'pb-8 md:pb-0' : 'pt-8 md:pt-0 md:pl-8'}`}>
              <Link
                href={`/news/${art.slug}`}
                className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
              >
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <span className="text-xs font-mono uppercase text-[#575757] font-semibold">
                  {art.tag || art.category}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-1 mb-2">
                    {art.title}
                  </h3>
                </Link>
                <p className="font-sans text-xs sm:text-sm text-[#575757] line-clamp-2 leading-relaxed mb-3">
                  {art.excerpt}
                </p>
                <div className="text-xs font-serif italic text-[#575757]">
                  By {art.author} • {art.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback grid-layout
  return (
    <section id={`${cat.slug}-section`} className="w-full pt-4 border-b border-[#211d1d]/20 pb-8 scroll-mt-20">
      <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-wider text-[#0a0a0a] pb-2 border-b border-[#211d1d]/30 mb-6">
        {cat.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryArticles.map((art) => (
          <div key={art.id} className="group flex flex-col justify-between">
            <Link
              href={`/news/${art.slug}`}
              className="block overflow-hidden relative aspect-[16/10] mb-3 bg-[#eff0e0]"
            >
              <Image
                src={art.image ? art.image.replace(/&amp;/g, '&') : ''}
                alt={art.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#575757] font-semibold">
                {art.tag || art.category}
              </span>
              <Link href={`/news/${art.slug}`}>
                <h4 className="font-serif text-base font-bold text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug mt-0.5">
                  {art.title}
                </h4>
              </Link>
              <div className="text-xs font-serif italic text-[#575757] mt-1.5">
                By {art.author} • {art.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
