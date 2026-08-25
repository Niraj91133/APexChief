import fs from 'fs';
import path from 'path';
import { Article, CategoryInfo } from '@/types';
import { ARTICLES } from './articles';
import { siteConfig } from './siteConfig';
import { CATEGORIES } from './categories';

const ARTICLES_FILE = path.join(process.cwd(), 'src/data/articles.json');
const CONFIG_FILE = path.join(process.cwd(), 'src/data/siteConfig.json');
const CATEGORIES_FILE = path.join(process.cwd(), 'src/data/categories.json');

// Helper to initialize JSON files if they don't exist
function initDB() {
  try {
    const dataDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(ARTICLES, null, 2), 'utf-8');
    }

    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(siteConfig, null, 2), 'utf-8');
    }

    if (!fs.existsSync(CATEGORIES_FILE)) {
      const initialCategories = CATEGORIES.map((cat, index) => {
        let layout = 'world-layout';
        if (cat.slug === 'technology') layout = 'tech-layout';
        else if (cat.slug === 'culture') layout = 'culture-layout';
        else if (cat.slug === 'business') layout = 'business-layout';
        else if (cat.slug === 'lifestyle') layout = 'lifestyle-layout';
        else if (cat.slug === 'travel') layout = 'travel-layout';
        else if (cat.slug === 'health') layout = 'health-layout';
        else if (cat.slug === 'ai') layout = 'ai-layout';
        
        return {
          ...cat,
          layout,
          order: index + 1,
          isVisible: true
        };
      });
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(initialCategories, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Failed to initialize database files', e);
  }
}

// Ensure database files are initialized
initDB();

export function getArticles(): Article[] {
  try {
    initDB();
    if (fs.existsSync(ARTICLES_FILE)) {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading articles.json', e);
  }
  return ARTICLES;
}

export function saveArticles(articles: Article[]): boolean {
  try {
    initDB();
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving articles.json', e);
    return false;
  }
}

export function getSiteConfig(): typeof siteConfig {
  try {
    initDB();
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading siteConfig.json', e);
  }
  return siteConfig;
}

export function saveSiteConfig(config: typeof siteConfig): boolean {
  try {
    initDB();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving siteConfig.json', e);
    return false;
  }
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getArticles();
  return articles.find((a) => a.slug === slug || a.id === slug);
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 4): Article[] {
  const articles = getArticles();
  return articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, limit);
}

export function getCategories(): CategoryInfo[] {
  try {
    initDB();
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      const cats = JSON.parse(data);
      // Ensure they are sorted by order
      return cats.sort((a: CategoryInfo, b: CategoryInfo) => (a.order || 0) - (b.order || 0));
    }
  } catch (e) {
    console.error('Error reading categories.json', e);
  }
  return CATEGORIES.map((cat, index) => ({
    ...cat,
    layout: cat.slug === 'ai' ? 'ai-layout' : `${cat.slug}-layout`,
    order: index + 1,
    isVisible: true
  }));
}

export function saveCategories(categories: CategoryInfo[]): boolean {
  try {
    initDB();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving categories.json', e);
    return false;
  }
}
