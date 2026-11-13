import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArticles, getArticleBySlug, getRelatedArticles, getSiteConfig } from '@/data/db';
import { getCachedArticleBySlug, getCachedArticleSummaries } from '@/lib/supabaseService';
import { getCategorySlug } from '@/data/categories';
import AmbientImage from '@/components/AmbientImage';
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
import { linkifyHtml, renderRichInline, getCleanPlainExcerpt } from '@/lib/linkify';
import { getBlogUrl } from '@/lib/blogUrl';

export const revalidate = 60;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Pre-render local baseline routes at build time; Supabase-authored stories render via on-demand ISR
  // so build concurrency never hits Postgres timeouts and bakes false 404s.
  return getArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const localArticle = getArticleBySlug(slug);
  const dbArticle = await getCachedArticleBySlug(slug).catch(() => null);
  const article = dbArticle
    ? {
        ...dbArticle,
        metaTitle: localArticle?.metaTitle || dbArticle.metaTitle,
        metaDescription: localArticle?.metaDescription || dbArticle.metaDescription,
        keywords: localArticle?.keywords || dbArticle.keywords,
        primaryKeyword: localArticle?.primaryKeyword || dbArticle.primaryKeyword,
      }
    : localArticle;
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  if (!article) {
    return {
      title: 'Story Not Found',
      description: 'The requested editorial story could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const catSlug = getCategorySlug(article.category);
  const articleUrl = `${baseUrl}/${catSlug}/${article.slug}`;
  const parsedKeywords = Array.isArray(article.keywords)
    ? (article.keywords as unknown as string[]).map((k) => String(k).trim()).filter(Boolean)
    : typeof article.keywords === 'string'
    ? article.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];
  const keywords =
    parsedKeywords.length > 0
      ? parsedKeywords
      : [
          article.tag,
          article.category,
          'editorial story',
          'journalism',
          siteConfig.name,
          'news analysis',
        ].filter(Boolean) as string[];

  const resolvedMetaTitle = article.metaTitle || `${article.title} | ${siteConfig.name}`;
  const resolvedMetaDesc = getCleanPlainExcerpt(
    article.metaDescription,
    article.excerpt,
    article.content || (Array.isArray(article.paragraphs) ? article.paragraphs[0] : '')
  );

  return {
    title: {
      absolute: resolvedMetaTitle,
    },
    description: resolvedMetaDesc,
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
      title: resolvedMetaTitle,
      description: resolvedMetaDesc,
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
      title: resolvedMetaTitle,
      description: resolvedMetaDesc,
      images: [article.image],
      creator: siteConfig.socialLinks?.twitter || '@apexchief01',
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dbArticle = await getCachedArticleBySlug(slug).catch(() => null);
  const article = dbArticle || getArticleBySlug(slug);
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  if (!article) {
    notFound();
  }

  const catSlug = getCategorySlug(article.category);

  // 301 Permanent Redirect to canonical /category/blog-title path if category is not news
  if (catSlug !== 'news') {
    permanentRedirect(`/${catSlug}/${article.slug}`);
  }

  const dbSummaries = await getCachedArticleSummaries().catch(() => []);
  const allArticles = dbSummaries && dbSummaries.length > 0 ? dbSummaries : getArticles();
  const eligibleOthers = allArticles.filter((a) => a.slug !== article.slug && !a.excludeFromPopularPosts);
  const sameCategoryArticles = eligibleOthers.filter(
    (a) => a.category?.toLowerCase() === article.category?.toLowerCase()
  );
  const relatedArticles = [
    ...sameCategoryArticles,
    ...eligibleOthers.filter((a) => a.category?.toLowerCase() !== article.category?.toLowerCase()),
  ].slice(0, 3);

  const top10RankedArticles = allArticles
    .filter((a) => a.slug !== article.slug && !a.excludeFromPopularPosts)
    .sort((a, b) => ((b.top10VisitCount || b.viewsCount || 0) - (a.top10VisitCount || a.viewsCount || 0)))
    .slice(0, 5);

  const articleUrl = `${baseUrl}/news/${article.slug}`;
  const shouldShowFeaturedImage = article.showFeaturedImage !== false && article.showFeaturedImage !== 'No' && article.showFeaturedImage !== 'no';
  const sidebarPos = article.sidebarPosition || 'none'; // 'right' | 'left' | 'none'
  const shouldShowPopularPosts = !article.disablePopularPostsDisplay;

  const isoDate = (() => {
    try {
      const parsed = Date.parse(article.date);
      return !isNaN(parsed) ? new Date(parsed).toISOString() : '2026-09-02T08:00:00.000Z';
    } catch {
      return '2026-09-02T08:00:00.000Z';
    }
  })();

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
        headline: article.metaTitle || article.title,
        description: getCleanPlainExcerpt(
          article.metaDescription,
          article.excerpt,
          article.content || (Array.isArray(article.paragraphs) ? article.paragraphs[0] : '')
        ),
        image: [
          article.image?.startsWith('http') ? article.image : `${baseUrl}${article.image || '/images/apexchief-logo-light.png'}`
        ],
        datePublished: isoDate,
        dateModified: isoDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        articleSection: article.category,
        keywords: [
          ...(Array.isArray(article.keywords)
            ? (article.keywords as unknown as string[])
            : typeof article.keywords === 'string'
            ? article.keywords.split(',').map((s) => s.trim()).filter(Boolean)
            : []),
          ...(Array.isArray(article.targetedKeywords)
            ? (article.targetedKeywords as unknown as string[])
            : typeof article.targetedKeywords === 'string'
            ? article.targetedKeywords.split(',').map((s) => s.trim()).filter(Boolean)
            : []),
          article.tag,
          article.category,
          siteConfig.name,
        ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', '),
        author: [
          {
            '@type': 'Person',
            name: article.author || 'ApexChief Editorial Team',
            jobTitle: article.authorRole || 'Editor',
            image: article.authorAvatar,
            url: `${baseUrl}/write-for-us`,
          },
        ],
        publisher: {
          '@type': 'Organization',
          '@id': 'https://www.apexchief.com/#organization',
          name: 'ApexChief',
          url: 'https://www.apexchief.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.apexchief.com/images/apexchief-logo-light.png',
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
            item: `${baseUrl}/category/${getCategorySlug(article.category)}`,
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
        <nav aria-label="Breadcrumb" className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-6 border-b border-[#211d1d]/15 dark:border-white/15 text-xs font-mono uppercase text-[#575757] dark:text-[#a3a3a3] overflow-hidden no-scrollbar">
          <div className="flex items-center space-x-2 flex-wrap">
            <Link
              href="/"
              className="hover:text-[#f7413e] dark:hover:text-[#f7413e] transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${getCategorySlug(article.category)}`}
              className="hover:text-[#f7413e] dark:hover:text-[#f7413e] transition-colors"
            >
              {article.category}
            </Link>
            <span>/</span>
            <span
              className="font-bold text-[#0a0a0a] dark:text-white truncate max-w-[200px] sm:max-w-[340px]"
              title={article.title}
            >
              {article.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline">Published:</span>
            <time dateTime={article.date} className="font-semibold text-[#211d1d] dark:text-[#ffffff]">
              {article.date}
            </time>
          </div>
        </nav>

        {/* Article Header & Headline: Left-aligned, full width, compact editorial scale */}
        <header className="w-full text-left mt-2 mb-5">
          <h1
            itemProp="headline"
            className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#0a0a0a] dark:text-[#ffffff] leading-snug tracking-tight mb-2.5"
          >
            {renderRichInline(article.title)}
          </h1>

          <p
            itemProp="description"
            className="font-serif italic text-sm sm:text-[15px] text-[#575757] dark:text-[#c4c4c4] leading-[1.45] w-full text-left mb-3.5"
          >
            {renderRichInline(
              article.excerpt,
              article.content || (Array.isArray(article.paragraphs) ? article.paragraphs[0] : '')
            )}
          </p>

          {/* Meta Info Bar (Date, Read Time, Tag) */}
          <div className="py-2.5 border-t border-b border-[#211d1d]/15 dark:border-white/15 flex flex-wrap items-center justify-start gap-4 sm:gap-5 text-[11px] text-[#575757] dark:text-[#a3a3a3] font-mono uppercase">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#f7413e]" />
              <time dateTime={article.date} itemProp="datePublished">
                {article.date}
              </time>
            </div>

            <div className="hidden sm:inline-block text-[#575757]/40 dark:text-white/30">•</div>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#002b5c] dark:text-[#60a5fa]" />
              <span>{article.readTime}</span>
            </div>

            {article.tag && (
              <>
                <div className="hidden sm:inline-block text-[#575757]/40 dark:text-white/30">•</div>
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-[#575757] dark:text-[#a3a3a3]" />
                  <span className="text-[#575757] dark:text-[#a3a3a3]">{article.tag}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Hero Featured Image (Controlled by "Show featured image on single post"): Full width 3:2 (1200x800 uncropped) */}
        {shouldShowFeaturedImage && (
          <div className="w-full my-5">
            <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg border border-[#211d1d]/15 dark:border-white/15 shadow-sm">
              <AmbientImage
                src={article.image}
                alt={article.title}
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            <div className="text-left text-[11px] font-mono text-[#575757] dark:text-[#a3a3a3] mt-1.5 italic">
              Photography & Editorial Archive — {siteConfig.name} Special Report
            </div>
          </div>
        )}

        {/* Main Content Layout: Full container width left-to-right */}
        <div className={`w-full my-6 ${
          sidebarPos === 'right'
            ? 'flex flex-col lg:flex-row gap-8 items-start'
            : sidebarPos === 'left'
            ? 'flex flex-col lg:flex-row-reverse gap-8 items-start'
            : ''
        }`}>
          {/* Article Body Content */}
          <div className={sidebarPos !== 'none' ? 'w-full lg:w-2/3 text-left' : 'w-full text-left'} itemProp="articleBody">
            {/* Social Share Bar */}
            <ShareButtons title={article.title} />

            {/* Rich Body Content (WYSIWYG HTML or Structured Paragraphs) */}
            {article.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: linkifyHtml(article.content) }}
                className="article-rich-content text-[15px] sm:text-base leading-[1.48] text-[#211d1d]/90 dark:text-[#e5e7eb] space-y-3 my-4 font-sans text-left"
              />
            ) : (
              <>
                {/* Lead Paragraph with Drop Cap */}
                {Array.isArray(article.paragraphs) && article.paragraphs[0] && (
                  <p className="drop-cap font-sans text-base sm:text-[17px] text-[#211d1d] dark:text-[#f5f4ef] leading-[1.48] mb-4 text-left">
                    {renderRichInline(article.paragraphs[0])}
                  </p>
                )}

                {/* Subheadings and Content Sections */}
                {Array.isArray(article.sections) && article.sections.length > 0 ? (
                  article.sections.map((sec, idx) => (
                    <section key={idx} className="my-4 text-left">
                      <h2 className="font-sans text-lg sm:text-xl font-bold text-[#0a0a0a] dark:text-[#ffffff] mt-5 mb-2 border-b border-[#211d1d]/10 dark:border-white/10 pb-1.5">
                        {renderRichInline(sec.heading || '')}
                      </h2>
                      <p className="font-sans text-[15px] sm:text-base text-[#211d1d]/90 dark:text-[#e5e7eb] leading-[1.48]">
                        {renderRichInline(sec.content || '')}
                      </p>
                    </section>
                  ))
                ) : (
                  (Array.isArray(article.paragraphs) ? article.paragraphs.slice(1) : []).map((p, idx) => (
                    <p
                      key={idx}
                      className="font-sans text-[15px] sm:text-base text-[#211d1d]/90 dark:text-[#e5e7eb] leading-[1.48] my-3 text-left"
                    >
                      {renderRichInline(p)}
                    </p>
                  ))
                )}
              </>
            )}

            {/* Editorial Pull Quote */}
            <div className="my-6 p-4 sm:p-5 bg-[#eff0e0] dark:bg-[#1c1c1c] border-l-4 border-[#f7413e] relative">
              <Quote className="w-7 h-7 text-[#f7413e]/20 absolute top-3 right-3" />
              <blockquote className="font-sans italic text-base sm:text-lg text-[#0a0a0a] dark:text-[#ffffff] leading-[1.48] mb-2">
                &ldquo;Modern reporting requires not just speed, but the depth to analyze how rapid technological and cultural shifts reshape community resilience.&rdquo;
              </blockquote>
              <cite className="text-xs font-mono uppercase font-bold text-[#575757] dark:text-[#a3a3a3] not-italic block">
                — {siteConfig.name} Editorial Board
              </cite>
            </div>
          </div>

          {/* Optional Sidebar (Appearance Position: Right / Left) */}
          {sidebarPos !== 'none' && (
            <aside className="w-full lg:w-1/3 space-y-6 shrink-0">
              {/* Top 10 / Popular Posts Widget */}
              {shouldShowPopularPosts && top10RankedArticles.length > 0 && (
                <div className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/15 p-4 rounded-md">
                  <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-[#f7413e]">
                    <span className="w-2 h-2 bg-[#f7413e]"></span>
                    <h3 className="font-oswald text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                      Popular Top 10 Stories
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {top10RankedArticles.map((pop, idx) => (
                      <Link
                        key={pop.slug}
                        href={getBlogUrl(pop)}
                        className="flex items-start space-x-3 group block"
                      >
                        <span className="font-oswald text-xs font-bold text-[#f7413e] shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold font-serif line-clamp-2 text-black dark:text-white group-hover:text-[#f7413e] transition-colors leading-snug">
                            {pop.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 block">
                            {pop.category}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar Newsletter Widget */}
              <div className="bg-[#0a0a0a] text-white p-5 rounded-md border border-white/10 text-center">
                <span className="text-[10px] font-mono text-[#f7413e] uppercase font-bold tracking-widest block mb-1">
                  ApexChief Dispatch
                </span>
                <h4 className="font-serif text-lg font-bold mb-2">Executive Briefing</h4>
                <p className="text-xs text-gray-400 mb-4 font-sans">
                  Direct intelligence on global markets and technology.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter executive email..."
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#f7413e]"
                  />
                  <button className="w-full bg-[#f7413e] hover:bg-[#d63431] text-white py-1.5 rounded text-xs font-oswald uppercase tracking-wider font-bold transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Newsletter Dispatch Component */}
        <NewsletterBanner />

        {/* Related Stories Recommendation Grid (Controlled by "Disable Popular Posts display") */}
        {shouldShowPopularPosts && (
          <section className="my-14 pt-8 border-t-2 border-[#211d1d] dark:border-white/30">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#211d1d]/15 dark:border-white/15">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#f7413e]"></span>
                <h3 className="font-serif text-2xl font-bold text-[#0a0a0a] dark:text-[#ffffff]">
                  Related Editorial Stories
                </h3>
              </div>
              <Link
                href={`/category/${getCategorySlug(article.category)}`}
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
        )}
      </article>
    </>
  );
}
