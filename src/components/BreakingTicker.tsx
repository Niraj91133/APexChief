'use client';

import React from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/data/articles';

export default function BreakingTicker() {
  const tickerArticles = ARTICLES.slice(0, 10);

  return (
    <div className="w-full bg-[#eff0e0] border-b border-[#211d1d]/15 overflow-hidden flex items-center h-10 select-none">
      {/* Static Label Badge */}
      <div className="flex items-center space-x-2 bg-[#0a0a0a] text-[#fefdf3] px-4 h-full z-10 flex-shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7413e] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f7413e]"></span>
        </span>
        <span className="font-oswald text-xs uppercase tracking-widest font-bold">
          Breaking News
        </span>
      </div>

      {/* Scrolling Content */}
      <div className="relative flex overflow-x-hidden flex-1 group">
        <div className="animate-marquee whitespace-nowrap flex items-center py-2 group-hover:[animation-play-state:paused]">
          {tickerArticles.concat(tickerArticles).map((article, idx) => (
            <div key={`${article.slug}-${idx}`} className="inline-flex items-center">
              <Link
                href={`/news/${article.slug}`}
                className="text-xs font-medium text-[#211d1d] hover:text-[#f7413e] transition-colors mx-4 hover:underline underline-offset-2 flex items-center space-x-2"
              >
                <span className="font-mono text-[10px] bg-[#211d1d]/10 text-[#211d1d] px-1.5 py-0.5 rounded font-semibold uppercase">
                  {article.category}
                </span>
                <span>{article.title}</span>
              </Link>
              <span className="text-[#211d1d]/30 mx-2 text-xs font-serif">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
