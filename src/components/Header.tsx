'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Category, Article, SiteConfig } from '@/types';

function HeaderNav({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className="category-nav-bar hidden lg:block w-full bg-black text-white border-b border-black transition-all relative z-40">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 flex items-center justify-center py-1.5">
        {/* Desktop Navigation Links (Home + Categories Centered within Container) */}
        <nav className="flex items-center justify-center flex-wrap gap-x-0.5 lg:gap-x-1 xl:gap-x-1.5 py-0.5 text-center">
          <Link
            href="/"
            className={`px-1.5 xl:px-2 py-0.5 text-[10px] xl:text-[10.5px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 rounded ${
              pathname === '/' && !currentCategory
                ? 'text-[#f7413e] bg-white/10'
                : 'text-white/95 hover:text-[#f7413e]'
            }`}
          >
            Home
          </Link>

          {categories.filter((c) => c.slug !== 'home').map((cat) => {
            const isActive = currentCategory?.toLowerCase() === cat.slug.toLowerCase();

            return (
              <div key={cat.slug} className="py-0.5 shrink-0">
                <Link
                  href={`/news?category=${cat.slug}`}
                  className={`inline-flex items-center px-1 lg:px-1.5 xl:px-2 py-0.5 rounded text-[10px] xl:text-[10.5px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#f7413e] bg-white/10'
                      : 'text-white/90 hover:text-[#f7413e]'
                  }`}
                >
                  <span>{cat.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function Header({ initialConfig }: { initialConfig?: SiteConfig } = {}) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Match SSR initial state with server-provided initialConfig to completely eliminate any logo flash
  const [config, setConfig] = useState<SiteConfig>(initialConfig || siteConfig);

  const getCleanLogoLight = (cfg: SiteConfig) => {
    let src = cfg.logoLight || cfg.logo || '/images/apexchief-logo-light.png';
    if (!src || src.includes('logo-dark')) {
      src = '/images/apexchief-logo-light.png';
    }
    return src;
  };

  const getCleanLogoDark = (cfg: SiteConfig) => {
    let src = cfg.logoDark || '/images/apexchief-logo-dark.png';
    if (!src || src.includes('logo-light') || src === cfg.logoLight) {
      src = '/images/apexchief-logo-dark.png';
    }
    return src;
  };

  const logoLightSrc = getCleanLogoLight(config);
  const logoDarkSrc = getCleanLogoDark(config);

  // Sync state if initialConfig updates from parent
  useEffect(() => {
    if (initialConfig) {
      setConfig((prev) => ({
        ...prev,
        ...initialConfig,
        logo: initialConfig.logo || prev.logo,
        logoLight: initialConfig.logoLight || prev.logoLight,
        logoDark: initialConfig.logoDark || prev.logoDark,
      }));
    }
  }, [initialConfig]);

  // Initialize and handle light / dark mode toggle (Default is Light Mode)
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        if (!storedTheme) {
          localStorage.setItem('theme', 'light');
        }
      }
    } catch (e) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        console.error('Error toggling theme', e);
      }
      return next;
    });
  };

  // Fetch dynamic categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const visibleCategories = data.filter((cat) => cat.isVisible !== false);
          setCategories(visibleCategories);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch dynamic config on mount with instant localStorage hydration and cross-tab sync
  useEffect(() => {
    const syncFromLocalStorage = () => {
      try {
        // Clean up any stale dark logo paths mistakenly placed in light mode
        const customLogoLight = localStorage.getItem('apexchief_custom_logo_light');
        if (customLogoLight && customLogoLight.includes('logo-dark')) {
          localStorage.removeItem('apexchief_custom_logo_light');
        }
        const customLogo = localStorage.getItem('apexchief_custom_logo');
        if (customLogo && customLogo.includes('logo-dark')) {
          localStorage.removeItem('apexchief_custom_logo');
        }

        const savedSettings = localStorage.getItem('apexchief_site_settings');
        const customLogoDark = localStorage.getItem('apexchief_custom_logo_dark');
        const validCustomLight = localStorage.getItem('apexchief_custom_logo_light');
        const validCustomLogo = localStorage.getItem('apexchief_custom_logo');

        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          let activeLight = parsed.logoLight || validCustomLight || parsed.logo || validCustomLogo || '';
          if (activeLight.includes('logo-dark')) {
            activeLight = '/images/apexchief-logo-light.png';
            parsed.logoLight = activeLight;
            try { localStorage.setItem('apexchief_site_settings', JSON.stringify(parsed)); } catch (e) {}
          }
          let activeDark = parsed.logoDark || customLogoDark || '';
          if (activeDark.includes('logo-light') || activeDark === activeLight) {
            activeDark = '/images/apexchief-logo-dark.png';
          }
          const activeLogo = activeLight;
          setConfig((prev: SiteConfig) => ({
            ...prev,
            ...parsed,
            logo: activeLogo || prev.logo,
            logoLight: activeLight || prev.logoLight,
            logoDark: activeDark || prev.logoDark || '/images/apexchief-logo-dark.png',
          }));
        } else if (validCustomLight || customLogoDark || validCustomLogo) {
          setConfig((prev: SiteConfig) => ({
            ...prev,
            logoLight: validCustomLight || validCustomLogo || prev.logoLight,
            logoDark: customLogoDark || '/images/apexchief-logo-dark.png',
            logo: validCustomLogo || validCustomLight || prev.logo,
          }));
        }
      } catch (e) {
        // ignore
      }
    };

    const fetchServerConfig = () => {
      fetch('/api/config')
        .then((res) => res.json())
        .then((data) => {
          if (data && (data.name || data.logo || data.logoLight || data.logoDark)) {
            let activeLight = data.logoLight || data.logo || '';
            if (activeLight.includes('logo-dark')) {
              activeLight = '/images/apexchief-logo-light.png';
            }
            let activeDark = data.logoDark || '';
            if (activeDark.includes('logo-light') || activeDark === activeLight) {
              activeDark = '/images/apexchief-logo-dark.png';
            }
            setConfig((prev: SiteConfig) => ({
              ...prev,
              ...data,
              logoLight: activeLight || prev.logoLight,
              logoDark: activeDark || prev.logoDark,
              logo: activeLight || prev.logo,
            }));
          }
        })
        .catch((err) => console.error('Failed to load site config', err));
    };

    // 1. Instant sync from localStorage
    syncFromLocalStorage();

    // 2. Fetch latest server configuration
    fetchServerConfig();

    // 3. Cross-tab real-time storage event listener
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'apexchief_site_settings' ||
        e.key === 'apexchief_custom_logo' ||
        e.key === 'apexchief_custom_logo_light' ||
        e.key === 'apexchief_custom_logo_dark'
      ) {
        syncFromLocalStorage();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Tab focus re-check (when switching between admin and landing page)
    const handleFocus = () => {
      syncFromLocalStorage();
      fetchServerConfig();
    };
    window.addEventListener('focus', handleFocus);

    // 5. BroadcastChannel for instant same-browser cross-tab sync
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('apexchief_config_channel');
      bc.onmessage = (event) => {
        if (event.data && (event.data.logoLight || event.data.logoDark || event.data.logo)) {
          setConfig((prev: SiteConfig) => ({
            ...prev,
            logoLight: event.data.logoLight || prev.logoLight,
            logoDark: event.data.logoDark || prev.logoDark,
            logo: event.data.logo || prev.logo,
          }));
        } else {
          syncFromLocalStorage();
          fetchServerConfig();
        }
      };
    } catch (e) { }

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      if (bc) bc.close();
    };
  }, []);

  // Fetch dynamic articles for breaking ticker
  const [liveArticles, setLiveArticles] = useState<Article[]>([]);
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLiveArticles(data);
      })
      .catch((err) => console.error('Failed to load breaking articles', err));
  }, []);

  const breakingDynamic = liveArticles.filter((a) => a.isBreaking);
  const breakingArticles = breakingDynamic.length > 0
    ? [...breakingDynamic, ...ARTICLES.filter((a) => !breakingDynamic.some((b) => b.slug === a.slug))].slice(0, 6)
    : ARTICLES.slice(0, 5);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#121212] shadow-md transition-colors duration-200">
      {/* 1. Main Header Masthead Bar */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        {/* Left: Mobile-only menu button */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-sans font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider shrink-0 sm:min-w-[130px] md:min-w-[170px]">
          {/* Mobile hamburger icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1 text-black dark:text-white hover:text-[#f7413e] transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center: ApexChief Logo */}
        <div className="flex items-center justify-center text-center px-1 sm:px-2 flex-1 min-w-0">
          <Link href="/" className="inline-flex items-center justify-center group py-0.5">
            {logoLightSrc || logoDarkSrc ? (
              <>
                <img
                  src={logoLightSrc}
                  alt={config.name || 'ApexChief'}
                  suppressHydrationWarning={true}
                  className="h-[34px] sm:h-10 md:h-11 lg:h-13 xl:h-[58px] w-auto max-w-[175px] sm:max-w-[220px] md:max-w-[270px] lg:max-w-[320px] xl:max-w-[350px] object-contain transition-transform duration-200 group-hover:scale-[1.02] dark:hidden block"
                />
                <img
                  src={logoDarkSrc}
                  alt={config.name || 'ApexChief'}
                  suppressHydrationWarning={true}
                  className="h-[34px] sm:h-10 md:h-11 lg:h-13 xl:h-[58px] w-auto max-w-[175px] sm:max-w-[220px] md:max-w-[270px] lg:max-w-[320px] xl:max-w-[350px] object-contain transition-transform duration-200 group-hover:scale-[1.02] hidden dark:block"
                />
              </>
            ) : (
              <h1 className="font-bebas text-3xl sm:text-3xl md:text-4xl tracking-widest text-black dark:text-white uppercase leading-none transition-colors group-hover:text-[#f7413e]">
                {config.name}
              </h1>
            )}
          </Link>
        </div>

        {/* Right: Search Box & Working Light/Dark Mode Toggle */}
        <div className="flex items-center space-x-1 sm:space-x-3 shrink-0 sm:min-w-[130px] md:min-w-[170px] justify-end">
          {/* Search Box Mockup (clickable) */}
          <button
            onClick={openSearch}
            className="hidden md:flex items-center bg-gray-100 dark:bg-[#202020] hover:bg-gray-200/80 dark:hover:bg-[#282828] border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-400 transition-colors font-sans tracking-wide cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 mr-2 text-gray-500 dark:text-gray-400" />
            <span>Search stories...</span>
            <span className="ml-3 bg-white dark:bg-[#333333] border border-gray-200 dark:border-transparent dark:text-white/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-500">/</span>
          </button>

          <button
            onClick={openSearch}
            className="md:hidden p-1.5 text-black dark:text-white hover:text-[#f7413e] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 hover:text-[#f7413e] dark:hover:text-[#eab308] transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-transparent"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#facc15]" />
            ) : (
              <Moon className="w-4 h-4 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Category Navigation Bar */}
      <Suspense
        fallback={
          <div className="w-full bg-black py-3 text-center text-xs font-mono text-white">
            Loading navigation...
          </div>
        }
      >
        <HeaderNav categories={categories} />
      </Suspense>

      {/* 3. Breaking News Scrolling Marquee Bar (Continuous Auto-Scroll) */}
      <div className="w-full bg-black text-white flex items-center overflow-hidden border-b border-gray-200 dark:border-white/10 h-9 sm:h-10 select-none">
        {/* Red Badge */}
        <div className="bg-[#f7413e] text-white px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shrink-0 z-10 border-r border-black/20 h-full">
          <span className="text-white animate-pulse">⚡</span>
          <span>BREAKING</span>
        </div>

        {/* Scrolling items */}
        <div className="flex-1 overflow-hidden relative flex items-center h-full">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-12 text-xs font-sans font-medium text-white/90">
            {breakingArticles.map((art) => (
              <span key={art.slug} className="inline-flex items-center">
                <Link href={`/news/${art.slug}`} className="hover:text-[#f7413e] hover:underline transition-colors">
                  {art.title}
                </Link>
                <span className="mx-2 text-white/40">•</span>
                <span className="text-gray-300 font-mono text-[10px]">{art.date}</span>
                <span className="ml-2.5 text-[#fbbf24] font-semibold text-[10px] uppercase font-mono">[{art.category}]</span>
              </span>
            ))}
            {/* Duplicate for seamless infinite loop */}
            {breakingArticles.map((art) => (
              <span key={`${art.slug}-dup`} className="inline-flex items-center">
                <Link href={`/news/${art.slug}`} className="hover:text-[#f7413e] hover:underline transition-colors">
                  {art.title}
                </Link>
                <span className="mx-2 text-white/40">•</span>
                <span className="text-gray-300 font-mono text-[10px]">{art.date}</span>
                <span className="ml-2.5 text-[#fbbf24] font-semibold text-[10px] uppercase font-mono">[{art.category}]</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-[#161616] p-6 shadow-2xl flex flex-col justify-between border-r border-gray-200 dark:border-white/10 transition-colors overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
                {logoLightSrc || logoDarkSrc ? (
                  <>
                    <img
                      src={logoLightSrc}
                      alt={config.name || 'ApexChief'}
                      suppressHydrationWarning={true}
                      className="h-8 sm:h-9 w-auto max-w-[160px] object-contain dark:hidden block"
                    />
                    <img
                      src={logoDarkSrc}
                      alt={config.name || 'ApexChief'}
                      suppressHydrationWarning={true}
                      className="h-8 sm:h-9 w-auto max-w-[160px] object-contain hidden dark:block"
                    />
                  </>
                ) : (
                  <span className="font-bebas text-2xl tracking-wider text-black dark:text-white">{config.name}</span>
                )}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#f7413e] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
                <nav className="flex flex-col space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-bold uppercase rounded transition-colors ${
                      pathname === '/'
                        ? 'bg-[#f7413e] text-white'
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    Home
                  </Link>
                  {categories.filter((c) => c.slug !== 'home').map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/news?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-bold uppercase text-gray-900 dark:text-gray-100 hover:text-[#f7413e] hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-gray-200 dark:border-white/10 mt-2">
                    <Link
                      href="/write-for-us"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-xs font-bold uppercase text-[#f7413e] hover:bg-[#f7413e]/10 rounded flex items-center justify-between"
                    >
                      <span>Write For Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-xs font-bold uppercase text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded block"
                    >
                      Contact Newsroom
                    </Link>
                  </div>
                </nav>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between mt-6">
              <span className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400">
                ApexChief Media
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-[#facc15]" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
