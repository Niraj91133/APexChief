const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ndvzzpyyctbbywvbrnzj.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdnp6cHl5Y3RiYnl3dmJybnpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODUzNzM2OSwiZXhwIjoyMTA0MTEzMzY5fQ.dDtdisngxTjm6pIV_Xq51ttMa3MHxiRBUUOB60e30EE';

const supabase = createClient(supabaseUrl, serviceKey);

async function syncData() {
  console.log('--- SYNCING LOCAL JSON DATA TO SUPABASE ---');

  // 1. Sync Site Config
  try {
    const configPath = path.join(__dirname, 'src/data/siteConfig.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const { error } = await supabase.from('site_settings').upsert({
        id: 'global_config',
        name: config.name || 'ApexChief',
        short_name: config.shortName || 'ApexChief',
        tagline: config.tagline,
        description: config.description,
        established_year: config.establishedYear,
        current_date_text: config.currentDate,
        edition: config.edition,
        contact: config.contact,
        social_links: config.socialLinks,
        copyright: config.copyright,
      });
      if (error) console.error('Site Settings sync error:', error.message);
      else console.log('✓ Site settings synced successfully.');
    }
  } catch (e) {
    console.error('Error in config sync:', e);
  }

  // 2. Sync Categories
  try {
    const categoriesPath = path.join(__dirname, 'src/data/categories.json');
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
      for (const cat of categories) {
        const { error } = await supabase.from('categories').upsert(
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
        if (error) console.error(`Error syncing category ${cat.name}:`, error.message);
      }
      console.log(`✓ Synced ${categories.length} categories.`);
    }
  } catch (e) {
    console.error('Error in categories sync:', e);
  }

  // 3. Sync Articles
  try {
    const articlesPath = path.join(__dirname, 'src/data/articles.json');
    if (fs.existsSync(articlesPath)) {
      const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
      let count = 0;
      for (const art of articles) {
        const { error } = await supabase.from('articles').upsert(
          {
            slug: art.slug || art.id,
            title: art.title,
            category: art.category,
            subcategory: art.subcategory || null,
            region: art.region || 'Global',
            content_type: art.contentType || art.articleType || 'News',
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
            homepage_priority: art.homepagePriority || 'Normal',
            is_breaking: Boolean(art.isBreaking),
            featured: Boolean(art.featured),
            trending: Boolean(art.trending),
            status: art.status || 'Published',
            publish_date: art.publishDate || '2026-09-04',
            publish_time: art.publishTime || '09:00',
            publish_timezone: art.publishTimezone || 'GST',
            paragraphs: art.paragraphs || [],
            sections: art.sections || [],
          },
          { onConflict: 'slug' }
        );
        if (error) {
          console.error(`Error syncing article ${art.title}:`, error.message);
        } else {
          count++;
        }
      }
      console.log(`✓ Successfully synced ${count} articles to Supabase.`);
    }
  } catch (e) {
    console.error('Error in articles sync:', e);
  }

  console.log('--- ALL SYNC COMPLETED SUCCESSFULLY ---');
}

syncData();
