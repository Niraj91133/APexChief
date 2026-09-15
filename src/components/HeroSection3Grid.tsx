'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Mic,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HeroSection3GridProps {
  articles: Article[];
  heroLeadArticle?: Article;
}

export default function HeroSection3Grid({
  articles,
  heroLeadArticle,
}: HeroSection3GridProps) {
  // State for Interview Slider
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // State for Top 10 Active Index & Auto-Scroll Carousel
  const [activeTopIndex, setActiveTopIndex] = useState(0);
  const [isTopHovered, setIsTopHovered] = useState(false);

  // State for Top 10 Inline Extra Expand
  const [showExtraTop10, setShowExtraTop10] = useState(false);

  // State for Total List Modals
  const [isTop10ModalOpen, setIsTop10ModalOpen] = useState(false);
  const [isInterviewsModalOpen, setIsInterviewsModalOpen] = useState(false);

  // Filter & Search states for Top 10 Modal
  const [top10Search, setTop10Search] = useState('');
  const [top10Category, setTop10Category] = useState('All');

  // Filter & Search states for Interviews Modal
  const [interviewSearch, setInterviewSearch] = useState('');
  const [interviewCategory, setInterviewCategory] = useState('All');

  // 1. Collect Interview Articles
  const interviewArticles = articles.filter(
    (a) =>
      a.placement === 'interview' ||
      a.category?.toLowerCase() === 'interview' ||
      a.contentType?.toLowerCase() === 'interview' ||
      a.subcategory?.toLowerCase() === 'interviews' ||
      a.tag?.toLowerCase().includes('interview') ||
      a.title?.toLowerCase().startsWith('interview:') ||
      a.slug?.startsWith('interview-')
  );

  // Fallback default interviews if empty
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
      excerpt: 'The founder of Apex Neural sits down to discuss multi-agent systems, human-computer interface design, and why desktop windows will vanish by 2030.',
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
      excerpt: 'General Partner at Horizon Capital discusses why wrapper products will collapse and what defensible technical architecture looks like today.',
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
      excerpt: 'Award-winning architect Maya Lin on biophilic city masterplans, timber skyscrapers, and creating community-centric public spaces.',
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
      excerpt: 'Director of Frontier Research explains how sovereign state compute grids guarantee institutional data sovereignty.',
      paragraphs: [],
      sections: [],
    },
  ];

  const activeInterviews =
    interviewArticles.length > 0 ? interviewArticles : fallbackInterviews;

  // Quotes mapping for interviews
  const interviewQuotes: Record<string, { interviewee: string; role: string; quote: string }> = {
    'interview-sarah-chen-on-building-ai-native-operating-systems': {
      interviewee: 'Sarah Chen',
      role: 'Founding CEO, Apex Neural',
      quote: '“The next decade of computing belongs entirely to multimodal agents that execute entire multi-step business objectives directly from natural speech.”',
    },
    'interview-venture-capitalist-marcus-graham-on-seed-stage-investing': {
      interviewee: 'Marcus Graham',
      role: 'Managing Partner, Horizon Capital',
      quote: '“If your software value proposition can be replicated by a foundation model update over a weekend, you don’t have a startup; you have an ephemeral feature.”',
    },
    'interview-maya-lin-on-the-renaissance-of-sustainable-urban-design': {
      interviewee: 'Maya Lin',
      role: 'Principal Architect, Studio Biophilic',
      quote: '“Urban density and environmental harmony are not mutually exclusive. Biophilic design with timber and district cooling is the foundation of future civilization.”',
    },
    'interview-tariq-al-mansoori-on-sovereign-ai-infrastructure': {
      interviewee: 'Tariq Al-Mansoori',
      role: 'Frontier AI Director, ADGM Cluster',
      quote: '“We are not building data centers for today’s chatbots; we are building sovereign cognitive power plants that run national infrastructure.”',
    },
  };

  // 2. Collect Top 10 Ranked Articles (Explicit top10 first, then remaining)
  const explicitTop10 = articles.filter((a) => a.placement === 'top10');
  const otherArticles = articles.filter((a) => a.placement !== 'top10');
  const top10Ranked = [...explicitTop10, ...otherArticles].slice(0, 15);

  // Visible ranked items (5 primary or 10 if expanded)
  const visibleTopCount = showExtraTop10 ? Math.min(10, top10Ranked.length) : Math.min(5, top10Ranked.length);

  // 3. Active Story for the Featured Image Showcase
  const activeTopArticle: Article =
    top10Ranked[activeTopIndex] ||
    heroLeadArticle ||
    top10Ranked[0] || {
      id: 'default-lead',
      slug: 'enterprise-ai-reshapes-global-supply-chain-logistics',
      title: 'Enterprise AI Reshapes Global Supply Chain Logistics and Maritime Route Optimization',
      category: 'Business',
      tag: 'Supply Chain',
      date: 'Sep 02, 2026',
      author: 'Admin',
      authorRole: 'Editor',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
      readTime: '5 min read',
      excerpt: 'Multinational corporations deploy predictive neural networks to preempt supply disruptions, optimize container routes, and insulate manufacturing schedules against geopolitical shocks.',
      paragraphs: [],
      sections: [],
    };

  // Auto-advance Top 10 Featured Showcase every 5s
  useEffect(() => {
    if (isTopHovered || visibleTopCount <= 1) return;
    const interval = setInterval(() => {
      setActiveTopIndex((prev) => (prev + 1) % visibleTopCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTopHovered, visibleTopCount]);

  // Auto-advance interview slider every 6s
  useEffect(() => {
    if (isSliderHovered || activeInterviews.length <= 1) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % activeInterviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSliderHovered, activeInterviews.length]);

  // Handle ESC key for modal closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTop10ModalOpen(false);
        setIsInterviewsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentInterview =
    activeInterviews[sliderIndex] || activeInterviews[0];
  const currentQuoteData =
    interviewQuotes[currentInterview?.slug] || {
      interviewee: currentInterview?.author || 'Featured Guest',
      role: currentInterview?.authorRole || 'Executive Contributor',
      quote: `"${currentInterview?.excerpt || 'Exclusive conversation on the frontier of industry, technology, and global markets.'}"`,
    };

  // Filtered Top 10 Modal items
  const filteredTop10 = top10Ranked.filter((item) => {
    const matchesSearch =
      top10Search === '' ||
      item.title.toLowerCase().includes(top10Search.toLowerCase()) ||
      item.category.toLowerCase().includes(top10Search.toLowerCase()) ||
      item.tag?.toLowerCase().includes(top10Search.toLowerCase());
    const matchesCategory =
      top10Category === 'All' ||
      item.category.toLowerCase() === top10Category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filtered Interviews Modal items
  const filteredInterviews = activeInterviews.filter((item) => {
    const quoteMeta = interviewQuotes[item.slug];
    const matchesSearch =
      interviewSearch === '' ||
      item.title.toLowerCase().includes(interviewSearch.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(interviewSearch.toLowerCase()) ||
      quoteMeta?.interviewee.toLowerCase().includes(interviewSearch.toLowerCase()) ||
      quoteMeta?.role.toLowerCase().includes(interviewSearch.toLowerCase());
    const matchesCategory =
      interviewCategory === 'All' ||
      item.tag?.toLowerCase().includes(interviewCategory.toLowerCase()) ||
      item.category?.toLowerCase().includes(interviewCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="w-full pb-6 border-b border-[#211d1d]/20 dark:border-white/15 relative">
      {/* 2-GRID HERO SECTION (8 COLS SPOTLIGHT + COMPACT TOP 10 STRIP | 4 COLS EXECUTIVE INTERVIEWS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* 1. LEFT GRID (8 Cols): SPOTLIGHT LEAD STORY + TOP 10 STRIP                 */}
        {/* ========================================================================= */}
        <div
          className="lg:col-span-8 flex flex-col justify-between lg:border-r lg:border-[#211d1d]/20 dark:lg:border-white/20 lg:pr-8 group/herobox"
          onMouseEnter={() => setIsTopHovered(true)}
          onMouseLeave={() => setIsTopHovered(false)}
        >
          <div>
            {/* Top Indicator & Slide Controls Bar */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#211d1d]/10 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-5 h-5 bg-[#f7413e] text-white text-[11px] font-mono font-bold">
                  <Trophy className="w-3 h-3" />
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#f7413e] font-bold">
                  RANK 0{activeTopIndex + 1} OF 0{visibleTopCount}
                </span>
              </div>

              {/* Carousel Next/Prev Controls */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 font-bold mr-1">
                  0{activeTopIndex + 1}/0{visibleTopCount}
                </span>
                <button
                  onClick={() =>
                    setActiveTopIndex((prev) =>
                      prev === 0 ? visibleTopCount - 1 : prev - 1
                    )
                  }
                  className="w-6 h-6 bg-gray-100 dark:bg-[#252525] hover:bg-[#f7413e] hover:text-white text-[#211d1d] dark:text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous Ranked Article"
                  title="Previous Story"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    setActiveTopIndex((prev) => (prev + 1) % visibleTopCount)
                  }
                  className="w-6 h-6 bg-gray-100 dark:bg-[#252525] hover:bg-[#f7413e] hover:text-white text-[#211d1d] dark:text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next Ranked Article"
                  title="Next Story"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Featured Image with Reduced Compact Height */}
            <Link
              href={`/news/${activeTopArticle.slug}`}
              className="block overflow-hidden relative w-full h-[180px] sm:h-[200px] md:h-[220px] mb-3 bg-[#eff0e0] dark:bg-[#202020] group/img"
            >
              <Image
                key={activeTopArticle.slug}
                src={activeTopArticle.image}
                alt={activeTopArticle.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover/img:scale-105 animate-in fade-in duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center space-x-2">
                <span className="bg-[#f7413e] text-white text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold shadow-md">
                  RANK 0{activeTopIndex + 1}
                </span>
                <span className="bg-black/85 backdrop-blur-xs text-white text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold shadow-md">
                  {activeTopArticle.tag || activeTopArticle.category}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5">
                <span className="bg-black/85 backdrop-blur-xs text-white text-xs font-mono px-2 py-0.5 font-semibold shadow-md">
                  {activeTopArticle.readTime}
                </span>
              </div>
            </Link>

            {/* Category / Tag Dot */}
            <div className="flex items-center space-x-1.5 text-xs text-[#575757] dark:text-gray-400 font-sans mb-1.5">
              <span className="text-[#002b5c] dark:text-[#60a5fa] font-bold text-sm leading-none">•</span>
              <span className="font-serif italic text-[13px] text-[#575757] dark:text-gray-300">
                {activeTopArticle.tag || activeTopArticle.category}
              </span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                Editorial Rank #{activeTopIndex + 1}
              </span>
            </div>

            {/* Headline matching Latest News font size */}
            <Link href={`/news/${activeTopArticle.slug}`} className="block group/headline">
              <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-medium tracking-wide text-[#0a0a0a] dark:text-white group-hover/headline:text-[#f7413e] transition-colors leading-tight mb-3">
                {activeTopArticle.title}
              </h3>
            </Link>

            {/* Excerpt matching Latest News font size */}
            <p className="font-sans text-xs sm:text-sm text-[#575757] dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
              {activeTopArticle.excerpt}
            </p>

            {/* Meta & Read full story link */}
            <div className="flex items-center justify-between pt-3 border-t border-[#211d1d]/10 dark:border-white/10 mb-5">
              <div className="text-[12px] font-serif italic text-[#575757] dark:text-gray-400">
                By {activeTopArticle.author} • {activeTopArticle.date}
              </div>
              <Link
                href={`/news/${activeTopArticle.slug}`}
                className="inline-flex items-center space-x-1 text-[12px] font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e] transition-colors font-medium"
              >
                <span>Read full story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* BOTTOM SECTION: COMPACT 5-CARD TOP 10 INDEX STRIP */}
          <div className="pt-4 border-t border-[#211d1d]/20 dark:border-white/15">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                TOP 10 QUICK INDEX (CLICK TO PREVIEW)
              </span>
              <button
                onClick={() => setShowExtraTop10(!showExtraTop10)}
                className="text-xs font-mono uppercase text-[#575757] dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center space-x-1 cursor-pointer font-semibold"
              >
                <span>{showExtraTop10 ? 'Show 1–5' : '+5 Extra (06–10)'}</span>
                {showExtraTop10 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 5 Primary Ranked Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {top10Ranked.slice(0, 5).map((art, idx) => {
                const isActive = activeTopIndex === idx;
                return (
                  <div
                    key={art.slug}
                    onClick={() => setActiveTopIndex(idx)}
                    onMouseEnter={() => setActiveTopIndex(idx)}
                    className={`p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#eff0e0] dark:bg-[#252525] border-[#f7413e] shadow-xs'
                        : 'bg-white dark:bg-[#181818] border-[#211d1d]/15 dark:border-white/10 hover:border-[#211d1d]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-oswald font-bold text-xs px-1.5 py-0.5 leading-none ${
                            isActive
                              ? 'bg-[#f7413e] text-white'
                              : 'bg-[#211d1d] dark:bg-white text-white dark:text-black'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="text-[10px] font-serif italic text-[#575757] dark:text-gray-400 truncate max-w-[65px]">
                          {art.tag || art.category}
                        </span>
                      </div>
                      <h4
                        className={`font-oswald text-[13px] sm:text-[14px] font-medium leading-snug line-clamp-2 transition-colors ${
                          isActive
                            ? 'text-[#f7413e]'
                            : 'text-[#0a0a0a] dark:text-white hover:text-[#f7413e]'
                        }`}
                      >
                        {art.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra Items 6-10 (Expandable inline) */}
            {showExtraTop10 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mt-2.5 pt-2.5 border-t border-dashed border-[#211d1d]/20 dark:border-white/15 animate-in fade-in slide-in-from-top-2 duration-200">
                {top10Ranked.slice(5, 10).map((art, idx) => {
                  const actualIdx = idx + 5;
                  const isActive = activeTopIndex === actualIdx;
                  return (
                    <div
                      key={art.slug}
                      onClick={() => setActiveTopIndex(actualIdx)}
                      onMouseEnter={() => setActiveTopIndex(actualIdx)}
                      className={`p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
                        isActive
                          ? 'bg-[#eff0e0] dark:bg-[#252525] border-[#f7413e] shadow-xs'
                          : 'bg-white dark:bg-[#181818] border-[#211d1d]/15 dark:border-white/10 hover:border-[#211d1d]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`font-oswald font-bold text-xs px-1.5 py-0.5 leading-none ${
                              isActive
                                ? 'bg-[#f7413e] text-white'
                                : 'bg-[#eff0e0] dark:bg-white/10 text-[#211d1d] dark:text-gray-200'
                            }`}
                          >
                            {actualIdx + 1 < 10 ? `0${actualIdx + 1}` : actualIdx + 1}
                          </span>
                          <span className="text-[10px] font-serif italic text-[#575757] dark:text-gray-400 truncate max-w-[65px]">
                            {art.tag || art.category}
                          </span>
                        </div>
                        <h4
                          className={`font-oswald text-[13px] sm:text-[14px] font-medium leading-snug line-clamp-2 transition-colors ${
                            isActive
                              ? 'text-[#f7413e]'
                              : 'text-[#0a0a0a] dark:text-white hover:text-[#f7413e]'
                          }`}
                        >
                          {art.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RIGHT GRID: EXECUTIVE INTERVIEWS (4 Cols)                               */}
        {/* ========================================================================= */}
        <div
          className="lg:col-span-4 flex flex-col justify-between group/interview-box"
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
        >
          <div>
            {/* Header with Mic badge & Clean Slider Controls */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#211d1d]/20 dark:border-white/15">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-5 h-5 bg-[#f7413e] text-white text-[11px] font-mono font-bold">
                  <Mic className="w-3 h-3" />
                </span>
                <h3 className="font-bebas text-2xl sm:text-3xl font-normal uppercase tracking-wider text-black dark:text-white leading-none">
                  INTERVIEWS
                </h3>
              </div>

              {/* Slider Next/Prev Arrows & Slide Counter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 font-bold mr-1">
                  0{sliderIndex + 1}/0{activeInterviews.length}
                </span>
                <button
                  onClick={() =>
                    setSliderIndex((prev) =>
                      prev === 0 ? activeInterviews.length - 1 : prev - 1
                    )
                  }
                  className="w-6 h-6 bg-gray-100 dark:bg-[#252525] hover:bg-[#f7413e] hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous Interview"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    setSliderIndex((prev) =>
                      prev === activeInterviews.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="w-6 h-6 bg-gray-100 dark:bg-[#252525] hover:bg-[#f7413e] hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next Interview"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Featured Interviewee Portrait Image */}
            <Link
              href={`/news/${currentInterview.slug}`}
              className="block overflow-hidden relative w-full h-[140px] sm:h-[155px] mb-2.5 bg-[#eff0e0] dark:bg-[#202020] group/img"
            >
              <Image
                src={currentInterview.image}
                alt={currentInterview.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-black/85 text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold shadow-xs">
                  {currentInterview.tag || 'Executive'}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5">
                <span className="bg-black/85 backdrop-blur-xs text-white text-[10px] font-mono font-semibold px-2 py-0.5">
                  {currentInterview.readTime}
                </span>
              </div>
            </Link>

            {/* Category / Tag Dot */}
            <div className="flex items-center space-x-1.5 text-xs text-[#575757] dark:text-gray-400 font-sans mb-1.5">
              <span className="text-[#002b5c] dark:text-[#60a5fa] font-bold text-sm leading-none">•</span>
              <span className="font-serif italic text-[13px] text-[#575757] dark:text-gray-300">
                {currentInterview.tag || 'Executive Feature'}
              </span>
            </div>

            {/* Headline */}
            <Link href={`/news/${currentInterview.slug}`} className="block group/title">
              <h4 className="font-oswald text-[18px] sm:text-[22px] font-medium tracking-wide text-[#0a0a0a] dark:text-white group-hover/title:text-[#f7413e] transition-colors leading-tight mb-2.5">
                {currentInterview.title}
              </h4>
            </Link>

            {/* Elegant Minimalist Quote Card */}
            <div className="bg-[#fefdf3] dark:bg-[#1a1a1a] p-3.5 border-l-2 border-[#f7413e] mb-3">
              <p className="font-serif italic text-xs sm:text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-3">
                &ldquo;{currentQuoteData.quote.replace(/^[“”"']+|[“”"']+$/g, '')}&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-[#211d1d]/10 dark:border-white/10">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="font-serif italic font-semibold text-black dark:text-white text-[12px]">
                    {currentQuoteData.interviewee}
                  </span>
                  <span className="text-gray-400 text-[10px]">•</span>
                  <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">
                    {currentQuoteData.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Slide Indicator Progress Bars */}
            <div className="flex items-center justify-center space-x-1 pt-1 mb-2">
              {activeInterviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    sliderIndex === idx
                      ? 'w-6 bg-[#f7413e]'
                      : 'w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-[#211d1d]/10 dark:border-white/10 flex items-center justify-between gap-2">
            <Link
              href={`/news/${currentInterview.slug}`}
              className="inline-flex items-center space-x-1 text-[12px] font-serif italic text-[#002b5c] dark:text-[#60a5fa] hover:text-[#f7413e] transition-colors font-medium"
            >
              <span>Read dialogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsInterviewsModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-oswald uppercase text-[#f7413e] hover:underline font-bold tracking-wider cursor-pointer"
            >
              <span>Total List</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL A: TOP 10 RANKINGS TOTAL LIST (Full View with Dark Mode)          */}
      {/* ========================================================================= */}
      {isTop10ModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#fefdf3] dark:bg-[#181818] w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#211d1d] dark:border-white/20 shadow-2xl relative rounded-xs">
            {/* Modal Header */}
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
                onClick={() => setIsTop10ModalOpen(false)}
                className="p-1.5 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black border border-[#211d1d]/20 dark:border-white/20 text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
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

              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Business', 'Technology', 'Leadership', 'Interview', 'Startup', 'Opinion', 'Health'].map(
                  (cat) => (
                    <button
                      key={cat}
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

            {/* Modal Body: Ranked Articles List */}
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
                        0{idx + 1}
                      </div>
                      <div className="relative w-16 h-12 rounded-xs overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-white/10 hidden sm:block">
                        <Image
                          src={art.image}
                          alt={art.title}
                          fill
                          className="object-cover"
                        />
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
                          href={`/news/${art.slug}`}
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
                      href={`/news/${art.slug}`}
                      onClick={() => setIsTop10ModalOpen(false)}
                      className="shrink-0 text-xs font-mono uppercase font-bold text-[#211d1d] dark:text-white group-hover/modal-item:text-[#f7413e] flex items-center space-x-1"
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
            {/* Modal Header */}
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
                onClick={() => setIsInterviewsModalOpen(false)}
                className="p-1.5 hover:bg-[#211d1d] hover:text-white dark:hover:bg-white dark:hover:text-black border border-[#211d1d]/20 dark:border-white/20 text-[#211d1d] dark:text-gray-200 transition-colors cursor-pointer rounded-xs"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
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

              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Frontier AI', 'Venture Capital', 'Urban Architecture', 'Sovereign AI'].map(
                  (cat) => (
                    <button
                      key={cat}
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

            {/* Modal Body: Interviews List */}
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
                        <div className="relative w-16 h-14 rounded-xs overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-white/10">
                          <Image
                            src={art.image}
                            alt={art.title}
                            fill
                            className="object-cover"
                          />
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
                            href={`/news/${art.slug}`}
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
                        href={`/news/${art.slug}`}
                        onClick={() => setIsInterviewsModalOpen(false)}
                        className="shrink-0 text-xs font-mono uppercase font-bold text-[#211d1d] dark:text-white group-hover/modal-item:text-[#f7413e] flex items-center space-x-1"
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
