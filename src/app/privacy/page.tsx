import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, Globe, Mail } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how ApexChief collects, protects, and handles your personal information with uncompromising journalistic standards and privacy security.',
};

export default function PrivacyPolicyPage() {
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
        <span className="text-[#f7413e] font-semibold">Editorial Governance</span>
      </div>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#211d1d]/15 dark:border-white/15">
        <div className="inline-flex items-center space-x-2 bg-[#0a0a0a] dark:bg-white text-[#fefdf3] dark:text-black text-[10px] font-oswald uppercase px-2.5 py-1 tracking-widest font-bold mb-3">
          <Shield className="w-3 h-3 text-[#f7413e]" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0a0a0a] dark:text-white tracking-tight mb-3">
          ApexChief Privacy Policy
        </h1>
        <p className="font-mono text-xs text-[#575757] dark:text-[#a3a3a3]">
          Effective Date &amp; Last Revised: <span className="font-semibold text-[#0a0a0a] dark:text-white">{lastUpdated}</span> • Global Compliance
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-[#211d1d] dark:text-[#eff0e0] leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">01.</span> Commitment to Reader Privacy
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            ApexChief (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is an independent digital publication committed to delivering authoritative business, technology, leadership, and market intelligence. We operate with strict adherence to privacy-first journalistic standards. This Privacy Policy details how we collect, safeguard, and utilize data when you visit <strong>apexchief.com</strong> or engage with our editorial dispatches, newsletters, and digital services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">02.</span> Information We Collect
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            We collect minimal information necessary to deliver high-quality editorial content, security, and platform reliability:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-sans text-xs sm:text-sm text-[#404040] dark:text-[#cccccc]">
            <li>
              <strong>Directly Provided Information:</strong> When you subscribe to our weekly editorial briefing or submit an inquiry through our contact desk, we collect your name, email address, organization, and message contents.
            </li>
            <li>
              <strong>Aggregated Readership Metrics:</strong> To improve our reporting, we record non-personally identifiable metrics such as article view counts, approximate geographic region (country/city level), browser type, device category, and referring websites.
            </li>
            <li>
              <strong>Zero Sensitive Data:</strong> ApexChief does not solicit, capture, or store sensitive financial instruments, biometric identifiers, or government identity documents from readers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">03.</span> Cookies &amp; Tracking Technologies
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            Our platform uses strictly necessary and performance cookies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            <div className="p-4 bg-[#faf8f2] dark:bg-[#1a1d26] border border-[#211d1d]/15 dark:border-white/10">
              <span className="font-bold text-[#f7413e] uppercase font-mono block mb-1">Essential Cookies</span>
              <p className="text-[#575757] dark:text-gray-300">
                Preserve user interface preferences such as dark/light theme toggle, font rendering, and secure authentication state for editorial staff.
              </p>
            </div>
            <div className="p-4 bg-[#faf8f2] dark:bg-[#1a1d26] border border-[#211d1d]/15 dark:border-white/10">
              <span className="font-bold text-[#f7413e] uppercase font-mono block mb-1">Analytics Cookies</span>
              <p className="text-[#575757] dark:text-gray-300">
                Help our editorial leadership understand aggregate engagement trends, popular investigation topics, and reading session times.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">04.</span> Zero Sale of Reader Personal Data
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            <strong>ApexChief will never sell, rent, or trade your personal information or email subscriber records to data brokers, ad networks, or commercial third parties.</strong> Data is shared only with trusted infrastructure service providers (such as secure cloud hosting and transactional email systems) strictly bound by data confidentiality agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">05.</span> Reader Rights (GDPR &amp; CCPA Compliance)
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            Regardless of your geographic jurisdiction, ApexChief accords all readers full sovereignty over their data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-sans text-xs sm:text-sm text-[#404040] dark:text-[#cccccc]">
            <li><strong>Right to Access:</strong> Request a complete record of any personal details associated with your email address.</li>
            <li><strong>Right to Rectification:</strong> Update or correct your newsletter subscription details at any time.</li>
            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request immediate deletion of your contact records and email subscriptions.</li>
            <li><strong>One-Click Opt-Out:</strong> Unsubscribe from our weekly editorial dispatches with a single click using the link at the bottom of every email.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <span className="text-[#f7413e]">06.</span> Security &amp; Data Protection
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#404040] dark:text-[#cccccc] leading-relaxed">
            We implement enterprise-grade TLS encryption, continuous vulnerability monitoring, strict access controls, and automated rate limiting to protect all stored information against unauthorized access, disclosure, or alteration.
          </p>
        </section>

        <section className="p-6 bg-[#faf8f2] dark:bg-[#151922] border-l-4 border-[#f7413e] space-y-2 mt-8">
          <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-[#0a0a0a] dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#f7413e]" />
            Data Protection &amp; Editorial Grievance Contact
          </h3>
          <p className="text-xs sm:text-sm font-sans text-[#575757] dark:text-gray-300">
            For inquiries regarding our privacy practices, data deletion requests, or editorial transparency, reach our Data Governance Officer at:
          </p>
          <p className="font-mono text-xs text-[#0a0a0a] dark:text-white font-semibold">
            Email: <a href="mailto:apexchiefofficial@gmail.com" className="text-[#f7413e] underline">apexchiefofficial@gmail.com</a>
            <br />
            Address: ApexChief Media Group, 100 Financial Center Blvd, New York, NY 10005
          </p>
        </section>
      </div>
    </div>
  );
}
