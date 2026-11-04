import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArticles, getArticleBySlug, getSiteConfig } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
import { getCategorySlug, CATEGORIES } from '@/data/categories';
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
import ShareButtons from '@/app/news/[slug]/ShareButtons';
import ArticleViewTracker from '@/components/ArticleViewTracker';
import { linkifyText, linkifyHtml } from '@/lib/linkify';
import { getBlogUrl } from '@/lib/blogUrl';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const dbArticles = await getArticlesFromDB();
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  return articles.map((article) => ({
    category: getCategorySlug(article.category),
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const dbArticles = await getArticlesFromDB();
  const article = dbArticles?.find((a) => a.slug === slug || a.id === slug) || getArticleBySlug(slug);
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
  const keywords = article.keywords
    ? article.keywords.split(',').map((k) => k.trim())
    : [
        article.tag,
        article.category,
        'editorial story',
        'journalism',
        siteConfig.name,
        'news analysis',
      ].filter(Boolean) as string[];

  const resolvedMetaTitle = article.metaTitle
    ? (article.metaTitle.toLowerCase().includes(siteConfig.name.toLowerCase())
        ? article.metaTitle
        : `${article.metaTitle} | ${siteConfig.name}`)
    : `${article.title} | ${siteConfig.name}`;
  const resolvedMetaDesc = article.metaDescription || article.excerpt;

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
  const dbArticles = await getArticlesFromDB();
  const article = dbArticles?.find((a) => a.slug === slug || a.id === slug) || getArticleBySlug(slug);
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  if (!article) {
    notFound();
  }

  const expectedCatSlug = getCategorySlug(article.category);

  // If URL category slug doesn't match the canonical category, redirect to canonical URL
  if (category.toLowerCase() !== expectedCatSlug.toLowerCase()) {
    permanentRedirect(`/${expectedCatSlug}/${article.slug}`);
  }

  const allArticles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug && !a.excludeFromPopularPosts && (a.category.toLowerCase() === article.category.toLowerCase() || true))
    .slice(0, 3);

  const top10RankedArticles = allArticles
    .filter((a) => a.slug !== article.slug && !a.excludeFromPopularPosts)
    .sort((a, b) => ((b.top10VisitCount || b.viewsCount || 0) - (a.top10VisitCount || a.viewsCount || 0)))
    .slice(0, 5);

  const articleUrl = `${baseUrl}/${expectedCatSlug}/${article.slug}`;
  const shouldShowFeaturedImage = article.showFeaturedImage !== false && article.showFeaturedImage !== 'No' && article.showFeaturedImage !== 'no';
  const sidebarPos = article.sidebarPosition || 'none';
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
        headline: article.title,
        description: article.excerpt,
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
        keywords: [article.tag, article.category, siteConfig.name].filter(Boolean).join(', '),
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

        {/* Article Header & Headline: Kept in serif */}
        <header className="max-w-4xl mx-auto text-center mt-3 mb-6 sm:mb-8">
          <h1
            itemProp="headline"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] dark:text-[#ffffff] leading-tight tracking-tight mb-4 sm:mb-5"
          >
            {linkifyText(article.title)}
          </h1>

          <p
            itemProp="description"
            className="font-serif italic text-base sm:text-lg text-[#575757] dark:text-[#c4c4c4] leading-relaxed max-w-2xl mx-auto mb-5"
          >
            {linkifyText(article.excerpt)}
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
        {shouldShowFeaturedImage && (
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
        )}

        {/* Main Content Layout with Dynamic Sidebar Position */}
        <div className={`max-w-5xl mx-auto my-10 ${
          sidebarPos === 'right'
            ? 'flex flex-col lg:flex-row gap-8 items-start'
            : sidebarPos === 'left'
            ? 'flex flex-col lg:flex-row-reverse gap-8 items-start'
            : 'max-w-3xl mx-auto'
        }`}>
          {/* Article Body Content: Rendered in Sans-Serif font-sans */}
          <div className={sidebarPos !== 'none' ? 'w-full lg:w-2/3' : 'w-full'} itemProp="articleBody">
            {/* Social Share Bar */}
            <ShareButtons title={article.title} />

            {/* Rich Body Content (WYSIWYG HTML or Structured Paragraphs) in clean sans-serif */}
            {article.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: linkifyHtml(article.content) }}
                className="article-rich-content text-base sm:text-lg leading-relaxed text-[#211d1d]/90 dark:text-[#e0ded6] space-y-6 my-6 font-sans"
              />
            ) : (
              <>
                {/* Lead Paragraph with Drop Cap */}
                {article.paragraphs[0] && (
                  <p className="drop-cap font-sans text-lg sm:text-xl text-[#211d1d] dark:text-[#f5f4ef] leading-relaxed mb-8">
                    {linkifyText(article.paragraphs[0])}
                  </p>
                )}

                {/* Subheadings and Content Sections */}
                {article.sections && article.sections.length > 0 ? (
                  article.sections.map((sec, idx) => (
                    <section key={idx} className="my-8">
                      <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#0a0a0a] dark:text-[#ffffff] mt-8 mb-4 border-b border-[#211d1d]/10 dark:border-white/10 pb-2">
                        {linkifyText(sec.heading)}
                      </h2>
                      <p className="font-sans text-base sm:text-lg text-[#211d1d]/90 dark:text-[#e0ded6] leading-relaxed">
                        {linkifyText(sec.content)}
                      </p>
                    </section>
                  ))
                ) : (
                  article.paragraphs.slice(1).map((p, idx) => (
                    <p
                      key={idx}
                      className="font-sans text-base sm:text-lg text-[#211d1d]/90 dark:text-[#e0ded6] leading-relaxed my-6"
                    >
                      {linkifyText(p)}
                    </p>
                  ))
                )}
              </>
            )}

            {/* Editorial Pull Quote */}
            <div className="my-10 p-6 sm:p-8 bg-[#eff0e0] dark:bg-[#1c1c1c] border-l-4 border-[#f7413e] relative">
              <Quote className="w-8 h-8 text-[#f7413e]/20 absolute top-4 right-4" />
              <blockquote className="font-sans italic text-lg sm:text-xl text-[#0a0a0a] dark:text-[#ffffff] leading-relaxed mb-3">
                &ldquo;Modern reporting requires not just speed, but the depth to analyze how rapid technological and cultural shifts reshape community resilience.&rdquo;
              </blockquote>
              <cite className="text-xs font-mono uppercase font-bold text-[#575757] dark:text-[#a3a3a3] not-italic block">
                — {article.author}, {article.authorRole}
              </cite>
            </div>

            {/* Author Byline / Bio Box */}
            <div className="my-12 p-6 sm:p-8 bg-[#fdfdfc] dark:bg-[#151515] border border-[#211d1d]/15 dark:border-white/15 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#f7413e]/30">
                <Image
                  src={article.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'}
                  alt={article.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#f7413e]/10 text-[#f7413e] font-bold inline-block mb-2">
                  Editorial Dispatch
                </span>
                <h3 className="font-sans font-bold text-lg text-[#0a0a0a] dark:text-[#ffffff]">
                  {article.author}
                </h3>
                <p className="text-xs font-mono text-[#575757] dark:text-[#a3a3a3] mb-3">
                  {article.authorRole}
                </p>
                <p className="text-sm font-sans text-[#211d1d]/80 dark:text-[#c4c4c4] leading-relaxed">
                  Focusing on geopolitical transitions, enterprise technology scaling, sovereign AI deployments, and structural macroeconomics across the MENA and global financial corridors.
                </p>
              </div>
            </div>
          </div>

          {/* Optional Sidebar (when enabled in CMS) */}
          {sidebarPos !== 'none' && shouldShowPopularPosts && (
            <aside className="w-full lg:w-1/3 space-y-8">
              <div className="p-6 bg-[#f8fafc] dark:bg-[#181818] border border-[#211d1d]/15 dark:border-white/15 sticky top-24">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#211d1d]/15 dark:border-white/15">
                  <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#0a0a0a] dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#f7413e]" />
                    Trending Briefs
                  </h3>
                  <span className="text-[10px] font-mono text-[#575757]">Apex Intelligence</span>
                </div>
                <div className="space-y-4">
                  {top10RankedArticles.map((pop, idx) => (
                    <div key={pop.slug} className="group/pop flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-white/10 last:border-0 last:pb-0">
                      <span className="font-mono text-sm font-bold text-[#f7413e] flex-shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <Link
                        href={getBlogUrl(pop)}
                        className="text-xs font-sans font-medium line-clamp-2 text-black dark:text-white group-hover/pop:text-[#f7413e] transition-colors leading-snug"
                      >
                        {pop.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Newsletter Signup Section */}
        <div className="my-14 border-t border-b border-[#211d1d]/15 dark:border-white/15 py-10">
          <div className="max-w-2xl mx-auto text-center px-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#f7413e] font-bold block mb-2">
              Stay Informed
            </span>
            <h4 className="font-sans text-xl sm:text-2xl font-bold mb-3">Executive Intelligence Delivered Weekly</h4>
            <p className="text-sm font-sans text-[#575757] dark:text-[#a3a3a3] mb-6 leading-relaxed">
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
