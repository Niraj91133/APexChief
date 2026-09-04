import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { Clock, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'horizontal' | 'compact' | 'featured' | 'sidebar' | 'grid';
  showExcerpt?: boolean;
  priority?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'standard',
  showExcerpt = true,
  priority = false,
}: ArticleCardProps) {
  // Hero Variant (Lead Cover Story)
  if (variant === 'hero') {
    return (
      <article className="group relative flex flex-col h-full bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/15 hover:border-black dark:hover:border-white/30 transition-all p-5 sm:p-7">
        <Link href={`/news/${article.slug}`} className="block overflow-hidden relative aspect-[16/10] mb-5 bg-gray-100 dark:bg-[#222222]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white font-oswald text-xs uppercase px-2.5 py-1 tracking-widest font-bold">
              {article.category}
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">
          <span>{article.date}</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </span>
        </div>

        <Link href={`/news/${article.slug}`} className="block">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white leading-tight group-hover:text-[#f7413e] transition-colors mb-3">
            {article.title}
          </h2>
        </Link>

        {showExcerpt && (
          <p className="font-sans text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-black dark:text-white group-hover:text-[#f7413e] group-hover:translate-x-1 transition-all"
          >
            <span>Read Full Story</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[11px] font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#222222] px-2 py-0.5 rounded">
            Editorial Lead
          </span>
        </div>
      </article>
    );
  }

  // Horizontal Variant
  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <Link href={`/news/${article.slug}`} className="relative w-full sm:w-48 sm:h-36 aspect-[16/10] sm:aspect-auto flex-shrink-0 bg-gray-100 dark:bg-[#222222] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center space-x-2 text-[11px] text-gray-600 dark:text-gray-400 uppercase font-mono mb-1.5">
              <span className="font-bold text-[#f7413e]">{article.category}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>

            <Link href={`/news/${article.slug}`}>
              <h3 className="font-serif text-lg font-bold text-black dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2">
                {article.title}
              </h3>
            </Link>

            {showExcerpt && (
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1.5 line-clamp-2">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono text-[11px]">{article.readTime}</span>
            <span className="font-bold text-[#f7413e]">{article.category}</span>
          </div>
        </div>
      </article>
    );
  }

  // Sidebar / List Variant
  if (variant === 'sidebar') {
    return (
      <article className="group py-3.5 border-b border-gray-200 dark:border-white/10 last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors px-2 -mx-2 rounded">
        <div className="flex items-center space-x-2 text-[10px] text-gray-600 dark:text-gray-400 font-mono uppercase mb-1">
          <span className="font-bold text-black dark:text-white">{article.category}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
        <Link href={`/news/${article.slug}`}>
          <h4 className="font-serif font-bold text-sm sm:text-base text-black dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h4>
        </Link>
        <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mt-2">
          <span className="font-mono">{article.readTime}</span>
          <span className="text-[#f7413e] font-medium text-[10px] uppercase">Read Story</span>
        </div>
      </article>
    );
  }

  // Compact Variant
  if (variant === 'compact') {
    return (
      <article className="group py-3 border-b border-gray-200 dark:border-white/15">
        <div className="flex items-center space-x-2 text-[10px] text-gray-600 dark:text-gray-400 uppercase font-mono mb-1">
          <span className="text-[#f7413e] font-semibold">{article.category}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
        <Link href={`/news/${article.slug}`}>
          <h4 className="font-serif font-bold text-sm text-black dark:text-white group-hover:text-[#f7413e] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
        </Link>
      </article>
    );
  }

  // Featured Paper Card Variant
  if (variant === 'featured') {
    return (
      <article className="group flex flex-col h-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/15 p-5 rounded-none hover:shadow-md transition-all">
        <Link href={`/news/${article.slug}`} className="block relative aspect-[16/10] mb-4 overflow-hidden bg-gray-100 dark:bg-[#222222]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-white dark:bg-[#111111] text-black dark:text-white font-oswald text-[10px] uppercase px-2 py-0.5 font-bold tracking-wider border border-gray-200 dark:border-white/10">
              {article.category}
            </span>
          </div>
        </Link>

        <div className="text-[11px] font-mono text-gray-600 dark:text-gray-400 mb-1.5 flex items-center space-x-2">
          <span>{article.date}</span>
        </div>

        <Link href={`/news/${article.slug}`}>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-black dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mb-2">
            {article.title}
          </h3>
        </Link>

        {showExcerpt && (
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 mb-4">
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
          <span className="font-mono text-gray-600 dark:text-gray-400">{article.readTime}</span>
          <Link
            href={`/news/${article.slug}`}
            className="font-bold text-black dark:text-white group-hover:text-[#f7413e] flex items-center space-x-1"
          >
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    );
  }

  // Standard Grid Card Variant (Default)
  return (
    <article className="group flex flex-col h-full bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/15 p-4 hover:border-black dark:hover:border-white/30 hover:shadow-sm transition-all">
      <Link href={`/news/${article.slug}`} className="block relative aspect-[16/10] mb-3.5 overflow-hidden bg-gray-100 dark:bg-[#222222]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-black text-white font-oswald text-[10px] uppercase px-2 py-0.5 tracking-wider font-bold">
            {article.category}
          </span>
        </div>
      </Link>

      <div className="flex items-center space-x-2 text-[11px] text-gray-600 dark:text-gray-400 font-mono uppercase mb-1.5">
        <span>{article.date}</span>
      </div>

      <Link href={`/news/${article.slug}`}>
        <h3 className="font-serif text-base sm:text-lg font-bold text-black dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
      </Link>

      {showExcerpt && (
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span className="font-mono text-[11px]">{article.readTime}</span>
        <Link
          href={`/news/${article.slug}`}
          className="font-bold text-black dark:text-white group-hover:text-[#f7413e] flex items-center space-x-1"
        >
          <span>Read Story</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
