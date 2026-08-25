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
      className="w-full my-14 bg-[#0a0a0a] text-[#fefdf3] p-8 sm:p-12 lg:p-16 border border-[#211d1d] relative overflow-hidden"
    >
      {/* Decorative watermark / subtle vintage border */}
      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-5 pointer-events-none font-serif text-[180px] font-bold select-none">
        THE AGE
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-[#ffffff]/10 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#eff0e0] mb-4">
          <Mail className="w-3.5 h-3.5 text-[#f7413e]" />
          <span>Editorial Newsletter</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[#fefdf3]">
          Stay Updated With Daily Editorial Stories
        </h2>

        <p className="font-serif italic text-sm sm:text-base text-[#eff0e0]/80 leading-relaxed mb-8 max-w-2xl mx-auto">
          Subscribe to receive curated news, modern culture updates, business insights, and the latest stories delivered directly to your inbox every week.
        </p>

        {subscribed ? (
          <div className="bg-[#eff0e0]/10 border border-[#f7413e]/30 rounded p-4 inline-flex items-center space-x-3 text-sm text-[#fefdf3]">
            <CheckCircle2 className="w-5 h-5 text-[#f7413e]" />
            <span>Thank you for subscribing! You will receive our next editorial dispatch.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 bg-[#1a1a1a] text-[#fefdf3] placeholder-[#eff0e0]/40 px-4 py-3 text-sm rounded border border-[#eff0e0]/20 focus:outline-none focus:border-[#f7413e] font-sans"
            />
            <button
              type="submit"
              className="bg-[#fefdf3] text-[#0a0a0a] hover:bg-[#f7413e] hover:text-[#fefdf3] font-oswald text-xs font-bold uppercase tracking-widest px-6 py-3 rounded transition-all flex items-center justify-center space-x-2"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center space-x-6 text-[11px] text-[#eff0e0]/50 font-mono">
          <span>✦ No Spam Ever</span>
          <span>✦ Weekly Curated Edition</span>
          <span>✦ One-Click Unsubscribe</span>
        </div>
      </div>
    </section>
  );
}
