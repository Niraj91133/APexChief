import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArticles, getArticleBySlug, getSiteConfig } from '@/data/db';
import { getCachedArticleBySlug, getCachedArticleSummaries } from '@/lib/supabaseService';
import { getCategorySlug, CATEGORIES } from '@/data/categories';
import ArticleHeroImage from '@/components/ArticleHeroImage';
import BlogSplitSidebar from '@/components/BlogSplitSidebar';
import ArticleCard from '@/components/ArticleCard';
import NewsletterBanner from '@/components/NewsletterBanner';
import {
  Clock,
  Calendar,
  Quote,
  Tag,
} from 'lucide-react';
import ShareButtons from '@/app/news/[slug]/ShareButtons';
import ArticleViewTracker from '@/components/ArticleViewTracker';
import { linkifyHtml, renderRichInline, getCleanPlainExcerpt } from '@/lib/linkify';
import { buildBlogSidebarLists } from '@/lib/articleSidebars';

export const revalidate = 60;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Pre-render local baseline routes at build time; Supabase-authored stories render via on-demand ISR
  // so build concurrency never hits Postgres timeouts and bakes false 404s.
  return getArticles().map((article) => ({
    category: getCategorySlug(article.category),
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
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

  const expectedCatSlug = getCategorySlug(article.category);
  const articleUrl = `${baseUrl}/${expectedCatSlug}/${article.slug}`;
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

export default async function CategoryArticleDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const [dbArticle, dbSummaries] = await Promise.all([
    getCachedArticleBySlug(slug).catch(() => null),
    getCachedArticleSummaries().catch(() => []),
  ]);
  const article = dbArticle || getArticleBySlug(slug);
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  if (!article || ['trash', 'draft'].includes(String(article.status || 'Published').trim().toLowerCase())) {
    notFound();
  }

  const expectedCatSlug = getCategorySlug(article.category);

  // If URL category slug doesn't match the canonical category, redirect to canonical URL
  if (category.toLowerCase() !== expectedCatSlug.toLowerCase()) {
    permanentRedirect(`/${expectedCatSlug}/${article.slug}`);
  }

  const allArticles = dbSummaries && dbSummaries.length > 0 ? dbSummaries : getArticles();
  const eligibleOthers = allArticles.filter((a) => a.slug !== article.slug && !a.excludeFromPopularPosts);
  const sameCategoryArticles = eligibleOthers.filter(
    (a) => a.category?.toLowerCase() === article.category?.toLowerCase()
  );
  const relatedArticles = [
    ...sameCategoryArticles,
    ...eligibleOthers.filter((a) => a.category?.toLowerCase() !== article.category?.toLowerCase()),
  ].slice(0, 3);

  const { latestArticles, interviewArticles } = buildBlogSidebarLists(allArticles, article.slug);

  const articleUrl = `${baseUrl}/${expectedCatSlug}/${article.slug}`;
  const shouldShowFeaturedImage = article.showFeaturedImage !== false && article.showFeaturedImage !== 'No' && article.showFeaturedImage !== 'no';
  const sidebarPos = article.sidebarPosition || 'right';

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
            item: `${baseUrl}/category/${expectedCatSlug}`,
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
        {/* Two-Part Blog Layout: Left Full Blog Column + Right Fixed/Sticky Latest & Interview Panel (stops above bottom Editorial section) */}
        <div className={`w-full flex flex-col ${sidebarPos === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-start`}>
          {/* Left Column: Complete Blog Article */}
          <div className="w-full lg:flex-1 min-w-0 text-left">
            {/* Top Breadcrumb & Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-5 border-b border-[#211d1d]/15 dark:border-white/15 text-xs font-mono uppercase text-[#575757] dark:text-[#a3a3a3] overflow-hidden no-scrollbar">
              <div className="flex items-center space-x-2 flex-wrap">
                <Link
                  href="/"
                  className="hover:text-[#f7413e] dark:hover:text-[#f7413e] transition-colors"
                >
                  Home
                </Link>
                <span>/</span>
                <Link
                  href={`/category/${expectedCatSlug}`}
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

            {/* Article Header & Headline: Left-aligned, compact editorial scale */}
            <header className="w-full text-left mt-1 mb-5">
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

            {/* Hero Featured Image: Self-fitting full aspect container with zero empty space & zero cropping */}
            {shouldShowFeaturedImage && (
              <ArticleHeroImage
                src={article.image}
                alt={article.title}
                caption={`Photography & Editorial Archive — ${siteConfig.name} Special Report`}
              />
            )}

            {/* Article Body Content */}
            <div className="w-full my-5 text-left" itemProp="articleBody">
              {/* Social Share Bar */}
              <ShareButtons title={article.title} />

              {/* Rich Body Content (WYSIWYG HTML or Structured Paragraphs) in clean sans-serif */}
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
                  — {article.author}, {article.authorRole}
                </cite>
              </div>

              {/* Author Byline / Bio Box */}
              <div className="my-8 p-5 sm:p-6 bg-[#fdfdfc] dark:bg-[#151515] border border-[#211d1d]/15 dark:border-white/15 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#f7413e]/30">
                  <Image
                    src={article.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'}
                    alt={article.author || 'Author'}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="text-left flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#f7413e]/10 text-[#f7413e] font-bold inline-block mb-1.5">
                    Editorial Dispatch
                  </span>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#0a0a0a] dark:text-[#ffffff]">
                    {article.author}
                  </h3>
                  <p className="text-xs font-mono text-[#575757] dark:text-[#a3a3a3] mb-2">
                    {article.authorRole}
                  </p>
                  <p className="text-sm font-sans text-[#211d1d]/80 dark:text-[#d1d5db] leading-[1.48]">
                    Focusing on geopolitical transitions, enterprise technology scaling, sovereign AI deployments, and structural macroeconomics across the MENA and global financial corridors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fixed/Sticky Latest & Interview Tabs Panel (stops cleanly above bottom Editorial section) */}
          <aside className="w-full lg:w-[340px] xl:w-[360px] shrink-0 lg:sticky lg:top-36">
            <BlogSplitSidebar
              latestArticles={latestArticles}
              interviewArticles={interviewArticles}
            />
          </aside>
        </div>

        {/* Newsletter Signup Section */}
        <div className="my-10 border-t border-b border-[#211d1d]/15 dark:border-white/15 py-8">
          <div className="max-w-2xl mx-auto text-center px-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#f7413e] font-bold block mb-2">
              Stay Informed
            </span>
            <h4 className="font-sans text-xl sm:text-2xl font-bold text-[#0a0a0a] dark:text-white mb-2.5">Executive Intelligence Delivered Weekly</h4>
            <p className="text-sm font-sans text-[#575757] dark:text-[#c4c4c4] mb-5 leading-[1.48]">
              Curated strategic teardowns, venture dispatches, and sovereign policy updates delivered directly to your inbox.
            </p>
            <NewsletterBanner />
          </div>
        </div>

        {/* Related Coverage Grid */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-8 border-t border-[#211d1d]/15 dark:border-white/15">
            <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-[#0a0a0a] dark:border-white">
              <h3 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-[#0a0a0a] dark:text-[#ffffff]">
                Related Coverage in {article.category}
              </h3>
              <Link
                href={`/category/${expectedCatSlug}`}
                className="text-xs font-mono uppercase text-[#f7413e] hover:underline"
              >
                View Category Archive →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedArticles.map((relArt) => (
                <ArticleCard key={relArt.slug} article={relArt} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
