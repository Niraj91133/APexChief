import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArticles, getArticleBySlug, getRelatedArticles } from '@/data/db';
import ArticleCard from '@/components/ArticleCard';
import NewsletterBanner from '@/components/NewsletterBanner';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Quote,
} from 'lucide-react';
import ShareButtons from './ShareButtons';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Story Not Found — The Modern Times',
    };
  }

  return {
    title: `${article.title} — The Modern Times`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — The Modern Times`,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);

  return (
    <article className="w-full">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#211d1d]/15 text-xs font-mono uppercase text-[#575757]">
        <Link
          href="/news"
          className="hover:text-[#211d1d] flex items-center space-x-1.5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Stories</span>
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-[#f7413e] font-bold">{article.category}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
      </div>

      {/* Article Header & Headline */}
      <div className="max-w-4xl mx-auto text-center my-8">
        <div className="inline-block mb-3">
          <span className="bg-[#0a0a0a] text-[#fefdf3] font-oswald text-xs uppercase px-3 py-1 font-bold tracking-widest">
            {article.category}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] leading-tight tracking-tight mb-6">
          {article.title}
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-[#575757] leading-relaxed max-w-2xl mx-auto mb-6">
          {article.excerpt}
        </p>

        {/* Byline and Meta Info Bar */}
        <div className="py-4 border-t border-b border-[#211d1d]/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#575757] font-mono uppercase">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#eff0e0] border border-[#211d1d]/20">
              <Image
                src={article.authorAvatar}
                alt={article.author}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#0a0a0a]">{article.author}</div>
              <div className="text-[10px] text-[#6e6e6e] lowercase first-letter:uppercase">
                {article.authorRole}
              </div>
            </div>
          </div>

          <div className="hidden sm:inline-block text-[#575757]/30">•</div>

          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.date}</span>
          </div>

          <div className="hidden sm:inline-block text-[#575757]/30">•</div>

          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Hero Featured Image */}
      <div className="max-w-5xl mx-auto my-8">
        <div className="relative aspect-[16/9] w-full bg-[#eff0e0] overflow-hidden border border-[#211d1d]/20">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
        <div className="text-right text-[11px] font-mono text-[#575757] mt-2 italic">
          Photography & Editorial Archive — The Modern Times Special Report
        </div>
      </div>

      {/* Article Body Content */}
      <div className="max-w-3xl mx-auto my-10">
        {/* Social Share Bar */}
        <ShareButtons title={article.title} />

        {/* Lead Paragraph with Drop Cap */}
        {article.paragraphs[0] && (
          <p className="drop-cap font-serif text-lg sm:text-xl text-[#211d1d] leading-relaxed mb-8">
            {article.paragraphs[0]}
          </p>
        )}

        {/* Subheadings and Content Sections */}
        {article.sections && article.sections.length > 0 ? (
          article.sections.map((sec, idx) => (
            <div key={idx} className="my-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] mt-8 mb-4 border-b border-[#211d1d]/10 pb-2">
                {sec.heading}
              </h2>
              <p className="font-serif text-base sm:text-lg text-[#211d1d]/90 leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))
        ) : (
          article.paragraphs.slice(1).map((p, idx) => (
            <p
              key={idx}
              className="font-serif text-base sm:text-lg text-[#211d1d]/90 leading-relaxed my-6"
            >
              {p}
            </p>
          ))
        )}

        {/* Editorial Pull Quote */}
        <div className="my-10 p-6 sm:p-8 bg-[#eff0e0] border-l-4 border-[#f7413e] relative">
          <Quote className="w-8 h-8 text-[#f7413e]/20 absolute top-4 right-4" />
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#0a0a0a] leading-relaxed mb-3">
            &ldquo;Modern reporting requires not just speed, but the depth to analyze how rapid technological and cultural shifts reshape community resilience.&rdquo;
          </blockquote>
          <div className="text-xs font-mono uppercase font-bold text-[#575757]">
            — The Modern Times Editorial Board
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="my-12 p-6 sm:p-8 bg-[#eff0e0] border border-[#211d1d]/15 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#fefdf3] border-2 border-[#211d1d]/20 flex-shrink-0">
            <Image
              src={article.authorAvatar}
              alt={article.author}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#f7413e] font-bold">
              About The Journalist
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0a0a0a] mt-0.5">
              {article.author}
            </h3>
            <p className="text-xs sm:text-sm text-[#575757] mt-2 leading-relaxed">
              {article.author} is a {article.authorRole.toLowerCase()} at The Modern Times, covering {article.category.toLowerCase()} developments, cultural analysis, and global affairs with specialized focus on contemporary societal evolution.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Dispatch Component */}
      <NewsletterBanner />

      {/* Related Stories Recommendation Grid */}
      <section className="my-14 pt-8 border-t-2 border-[#211d1d]">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#211d1d]/15">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#f7413e]"></span>
            <h3 className="font-serif text-2xl font-bold text-[#0a0a0a]">
              Related Editorial Stories
            </h3>
          </div>
          <Link
            href="/news"
            className="text-xs font-oswald uppercase tracking-wider font-bold text-[#211d1d] hover:text-[#f7413e]"
          >
            View More →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <ArticleCard key={rel.slug} article={rel} variant="standard" />
          ))}
        </div>
      </section>
    </article>
  );
}
