'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu, X, Moon } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { ARTICLES } from '@/data/articles';

function HeaderNav({
  isScrolled,
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  navLinks,
}: {
  isScrolled: boolean;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navLinks: { name: string; href: string }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, currentCategory, setMobileMenuOpen]);

  return (
    <div
      className={`w-full bg-[#faf8f2] border-b border-[#211d1d]/15 transition-all z-40 ${
        isScrolled ? 'sticky top-0 shadow-sm border-t border-[#211d1d]/15' : ''
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3.5">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#211d1d] hover:text-[#f7413e] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center flex-1 space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wider text-[#211d1d]/85 hover:text-[#f7413e] transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile search indicator */}
        <div className="lg:hidden">
          <button onClick={onOpenSearch} className="p-2 text-[#211d1d]">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState<{ name: string; href: string }[]>([
    { name: 'All Stories', href: '/news' }
  ]);

  // Fetch dynamic categories to build nav links
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const visibleCategories = data.filter((cat) => cat.isVisible !== false);
          const links = [
            { name: 'All Stories', href: '/news' },
            ...visibleCategories.map((cat) => ({
              name: cat.name,
              href: `/#${cat.slug}-section`
            }))
          ];
          setNavLinks(links);
        }
      })
      .catch((err) => console.error('Failed to load categories for nav', err));
  }, []);
  const [config, setConfig] = useState(siteConfig);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic config on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setConfig(data);
        }
      })
      .catch((err) => console.error('Failed to load site config', err));
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  // Helper to resolve monogram letters dynamically
  const getMonogram = (name: string) => {
    if (!name) return 'AC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Get breaking news stories from the dataset
  const breakingArticles = ARTICLES.slice(0, 5);

  return (
    <header className="w-full bg-[#faf8f2]">
      {/* 1. Top Utility Row (Search, Stamp monogram, Subscribe, Dark Mode) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-[#211d1d]/10">
        {/* Left: Menu & Date */}
        <div className="flex items-center space-x-4 text-xs font-sans font-semibold text-[#211d1d] uppercase tracking-wider">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 text-[#211d1d] hover:text-[#f7413e] transition-colors"
            aria-label="Open side menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="hidden md:inline border-l border-[#211d1d]/20 pl-4">
            {config.currentDate}
          </span>
        </div>

        {/* Center: Stamp Monogram */}
        <div className="flex justify-center flex-1">
          <Link
            href="/"
            className="w-8 h-8 rounded-full border border-[#211d1d] flex items-center justify-center font-serif text-xs font-bold text-[#111111] hover:bg-[#211d1d]/5 transition-colors"
          >
            {getMonogram(config.name)}
          </Link>
        </div>

        {/* Right: Search input box, Subscribe & Dark Mode */}
        <div className="flex items-center space-x-4">
          {/* Search Box Mockup (clickable) */}
          <button
            onClick={openSearch}
            className="hidden md:flex items-center bg-[#f3f1e6]/80 hover:bg-[#f3f1e6] border border-[#211d1d]/15 px-3 py-1.5 rounded-lg text-xs text-[#575757] transition-colors font-sans tracking-wide cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 mr-2 text-[#575757]/70" />
            <span>Search...</span>
            <span className="ml-3 bg-[#eff0e0] px-1.5 py-0.5 rounded text-[9px] font-mono text-[#575757]/60">/</span>
          </button>
          <button onClick={openSearch} className="md:hidden p-1 text-[#211d1d]">
            <Search className="w-5 h-5" />
          </button>

          {/* Subscribe Button */}
          <a
            href="#newsletter"
            className="bg-[#002b5c] hover:bg-[#f7413e] text-[#faf8f2] px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors font-sans rounded-md shadow-sm"
          >
            SUBSCRIBE
          </a>

          {/* Dark Mode toggle icon */}
          <button className="p-1 text-[#211d1d] hover:text-[#f7413e] transition-colors" aria-label="Toggle dark mode">
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Logo & Tagline */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center border-b border-[#211d1d]/10">
        <Link href="/" className="inline-block group">
          <h1 className="font-bebas text-6xl sm:text-8xl md:text-[90px] font-normal tracking-wider text-[#111111] uppercase leading-none transition-opacity group-hover:opacity-90">
            {config.name}
          </h1>
        </Link>
        <p className="font-sans text-[10px] sm:text-xs text-[#575757] mt-3 uppercase tracking-widest font-semibold">
          {config.tagline}
        </p>
      </div>

      {/* 3. Category Navigation */}
      <Suspense
        fallback={
          <div className="w-full bg-[#faf8f2] py-3 text-center text-xs font-mono">
            Loading...
          </div>
        }
      >
        <HeaderNav
          isScrolled={isScrolled}
          onOpenSearch={openSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          navLinks={navLinks}
        />
      </Suspense>

      {/* 4. Breaking News Scrolling Marquee Bar */}
      <div className="w-full bg-[#111111] text-[#faf8f2] flex items-center overflow-hidden border-b border-[#211d1d]/20 h-10 select-none">
        {/* Red Badge */}
        <div className="bg-[#f7413e] text-[#faf8f2] px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shrink-0 z-10 border-r border-[#211d1d]/20 h-full">
          <span className="text-white animate-pulse">⚡</span>
          <span>BREAKING</span>
        </div>

        {/* Scrolling items */}
        <div className="flex-1 overflow-hidden relative flex items-center h-full">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-12 text-xs font-sans font-medium text-[#faf8f2]/90">
            {breakingArticles.map((art) => (
              <span key={art.slug} className="inline-flex items-center">
                <Link href={`/news/${art.slug}`} className="hover:text-[#f7413e] hover:underline transition-colors">
                  {art.title}
                </Link>
                <span className="mx-2 text-[#faf8f2]/40">•</span>
                <span className="text-[#eff0e0]/70 font-mono text-[10px]">{art.date}</span>
                <span className="ml-2.5 text-[#d97706] font-semibold text-[10px] uppercase font-mono">[{art.category}]</span>
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {breakingArticles.map((art) => (
              <span key={`${art.slug}-dup`} className="inline-flex items-center">
                <Link href={`/news/${art.slug}`} className="hover:text-[#f7413e] hover:underline transition-colors">
                  {art.title}
                </Link>
                <span className="mx-2 text-[#faf8f2]/40">•</span>
                <span className="text-[#eff0e0]/70 font-mono text-[10px]">{art.date}</span>
                <span className="ml-2.5 text-[#d97706] font-semibold text-[10px] uppercase font-mono">[{art.category}]</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0a0a]/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#faf8f2] p-6 shadow-2xl flex flex-col justify-between border-r border-[#211d1d]/20">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#211d1d]/15">
                <span className="font-serif font-bold text-xl text-[#111111]">{config.name}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#211d1d] hover:text-[#f7413e]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-bold uppercase rounded text-[#211d1d] hover:bg-[#211d1d]/5"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="pt-6 border-t border-[#211d1d]/15">
              <a
                href="#newsletter"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center bg-[#002b5c] text-[#faf8f2] py-2.5 rounded-none text-xs font-bold uppercase tracking-wider hover:bg-[#f7413e] transition-colors"
              >
                Subscribe
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
