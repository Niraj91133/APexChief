import { supabaseAdmin, supabase } from './supabase';
import { Article, CategoryInfo } from '@/types';
import { siteConfig } from '@/data/siteConfig';

// Helper to convert Supabase row to Article interface
export function mapRowToArticle(row: any): Article {
  return {
    id: row.id || row.slug,
    slug: row.slug,
    title: row.title,
    category: row.category,
    subcategory: row.subcategory || undefined,
    region: row.region || 'Global',
    contentType: row.content_type || 'News',
    tag: row.tag || 'General',
    date: row.date_text || row.publish_date || 'Recent',
    author: row.author_name || 'Admin',
    authorRole: row.author_role || 'Editor',
    authorAvatar: row.author_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    image: row.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    readTime: row.read_time || '4 min read',
    excerpt: row.excerpt || '',
    content: row.content || '',
    placement: row.placement || 'category',
    isBreaking: Boolean(row.is_breaking),
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    status: row.status || 'Published',
    publishDate: row.publish_date || undefined,
    publishTime: row.publish_time || undefined,
    publishTimezone: row.publish_timezone || undefined,
    homepagePriority: row.homepage_priority || 'Normal',
    paragraphs: Array.isArray(row.paragraphs) ? row.paragraphs : [],
    sections: Array.isArray(row.sections) ? row.sections : [],
  } as Article;
}

// Helper to convert Article interface to Supabase row
export function mapArticleToRow(art: Article): any {
  return {
    slug: art.slug || art.id,
    title: art.title,
    category: art.category,
    subcategory: art.subcategory || null,
    region: art.region || 'Global',
    content_type: art.contentType || 'News',
    tag: art.tag || 'General',
    date_text: art.date,
    author_name: art.author || 'Admin',
    author_role: art.authorRole || 'Editor',
    author_avatar: art.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    image_url: art.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    read_time: art.readTime || '4 min read',
    excerpt: art.excerpt || '',
    content: art.content || '',
    placement: art.placement || 'category',
    homepage_priority: (art as any).homepagePriority || 'Normal',
    is_breaking: Boolean(art.isBreaking),
    featured: Boolean(art.featured),
    trending: Boolean(art.trending),
    status: (art as any).status || 'Published',
    publish_date: (art as any).publishDate || new Date().toISOString().split('T')[0],
    publish_time: (art as any).publishTime || '09:00',
    publish_timezone: (art as any).publishTimezone || 'GST',
    paragraphs: art.paragraphs || [],
    sections: art.sections || [],
  };
}

// --- ARTICLES OPERATIONS ---
export async function getArticlesFromDB(): Promise<Article[] | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getArticles error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapRowToArticle);
    }
    return [];
  } catch (err) {
    console.error('Supabase getArticles exception:', err);
    return null;
  }
}

export async function upsertArticleInDB(article: Article): Promise<boolean> {
  try {
    const row = mapArticleToRow(article);
    const { error } = await supabaseAdmin
      .from('articles')
      .upsert(row, { onConflict: 'slug' });

    if (error) {
      console.error('Supabase upsertArticle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsertArticle exception:', err);
    return false;
  }
}

export async function deleteArticleFromDB(idOrSlug: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .or(`slug.eq.${idOrSlug},id.eq.${idOrSlug}`);

    if (error) {
      console.error('Supabase deleteArticle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteArticle exception:', err);
    return false;
  }
}

// --- CATEGORIES OPERATIONS ---
export async function getCategoriesFromDB(): Promise<CategoryInfo[] | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase getCategories error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        layout: cat.layout || `${cat.slug}-layout`,
        order: cat.display_order || 1,
        isVisible: cat.is_visible !== false,
        subcategories: cat.subcategories || [],
      }));
    }
    return [];
  } catch (err) {
    console.error('Supabase getCategories exception:', err);
    return null;
  }
}

export async function upsertCategoryInDB(cat: CategoryInfo): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('categories').upsert(
      {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        layout: cat.layout || `${cat.slug}-layout`,
        display_order: cat.order || 1,
        is_visible: cat.isVisible !== false,
        subcategories: cat.subcategories || [],
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error('Supabase upsertCategory error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsertCategory exception:', err);
    return false;
  }
}

export async function bulkSaveCategoriesInDB(categories: CategoryInfo[]): Promise<boolean> {
  try {
    const rows = categories.map((cat, idx) => ({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      layout: cat.layout || `${cat.slug}-layout`,
      display_order: cat.order !== undefined ? cat.order : idx + 1,
      is_visible: cat.isVisible !== false,
      subcategories: cat.subcategories || [],
    }));

    const { error } = await supabaseAdmin
      .from('categories')
      .upsert(rows, { onConflict: 'slug' });

    if (error) {
      console.error('Supabase bulkSaveCategories error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase bulkSaveCategories exception:', err);
    return false;
  }
}

// --- SITE CONFIG OPERATIONS ---
export async function getSiteConfigFromDB(): Promise<typeof siteConfig | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'global_config')
      .single();

    if (error) {
      console.error('Supabase getSiteConfig error:', error.message);
      return null;
    }

    if (data) {
      return {
        name: data.name || 'ApexChief',
        shortName: data.short_name || 'ApexChief',
        tagline: data.tagline || '',
        description: data.description || '',
        establishedYear: data.established_year || '2023',
        currentDate: data.current_date_text || 'Monday, May 25, 2026',
        edition: data.edition || 'Vol. XIV, No. 128 — Global Edition',
        contact: data.contact || siteConfig.contact,
        socialLinks: data.social_links || siteConfig.socialLinks,
        copyright: data.copyright || siteConfig.copyright,
      };
    }
    return null;
  } catch (err) {
    console.error('Supabase getSiteConfig exception:', err);
    return null;
  }
}

export async function saveSiteConfigInDB(config: typeof siteConfig): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('site_settings').upsert({
      id: 'global_config',
      name: config.name,
      short_name: config.shortName,
      tagline: config.tagline,
      description: config.description,
      established_year: config.establishedYear,
      current_date_text: config.currentDate,
      edition: config.edition,
      contact: config.contact,
      social_links: config.socialLinks,
      copyright: config.copyright,
    });

    if (error) {
      console.error('Supabase saveSiteConfig error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSiteConfig exception:', err);
    return false;
  }
}
