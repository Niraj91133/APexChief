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
  Quote,
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

  // 2. Collect Top 10 Ranked Articles
  const top10Ranked = articles.slice(0, 15);

  // 3. Center Hero Lead Article
  const lead =
    heroLeadArticle ||
    articles.find((a) => a.placement === 'top3') ||
    articles[0] || {
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
      quote: `“${currentInterview?.excerpt || 'Exclusive conversation on the frontier of industry, technology, and global markets.'}”`,
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
    <section className="w-full pb-8 border-b border-[#211d1d]/20 relative">
      {/* 3-GRID HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* ========================================================================= */}
        {/* 1. LEFT GRID: TOP 10 RANKINGS & LEFT-SIDE INTERVIEWS (4 Cols)             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#fbfaf5] border border-[#211d1d]/20 p-5 sm:p-6 shadow-xs group/left">
          <div>
            {/* Header with Badges and Total List Trigger */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-[#211d1d]">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#f7413e] text-white text-[11px] font-mono font-bold rounded-xs shadow-2xs">
                  <Trophy className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="font-oswald text-base sm:text-lg font-bold uppercase tracking-wider text-[#0a0a0a] leading-none">
                    TOP 10 INDEX
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#575757]">
                    Editorial Rankings
                  </span>
                </div>
              </div>

              {/* Click to open Total List Modal */}
              <button
                onClick={() => setIsTop10ModalOpen(true)}
                className="inline-flex items-center space-x-1 text-[11px] font-mono uppercase font-bold text-[#f7413e] hover:text-[#0a0a0a] bg-[#f7413e]/10 hover:bg-[#f7413e]/20 px-2 py-1 rounded transition-colors cursor-pointer"
                title="Click to view total top 10 ranked list"
              >
                <span>Total List</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Top 5 Primary Stories */}
            <div className="divide-y divide-[#211d1d]/10 space-y-2.5">
              {top10Ranked.slice(0, 5).map((art, idx) => (
                <div
                  key={art.slug}
                  className="pt-2.5 first:pt-0 flex items-start space-x-3 group"
                >
                  {/* Rank Number Badge */}
                  <span
                    className={`font-oswald font-bold text-sm sm:text-base leading-none px-1.5 py-0.5 mt-0.5 rounded-xs ${
                      idx === 0
                        ? 'bg-[#f7413e] text-white shadow-2xs'
                        : idx === 1
                        ? 'bg-[#211d1d] text-white'
                        : 'bg-[#eff0e0] text-[#211d1d] border border-[#211d1d]/20'
                    }`}
                  >
                    0{idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#575757]">
                      <span className="font-bold text-[#f7413e]">
                        {art.tag || art.category}
                      </span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <Link
                      href={`/news/${art.slug}`}
                      className="font-serif font-bold text-xs sm:text-[13px] text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors line-clamp-2 leading-snug mt-0.5"
                    >
                      {art.title}
                    </Link>
                  </div>
                </div>
              ))}

              {/* Extra Items 6-10 (Expandable inline) */}
              {showExtraTop10 && (
                <div className="space-y-2.5 pt-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  {top10Ranked.slice(5, 10).map((art, idx) => (
                    <div
                      key={art.slug}
                      className="pt-2.5 flex items-start space-x-3 group border-t border-dashed border-[#211d1d]/15"
                    >
                      <span className="font-oswald font-bold text-sm sm:text-base leading-none px-1.5 py-0.5 mt-0.5 rounded-xs bg-[#eff0e0] text-[#211d1d] border border-[#211d1d]/20">
                        {idx + 6 < 10 ? `0${idx + 6}` : idx + 6}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#575757]">
                          <span className="font-bold text-[#002b5c]">
                            {art.tag || art.category}
                          </span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                        <Link
                          href={`/news/${art.slug}`}
                          className="font-serif font-bold text-xs sm:text-[13px] text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors line-clamp-2 leading-snug mt-0.5"
                        >
                          {art.title}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Left Side Interview Spotlight Card */}
            <div className="mt-4 pt-3.5 border-t border-[#211d1d]/15 bg-white/80 p-3 border border-[#211d1d]/10 rounded-xs">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#575757] mb-1">
                <span className="flex items-center space-x-1 text-[#f7413e] font-bold">
                  <Mic className="w-3 h-3" />
                  <span>Interview Spotlight</span>
                </span>
                <button
                  onClick={() => setIsInterviewsModalOpen(true)}
                  className="hover:underline font-bold text-[#002b5c] cursor-pointer"
                >
                  All Interviews →
                </button>
              </div>
              <Link
                href={`/news/${activeInterviews[0]?.slug}`}
                className="font-serif font-bold text-xs text-[#0a0a0a] hover:text-[#f7413e] transition-colors line-clamp-1 block"
              >
                {activeInterviews[0]?.title}
              </Link>
            </div>
          </div>

          {/* Bottom Actions: Expand Inline Toggle + Open Total List Modal Button */}
          <div className="mt-4 pt-3 border-t border-[#211d1d]/15 flex items-center justify-between gap-2">
            <button
              onClick={() => setShowExtraTop10(!showExtraTop10)}
              className="flex items-center space-x-1 text-[11px] font-mono uppercase tracking-wider text-[#575757] hover:text-[#0a0a0a] font-semibold transition-colors cursor-pointer"
            >
              <span>{showExtraTop10 ? 'Show Less' : '+5 Extra Rankings'}</span>
              {showExtraTop10 ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => setIsTop10ModalOpen(true)}
              className="bg-[#211d1d] hover:bg-[#f7413e] text-white text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              <span>View Total List</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CENTER GRID: MAIN EDITORIAL HERO LEAD (4 Cols)                          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between group/hero border border-[#211d1d]/20 p-5 sm:p-6 bg-white shadow-xs">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-[#211d1d]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#f7413e] animate-pulse"></span>
                <span className="font-oswald text-base sm:text-lg font-bold uppercase tracking-wider text-[#0a0a0a] leading-none">
                  FRONT PAGE LEAD
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#575757]">
                ApexChief Editorial
              </span>
            </div>

            {/* Featured Hero Image */}
            <Link
              href={`/news/${lead.slug}`}
              className="block overflow-hidden relative aspect-[16/10] mb-4 bg-[#eff0e0] border border-[#211d1d]/10"
            >
              <Image
                src={lead.image}
                alt={lead.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover/hero:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#211d1d]/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold">
                {lead.tag || lead.category}
              </div>
            </Link>

            {/* Title & Excerpt */}
            <div>
              <Link href={`/news/${lead.slug}`}>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] group-hover/hero:text-[#f7413e] transition-colors leading-snug mb-2">
                  {lead.title}
                </h2>
              </Link>
              <p className="font-sans text-xs text-[#575757] leading-relaxed line-clamp-3 mb-3">
                {lead.excerpt}
              </p>
            </div>
          </div>

          {/* Author & Read Time Meta */}
          <div className="pt-3 border-t border-[#211d1d]/15 flex items-center justify-between text-xs text-[#575757]">
            <div className="flex items-center space-x-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#211d1d]/20">
                <Image
                  src={lead.authorAvatar}
                  alt={lead.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif italic font-medium text-[11px] text-[#211d1d]">
                By {lead.author}
              </span>
            </div>
            <Link
              href={`/news/${lead.slug}`}
              className="text-[11px] font-mono uppercase tracking-wider text-[#002b5c] font-bold hover:text-[#f7413e] flex items-center space-x-1"
            >
              <span>Read Analysis</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RIGHT GRID: EXECUTIVE INTERVIEWS & INTERACTIVE SLIDER (4 Cols)          */}
        {/* ========================================================================= */}
        <div
          className="lg:col-span-4 flex flex-col justify-between bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/15 p-5 sm:p-6 shadow-xs relative transition-all group/interview-box"
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
        >
          <div>
            {/* Header with Mic badge & Clean Slider Controls */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-200 dark:border-white/15">
              <div className="flex items-center space-x-2.5">
                <span className="flex items-center justify-center w-7 h-7 bg-[#f7413e] text-white text-xs font-mono font-bold rounded-xs shadow-2xs">
                  <Mic className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="font-oswald text-base sm:text-lg font-bold uppercase tracking-wider text-black dark:text-white leading-none">
                    INTERVIEWS
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Executive Dialogues
                  </span>
                </div>
              </div>

              {/* Slider Next/Prev Arrows & Slide Counter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 font-bold mr-1">
                  0{sliderIndex + 1} / 0{activeInterviews.length}
                </span>
                <button
                  onClick={() =>
                    setSliderIndex((prev) =>
                      prev === 0 ? activeInterviews.length - 1 : prev - 1
                    )
                  }
                  className="w-7 h-7 bg-gray-100 dark:bg-gray-800 hover:bg-[#f7413e] hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors cursor-pointer rounded-xs"
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
                  className="w-7 h-7 bg-gray-100 dark:bg-gray-800 hover:bg-[#f7413e] hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors cursor-pointer rounded-xs"
                  aria-label="Next Interview"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Clean Featured Interviewee Portrait Image */}
            <Link
              href={`/news/${currentInterview.slug}`}
              className="block overflow-hidden relative aspect-[16/10] mb-3.5 bg-gray-100 dark:bg-gray-800 rounded-xs border border-gray-200 dark:border-white/10 group/img"
            >
              <Image
                src={currentInterview.image}
                alt={currentInterview.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-black/90 text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold rounded-xs shadow-xs">
                  {currentInterview.tag || 'Executive'}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5">
                <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded-xs">
                  {currentInterview.readTime}
                </span>
              </div>
            </Link>

            {/* Clear Typography: Headline Below Image */}
            <Link href={`/news/${currentInterview.slug}`} className="block group/title">
              <h4 className="font-serif text-base sm:text-lg font-bold text-black dark:text-white group-hover/title:text-[#f7413e] transition-colors leading-snug line-clamp-2 mb-3">
                {currentInterview.title}
              </h4>
            </Link>

            {/* Elegant Minimalist Quote Card */}
            <div className="bg-[#faf8f5] dark:bg-[#202020] p-3.5 border-l-2 border-[#f7413e] rounded-r-xs mb-3">
              <p className="font-serif italic text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                &ldquo;{currentQuoteData.quote.replace(/^[“”"']+|[“”"']+$/g, '')}&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-gray-200/60 dark:border-white/10">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="font-bold text-black dark:text-white text-xs">
                    {currentQuoteData.interviewee}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">
                    {currentQuoteData.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Slide Indicator Progress Bars */}
            <div className="flex items-center justify-center space-x-1.5 pt-0.5 mb-1">
              {activeInterviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`h-1 rounded-full transition-all cursor-pointer ${
                    sliderIndex === idx
                      ? 'w-7 bg-[#f7413e]'
                      : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Actions: Read Full Dialogue & View Total List Button */}
          <div className="mt-4 pt-3.5 border-t border-gray-200 dark:border-white/15 flex items-center justify-between gap-2">
            <Link
              href={`/news/${currentInterview.slug}`}
              className="inline-flex items-center space-x-1 text-xs font-mono uppercase tracking-wider text-black dark:text-white hover:text-[#f7413e] font-bold transition-colors"
            >
              <span>Read Dialogue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsInterviewsModalOpen(true)}
              className="bg-black hover:bg-[#f7413e] dark:bg-white dark:hover:bg-[#f7413e] text-white dark:text-black dark:hover:text-white text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer rounded-xs"
            >
              <span>Total List</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL A: TOP 10 RANKINGS TOTAL LIST (Full View)                         */}
      {/* ========================================================================= */}
      {isTop10ModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#fefdf3] w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#211d1d] shadow-2xl relative">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b-2 border-[#211d1d] bg-[#f7f6ec] flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="w-6 h-6 bg-[#f7413e] text-white flex items-center justify-center text-xs font-mono font-bold rounded-xs shadow-2xs">
                    <Trophy className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                    ApexChief Editorial Index
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a]">
                  Top 10 Ranked Stories & Editorial Archive
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] font-sans mt-1">
                  The most authoritative, high-impact investigations and leadership dialogues across global industries.
                </p>
              </div>

              <button
                onClick={() => setIsTop10ModalOpen(false)}
                className="p-2 hover:bg-[#211d1d] hover:text-white border border-[#211d1d]/20 text-[#211d1d] transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 sm:px-6 border-b border-[#211d1d]/15 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#575757]" />
                <input
                  type="text"
                  placeholder="Search top ranked stories..."
                  value={top10Search}
                  onChange={(e) => setTop10Search(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fbfaf5] border border-[#211d1d]/20 focus:outline-none focus:border-[#f7413e]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Business', 'Markets', 'Technology', 'Interview', 'Future'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setTop10Category(cat)}
                      className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                        top10Category === cat
                          ? 'bg-[#211d1d] text-white'
                          : 'bg-[#eff0e0] text-[#575757] hover:bg-[#211d1d]/10'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Modal Body: Ranked List */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {filteredTop10.length === 0 ? (
                <div className="text-center py-12 text-[#575757]">
                  <p className="font-serif text-base">No ranked stories match your query.</p>
                  <button
                    onClick={() => {
                      setTop10Search('');
                      setTop10Category('All');
                    }}
                    className="mt-2 text-xs font-mono text-[#f7413e] hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTop10.map((art, idx) => (
                  <div
                    key={art.slug}
                    className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white border border-[#211d1d]/15 hover:border-[#f7413e] transition-colors group"
                  >
                    {/* Rank Badge */}
                    <div className="flex sm:flex-col items-center justify-center w-full sm:w-16 h-10 sm:h-auto py-2 bg-[#fbfaf5] border border-[#211d1d]/10 flex-shrink-0">
                      <span className="text-[10px] font-mono uppercase text-[#575757]">
                        RANK
                      </span>
                      <span
                        className={`font-oswald font-bold text-xl sm:text-2xl ${
                          idx === 0
                            ? 'text-[#f7413e]'
                            : idx === 1
                            ? 'text-[#002b5c]'
                            : 'text-[#211d1d]'
                        }`}
                      >
                        #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                    </div>

                    {/* Story Thumbnail */}
                    <Link
                      href={`/news/${art.slug}`}
                      onClick={() => setIsTop10ModalOpen(false)}
                      className="relative w-full sm:w-36 aspect-[16/10] bg-[#eff0e0] flex-shrink-0 overflow-hidden"
                    >
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Story Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#575757] mb-1">
                          <span className="bg-[#f7413e]/10 text-[#f7413e] px-1.5 py-0.5 rounded-xs font-bold">
                            {art.tag || art.category}
                          </span>
                          <span>•</span>
                          <span>{art.date}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>

                        <Link
                          href={`/news/${art.slug}`}
                          onClick={() => setIsTop10ModalOpen(false)}
                          className="font-serif font-bold text-base sm:text-lg text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2"
                        >
                          {art.title}
                        </Link>

                        <p className="font-sans text-xs text-[#575757] line-clamp-2 mt-1 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#211d1d]/10 flex items-center justify-between text-xs">
                        <span className="font-serif italic text-[11px] text-[#575757]">
                          By {art.author} ({art.authorRole})
                        </span>
                        <Link
                          href={`/news/${art.slug}`}
                          onClick={() => setIsTop10ModalOpen(false)}
                          className="inline-flex items-center space-x-1 text-[11px] font-mono uppercase font-bold text-[#002b5c] group-hover:text-[#f7413e]"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#211d1d]/15 bg-[#fbfaf5] flex items-center justify-between text-xs font-mono text-[#575757]">
              <span>Showing {filteredTop10.length} ranked investigations</span>
              <button
                onClick={() => setIsTop10ModalOpen(false)}
                className="bg-[#211d1d] hover:bg-[#f7413e] text-white px-4 py-2 font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL B: EXECUTIVE INTERVIEWS TOTAL LIST (Full View)                   */}
      {/* ========================================================================= */}
      {isInterviewsModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#fefdf3] w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#211d1d] shadow-2xl relative">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b-2 border-[#211d1d] bg-[#f7f6ec] flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="w-6 h-6 bg-[#211d1d] text-white flex items-center justify-center text-xs font-mono font-bold rounded-xs shadow-2xs">
                    <Mic className="w-3.5 h-3.5 text-[#f7413e]" />
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#f7413e] font-bold">
                    Executive Dialogue Series
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a]">
                  Total Executive Interviews Archive
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] font-sans mt-1">
                  Unvarnished conversations with founders, venture capitalists, architects, and industry leaders.
                </p>
              </div>

              <button
                onClick={() => setIsInterviewsModalOpen(false)}
                className="p-2 hover:bg-[#211d1d] hover:text-white border border-[#211d1d]/20 text-[#211d1d] transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 sm:px-6 border-b border-[#211d1d]/15 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#575757]" />
                <input
                  type="text"
                  placeholder="Search by name, role, or topic..."
                  value={interviewSearch}
                  onChange={(e) => setInterviewSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fbfaf5] border border-[#211d1d]/20 focus:outline-none focus:border-[#f7413e]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Frontier AI', 'Venture Capital', 'Urban Architecture', 'Sovereign AI'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setInterviewCategory(cat)}
                      className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                        interviewCategory === cat
                          ? 'bg-[#211d1d] text-white'
                          : 'bg-[#eff0e0] text-[#575757] hover:bg-[#211d1d]/10'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Modal Body: Interviews List */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {filteredInterviews.length === 0 ? (
                <div className="text-center py-12 text-[#575757]">
                  <p className="font-serif text-base">No interviews match your search criteria.</p>
                  <button
                    onClick={() => {
                      setInterviewSearch('');
                      setInterviewCategory('All');
                    }}
                    className="mt-2 text-xs font-mono text-[#f7413e] hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredInterviews.map((item) => {
                  const quoteMeta =
                    interviewQuotes[item.slug] || {
                      interviewee: item.author,
                      role: item.authorRole,
                      quote: `“${item.excerpt}”`,
                    };

                  return (
                    <div
                      key={item.slug}
                      className="p-5 bg-white border border-[#211d1d]/15 hover:border-[#f7413e] transition-colors group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        {/* Interviewee Image */}
                        <Link
                          href={`/news/${item.slug}`}
                          onClick={() => setIsInterviewsModalOpen(false)}
                          className="md:col-span-4 block overflow-hidden relative aspect-[4/3] bg-[#eff0e0] border border-[#211d1d]/10"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 bg-[#f7413e] text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 font-bold">
                            {item.tag || 'Dialogue'}
                          </div>
                        </Link>

                        {/* Interview Details & Quote */}
                        <div className="md:col-span-8 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#575757] mb-1">
                              <span className="font-bold text-[#002b5c]">
                                {quoteMeta.interviewee}
                              </span>
                              <span>•</span>
                              <span>{quoteMeta.role}</span>
                              <span>•</span>
                              <span>{item.readTime}</span>
                            </div>

                            <Link
                              href={`/news/${item.slug}`}
                              onClick={() => setIsInterviewsModalOpen(false)}
                              className="font-serif font-bold text-lg text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors leading-snug block mb-2"
                            >
                              {item.title}
                            </Link>

                            {/* Pull Quote Box */}
                            <div className="bg-[#fbfaf5] p-3 border-l-2 border-[#f7413e] mb-3">
                              <p className="font-serif italic text-xs text-[#211d1d] leading-relaxed">
                                {quoteMeta.quote}
                              </p>
                            </div>

                            <p className="font-sans text-xs text-[#575757] line-clamp-2 leading-relaxed">
                              {item.excerpt}
                            </p>
                          </div>

                          <div className="mt-4 pt-2 border-t border-[#211d1d]/10 flex items-center justify-between text-xs">
                            <span className="text-[11px] font-mono text-[#575757]">
                              Published: {item.date}
                            </span>
                            <Link
                              href={`/news/${item.slug}`}
                              onClick={() => setIsInterviewsModalOpen(false)}
                              className="bg-[#211d1d] group-hover:bg-[#f7413e] text-white text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 font-bold transition-colors inline-flex items-center space-x-1"
                            >
                              <span>Read Full Interview</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#211d1d]/15 bg-[#fbfaf5] flex items-center justify-between text-xs font-mono text-[#575757]">
              <span>Showing {filteredInterviews.length} exclusive conversations</span>
              <button
                onClick={() => setIsInterviewsModalOpen(false)}
                className="bg-[#211d1d] hover:bg-[#f7413e] text-white px-4 py-2 font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
