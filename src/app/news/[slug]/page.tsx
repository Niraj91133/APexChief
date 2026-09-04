import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArticles, getArticleBySlug, getRelatedArticles, getSiteConfig } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
import ArticleCard from '@/components/ArticleCard';
import NewsletterBanner from '@/components/NewsletterBanner';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Quote,
  Share2,
  Tag,
  BookOpen,
} from 'lucide-react';
import ShareButtons from './ShareButtons';
import ArticleViewTracker from '@/components/ArticleViewTracker';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const dbArticles = await getArticlesFromDB();
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbArticles = await getArticlesFromDB();
  const article = dbArticles?.find((a) => a.slug === slug || a.id === slug) || getArticleBySlug(slug);
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007';

  if (!article) {
    return {
      title: `Story Not Found — ${siteConfig.name}`,
      description: 'The requested editorial story could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const articleUrl = `${baseUrl}/news/${article.slug}`;
  const keywords = [
    article.tag,
    article.category,
    'editorial story',
    'journalism',
    siteConfig.name,
    'news analysis',
  ].filter(Boolean) as string[];

  return {
    title: `${article.title} — ${siteConfig.name}`,
    description: article.excerpt,
    keywords: keywords,
    authors: [{ name: article.author }],
    creator: article.author,
    publisher: siteConfig.name,
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: [article.author],
      section: article.category,
      tags: [article.tag || article.category],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      creator: siteConfig.socialLinks?.twitter || '@ApexChief',
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dbArticles = await getArticlesFromDB();
  const article = dbArticles?.find((a) => a.slug === slug || a.id === slug) || getArticleBySlug(slug);
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007';

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);
  const articleUrl = `${baseUrl}/news/${article.slug}`;

  // Structured Data Schema for Google Search Rich Results (NewsArticle & BreadcrumbList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${articleUrl}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: siteConfig.name,
          url: baseUrl,
        },
        headline: article.title,
        description: article.excerpt,
        image: [article.image],
        datePublished: article.date,
        dateModified: article.date,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        articleSection: article.category,
        keywords: [article.tag, article.category, siteConfig.name].filter(Boolean).join(', '),
        author: {
          '@type': 'Person',
          name: article.author,
          jobTitle: article.authorRole,
          image: article.authorAvatar,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: 'https://framerusercontent.com/images/zYn8Xte3IxdFPFqfnQCRr2eGyHY.svg',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: article.category,
            item: `${baseUrl}/news?category=${article.category.toLowerCase()}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Real-time Article View & Visitor Tracker */}
      <ArticleViewTracker slug={article.slug} />

      {/* Search Engine Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="w-full" itemScope itemType="https://schema.org/NewsArticle">
        {/* Top Breadcrumb & Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between pb-4 mb-6 border-b border-[#211d1d]/15 dark:border-white/15 text-xs font-mono uppercase text-[#575757] dark:text-[#a3a3a3]">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="hover:text-[#211d1d] dark:hover:text-[#ffffff] transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/news"
              className="hover:text-[#211d1d] dark:hover:text-[#ffffff] transition-colors"
            >
              Stories
            </Link>
            <span>/</span>
            <Link
              href={`/news?category=${article.category.toLowerCase()}`}
              className="text-[#f7413e] font-bold hover:underline"
            >
              {article.category}
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline">Published:</span>
            <time dateTime={article.date} className="font-semibold text-[#211d1d] dark:text-[#ffffff]">
              {article.date}
            </time>
          </div>
        </nav>

        {/* Article Header & Headline */}
        <header className="max-w-4xl mx-auto text-center mt-3 mb-6 sm:mb-8">
          <h1
            itemProp="headline"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] dark:text-[#ffffff] leading-tight tracking-tight mb-4 sm:mb-5"
          >
            {article.title}
          </h1>

          <p
            itemProp="description"
            className="font-serif italic text-base sm:text-lg text-[#575757] dark:text-[#c4c4c4] leading-relaxed max-w-2xl mx-auto mb-5"
          >
            {article.excerpt}
          </p>

          {/* Meta Info Bar (Date, Read Time, Tag) */}
          <div className="py-4 border-t border-b border-[#211d1d]/15 dark:border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#575757] dark:text-[#a3a3a3] font-mono uppercase">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#f7413e]" />
              <time dateTime={article.date} itemProp="datePublished">
                {article.date}
              </time>
            </div>

            <div className="hidden sm:inline-block text-[#575757]/30">•</div>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#002b5c] dark:text-[#60a5fa]" />
              <span>{article.readTime}</span>
            </div>

            {article.tag && (
              <>
                <div className="hidden sm:inline-block text-[#575757]/30">•</div>
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-[#575757] dark:text-[#a3a3a3]" />
                  <span className="text-[#575757] dark:text-[#a3a3a3]">{article.tag}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Hero Featured Image */}
        <div className="max-w-5xl mx-auto my-8">
          <div className="relative aspect-[16/9] w-full bg-[#eff0e0] dark:bg-[#1a1a1a] overflow-hidden border border-[#211d1d]/20 dark:border-white/15">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
          <div className="text-right text-[11px] font-mono text-[#575757] dark:text-[#888888] mt-2 italic">
            Photography & Editorial Archive — {siteConfig.name} Special Report
          </div>
        </div>

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto my-10" itemProp="articleBody">
          {/* Social Share Bar */}
          <ShareButtons title={article.title} />

          {/* Rich Body Content (WYSIWYG HTML or Structured Paragraphs) */}
          {article.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-rich-content text-base sm:text-lg leading-relaxed text-[#211d1d]/90 dark:text-[#e0ded6] space-y-6 my-6 font-serif"
            />
          ) : (
            <>
              {/* Lead Paragraph with Drop Cap */}
              {article.paragraphs[0] && (
                <p className="drop-cap font-serif text-lg sm:text-xl text-[#211d1d] dark:text-[#f5f4ef] leading-relaxed mb-8">
                  {article.paragraphs[0]}
                </p>
              )}

              {/* Subheadings and Content Sections */}
              {article.sections && article.sections.length > 0 ? (
                article.sections.map((sec, idx) => (
                  <section key={idx} className="my-8">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0a0a] dark:text-[#ffffff] mt-8 mb-4 border-b border-[#211d1d]/10 dark:border-white/10 pb-2">
                      {sec.heading}
                    </h2>
                    <p className="font-serif text-base sm:text-lg text-[#211d1d]/90 dark:text-[#e0ded6] leading-relaxed">
                      {sec.content}
                    </p>
                  </section>
                ))
              ) : (
                article.paragraphs.slice(1).map((p, idx) => (
                  <p
                    key={idx}
                    className="font-serif text-base sm:text-lg text-[#211d1d]/90 dark:text-[#e0ded6] leading-relaxed my-6"
                  >
                    {p}
                  </p>
                ))
              )}
            </>
          )}

          {/* Editorial Pull Quote */}
          <div className="my-10 p-6 sm:p-8 bg-[#eff0e0] dark:bg-[#1c1c1c] border-l-4 border-[#f7413e] relative">
            <Quote className="w-8 h-8 text-[#f7413e]/20 absolute top-4 right-4" />
            <blockquote className="font-serif italic text-lg sm:text-xl text-[#0a0a0a] dark:text-[#ffffff] leading-relaxed mb-3">
              &ldquo;Modern reporting requires not just speed, but the depth to analyze how rapid technological and cultural shifts reshape community resilience.&rdquo;
            </blockquote>
            <cite className="text-xs font-mono uppercase font-bold text-[#575757] dark:text-[#a3a3a3] not-italic block">
              — {siteConfig.name} Editorial Board
            </cite>
          </div>
        </div>

        {/* Newsletter Dispatch Component */}
        <NewsletterBanner />

        {/* Related Stories Recommendation Grid */}
        <section className="my-14 pt-8 border-t-2 border-[#211d1d] dark:border-white/30">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#211d1d]/15 dark:border-white/15">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#f7413e]"></span>
              <h3 className="font-serif text-2xl font-bold text-[#0a0a0a] dark:text-[#ffffff]">
                Related Editorial Stories
              </h3>
            </div>
            <Link
              href={`/news?category=${article.category.toLowerCase()}`}
              className="text-xs font-oswald uppercase tracking-wider font-bold text-[#211d1d] dark:text-[#f5f4ef] hover:text-[#f7413e] dark:hover:text-[#f7413e]"
            >
              More in {article.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.slug} article={rel} variant="standard" />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
