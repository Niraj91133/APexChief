'use client';

import { useEffect } from 'react';

interface ArticleViewTrackerProps {
  slug: string;
}

export default function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return;

    const sessionKey = `viewed_${slug}`;
    const alreadyViewed = sessionStorage.getItem(sessionKey);

    // Track view (pass isUnique if first time visiting the site today)
    const visitorKey = 'apex_visitor_tracked';
    const isNewVisitor = !localStorage.getItem(visitorKey);

    if (!alreadyViewed) {
      sessionStorage.setItem(sessionKey, '1');
      if (isNewVisitor) {
        localStorage.setItem(visitorKey, Date.now().toString());
      }

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          isUnique: isNewVisitor,
        }),
      }).catch((err) => console.warn('Analytics tracking error:', err));
    }
  }, [slug]);

  return null;
}
