import { NextResponse } from 'next/server';
import { getCategories, saveCategories } from '@/data/db';
import { CategoryInfo } from '@/types';
import {
  getCategoriesFromDB,
  upsertCategoryInDB,
  bulkSaveCategoriesInDB,
} from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

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

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedCategory: CategoryInfo = await request.json();
    if (!updatedCategory.slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    await upsertCategoryInDB(updatedCategory);

    const categories = getCategories();
    const idx = categories.findIndex((c) => c.slug.toLowerCase() === updatedCategory.slug.toLowerCase());
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...updatedCategory };
    } else {
      categories.push(updatedCategory);
    }
    saveCategories(categories);

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const categories = getCategories();
    const filtered = categories.filter((c) => c.slug.toLowerCase() !== slug.toLowerCase());
    saveCategories(filtered);
    await bulkSaveCategoriesInDB(filtered);

    return NextResponse.json({ success: true, message: `Category ${slug} deleted` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
