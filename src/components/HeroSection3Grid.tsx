'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AmbientImage from '@/components/AmbientImage';
import { getBlogUrl } from '@/lib/blogUrl';
import { Article } from '@/types';
import { ARTICLES } from '@/data/articles';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Mic,
  X,
  Search,
} from 'lucide-react';

interface HeroSection3GridProps {
  articles: Article[];
  heroLeadArticle?: Article;
}

export default function HeroSection3Grid({
  articles,
  heroLeadArticle,
}: HeroSection3GridProps) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  const [activeTopIndex, setActiveTopIndex] = useState(0);
  const [isTopHovered, setIsTopHovered] = useState(false);

  const [isTop10ModalOpen, setIsTop10ModalOpen] = useState(false);
  const [isInterviewsModalOpen, setIsInterviewsModalOpen] = useState(false);

  const [top10Search, setTop10Search] = useState('');
  const [top10Category, setTop10Category] = useState('All');

  const [interviewSearch, setInterviewSearch] = useState('');
  const [interviewCategory, setInterviewCategory] = useState('All');

  const sourceArticles = articles && articles.length > 0 ? articles : ARTICLES;

  // 1. Collect Interview Articles
  const interviewArticles = sourceArticles.filter(
    (a) =>
      a.placement === 'interview' ||
      a.category?.toLowerCase() === 'interview' ||
      a.contentType?.toLowerCase() === 'interview' ||
      a.subcategory?.toLowerCase() === 'interviews' ||
      a.tag?.toLowerCase().includes('interview') ||
      a.title?.toLowerCase().startsWith('interview:') ||
      a.slug?.startsWith('interview-')
  );

  // Fallback default interviews if DB has none
  const fallbackInterviews: Article[] = [
    {
      id: 'interview-sarah-chen',
      slug: 'interview-sarah-chen-on-building-ai-native-operating-systems',
      title: 'Interview: Sarah Chen on Building the First AI-Native Enterprise Operating System',
      category: 'Interview',
      tag: 'Frontier AI',
      date: 'Sep 02, 2026',
      author: 'Lucas Davenport',
      authorRole: 'Editor-at-Large',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200',
      readTime: '8 min read',
      excerpt:
        'The founder of Apex Neural sits down to discuss multi-agent systems, human-computer interface design, and why desktop windows will vanish by 2030.',
      paragraphs: [
        'In our exclusive autumn feature interview, Sarah Chen breaks down the monumental shift from traditional graphical user interfaces toward intent-driven agent orchestration.',
      ],
      sections: [],
    },
    {
      id: 'interview-marcus-graham',
      slug: 'interview-venture-capitalist-marcus-graham-on-seed-stage-investing',
      title: 'Interview: Marcus Graham on Finding True Product Moats in 2026',
      category: 'Interview',
      tag: 'Venture Capital',
      date: 'Aug 26, 2026',
      author: 'Elena Rostova',
      authorRole: 'Senior Financial Editor',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200',
      readTime: '7 min read',
      excerpt:
        'General Partner at Horizon Capital discusses why wrapper products will collapse and what defensible technical architecture looks like today.',
      paragraphs: [],
      sections: [],
    },
    {
      id: 'interview-maya-lin',
      slug: 'interview-maya-lin-on-the-renaissance-of-sustainable-urban-design',
      title: 'Interview: Maya Lin on the Renaissance of Sustainable Urban Architecture',
      category: 'Interview',
      tag: 'Urban Architecture',
      date: 'Aug 19, 2026',
      author: 'Julian Vance',
      authorRole: 'Culture & Design Critic',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
      readTime: '6 min read',
      excerpt:
        'Award-winning architect Maya Lin on biophilic city masterplans, timber skyscrapers, and creating community-centric public spaces.',
      paragraphs: [],
      sections: [],
    },
    {
      id: 'interview-tariq-al-mansoori',
      slug: 'interview-tariq-al-mansoori-on-sovereign-ai-infrastructure',
      title: 'Interview: Tariq Al-Mansoori on Building Sovereign AI Computing Clusters',
      category: 'Interview',
      tag: 'Sovereign AI',
      date: 'Sep 02, 2026',
      author: 'Admin',
      authorRole: 'Middle East Bureau Chief',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
      readTime: '7 min read',
      excerpt:
        'Director of Frontier Research explains how sovereign state compute grids guarantee institutional data sovereignty.',
      paragraphs: [],
      sections: [],
    },
  ];

  const activeInterviews =
    interviewArticles.length > 0 ? interviewArticles : fallbackInterviews;

  const interviewQuotes: Record<string, { interviewee: string; role: string; quote: string }> = {
    'interview-sarah-chen-on-building-ai-native-operating-systems': {
      interviewee: 'Sarah Chen',
      role: 'Founding CEO, Apex Neural',
      quote:
        '“The next decade of computing belongs entirely to multimodal agents that execute entire multi-step business objectives directly from natural speech.”',
    },
    'interview-venture-capitalist-marcus-graham-on-seed-stage-investing': {
      interviewee: 'Marcus Graham',
      role: 'General Partner, Horizon Capital',
      quote:
        '“Thin API wrappers get compressed to zero margin within quarters. Defensible startups own proprietary workflows and closed-loop telemetry.”',
    },
    'interview-maya-lin-on-the-renaissance-of-sustainable-urban-design': {
      interviewee: 'Maya Lin',
      role: 'Principal Architect, Studio Lin',
      quote:
        '“High-density cities do not have to feel extractive—mass timber and passive microclimates turn civic towers into living ecosystems.”',
    },
    'interview-tariq-al-mansoori-on-sovereign-ai-infrastructure': {
      interviewee: 'Tariq Al-Mansoori',
      role: 'Director of Frontier Research',
      quote:
        '“Compute capacity is the new strategic reserve. Institutions that anchor model weights locally retain long-term regulatory autonomy.”',
    },
  };

  // 2. Top Ranked Stories (Top 5 hero carousel + Top 10 archive modal)
  const top10Ranked = useMemo(() => {
    const eligible = sourceArticles.filter((a) => !a.excludeFromPopularPosts);
    const ranked = [...eligible].sort((a, b) => {
      const aTop = a.placement === 'top10' ? 1 : 0;
      const bTop = b.placement === 'top10' ? 1 : 0;
      if (aTop !== bTop) return bTop - aTop;
      return (b.top10VisitCount || b.viewsCount || 0) - (a.top10VisitCount || a.viewsCount || 0);
    });
    if (heroLeadArticle && !ranked.some((r) => r.slug === heroLeadArticle.slug)) {
      ranked.unshift(heroLeadArticle);
    }
    return ranked.slice(0, 10);
  }, [sourceArticles, heroLeadArticle]);

  const heroRanked5 = top10Ranked.slice(0, 5);
  const safeTopIndex = heroRanked5.length > 0 ? activeTopIndex % heroRanked5.length : 0;
  const heroStory = heroRanked5[safeTopIndex] || heroLeadArticle || sourceArticles[0];

  const safeSliderIndex = activeInterviews.length > 0 ? sliderIndex % activeInterviews.length : 0;
  const activeInterview = activeInterviews[safeSliderIndex] || activeInterviews[0];

  const activeQuoteMeta = activeInterview ? interviewQuotes[activeInterview.slug] : undefined;

  // Auto-rotate Top Stories
  useEffect(() => {
    if (isTopHovered || heroRanked5.length <= 1 || isTop10ModalOpen) return;
    const timer = setInterval(() => {
      setActiveTopIndex((prev) => (prev + 1) % heroRanked5.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isTopHovered, heroRanked5.length, isTop10ModalOpen]);

  // Auto-rotate Interviews
  useEffect(() => {
    if (isSliderHovered || activeInterviews.length <= 1 || isInterviewsModalOpen) return;
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % activeInterviews.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isSliderHovered, activeInterviews.length, isInterviewsModalOpen]);

  const filteredTop10 = useMemo(() => {
    const q = top10Search.trim().toLowerCase();
    return top10Ranked.filter((art) => {
      const catMatch =
        top10Category === 'All' ||
        art.category?.toLowerCase() === top10Category.toLowerCase();
      if (!catMatch) return false;
      if (!q) return true;
      return (
        art.title?.toLowerCase().includes(q) ||
        art.excerpt?.toLowerCase().includes(q) ||
        art.tag?.toLowerCase().includes(q) ||
        art.category?.toLowerCase().includes(q) ||
        art.author?.toLowerCase().includes(q)
      );
    });
  }, [top10Ranked, top10Category, top10Search]);

  const filteredInterviews = useMemo(() => {
    const q = interviewSearch.trim().toLowerCase();
    return activeInterviews.filter((art) => {
      const catMatch =
        interviewCategory === 'All' ||
        (art.tag || '').toLowerCase() === interviewCategory.toLowerCase() ||
        (art.category || '').toLowerCase() === interviewCategory.toLowerCase();
      if (!catMatch) return false;
      if (!q) return true;
      const meta = interviewQuotes[art.slug];
      return (
        art.title?.toLowerCase().includes(q) ||
        art.excerpt?.toLowerCase().includes(q) ||
        art.tag?.toLowerCase().includes(q) ||
        art.author?.toLowerCase().includes(q) ||
        meta?.interviewee?.toLowerCase().includes(q) ||
        meta?.quote?.toLowerCase().includes(q)
      );
    });
  }, [activeInterviews, interviewCategory, interviewSearch]);

  if (!heroStory) return null;

  return (
    <section className="w-full pt-1 pb-4 sm:pb-6">
      {/* Main 12-Column Editorial Grid: 8 Col Top Stories Spotlight + 4 Col Executive Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* 1. LEFT COLUMN (8 Cols): TOP STORIES (3:2 Spotlight + Interactive Top 5) */}
        {/* ========================================================================= */}
        <div
          className="lg:col-span-8 flex flex-col bg-white dark:bg-[#1a1a1a] border border-[#211d1d]/15 dark:border-white/15 rounded-xs shadow-2xs overflow-hidden"
          onMouseEnter={() => setIsTopHovered(true)}
          onMouseLeave={() => setIsTopHovered(false)}
        >
          {/* Section Header Bar */}
          <div className="px-3.5 py-2 border-b border-[#211d1d]/15 dark:border-white/15 bg-[#f7f6ec] dark:bg-[#222222] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-[#f7413e] text-white flex items-center justify-center rounded-xs shadow-2xs">
                <Trophy className="w-3 h-3" />
              </span>
              <h2 className="font-oswald text-sm sm:text-base font-bold uppercase tracking-wider text-[#0a0a0a] dark:text-white">
                Top Stories
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-[#575757] dark:text-gray-300 font-semibold">
                {String(safeTopIndex + 1).padStart(2, '0')} / {String(heroRanked5.length).padStart(2, '0')}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTopIndex((prev) => (prev - 1 + heroRanked5.length) % heroRanked5.length)
                  }
                  className="p-1 border border-[#211d1d]/15 dark:border-white/15 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                  aria-label="Previous Top Story"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTopIndex((prev) => (prev + 1) % heroRanked5.length)}
                  className="p-1 border border-[#211d1d]/15 dark:border-white/15 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                  aria-label="Next Top Story"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Compact 2-Column Body so 1200x800 (3:2) Image + Text stay Visible Above the Fold */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3.5 flex-1 items-stretch">
            {/* Spotlight Lead Story: Strict 3:2 (1200x800 aspect) at Compact Width */}
            <div className="md:col-span-7 flex flex-col">
              <Link
                href={getBlogUrl(heroStory)}
                className="relative block w-full aspect-[3/2] overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10 group/img mb-2.5"
              >
                <AmbientImage
                  src={heroStory.image}
                  alt={heroStory.title}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 440px"
                >
                  <div className="absolute top-2 left-2 z-20 flex items-center space-x-1 pointer-events-none">
                    <span className="bg-[#f7413e] text-white text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs shadow-xs">
                      Rank 0{safeTopIndex + 1}
                    </span>
                    <span className="bg-black/85 text-white text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs shadow-xs">
                      {heroStory.tag || heroStory.category}
                    </span>
                  </div>
                  {heroStory.readTime && (
                    <span className="absolute bottom-2 right-2 z-20 bg-black/80 text-white text-[9.5px] font-mono px-1.5 py-0.5 rounded-xs pointer-events-none">
                      {heroStory.readTime}
                    </span>
                  )}
                </AmbientImage>
              </Link>

              <div className="flex items-center space-x-1.5 text-[10.5px] font-mono text-[#575757] dark:text-gray-400 mb-1">
                <span className="text-[#f7413e] font-bold">•</span>
                <span>{heroStory.tag || heroStory.category}</span>
                <span>•</span>
                <span>Editorial Rank #{safeTopIndex + 1}</span>
              </div>

              <Link
                href={getBlogUrl(heroStory)}
                className="font-serif font-bold text-lg sm:text-[20px] leading-snug text-[#0a0a0a] dark:text-white hover:text-[#f7413e] transition-colors line-clamp-2 mb-1"
              >
                {heroStory.title}
              </Link>

              <p className="font-sans text-xs sm:text-[13px] text-[#575757] dark:text-gray-300 leading-relaxed line-clamp-2 mb-2.5">
                {heroStory.excerpt}
              </p>

              <div className="mt-auto pt-2 border-t border-[#211d1d]/10 dark:border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-mono text-[#575757] dark:text-gray-400 truncate">
                  By {heroStory.author} • {heroStory.date}
                </span>
                <Link
                  href={getBlogUrl(heroStory)}
                  className="shrink-0 inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xs transition-colors shadow-2xs"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Interactive Top 5 Dispatches Rail */}
            <div className="md:col-span-5 flex flex-col border-t md:border-t-0 md:border-l border-[#211d1d]/10 dark:border-white/10 pt-3 md:pt-0 md:pl-3.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#575757] dark:text-gray-400 mb-2">
                <span className="font-bold text-[#0a0a0a] dark:text-gray-200">Ranked Dispatches</span>
                <span>Top {heroRanked5.length}</span>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-1.5">
                {heroRanked5.map((art, idx) => {
                  const isActive = idx === safeTopIndex;
                  return (
                    <div
                      key={art.slug}
                      onMouseEnter={() => setActiveTopIndex(idx)}
                      className={`p-2 rounded-xs border transition-colors ${
                        isActive
                          ? 'bg-[#f7f6ec] dark:bg-[#242424] border-[#f7413e]/60'
                          : 'bg-transparent border-[#211d1d]/10 dark:border-white/10 hover:bg-[#faf9f2] dark:hover:bg-[#202020]'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTopIndex(idx)}
                          className={`w-5 h-5 shrink-0 rounded-xs font-oswald text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer mt-0.5 ${
                            isActive
                              ? 'bg-[#f7413e] text-white'
                              : 'bg-[#211d1d] dark:bg-white/15 text-white'
                          }`}
                          aria-label={`Select Rank ${idx + 1}`}
                        >
                          0{idx + 1}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 text-[9.5px] font-mono uppercase text-[#575757] dark:text-gray-400">
                            <span className="text-[#f7413e] font-bold truncate">
                              {art.tag || art.category}
                            </span>
                            <span className="shrink-0">{art.readTime}</span>
                          </div>
                          <Link
                            href={getBlogUrl(art)}
                            className="font-serif font-bold text-[12.5px] leading-snug text-[#0a0a0a] dark:text-white hover:text-[#f7413e] transition-colors line-clamp-2 block mt-0.5"
                          >
                            {art.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-[#211d1d]/10 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {heroRanked5.map((art, idx) => (
                    <button
                      key={art.slug}
                      type="button"
                      onClick={() => setActiveTopIndex(idx)}
                      aria-label={`Go to story ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === safeTopIndex
                          ? 'w-4 bg-[#f7413e]'
                          : 'w-1.5 bg-[#211d1d]/20 dark:bg-white/25 hover:bg-[#f7413e]/60'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsTop10ModalOpen(true)}
                  className="inline-flex items-center space-x-1 text-[10.5px] font-mono uppercase font-bold text-[#f7413e] hover:underline cursor-pointer"
                >
                  <span>Total List</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RIGHT COLUMN (4 Cols): EXECUTIVE INTERVIEWS (Compact, Zero White Void) */}
        {/* ========================================================================= */}
        {activeInterview && (
          <div
            className="lg:col-span-4 flex flex-col bg-white dark:bg-[#1a1a1a] border border-[#211d1d]/15 dark:border-white/15 rounded-xs shadow-2xs overflow-hidden"
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
          >
            {/* Header Bar */}
            <div className="px-3.5 py-2 border-b border-[#211d1d]/15 dark:border-white/15 bg-[#f7f6ec] dark:bg-[#222222] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-[#f7413e] text-white flex items-center justify-center rounded-xs shadow-2xs">
                  <Mic className="w-3 h-3" />
                </span>
                <h2 className="font-oswald text-sm sm:text-base font-bold uppercase tracking-wider text-[#0a0a0a] dark:text-white">
                  Interviews
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-[#575757] dark:text-gray-300 font-semibold">
                  {String(safeSliderIndex + 1).padStart(2, '0')} /{' '}
                  {String(activeInterviews.length).padStart(2, '0')}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSliderIndex(
                        (prev) => (prev - 1 + activeInterviews.length) % activeInterviews.length
                      )
                    }
                    className="p-1 border border-[#211d1d]/15 dark:border-white/15 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                    aria-label="Previous Interview"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderIndex((prev) => (prev + 1) % activeInterviews.length)}
                    className="p-1 border border-[#211d1d]/15 dark:border-white/15 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                    aria-label="Next Interview"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editorial Interview Card Matching Reference Layout (Zero White Void) */}
            <div className="p-3.5 flex-1 flex flex-col">
              {/* Full-Width Top Image Box */}
              <Link
                href={getBlogUrl(activeInterview)}
                className="relative block w-full aspect-[3/2] overflow-hidden rounded-xs border border-[#211d1d]/10 dark:border-white/10 group/img mb-2.5"
              >
                <AmbientImage
                  src={activeInterview.image}
                  alt={activeInterview.title}
                  priority
                  maxZoomRatio={1.55}
                  sizes="(max-width: 1024px) 100vw, 360px"
                >
                  <span className="absolute top-2.5 left-2.5 z-20 bg-[#111111]/90 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs pointer-events-none">
                    {activeInterview.tag || 'Executive Dialogue'}
                  </span>
                  {activeInterview.readTime && (
                    <span className="absolute bottom-2.5 right-2.5 z-20 bg-[#111111]/90 text-white text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-xs pointer-events-none">
                      {activeInterview.readTime}
                    </span>
                  )}
                </AmbientImage>
              </Link>

              {/* Bullet Tag Label */}
              <div className="flex items-center space-x-1.5 text-[11.5px] font-serif italic text-[#575757] dark:text-gray-400 mb-1">
                <span className="text-[#f7413e] font-bold not-italic">•</span>
                <span>{activeInterview.tag || 'Executive Dialogue'}</span>
              </div>

              {/* Bold Condensed Title */}
              <Link
                href={getBlogUrl(activeInterview)}
                className="font-oswald font-bold text-[19px] sm:text-[21px] leading-[1.18] tracking-tight text-[#0a0a0a] dark:text-white hover:text-[#f7413e] transition-colors line-clamp-3 block mb-2.5"
              >
                {activeInterview.title}
              </Link>

              {/* Highlighted Pull Quote Box */}
              <div className="border-l-2 border-[#f7413e] bg-[#faf9ef]/70 dark:bg-[#222222] pl-3 pr-2.5 py-2 mb-3">
                <p className="font-serif italic text-[12px] text-[#211d1d] dark:text-gray-200 leading-relaxed line-clamp-3">
                  {activeQuoteMeta?.quote ||
                    `“${(Array.isArray(activeInterview.paragraphs) && activeInterview.paragraphs[0]) || activeInterview.excerpt}”`}
                </p>
                <div className="border-t border-[#211d1d]/10 dark:border-white/10 pt-1.5 mt-2 flex items-center text-[11px] truncate">
                  <span className="font-serif italic font-bold text-[#0a0a0a] dark:text-white shrink-0">
                    {activeQuoteMeta?.interviewee || activeInterview.author}
                  </span>
                  <span className="text-[#f7413e]/70 mx-1.5 font-bold">▪</span>
                  <span className="font-mono text-[10.5px] text-[#575757] dark:text-gray-400 truncate">
                    {activeQuoteMeta?.role || activeInterview.authorRole}
                  </span>
                </div>
              </div>

              {/* Anchored Dots + Compact Action Footer */}
              <div className="mt-auto flex flex-col gap-2.5">
                <div className="flex items-center justify-center space-x-1.5">
                  {activeInterviews.map((item, idx) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setSliderIndex(idx)}
                      aria-label={`Interview slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === safeSliderIndex
                          ? 'w-5 bg-[#f7413e]'
                          : 'w-1.5 bg-[#211d1d]/20 dark:bg-white/25 hover:bg-[#f7413e]/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-[#211d1d]/10 dark:border-white/10 flex items-center justify-between gap-2">
                  <Link
                    href={getBlogUrl(activeInterview)}
                    className="inline-flex items-center space-x-1.5 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xs transition-colors shadow-2xs"
                  >
                    <span>Read Dialogue</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsInterviewsModalOpen(true)}
                    className="inline-flex items-center space-x-1 text-[10.5px] font-mono uppercase font-bold text-[#f7413e] hover:underline cursor-pointer"
                  >
                    <span>Total List</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL A: TOP 10 RANKINGS TOTAL LIST (Full View with Dark Mode)          */}
      {/* ========================================================================= */}
      {isTop10ModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#fefdf3] dark:bg-[#181818] w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#211d1d] dark:border-white/20 shadow-2xl relative rounded-xs">
            <div className="p-4 sm:p-5 border-b-2 border-[#211d1d] dark:border-white/20 bg-[#f7f6ec] dark:bg-[#202020] flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="w-5 h-5 bg-[#f7413e] text-white flex items-center justify-center text-xs font-mono font-bold rounded-xs shadow-2xs">
                    <Trophy className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                    ApexChief Editorial Index
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] dark:text-white">
                  Top 10 Ranked Stories &amp; Editorial Archive
                </h2>
                <p className="text-xs text-[#575757] dark:text-gray-300 font-sans mt-0.5">
                  The most authoritative, high-impact investigations and leadership dialogues across global industries.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTop10ModalOpen(false)}
                className="p-1.5 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black border border-[#211d1d]/20 dark:border-white/20 text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 sm:px-5 border-b border-[#211d1d]/15 dark:border-white/10 bg-white dark:bg-[#1c1c1c] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#575757] dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search top ranked stories..."
                  value={top10Search}
                  onChange={(e) => setTop10Search(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fbfaf5] dark:bg-[#252525] border border-[#211d1d]/20 dark:border-white/15 text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#f7413e] rounded-xs"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Business', 'Technology', 'Leadership', 'Interview', 'Startup', 'Opinion', 'Health'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTop10Category(cat)}
                      className={`px-2.5 py-1 text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-xs ${
                        top10Category === cat
                          ? 'bg-[#f7413e] text-white shadow-2xs'
                          : 'bg-[#eff0e0] dark:bg-[#252525] text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-[#fefdf3] dark:bg-[#181818]">
              {filteredTop10.length === 0 ? (
                <div className="text-center py-12 text-[#575757] dark:text-gray-400 font-mono text-xs">
                  No ranked stories match your filter criteria.
                </div>
              ) : (
                filteredTop10.map((art, idx) => (
                  <div
                    key={art.slug}
                    className="p-3.5 bg-white dark:bg-[#202020] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group/modal-item shadow-2xs rounded-xs"
                  >
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <div className="w-8 h-8 rounded-xs bg-[#211d1d] dark:bg-white text-white dark:text-black flex items-center justify-center font-oswald text-xs font-bold shrink-0 group-hover/modal-item:bg-[#f7413e] group-hover/modal-item:text-white transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="relative w-16 h-12 rounded-xs overflow-hidden shrink-0 border border-gray-200 dark:border-white/10 hidden sm:block">
                        <AmbientImage src={art.image} alt={art.title} sizes="80px" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-[#575757] dark:text-gray-400 mb-0.5">
                          <span className="uppercase text-[#f7413e] font-bold">
                            {art.tag || art.category}
                          </span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                          <span>•</span>
                          <span>{art.date}</span>
                        </div>
                        <Link
                          href={getBlogUrl(art)}
                          onClick={() => setIsTop10ModalOpen(false)}
                          className="font-serif font-bold text-sm text-[#0a0a0a] dark:text-white group-hover/modal-item:text-[#f7413e] transition-colors leading-snug line-clamp-1 block"
                        >
                          {art.title}
                        </Link>
                        <p className="font-sans text-xs text-[#575757] dark:text-gray-300 line-clamp-1 mt-0.5">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={getBlogUrl(art)}
                      onClick={() => setIsTop10ModalOpen(false)}
                      className="shrink-0 inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-all shadow-xs"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL B: EXECUTIVE INTERVIEWS TOTAL LIST (Full View with Dark Mode)     */}
      {/* ========================================================================= */}
      {isInterviewsModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#fefdf3] dark:bg-[#181818] w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#211d1d] dark:border-white/20 shadow-2xl relative rounded-xs">
            <div className="p-4 sm:p-5 border-b-2 border-[#211d1d] dark:border-white/20 bg-[#f7f6ec] dark:bg-[#202020] flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="w-5 h-5 bg-[#f7413e] text-white flex items-center justify-center text-xs font-mono font-bold rounded-xs shadow-2xs">
                    <Mic className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                    Executive Dialogue Archives
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0a0a0a] dark:text-white">
                  Executive Dialogues &amp; Leadership Interviews
                </h2>
                <p className="text-xs text-[#575757] dark:text-gray-300 font-sans mt-0.5">
                  Exclusive in-depth conversations with global executives, venture partners, and foundational architects.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInterviewsModalOpen(false)}
                className="p-1.5 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black border border-[#211d1d]/20 dark:border-white/20 text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 sm:px-5 border-b border-[#211d1d]/15 dark:border-white/10 bg-white dark:bg-[#1c1c1c] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#575757] dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search executive interviews..."
                  value={interviewSearch}
                  onChange={(e) => setInterviewSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fbfaf5] dark:bg-[#252525] border border-[#211d1d]/20 dark:border-white/15 text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#f7413e] rounded-xs"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Frontier AI', 'Venture Capital', 'Urban Architecture', 'Sovereign AI'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInterviewCategory(cat)}
                      className={`px-2.5 py-1 text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-xs ${
                        interviewCategory === cat
                          ? 'bg-[#f7413e] text-white shadow-2xs'
                          : 'bg-[#eff0e0] dark:bg-[#252525] text-[#211d1d] dark:text-gray-300 hover:bg-[#211d1d] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-[#fefdf3] dark:bg-[#181818]">
              {filteredInterviews.length === 0 ? (
                <div className="text-center py-12 text-[#575757] dark:text-gray-400 font-mono text-xs">
                  No executive interviews match your search.
                </div>
              ) : (
                filteredInterviews.map((art) => {
                  const quoteMeta = interviewQuotes[art.slug];
                  return (
                    <div
                      key={art.slug}
                      className="p-3.5 bg-white dark:bg-[#202020] border border-[#211d1d]/15 dark:border-white/10 hover:border-[#f7413e] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group/modal-item shadow-2xs rounded-xs"
                    >
                      <div className="flex items-start space-x-3.5 min-w-0">
                        <div className="relative w-16 h-14 rounded-xs overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                          <AmbientImage src={art.image} alt={art.title} sizes="80px" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#575757] dark:text-gray-400 mb-0.5">
                            <span className="uppercase text-[#f7413e] font-bold">
                              {quoteMeta?.interviewee || art.author}
                            </span>
                            <span>•</span>
                            <span className="text-gray-400">{quoteMeta?.role || art.authorRole}</span>
                          </div>
                          <Link
                            href={getBlogUrl(art)}
                            onClick={() => setIsInterviewsModalOpen(false)}
                            className="font-serif font-bold text-sm text-[#0a0a0a] dark:text-white group-hover/modal-item:text-[#f7413e] transition-colors leading-snug line-clamp-1 block"
                          >
                            {art.title}
                          </Link>
                          {quoteMeta && (
                            <p className="font-serif italic text-xs text-[#575757] dark:text-gray-300 line-clamp-1 mt-0.5">
                              {quoteMeta.quote}
                            </p>
                          )}
                        </div>
                      </div>

                      <Link
                        href={getBlogUrl(art)}
                        onClick={() => setIsInterviewsModalOpen(false)}
                        className="shrink-0 inline-flex items-center space-x-1 bg-black text-white dark:bg-black dark:text-white dark:border dark:border-white/20 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-all shadow-xs"
                      >
                        <span>Read Dialogue</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
