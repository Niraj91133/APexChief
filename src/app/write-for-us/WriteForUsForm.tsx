'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function WriteForUsForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: 'Leadership & Strategy',
    pitchTitle: '',
    synopsis: '',
    sampleUrl: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.pitchTitle || !formData.synopsis) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500/40 p-6 sm:p-8 text-center rounded">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-oswald text-2xl font-bold uppercase text-black dark:text-white">
          Pitch Received
        </h3>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
          Thank you for submitting your pitch to the ApexChief editorial desk. Our editors will review your thesis and contact you at <span className="font-mono font-semibold text-black dark:text-white">{formData.email}</span> within 2-3 business days.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              company: '',
              topic: 'Leadership & Strategy',
              pitchTitle: '',
              synopsis: '',
              sampleUrl: '',
            });
          }}
          className="mt-5 text-xs font-mono font-bold uppercase bg-black dark:bg-white text-white dark:text-black px-4 py-2 hover:bg-[#f7413e] dark:hover:bg-[#f7413e] dark:hover:text-white transition-colors"
        >
          Submit Another Pitch
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-6 rounded-sm shadow-xs">
      <div className="flex items-center space-x-2 pb-3 mb-5 border-b border-gray-200 dark:border-white/10">
        <MessageSquare className="w-4 h-4 text-[#f7413e]" />
        <h3 className="font-oswald text-xl font-bold uppercase text-black dark:text-white">
          Submit Editorial Pitch
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
            Author Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Sarah Jenkins"
            className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
            Executive Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="s.jenkins@company.com"
            className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
              Title &amp; Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Managing Partner, Acme VC"
              className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
              Pillar / Category
            </label>
            <select
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
            >
              <option value="Leadership & Strategy">Leadership &amp; Strategy</option>
              <option value="Technology & AI">Technology &amp; AI</option>
              <option value="Business & Finance">Business &amp; Finance</option>
              <option value="Startups & Scaleups">Startups &amp; Scaleups</option>
              <option value="Executive Opinion">Executive Opinion</option>
              <option value="Commercial Real Estate">Commercial Real Estate</option>
              <option value="Deep Tech & Biotech">Deep Tech &amp; Biotech</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
            Proposed Article Headline / Working Title *
          </label>
          <input
            type="text"
            required
            value={formData.pitchTitle}
            onChange={(e) => setFormData({ ...formData, pitchTitle: e.target.value })}
            placeholder="e.g. Why Enterprise AI Deployments Fail Before Year Two"
            className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
            Synopsis, Key Thesis &amp; Outline *
          </label>
          <textarea
            rows={4}
            required
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            placeholder="Summarize your main arguments, key data points, takeaways for C-suite readers, and why this story is timely..."
            className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-gray-600 dark:text-gray-400 mb-1">
            Link to Draft or Past Publications (Optional)
          </label>
          <input
            type="url"
            value={formData.sampleUrl}
            onChange={(e) => setFormData({ ...formData, sampleUrl: e.target.value })}
            placeholder="https://docs.google.com/... or past article link"
            className="w-full text-xs px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/15 rounded text-black dark:text-white focus:outline-none focus:border-[#f7413e]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-[#f7413e] hover:bg-[#d63431] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer rounded"
        >
          {isSubmitting ? (
            <span>Transmitting to Newsroom...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Contributor Pitch</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-sans">
          You can also email your draft directly to <span className="font-mono text-black dark:text-white font-medium">apexchiefofficial@gmail.com</span>
        </p>
      </form>
    </div>
  );
}
