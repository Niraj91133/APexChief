import { NextResponse } from 'next/server';
import { getCategories, saveCategories } from '@/data/db';
import { CategoryInfo } from '@/types';
import {
  getCategoriesFromDB,
  upsertCategoryInDB,
  bulkSaveCategoriesInDB,
} from '@/lib/supabaseService';

export async function GET() {
  try {
    const dbCategories = await getCategoriesFromDB();
    if (dbCategories && dbCategories.length > 0) {
      return NextResponse.json(dbCategories);
    }
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
      await bulkSaveCategoriesInDB(data);
      saveCategories(data);
      return NextResponse.json({ success: true, categories: data });
    }

    // Single category create
    const { name, slug, description, layout, isVisible } = data;
    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 });
    }

    const categories = (await getCategoriesFromDB()) || getCategories();
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

    await upsertCategoryInDB(newCategory);

    categories.push(newCategory);
    saveCategories(categories);

    return NextResponse.json(newCategory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
