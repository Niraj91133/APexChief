import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getArticles, saveArticles } from '@/data/db';
import { getCategorySlug } from '@/data/categories';
import { Article } from '@/types';
import {
  getArticlesFromDB,
  getCachedArticleSummaries,
  invalidateArticlesCache,
  primeArticleCache,
  upsertArticleInDB,
  deleteArticleRecordsFromDB,
  updateArticleStatusInDB,
} from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || (searchParams.get('ticker') === '1' ? 'ticker' : searchParams.get('summary') === '1' ? 'summary' : 'full');

  if (mode === 'ticker') {
    const summaries = await getCachedArticleSummaries();
    const breaking = summaries.filter((a) => a.isBreaking);
    const pool = breaking.length > 0 ? breaking.slice(0, 6) : summaries.slice(0, 5);
    const minimal = pool.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      tag: a.tag,
      isBreaking: a.isBreaking,
    }));
    return NextResponse.json(minimal, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  }

  if (mode === 'summary') {
    const summaries = await getCachedArticleSummaries();
    return NextResponse.json(summaries, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  }

  // Full articles payload (used by Admin panel)
  const dbArticles = await getArticlesFromDB();
  if (dbArticles && dbArticles.length > 0) {
    return NextResponse.json(dbArticles);
  }

  // Fallback to local files
  const articles = getArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const newArticle: Article = await request.json();
    if (!newArticle.title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }

    if (!newArticle.slug) {
      newArticle.slug =
        newArticle.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim() || `story-${Date.now()}`;
    } else {
      newArticle.slug = newArticle.slug.trim().replace(/^-+|-+$/g, '') || `story-${Date.now()}`;
    }

    if (!newArticle.id) {
      newArticle.id = newArticle.slug;
    }

    // 1. Save to Supabase & pre-warm in-memory caches immediately
    const dbSaved = await upsertArticleInDB(newArticle);
    primeArticleCache(newArticle);

    // 2. Backup to local JSON (best effort; serverless environments may be read-only)
    let localSaved = false;
    try {
      const articles = getArticles();
      const existingIndex = articles.findIndex(
        (art) => (newArticle.id && art.id === newArticle.id) || art.slug === newArticle.slug
      );

      let updated: Article[];
      if (existingIndex !== -1) {
        articles[existingIndex] = { ...articles[existingIndex], ...newArticle };
        updated = [...articles];
      } else {
        updated = [newArticle, ...articles];
      }
      localSaved = saveArticles(updated);
    } catch {}

    if (!dbSaved && !localSaved) {
      return NextResponse.json({ error: 'Failed to persist story to database' }, { status: 500 });
    }

    const catSlug = getCategorySlug(newArticle.category || 'Business');
    try {
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath('/category');
      revalidatePath(`/category/${catSlug}`);
      revalidatePath(`/${catSlug}/${newArticle.slug}`);
      revalidatePath(`/news/${newArticle.slug}`);
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(newArticle, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle: Article = await request.json();
    if (!updatedArticle.title) {
      return NextResponse.json({ error: 'Missing article title' }, { status: 400 });
    }

    if (!updatedArticle.slug) {
      updatedArticle.slug =
        updatedArticle.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim() || `story-${Date.now()}`;
    } else {
      updatedArticle.slug = updatedArticle.slug.trim().replace(/^-+|-+$/g, '') || `story-${Date.now()}`;
    }

    if (!updatedArticle.id) {
      updatedArticle.id = updatedArticle.slug;
    }

    // 1. Save to Supabase & pre-warm in-memory caches immediately
    const dbSaved = await upsertArticleInDB(updatedArticle);
    primeArticleCache(updatedArticle);

    // 2. Backup to local JSON
    let localSaved = false;
    try {
      const articles = getArticles();
      const index = articles.findIndex(
        (art) => (updatedArticle.id && art.id === updatedArticle.id) || art.slug === updatedArticle.slug
      );

      let updatedList: Article[];
      if (index === -1) {
        updatedList = [updatedArticle, ...articles];
      } else {
        articles[index] = { ...articles[index], ...updatedArticle };
        updatedList = [...articles];
      }
      localSaved = saveArticles(updatedList);
    } catch {}

    if (!dbSaved && !localSaved) {
      return NextResponse.json({ error: 'Failed to update story in database' }, { status: 500 });
    }

    const catSlug = getCategorySlug(updatedArticle.category || 'Business');
    try {
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath('/category');
      revalidatePath(`/category/${catSlug}`);
      revalidatePath(`/${catSlug}/${updatedArticle.slug}`);
      revalidatePath(`/news/${updatedArticle.slug}`);
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(updatedArticle);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

function revalidateArticlePaths(items: Array<{ slug: string; category?: string }>) {
  try {
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/category');
    revalidatePath('/admin');
    revalidatePath('/sitemap.xml');
    revalidatePath('/', 'layout');
    for (const item of items) {
      if (!item?.slug) continue;
      const catSlug = getCategorySlug(item.category || 'Business');
      revalidatePath(`/category/${catSlug}`);
      revalidatePath(`/${catSlug}/${item.slug}`);
      revalidatePath(`/news/${item.slug}`);
    }
  } catch {}
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    const status = typeof body?.status === 'string' ? body.status.trim() : '';

    if ((!slug && !id) || !status) {
      return NextResponse.json({ error: 'Missing slug/id or status' }, { status: 400 });
    }

    const dbRes = await updateArticleStatusInDB(slug, id, status);
    const affected: Array<{ slug: string; category?: string }> = [...dbRes.affected];

    try {
      const articles = getArticles();
      let changed = false;
      const updated = articles.map((art) => {
        if ((id && art.id === id) || (slug && art.slug === slug)) {
          changed = true;
          affected.push({ slug: art.slug, category: art.category });
          return { ...art, status };
        }
        return art;
      });
      if (changed) saveArticles(updated);
    } catch {}

    invalidateArticlesCache(slug || id);
    if (!dbRes.updated && affected.length === 0) {
      return NextResponse.json({ error: 'Story not found in database' }, { status: 404 });
    }

    revalidateArticlePaths(affected);
    return NextResponse.json({ message: 'Status updated successfully', status });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id')?.trim() || '';
    let slug = searchParams.get('slug')?.trim() || '';

    if (!id && !slug) {
      const body = await request.json().catch(() => null);
      if (body && typeof body === 'object') {
        id = typeof body.id === 'string' ? body.id.trim() : '';
        slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      }
    }

    if (!id && !slug) {
      return NextResponse.json({ error: 'Missing article identifier (id or slug)' }, { status: 400 });
    }

    const dbResult = await deleteArticleRecordsFromDB(slug || null, id || null);
    if (!dbResult.deleted) {
      return NextResponse.json({ error: 'Failed to delete story from database' }, { status: 500 });
    }

    const affected: Array<{ slug: string; category?: string }> = [...dbResult.affected];
    try {
      const articles = getArticles();
      const filtered = articles.filter((art) => {
        const match =
          (id && (art.id === id || art.slug === id)) ||
          (slug && (art.slug === slug || art.id === slug));
        if (match) {
          affected.push({ slug: art.slug, category: art.category });
          return false;
        }
        return true;
      });
      if (filtered.length !== articles.length) {
        saveArticles(filtered);
      }
    } catch {}

    if (slug) invalidateArticlesCache(slug);
    if (id && id !== slug) invalidateArticlesCache(id);
    if (affected.length === 0 && slug) {
      affected.push({ slug, category: searchParams.get('category') || 'Business' });
    }
    revalidateArticlePaths(affected);

    return NextResponse.json({ message: 'Article deleted successfully', affectedCount: affected.length });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
