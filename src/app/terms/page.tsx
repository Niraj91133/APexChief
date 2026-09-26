import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, BookOpen, AlertCircle, FileCheck, ShieldCheck, Mail } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the official Terms of Service governing access, editorial syndication, copyright, and usage across ApexChief media properties.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'September 2026';

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Top Breadcrumb */}
      <div className="py-4 border-b border-[#211d1d]/15 dark:border-white/15 text-xs font-mono uppercase text-[#575757] dark:text-[#a3a3a3] flex items-center justify-between mb-8">
        <Link
          href="/"
          className="hover:text-[#211d1d] dark:hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Front Page</span>
        </Link>
        <span className="text-[#f7413e] font-semibold">Editorial Terms</span>
      </div>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#211d1d]/15 dark:border-white/15">
        <div className="inline-flex items-center space-x-2 bg-[#0a0a0a] dark:bg-white text-[#fefdf3] dark:text-black text-[10px] font-oswald uppercase px-2.5 py-1 tracking-widest font-bold mb-3">
          <Scale className="w-3 h-3 text-[#f7413e]" />
          <span>Legal Standards</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0a0a0a] dark:text-white tracking-tight mb-3">
          ApexChief Terms of Service
        </h1>
        <p className="font-mono text-xs text-[#575757] dark:text-[#a3a3a3]">
          Effective Date &amp; Last Revised: <span className="font-semibold text-[#0a0a0a] dark:text-white">{lastUpdated}</span> • Standard Editorial Agreement
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-[#211d1d] dark:text-[#eff0e0] leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">01.</span> Acceptance of Terms
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            By accessing or browsing <strong>apexchief.com</strong>, subscribing to our publications, or utilizing any affiliated digital features, you agree to comply with and be bound by these Terms of Service. If you do not agree with any portion of these terms, you should discontinue use of the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">02.</span> Intellectual Property &amp; Editorial Copyright
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            All original journalism, investigative essays, executive interviews, photography, infographics, audio, layout architecture, and codebases displayed across ApexChief are the proprietary intellectual property of ApexChief Media Group and are protected by international copyright laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">03.</span> Syndication, Quotation &amp; Fair Use Policy
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            We support healthy journalistic discourse, academic research, and media citation under fair use provisions subject to the following rules:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-sans text-xs sm:text-sm text-[#404040] dark:text-[#cccccc]">
            <li>
              <strong>Mandatory Attribution:</strong> Any quotation or excerpt from an ApexChief article must explicitly credit <strong>ApexChief</strong> as the original publisher and include a direct, do-follow hyperlink back to the canonical story URL.
            </li>
            <li>
              <strong>Excerpt Limits:</strong> Non-commercial publications may quote up to 100 words of text. Systematic full-article scraping, automated republishing, or bulk reproduction without explicit written licensing is strictly prohibited.
            </li>
            <li>
              <strong>Syndication Licensing:</strong> For commercial syndication, enterprise reprints, or translation rights, please contact <a href="mailto:apexchiefofficial@gmail.com" className="text-[#f7413e] underline">apexchiefofficial@gmail.com</a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">04.</span> Editorial Independence &amp; Financial Disclaimer
          </h2>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 font-sans text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            <strong>Important Notice:</strong> Content published by ApexChief — including market analysis, macroeconomic commentary, startup coverage, and technology insights — is provided strictly for educational and informational journalism purposes. Nothing on this website constitutes personalized investment, financial, tax, or legal advice. Readers should consult accredited financial advisors before executing financial transactions.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">05.</span> Reader Submissions &amp; Story Pitches
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            By transmitting story tips, op-ed pitches, or letters to the editor through our platform, you grant ApexChief a non-exclusive, worldwide, royalty-free license to publish, edit for length and clarity, and archive the submission across our editorial channels. We uphold rigorous source confidentiality where explicitly requested.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">06.</span> Disclaimer of Warranties &amp; Limitation of Liability
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            ApexChief is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While our newsroom verifies information with highest journalistic diligence, we make no warranties regarding 100% real-time accuracy, uninterrupted platform uptime, or external links beyond our editorial control. In no event shall ApexChief Media Group be liable for direct or indirect losses arising from platform usage.
          </p>
        </section>

        <section className="p-6 bg-[#faf8f2] dark:bg-[#151922] border-l-4 border-[#f7413e] space-y-2 mt-8">
          <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#f7413e]" />
            Legal &amp; Syndication Inquiries
          </h3>
          <p className="text-xs sm:text-sm font-sans text-[#575757] dark:text-gray-300">
            For intellectual property queries, syndication requests, or formal legal correspondence:
          </p>
          <p className="font-mono text-xs text-[#0a0a0a] dark:text-white font-semibold">
            Email: <a href="mailto:apexchiefofficial@gmail.com" className="text-[#f7413e] underline">apexchiefofficial@gmail.com</a>
            <br />
            ApexChief Media Group • Legal &amp; Corporate Affairs Division
          </p>
        </section>
      </div>
    </div>
  );
}
