import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  PenTool,
  ArrowLeft,
  CheckCircle2,
  Send,
  BookOpen,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  Mail,
  Award,
  HelpCircle,
} from 'lucide-react';
import WriteForUsForm from './WriteForUsForm';

export const metadata: Metadata = {
  title: 'Write For Us | Editorial Submission Guidelines | ApexChief',
  description:
    'Contribute thought leadership, executive perspectives, founder retrospectives, and industry analyses to ApexChief. Review our contributor guidelines and submit your editorial pitch.',
  alternates: {
    canonical: 'https://www.apexchief.com/write-for-us',
  },
  openGraph: {
    title: 'Write For Us | Editorial Submission Guidelines | ApexChief',
    description:
      'Contribute thought leadership, executive perspectives, founder retrospectives, and industry analyses to ApexChief. Review our contributor guidelines and submit your editorial pitch.',
    url: 'https://www.apexchief.com/write-for-us',
    siteName: 'ApexChief',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Write For Us | Contributor Guidelines | ApexChief',
    description:
      'Submit guest columns, executive insights, and industry deep dives to ApexChief editors.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.apexchief.com/write-for-us#webpage',
      url: 'https://www.apexchief.com/write-for-us',
      name: 'Write For Us - Editorial Contributor Guidelines',
      description:
        'Contribute thought leadership, executive perspectives, founder retrospectives, and industry analyses to ApexChief.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.apexchief.com/#website',
        name: 'ApexChief',
        url: 'https://www.apexchief.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.apexchief.com/write-for-us#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.apexchief.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Write For Us',
          item: 'https://www.apexchief.com/write-for-us',
        },
      ],
    },
  ],
};

