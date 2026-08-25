import { NextResponse } from 'next/server';
import { getCategories, saveCategories, getArticles, saveArticles } from '@/data/db';
import { CategoryInfo } from '@/types';

// Helper to resolve route parameters in Next.js App Router (Next 15 expects params to be awaited if they are processed asynchronously, but we can type them appropriately or access them directly)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: oldSlug } = await params;
    const data = await request.json();
    const { name, slug: newSlug, description, layout, order, isVisible } = data;

    if (!name || !newSlug) {
      return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 });
    }

    const categories = getCategories();
    const catIndex = categories.findIndex((c) => c.slug.toLowerCase() === oldSlug.toLowerCase());

    if (catIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if new slug conflicts with another category
    if (
      newSlug.toLowerCase() !== oldSlug.toLowerCase() &&
      categories.some((c) => c.slug.toLowerCase() === newSlug.toLowerCase())
    ) {
      return NextResponse.json({ error: 'Another category with this slug already exists' }, { status: 400 });
    }

    const oldName = categories[catIndex].name;
    const newName = name.trim();

    // Update category
    const updatedCategory: CategoryInfo = {
      ...categories[catIndex],
      name: newName,
      slug: newSlug.toLowerCase().trim(),
      description: description || '',
      layout: layout || categories[catIndex].layout,
      order: typeof order === 'number' ? order : categories[catIndex].order,
      isVisible: isVisible !== undefined ? isVisible : categories[catIndex].isVisible,
    };

    categories[catIndex] = updatedCategory;
    
    // Save updated categories
    const saveCatSuccess = saveCategories(categories);
    if (!saveCatSuccess) {
      return NextResponse.json({ error: 'Failed to save category update' }, { status: 500 });
    }

    // If category name was renamed, propagate this change to all articles
    if (oldName.toLowerCase() !== newName.toLowerCase()) {
      const articles = getArticles();
      let updatedCount = 0;
      const updatedArticles = articles.map((art) => {
        if (art.category.toLowerCase().trim() === oldName.toLowerCase().trim()) {
          updatedCount++;
          return {
            ...art,
            category: newName,
            // also update tag if it matches the category exactly
            tag: art.tag.toLowerCase().trim() === oldName.toLowerCase().trim() ? newName : art.tag,
          };
        }
        return art;
      });

      if (updatedCount > 0) {
        saveArticles(updatedArticles);
      }
    }

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const categories = getCategories();
    const catIndex = categories.findIndex((c) => c.slug.toLowerCase() === slug.toLowerCase());

    if (catIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryToDelete = categories[catIndex];
    categories.splice(catIndex, 1);

    const saveCatSuccess = saveCategories(categories);
    if (!saveCatSuccess) {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    // Reassign deleted category articles to "Latest News"
    const articles = getArticles();
    const updatedArticles = articles.map((art) => {
      if (art.category.toLowerCase().trim() === categoryToDelete.name.toLowerCase().trim()) {
        return {
          ...art,
          category: 'Latest News',
          tag: art.tag.toLowerCase().trim() === categoryToDelete.name.toLowerCase().trim() ? 'News' : art.tag,
        };
      }
      return art;
    });
    saveArticles(updatedArticles);

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
