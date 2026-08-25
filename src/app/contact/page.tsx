'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Globe,
  MessageSquare,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Failed to load categories for contact form', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full">
      {/* Top Breadcrumb */}
      <div className="py-4 border-b border-[#211d1d]/15 text-xs font-mono uppercase text-[#575757] flex items-center justify-between mb-8">
        <Link
          href="/"
          className="hover:text-[#211d1d] flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Front Page</span>
        </Link>
        <span className="text-[#f7413e] font-semibold">Editorial Desk</span>
      </div>

      {/* Hero Masthead */}
      <div className="max-w-3xl mb-12">
        <div className="inline-block bg-[#0a0a0a] text-[#fefdf3] text-[10px] font-oswald uppercase px-2.5 py-1 tracking-widest font-bold mb-3">
          Get in Touch
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0a0a0a] tracking-tight mb-4">
          Contact The Editorial Team
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-[#575757] leading-relaxed">
          Have a story idea, partnership inquiry, or media question? Reach out to our editorial team and let&rsquo;s start the conversation.
        </p>
      </div>

      {/* Main Grid: Form + Office Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#eff0e0] border border-[#211d1d]/20 p-6 sm:p-10">
          <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-[#211d1d]/15">
            <MessageSquare className="w-5 h-5 text-[#f7413e]" />
            <h2 className="font-serif text-2xl font-bold text-[#0a0a0a]">
              Send An Editorial Message
            </h2>
          </div>

          {submitted ? (
            <div className="bg-[#fefdf3] border-2 border-[#211d1d] p-8 text-center my-6">
              <CheckCircle2 className="w-12 h-12 text-[#f7413e] mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-[#0a0a0a]">
                Message Dispatched
              </h3>
              <p className="text-sm text-[#575757] mt-2 max-w-md mx-auto">
                Thank you for contacting The Modern Times. Our editorial desk will review your inquiry and follow up within 1-2 business days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: 'General Inquiry',
                    message: '',
                  });
                }}
                className="mt-6 bg-[#211d1d] text-[#fefdf3] px-6 py-2.5 text-xs font-oswald uppercase tracking-widest rounded hover:bg-[#f7413e] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#211d1d] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#fefdf3] text-[#211d1d] px-3.5 py-2.5 rounded border border-[#211d1d]/20 focus:outline-none focus:border-[#211d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#211d1d] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full bg-[#fefdf3] text-[#211d1d] px-3.5 py-2.5 rounded border border-[#211d1d]/20 focus:outline-none focus:border-[#211d1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#211d1d] mb-1.5">
                    Subject / Story Title
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Story pitch or inquiry"
                    className="w-full bg-[#fefdf3] text-[#211d1d] px-3.5 py-2.5 rounded border border-[#211d1d]/20 focus:outline-none focus:border-[#211d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#211d1d] mb-1.5">
                    Department / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#fefdf3] text-[#211d1d] px-3.5 py-2.5 rounded border border-[#211d1d]/20 focus:outline-none"
                  >
                    <option value="General Inquiry">General Editorial Inquiry</option>
                    <option value="Story Pitch">Story Pitch & Leaks</option>
                    <option value="Press & Media">Press & Media Relations</option>
                    <option value="Advertising">Advertising & Partnerships</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>
                        {cat.name} Desk
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#211d1d] mb-1.5">
                  Message / Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details of your inquiry, story pitch, or feedback..."
                  className="w-full bg-[#fefdf3] text-[#211d1d] px-3.5 py-2.5 rounded border border-[#211d1d]/20 focus:outline-none focus:border-[#211d1d]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#211d1d] hover:bg-[#f7413e] text-[#fefdf3] font-oswald text-xs font-bold uppercase tracking-widest py-3.5 rounded transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Editorial Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Office Details & Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Contacts Card */}
          <div className="p-6 bg-[#fefdf3] border border-[#211d1d]/20">
            <h3 className="font-oswald text-xs font-bold uppercase tracking-widest text-[#f7413e] mb-3">
              Direct Contact Lines
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#211d1d] mt-0.5" />
                <div>
                  <div className="font-bold text-[#0a0a0a]">Editorial Desk Phone</div>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-[#575757] hover:text-[#f7413e] font-mono"
                  >
                    {siteConfig.contact.phone}
                  </a>
                  <div className="text-xs text-[#6e6e6e] mt-0.5">Mon–Fri: 9:00 AM – 6:00 PM EST</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-3 border-t border-[#211d1d]/10">
                <Mail className="w-5 h-5 text-[#211d1d] mt-0.5" />
                <div>
                  <div className="font-bold text-[#0a0a0a]">Primary Dispatch Email</div>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-[#575757] hover:text-[#f7413e] font-mono"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* New York Office */}
          <div className="p-6 bg-[#fefdf3] border border-[#211d1d]/20">
            <div className="flex items-center space-x-2 text-[#f7413e] text-xs font-mono uppercase font-bold mb-2">
              <MapPin className="w-4 h-4" />
              <span>United States Bureau</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#0a0a0a]">
              {siteConfig.contact.addressNY.title}
            </h4>
            <p className="text-sm text-[#575757] mt-1">
              {siteConfig.contact.addressNY.street}
              <br />
              {siteConfig.contact.addressNY.city}
              <br />
              {siteConfig.contact.addressNY.country}
            </p>
          </div>

          {/* London Office */}
          <div className="p-6 bg-[#fefdf3] border border-[#211d1d]/20">
            <div className="flex items-center space-x-2 text-[#f7413e] text-xs font-mono uppercase font-bold mb-2">
              <MapPin className="w-4 h-4" />
              <span>European Bureau</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#0a0a0a]">
              {siteConfig.contact.addressLondon.title}
            </h4>
            <p className="text-sm text-[#575757] mt-1">
              {siteConfig.contact.addressLondon.street}
              <br />
              {siteConfig.contact.addressLondon.city}
              <br />
              {siteConfig.contact.addressLondon.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
