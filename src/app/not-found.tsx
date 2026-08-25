'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.filter((cat) => cat.isVisible !== false));
        }
      })
      .catch((err) => console.error('Failed to load categories for 404', err));
  }, []);
  return (
    <div className="py-16 sm:py-24 text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center space-x-2 bg-[#eff0e0] border border-[#211d1d]/20 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#575757] mb-6">
        <Newspaper className="w-3.5 h-3.5 text-[#f7413e]" />
        <span>Edition Error 404</span>
      </div>

      <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#0a0a0a] tracking-tight mb-4">
        Story Not Found
      </h1>

      <p className="font-serif italic text-base sm:text-lg text-[#575757] leading-relaxed mb-8 max-w-xl mx-auto">
        The requested editorial story or section dispatch could not be located in our current edition or digital archives.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <Link
          href="/"
          className="bg-[#211d1d] hover:bg-[#f7413e] text-[#fefdf3] font-oswald text-xs font-bold uppercase tracking-widest px-6 py-3 rounded transition-all inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Front Page</span>
        </Link>
        <Link
          href="/news"
          className="border border-[#211d1d] hover:bg-[#211d1d] hover:text-[#fefdf3] text-[#211d1d] font-oswald text-xs font-bold uppercase tracking-widest px-6 py-3 rounded transition-all inline-flex items-center space-x-2"
        >
          <span>Browse All 56 Stories</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-[#211d1d]/15">
        <div className="text-xs font-mono uppercase font-bold text-[#575757] mb-3">
          Popular Editorial Desks
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/news?category=${cat.slug}`}
              className="text-xs bg-[#eff0e0] hover:bg-[#211d1d] hover:text-[#fefdf3] px-3 py-1.5 rounded transition-colors text-[#211d1d]"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
