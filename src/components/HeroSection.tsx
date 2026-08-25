import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { ArrowUpRight, TrendingUp, Flame } from 'lucide-react';

interface HeroSectionProps {
  leadArticle: Article;
  secondaryArticles: Article[];
  sidebarArticles: Article[];
}

export default function HeroSection({
  leadArticle,
  secondaryArticles,
  sidebarArticles,
}: HeroSectionProps) {
  return (
    <section className="w-full mb-12">
      {/* Section Header Line */}
      <div className="flex items-center justify-between pb-2 mb-6 border-b-2 border-[#211d1d]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#f7413e]"></span>
          <h2 className="font-oswald text-sm sm:text-base font-bold uppercase tracking-widest text-[#0a0a0a]">
            Top Stories & Editorial Lead
          </h2>
        </div>
        <div className="text-xs font-mono uppercase text-[#575757]">
          Front Page Edition
        </div>
      </div>

      {/* Hero 3-Column Newspaper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lead Hero Story (7 cols) */}
        <div className="lg:col-span-7">
          <ArticleCard article={leadArticle} variant="hero" priority />
        </div>

        {/* Center/Right Column: Secondary Stories & Trending Sidebar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Secondary Lead Stack */}
          <div className="space-y-4">
            {secondaryArticles.slice(0, 2).map((article) => (
              <ArticleCard key={article.slug} article={article} variant="horizontal" />
            ))}
          </div>

          {/* Trending / Editorial Picks Sidebar Box */}
          <div className="bg-[#eff0e0] border border-[#211d1d]/20 p-5">
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-[#211d1d]/15">
              <Flame className="w-4 h-4 text-[#f7413e]" />
              <h3 className="font-oswald text-xs font-bold uppercase tracking-widest text-[#0a0a0a]">
                Trending Across The Newsroom
              </h3>
            </div>

            <div className="divide-y divide-[#211d1d]/10">
              {sidebarArticles.slice(0, 4).map((article, idx) => (
                <div key={article.slug} className="py-2.5 first:pt-0 last:pb-0 flex items-start space-x-3">
                  <span className="font-serif font-bold text-base text-[#575757]/60 leading-none mt-0.5">
                    0{idx + 1}
                  </span>
                  <div className="flex-1">
                    <Link
                      href={`/news/${article.slug}`}
                      className="font-serif font-bold text-xs sm:text-sm text-[#0a0a0a] hover:text-[#f7413e] transition-colors line-clamp-2 leading-snug"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-[#575757] mt-1">
                      <span className="uppercase font-semibold">{article.category}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