export default function WriteForUsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Breadcrumb */}
      <div className="py-4 border-b border-[#211d1d]/15 dark:border-white/15 text-xs font-mono uppercase text-[#575757] dark:text-gray-400 flex items-center justify-between mb-8">
        <Link
          href="/"
          className="hover:text-black dark:hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Front Page</span>
        </Link>
        <span className="text-[#f7413e] font-semibold">Contributor Network</span>
      </div>

      {/* Hero Header */}
      <div className="mb-12 text-left">
        <div className="inline-flex items-center space-x-2 bg-[#0a0a0a] dark:bg-white text-white dark:text-black text-[10px] font-oswald uppercase px-2.5 py-1 tracking-widest font-bold mb-3">
          <PenTool className="w-3 h-3 text-[#f7413e]" />
          <span>ApexChief Editorial Contributor Program</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight mb-4">
          Write For ApexChief
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed">
          Share your executive perspectives, industry breakthroughs, founder journeys, and strategic insights with a global audience of CEOs, investors, technologists, and decision-makers.
        </p>
      </div>

      {/* Why Write For ApexChief - 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-sm">
          <div className="w-10 h-10 rounded-sm bg-[#f7413e]/10 text-[#f7413e] flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-black dark:text-white mb-2">
            Executive Readership
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            Reach hundreds of thousands of monthly executives, venture capitalists, founders, and tech pioneers across the US, Europe, Asia, and the Middle East.
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-sm">
          <div className="w-10 h-10 rounded-sm bg-[#f7413e]/10 text-[#f7413e] flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-black dark:text-white mb-2">
            Author Byline &amp; Authority
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            Every published contributor receives a verified author profile, biographical blurb, social links, and Google News indexed authorship credit.
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-sm">
          <div className="w-10 h-10 rounded-sm bg-[#f7413e]/10 text-[#f7413e] flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-black dark:text-white mb-2">
            Global Syndication
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            Selected editorial pieces are featured across ApexChief daily dispatches, social feeds, and premier industry syndication networks.
          </p>
        </div>
      </div>

      {/* Main Guidelines & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Left: Editorial Guidelines (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-4">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
              <BookOpen className="w-5 h-5 text-[#f7413e]" />
              <span>Topics We Welcome</span>
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
              We seek deep, rigorous, original analysis rather than generic overviews or overt promotional material. We are actively accepting pitches on:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-800 dark:text-gray-200 font-sans">
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>C-Suite Leadership &amp; Board Governance</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Enterprise AI &amp; Autonomous Systems</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Venture Capital &amp; Private Equity</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Early-Stage Startup Scaling ($0 to $10M ARR)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Commercial Real Estate &amp; PropTech</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Sustainable Energy &amp; Deep Tech</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Market Macroeconomics &amp; Geopolitics</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#f7413e] font-bold">✓</span>
                <span>Founder Retrospectives &amp; Lessons</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
              <ShieldCheck className="w-5 h-5 text-[#f7413e]" />
              <span>Editorial Standards &amp; Criteria</span>
            </h2>
            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border-l-2 border-[#f7413e]">
                <strong className="text-black dark:text-white block mb-1">1. 100% Original Content:</strong>
                All submissions must be original work not published elsewhere. We maintain a zero-tolerance policy toward plagiarism or generic AI hallucinations.
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border-l-2 border-[#f7413e]">
                <strong className="text-black dark:text-white block mb-1">2. Word Count &amp; Structure:</strong>
                Articles generally range between 900 and 2,500 words. Organize your piece with clear H2/H3 subheadings, bullet points, and authoritative source citations.
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border-l-2 border-[#f7413e]">
                <strong className="text-black dark:text-white block mb-1">3. Non-Promotional Stance:</strong>
                Submissions must educate, analyze, or provoke thoughtful debate. Pitches that serve purely as company sales pitches or affiliate plugs will be rejected.
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border-l-2 border-[#f7413e]">
                <strong className="text-black dark:text-white block mb-1">4. Author Transparency:</strong>
                Include full author name, current executive title, company affiliation, headshot image, and a 2-3 sentence biography.
              </div>
            </div>
          </section>

          {/* Submission Review Steps */}
          <section className="space-y-4">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
              <Sparkles className="w-5 h-5 text-[#f7413e]" />
              <span>Editorial Workflow</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
                <span className="font-mono text-lg font-bold text-[#f7413e]">01</span>
                <h4 className="font-oswald text-sm font-bold uppercase mt-1 text-black dark:text-white">Pitch Submission</h4>
                <p className="text-[11px] text-gray-500 mt-1">Submit your outline and thesis through our form or email.</p>
              </div>
              <div className="p-3 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
                <span className="font-mono text-lg font-bold text-[#f7413e]">02</span>
                <h4 className="font-oswald text-sm font-bold uppercase mt-1 text-black dark:text-white">Editorial Review</h4>
                <p className="text-[11px] text-gray-500 mt-1">Our editors review your draft within 48 to 72 business hours.</p>
              </div>
              <div className="p-3 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
                <span className="font-mono text-lg font-bold text-[#f7413e]">03</span>
                <h4 className="font-oswald text-sm font-bold uppercase mt-1 text-black dark:text-white">Publication &amp; Reach</h4>
                <p className="text-[11px] text-gray-500 mt-1">Approved stories are scheduled for global newsroom release.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Pitch Submission Form (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <WriteForUsForm />
          </div>
        </div>
      </div>

      {/* Contributor FAQs */}
      <div className="border-t border-gray-200 dark:border-white/10 pt-10 mb-12">
        <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-black dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#f7413e]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700 dark:text-gray-300 font-sans">
          <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
            <h4 className="font-bold text-sm text-black dark:text-white mb-1.5">How long does the editorial review take?</h4>
            <p className="leading-relaxed">Our editorial team reviews all contributor pitches within 2 to 3 business days. If your pitch is selected, we will reply with draft formatting instructions.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
            <h4 className="font-bold text-sm text-black dark:text-white mb-1.5">Can I include backlinks in my article?</h4>
            <p className="leading-relaxed">Relevant, contextual links to primary data sources, research reports, or cited studies are encouraged. Self-promotional or spammy affiliate links will be removed.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
            <h4 className="font-bold text-sm text-black dark:text-white mb-1.5">Do you accept syndicated or republished content?</h4>
            <p className="leading-relaxed">We strongly prioritize original, exclusive content. On rare occasions, we consider strategic syndication with appropriate canonical tags and permission.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded">
            <h4 className="font-bold text-sm text-black dark:text-white mb-1.5">Where should I send PR pitches or press releases?</h4>
            <p className="leading-relaxed">For breaking press releases or company announcements, please email our newsroom desk directly at <a href="mailto:apexchiefofficial@gmail.com" className="text-[#f7413e] underline">apexchiefofficial@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
