'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Tag, Calendar, User } from 'lucide-react';
import { ARTICLES } from '@/data/articles';
import { Article } from '@/types';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for open events & keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search', handleCustomOpen);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults(ARTICLES.slice(0, 5));
      return;
    }

    const q = query.toLowerCase().trim();
    const filtered = ARTICLES.filter((article) => {
      return (
        article.title.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.toLowerCase().includes(q) ||
        article.paragraphs.some((p) => p.toLowerCase().includes(q))
      );
    });

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleNavigate = (slug: string) => {
    setIsOpen(false);
    router.push(`/news/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0a0a0a]/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#fefdf3] rounded-lg shadow-2xl border border-[#211d1d]/20 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-[#211d1d]/15 flex items-center space-x-3 bg-[#eff0e0]/40">
          <Search className="w-5 h-5 text-[#575757] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 56 articles, topics, authors..."
            className="w-full bg-transparent text-[#211d1d] placeholder-[#575757]/60 text-base outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#575757] hover:text-[#211d1d]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs bg-[#211d1d]/10 hover:bg-[#211d1d]/20 text-[#211d1d] px-2 py-1 rounded font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#211d1d]/10">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[#575757]">
              <p className="font-serif text-lg text-[#211d1d]">No stories found</p>
              <p className="text-sm mt-1">Try searching for keywords like &ldquo;AI&rdquo;, &ldquo;health&rdquo;, &ldquo;technology&rdquo;, or &ldquo;culture&rdquo;.</p>
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#575757]">
                {query ? `Found ${results.length} Stories` : 'Recent Highlights'}
              </div>
              <div className="space-y-1">
                {results.map((article) => (
                  <button
                    key={article.slug}
                    onClick={() => handleNavigate(article.slug)}
                    className="w-full text-left p-3 rounded-md hover:bg-[#eff0e0] transition-colors group flex items-start justify-between cursor-pointer"
                  >
                    <div className="pr-4 flex-1">
                      <div className="flex items-center space-x-2 text-[11px] text-[#575757] mb-1">
                        <span className="font-semibold text-[#f7413e] uppercase">
                          {article.category}
                        </span>
                        <span>•</span>
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#0a0a0a] group-hover:text-[#f7413e] transition-colors line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-[#575757] mt-1 line-clamp-1 font-sans">
                        {article.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#575757] group-hover:text-[#211d1d] group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#211d1d]/10 bg-[#eff0e0]/60 text-xs text-[#575757] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <kbd className="bg-[#fefdf3] px-1.5 py-0.5 rounded border text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="bg-[#fefdf3] px-1.5 py-0.5 rounded border text-[10px]">ESC</kbd>
              <span>to close</span>
            </span>
          </div>
          <Link
            href="/news"
            onClick={() => setIsOpen(false)}
            className="text-[#211d1d] font-bold hover:underline"
          >
            View all 56 stories →
          </Link>
        </div>
      </div>
    </div>
  );
}
