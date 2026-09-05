'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function Analytics() {
  const pathname = usePathname();
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'ydgkxqb6b8';
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-02WC3EL89S';

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || typeof window === 'undefined') return;

    const visitorKey = 'apex_visitor_tracked';
    const isNewVisitor = !localStorage.getItem(visitorKey);
    if (isNewVisitor) {
      localStorage.setItem(visitorKey, Date.now().toString());
    }

    // Ping site analytics tracker for daily visits / pageviews
    // For specific articles, ArticleViewTracker will also pass the slug
    if (!pathname.startsWith('/news/')) {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isUnique: isNewVisitor,
        }),
      }).catch((err) => console.warn('Analytics ping error:', err));
    }
  }, [pathname]);

  return (
    <>
      {/* 1. Microsoft Clarity (Heatmaps & Session Recordings) */}
      {clarityId && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `,
          }}
        />
      )}

      {/* 2. Google Analytics 4 (Traffic & Pageviews) */}
      {gaId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
