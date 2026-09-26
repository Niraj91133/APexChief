'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section
      id="newsletter"
      className="w-full my-12 bg-[#faf8f2] dark:bg-[#151922] text-[#0a0a0a] dark:text-[#fefdf3] p-6 sm:p-10 lg:p-12 border border-[#211d1d]/20 dark:border-white/15 relative overflow-hidden shadow-xs"
    >
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Top Tag / Pill */}
        <div className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-3.5 py-1 text-xs font-mono uppercase tracking-widest font-bold mb-4">
          <Mail className="w-3.5 h-3.5 text-[#f7413e]" />
          <span>Weekly Editorial Newsletter</span>
        </div>

        {/* Main Heading */}
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-[#0a0a0a] dark:text-white leading-tight">
          Stay Ahead With Weekly Editorial Briefings
        </h2>

        {/* Subtitle / Description */}
        <p className="font-sans text-xs sm:text-sm md:text-base text-[#4a4a4a] dark:text-[#d1d5db] leading-relaxed mb-6 max-w-2xl mx-auto font-normal">
          Join over 45,000 global executives and founders. Receive our hand-curated weekly digest of deep-dive business reporting, leadership insights, and technology intelligence every Friday morning.
        </p>

        {/* Form or Success State */}
        {subscribed ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 text-emerald-800 dark:text-emerald-300 p-4 font-sans text-sm inline-flex items-center justify-center space-x-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">Thank you for subscribing! Your briefing will arrive every Friday.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 bg-white dark:bg-[#0d1117] text-[#0a0a0a] dark:text-white placeholder-[#737373] dark:placeholder-[#9ca3af] px-4 py-3 text-xs sm:text-sm border border-[#211d1d]/30 dark:border-white/20 focus:outline-none focus:border-[#f7413e] focus:ring-1 focus:ring-[#f7413e] font-sans rounded-none"
            />
            <button
              type="submit"
              className="bg-[#f7413e] hover:bg-[#d92d2a] text-white font-oswald text-xs uppercase tracking-widest px-6 py-3 font-bold transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-xs rounded-none"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Badges / Trust Markers */}
        <div className="mt-6 pt-5 border-t border-[#211d1d]/10 dark:border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#525252] dark:text-[#a3a3a3] font-mono">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#f7413e]">✓</span> Every Friday Edition
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#f7413e]">✓</span> 100% Free &amp; No Spam
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#f7413e]">✓</span> One-Click Unsubscribe
          </span>
        </div>
      </div>
    </section>
  );
}
