import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  categoryName: string;
  articles: Article[];
  layout?: 'grid-4' | 'split' | 'featured-row' | 'list-side';
  description?: string;
}

export default function CategorySection({
  title,
  categorySlug,
  categoryName,
  articles,
  layout = 'grid-4',
  description,
}: CategorySectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full my-12 pt-8 border-t-2 border-[#211d1d]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-[#211d1d]/20 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#f7413e]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#575757]">
              Section Report
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight mt-0.5">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-[#575757] mt-1 max-w-xl font-sans">
              {description}
            </p>
          )}
        </div>

        <Link
          href={`/news?category=${categorySlug}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#211d1d] hover:text-[#f7413e] transition-colors py-1 group flex-shrink-0"
        >
          <span>See All {categoryName}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Layout Variants */}
      {layout === 'split' && articles.length >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Big Story */}
          <div className="lg:col-span-7">
            <ArticleCard article={articles[0]} variant="hero" />
          </div>

          {/* Right Side Stack */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {articles.slice(1, 4).map((art) => (
              <ArticleCard key={art.slug} article={art} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {layout === 'featured-row' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((art) => (
            <ArticleCard key={art.slug} article={art} variant="featured" />
          ))}
        </div>
      )}

      {layout === 'list-side' && articles.length >= 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.slice(0, 2).map((art) => (
              <ArticleCard key={art.slug} article={art} variant="standard" />
            ))}
          </div>
          <div className="lg:col-span-4 bg-[#eff0e0] border border-[#211d1d]/15 p-4 divide-y divide-[#211d1d]/10">
            <h3 className="font-oswald text-xs font-bold uppercase tracking-widest text-[#0a0a0a] pb-2">
              In Brief
            </h3>
            {articles.slice(2, 6).map((art) => (
              <ArticleCard key={art.slug} article={art} variant="sidebar" />
            ))}
          </div>
        </div>
      )}

      {(layout === 'grid-4' || (layout === 'split' && articles.length < 3)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((art) => (
            <ArticleCard key={art.slug} article={art} variant="standard" />
          ))}
        </div>
      )}
    </section>
  );
}
