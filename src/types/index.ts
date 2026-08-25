export interface ArticleSection {
  heading: string;
  content: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  tag: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  image: string;
  readTime: string;
  excerpt: string;
  paragraphs: string[];
  sections: ArticleSection[];
  featured?: boolean;
  trending?: boolean;
}

export type CategorySlug =
  | 'world'
  | 'technology'
  | 'culture'
  | 'business'
  | 'lifestyle'
  | 'travel'
  | 'health'
  | 'ai';

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  layout?: string;
  order?: number;
  isVisible?: boolean;
}
