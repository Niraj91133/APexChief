import { NextResponse } from 'next/server';
import { getCategories, saveCategories } from '@/data/db';
import { CategoryInfo } from '@/types';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Check if it's a bulk save (for reordering or status toggle)
    if (Array.isArray(data)) {
      const success = saveCategories(data);
      if (success) {
        return NextResponse.json({ success: true, categories: data });
      }
      return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
    }

    // Single category create
    const { name, slug, description, layout, isVisible } = data;
    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 });
    }

    const categories = getCategories();
    if (categories.some((cat) => cat.slug.toLowerCase() === slug.toLowerCase())) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 });
    }

    const newCategory: CategoryInfo = {
      name,
      slug: slug.toLowerCase().trim(),
      description: description || '',
      layout: layout || 'world-layout',
      order: categories.length > 0 ? Math.max(...categories.map((c) => c.order || 0)) + 1 : 1,
      isVisible: isVisible !== undefined ? isVisible : true,
    };

    categories.push(newCategory);
    const success = saveCategories(categories);
    if (success) {
      return NextResponse.json(newCategory);
    }
    return NextResponse.json({ error: 'Failed to save new category' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
