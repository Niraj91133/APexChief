'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import AmbientImage from '@/components/AmbientImage';
import { Article } from '@/types';
import { getBlogUrl } from '@/lib/blogUrl';

interface BlogSplitSidebarProps {
  latestArticles: Article[];
  interviewArticles: Article[];
}

function isInterviewItem(art: Article): boolean {
  const cat = (art.category || '').toLowerCase();
  const sub = (art.subcategory || '').toLowerCase();
  const tag = (art.tag || '').toLowerCase();
  const title = (art.title || '').toLowerCase();
  const slug = (art.slug || '').toLowerCase();
  return (
    art.placement === 'interview' ||
    cat === 'interview' ||
    sub === 'interviews' ||
    tag.includes('interview') ||
    title.startsWith('interview:') ||
    slug.includes('interview')
  );
}

export default function BlogSplitSidebar({
  latestArticles,
  interviewArticles,
}: BlogSplitSidebarProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'interview'>('latest');

  const activeList = activeTab === 'latest' ? latestArticles : interviewArticles;
  const viewAllHref = activeTab === 'latest' ? '/news' : '/category/interview';
  const viewAllLabel = activeTab === 'latest' ? 'view all Latest' : 'view all Interview';

  return (
    <div className="bg-white dark:bg-[#161616] border border-[#211d1d]/15 dark:border-white/15 rounded-xs overflow-hidden shadow-2xs">
      {/* Top Tabs Header: Latest | Interview */}
      <div
        role="tablist"
        aria-label="Sidebar article feeds"
        className="grid grid-cols-2 border-b border-[#211d1d]/15 dark:border-white/15"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'latest'}
          onClick={() => setActiveTab('latest')}
          className={`py-3.5 px-3 text-center font-sans text-xs sm:text-[13px] tracking-wide transition-colors cursor-pointer border-b-2 ${
            activeTab === 'latest'
              ? 'bg-white dark:bg-[#161616] text-[#0a0a0a] dark:text-white font-semibold border-b-[#f7413e]'
              : 'bg-[#f8fafc] dark:bg-[#1f1f1f] text-[#575757] dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-white font-medium border-b-transparent'
          }`}
        >
          Latest
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'interview'}
          onClick={() => setActiveTab('interview')}
          className={`py-3.5 px-3 text-center font-sans text-xs sm:text-[13px] tracking-wide transition-colors cursor-pointer border-l border-[#211d1d]/10 dark:border-white/10 border-b-2 ${
            activeTab === 'interview'
              ? 'bg-white dark:bg-[#161616] text-[#0a0a0a] dark:text-white font-semibold border-b-[#f7413e]'
              : 'bg-[#f8fafc] dark:bg-[#1f1f1f] text-[#575757] dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-white font-medium border-b-transparent'
          }`}
        >
          Interview
        </button>
      </div>

      {/* Article Rows */}
      <div className="divide-y divide-[#211d1d]/10 dark:divide-white/10 px-4">
        {activeList.map((item) => {
          const cleanImg = item.image ? item.image.replace(/&amp;/g, '&') : '/images/apexchief-logo-light.png';
          const eyebrowLabel =
            activeTab === 'latest'
              ? item.category || 'Latest'
              : isInterviewItem(item)
              ? 'Interview'
              : item.category || 'Profile';

          return (
            <Link
              key={item.slug}
              href={getBlogUrl(item)}
              className="group flex items-start gap-3 py-3.5 transition-colors"
            >
              <div className="w-[86px] h-[62px] shrink-0 relative overflow-hidden rounded-[2px] border border-[#211d1d]/10 dark:border-white/10 bg-[#f1f5f9] dark:bg-[#222]">
                <AmbientImage
                  src={cleanImg}
                  alt={item.title}
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="text-[11px] font-sans text-[#6b7280] dark:text-[#9ca3af] mb-0.5 truncate">
                  {eyebrowLabel} <span className="mx-0.5">•</span> {item.date}
                </div>
                <h3 className="font-sans font-medium text-[13.5px] leading-[1.35] text-[#111827] dark:text-white group-hover:text-[#f7413e] transition-colors line-clamp-3">
                  {item.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="px-4 py-3 border-t border-[#211d1d]/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#1b1b1b] flex items-center justify-end">
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#575757] dark:text-gray-300 hover:text-[#f7413e] dark:hover:text-[#f7413e] transition-colors"
        >
          <span>{viewAllLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

