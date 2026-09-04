export interface ArticleSection {
  heading: string;
  content: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  region?: string;
  contentType?: string;
  tag: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  image: string;
  readTime: string;
  excerpt: string;
  content?: string;
  placement?: 'top3' | 'latest-news' | 'best-month' | 'category';
  isBreaking?: boolean;
  paragraphs: string[];
  sections: ArticleSection[];
  featured?: boolean;
  trending?: boolean;
  viewsCount?: number;
  likesCount?: number;
}

export interface SubCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  layout?: string;
  order?: number;
  isVisible?: boolean;
  subcategories?: SubCategory[];
}

export type CategoryInfo = Category;
