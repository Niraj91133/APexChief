import { NextResponse } from 'next/server';
import { getArticles, saveArticles } from '@/data/db';
import { Article } from '@/types';
import {
  getArticlesFromDB,
  upsertArticleInDB,
  deleteArticleFromDB,
} from '@/lib/supabaseService';

export async function GET() {
  // Try Supabase first
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
          .trim() || `story-${Date.now()}`;
    }

    if (!newArticle.id) {
      newArticle.id = newArticle.slug;
    }

    // 1. Save to Supabase
    await upsertArticleInDB(newArticle);

    // 2. Backup to local JSON
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
    saveArticles(updated);

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
          .trim() || `story-${Date.now()}`;
    }

    if (!updatedArticle.id) {
      updatedArticle.id = updatedArticle.slug;
    }

    // 1. Save to Supabase
    await upsertArticleInDB(updatedArticle);

    // 2. Backup to local JSON
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
    saveArticles(updatedList);

    return NextResponse.json(updatedArticle);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    const identifier = slug || id;
    if (!identifier) {
      return NextResponse.json({ error: 'Missing article identifier (id or slug)' }, { status: 400 });
    }

    // 1. Delete from Supabase
    await deleteArticleFromDB(identifier);

    // 2. Delete from local JSON backup
    const articles = getArticles();
    const filtered = articles.filter((art) => art.id !== id && art.slug !== slug);
    saveArticles(filtered);

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
