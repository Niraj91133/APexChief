import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showBackLink?: boolean;
  backHref?: string;
  backLabel?: string;
  rightBadge?: string;
  includeJsonLd?: boolean;
}

export default function Breadcrumbs({
  items,
  className = '',
  showBackLink = false,
  backHref = '/',
  backLabel = 'Back',
  rightBadge,
  includeJsonLd = true,
}: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const fullUrl = item.href
        ? item.href.startsWith('http')
          ? item.href
          : `${baseUrl}${item.href.startsWith('/') ? item.href : `/${item.href}`}`
        : undefined;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(fullUrl ? { item: fullUrl } : {}),
      };
    }),
  };

  return (
    <>
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        className={`w-full flex items-center justify-between flex-wrap gap-2 py-3 mb-6 border-b border-[#211d1d]/15 dark:border-white/15 text-xs font-mono uppercase text-[#575757] dark:text-[#a3a3a3] ${className}`}
      >
        <div className="flex items-center space-x-1.5 flex-wrap overflow-hidden no-scrollbar">
          {showBackLink && (
            <>
              <Link
                href={backHref}
                className="hover:text-black dark:hover:text-white flex items-center space-x-1 mr-2 text-black dark:text-white font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{backLabel}</span>
              </Link>
              <span className="text-[#211d1d]/30 dark:text-white/30 mr-2">|</span>
            </>
          )}

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const isFirst = idx === 0;

            return (
              <React.Fragment key={`${item.label}-${idx}`}>
                {idx > 0 && (
                  <span className="text-[#211d1d]/40 dark:text-white/40 select-none">/</span>
                )}
                {isLast || !item.href ? (
                  <span
                    className="font-bold text-[#0a0a0a] dark:text-white truncate max-w-[200px] sm:max-w-[360px]"
                    title={item.label}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#f7413e] dark:hover:text-[#f7413e] transition-colors flex items-center gap-1 font-medium text-[#575757] dark:text-[#a3a3a3]"
                  >
                    {isFirst && <Home className="w-3 h-3 inline-block -mt-0.5" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {rightBadge && (
          <span className="shrink-0 text-[#f7413e] font-semibold text-[11px] tracking-wider uppercase">
            {rightBadge}
          </span>
        )}
      </nav>
    </>
  );
}
