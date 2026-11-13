import { Article } from '@/types';

const isInterviewArticle = (art: Article): boolean => {
  const cat = (art.category || '').toLowerCase();
  const sub = (art.subcategory || '').toLowerCase();
  const tag = (art.tag || '').toLowerCase();
  const title = (art.title || '').toLowerCase();
  const slug = (art.slug || '').toLowerCase();
  return (
    art.placement === 'interview' ||
    cat === 'interview' ||
    sub === 'interviews' ||
    tag.includes('interview') ||
    title.startsWith('interview:') ||
    slug.includes('interview')
  );
};

/**
 * Builds deduplicated Latest (up to 6) and Interview (up to 6) article lists
 * for the sticky blog detail split sidebar, excluding the current article.
 */
export function buildBlogSidebarLists(allArticles: Article[], currentSlug: string) {
  const eligible = allArticles.filter((a) => {
    if (!a?.slug || a.slug === currentSlug) return false;
    const st = String(a.status || 'Published').trim().toLowerCase();
    return st !== 'trash' && st !== 'draft';
  });

  const latestArticles = eligible
    .filter((a) => !a.excludeFromPopularPosts)
    .slice(0, 6);

  const genuineInterviews = eligible.filter(isInterviewArticle);
  const interviewSlugs = new Set(genuineInterviews.map((a) => a.slug));

  const interviewArticles = [...genuineInterviews];
  if (interviewArticles.length < 4) {
    // Supplement with executive leadership / founder profile stories if fewer than 4 interviews exist
    const executiveFallbacks = eligible.filter((a) => {
      if (interviewSlugs.has(a.slug) || a.excludeFromPopularPosts) return false;
      const cat = (a.category || '').toLowerCase();
      return cat === 'leadership' || cat === 'startups' || a.placement === 'top10';
    });
    for (const item of executiveFallbacks) {
      if (interviewArticles.length >= 4) break;
      interviewSlugs.add(item.slug);
      interviewArticles.push(item);
    }
    for (const item of eligible) {
      if (interviewArticles.length >= 4) break;
      if (!interviewSlugs.has(item.slug) && !item.excludeFromPopularPosts) {
        interviewSlugs.add(item.slug);
        interviewArticles.push(item);
      }
    }
  }

  return {
    latestArticles: latestArticles.length > 0 ? latestArticles : eligible.slice(0, 6),
    interviewArticles: interviewArticles.slice(0, 6),
  };
}

