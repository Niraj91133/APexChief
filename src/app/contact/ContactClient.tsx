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
  MessageSquare,
} from 'lucide-react';

export default function ContactClient() {
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
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {});
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
          ApexChief Newsroom Desk
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0a0a0a] tracking-tight mb-4">
          Contact ApexChief Editorial Desk
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-[#575757] leading-relaxed">
          Have an executive briefing pitch, investigative tip, leadership story, or strategic editorial inquiry? Connect directly with our global editorial newsroom.
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
                Thank you for contacting ApexChief. Our editorial desk will review your inquiry and follow up within 1-2 business days.
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
                    placeholder="e.g. Alex Rivera"
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
                    placeholder="e.g. alex.rivera@enterprise.com"
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
                  <div className="font-bold text-[#0a0a0a]">Editorial Desk Phone &amp; Hotline</div>
                  <a
                    href="tel:+916206539717"
                    className="text-[#575757] hover:text-[#f7413e] font-mono font-medium"
                  >
                    +91 6206539717
                  </a>
                  <div className="text-xs text-[#6e6e6e] mt-0.5">Direct Voice / Inquiry Hotline</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-3 border-t border-[#211d1d]/10">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-[#25D366]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-[#0a0a0a]">Direct WhatsApp Channel</div>
                  <a
                    href="https://wa.me/916206539717?text=Hello%20ApexChief%20Editorial%20Team%2C%20I%20would%20like%20to%20inquire%20about..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline font-mono font-medium"
                  >
                    +91 6206539717 (Instant Chat)
                  </a>
                  <div className="text-xs text-[#6e6e6e] mt-0.5">Available for urgent press &amp; tips</div>
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
              {siteConfig.contact.addressNY?.title || 'Global Headquarters - New York'}
            </h4>
            <p className="text-sm text-[#575757] mt-1">
              {siteConfig.contact.addressNY?.street || '100 Financial Center Blvd, Suite 4800'}
              <br />
              {siteConfig.contact.addressNY?.city || 'New York, NY 10005'}
              <br />
              {siteConfig.contact.addressNY?.country || 'United States'}
            </p>
          </div>

          {/* London Office */}
          <div className="p-6 bg-[#fefdf3] border border-[#211d1d]/20">
            <div className="flex items-center space-x-2 text-[#f7413e] text-xs font-mono uppercase font-bold mb-2">
              <MapPin className="w-4 h-4" />
              <span>European Bureau</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#0a0a0a]">
              {siteConfig.contact.addressLondon?.title || 'European Bureau - London'}
            </h4>
            <p className="text-sm text-[#575757] mt-1">
              {siteConfig.contact.addressLondon?.street || '1 Canada Square, Canary Wharf'}
              <br />
              {siteConfig.contact.addressLondon?.city || 'London E14 5AA'}
              <br />
              {siteConfig.contact.addressLondon?.country || 'United Kingdom'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
