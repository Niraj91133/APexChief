import { NextResponse } from 'next/server';
import { getArticles, saveArticles } from '@/data/db';
import { Article } from '@/types';

export async function GET() {
  const articles = getArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const newArticle: Article = await request.json();
    if (!newArticle.title || !newArticle.slug) {
      return NextResponse.json({ error: 'Missing title or slug' }, { status: 400 });
    }

    const articles = getArticles();
    if (articles.some((art) => art.slug === newArticle.slug)) {
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 400 });
    }

    // Ensure it has an id
    if (!newArticle.id) {
      newArticle.id = newArticle.slug;
    }

    const updated = [newArticle, ...articles];
    const success = saveArticles(updated);
    if (success) {
      return NextResponse.json(newArticle, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save article to file' }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle: Article = await request.json();
    if (!updatedArticle.id && !updatedArticle.slug) {
      return NextResponse.json({ error: 'Missing article identifier (id or slug)' }, { status: 400 });
    }

    const articles = getArticles();
    const index = articles.findIndex(
      (art) => art.id === updatedArticle.id || art.slug === updatedArticle.slug
    );

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    articles[index] = {
      ...articles[index],
      ...updatedArticle,
    };

    const success = saveArticles(articles);
    if (success) {
      return NextResponse.json(articles[index]);
    } else {
      return NextResponse.json({ error: 'Failed to update article file' }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Missing article identifier (id or slug)' }, { status: 400 });
    }

    const articles = getArticles();
    const filtered = articles.filter((art) => art.id !== id && art.slug !== slug);

    if (filtered.length === articles.length) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const success = saveArticles(filtered);
    if (success) {
      return NextResponse.json({ message: 'Article deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to write deletion to file' }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
