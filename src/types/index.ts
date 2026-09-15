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
  placement?: 'top3' | 'latest-news' | 'best-month' | 'category' | 'interview' | 'top10' | 'standard';
  isBreaking?: boolean;
  paragraphs: string[];
  sections: ArticleSection[];
  featured?: boolean;
  trending?: boolean;
  viewsCount?: number;
  likesCount?: number;
  focusKeyword?: string;
  status?: string;
  articleType?: string;
  homepagePriority?: string;
  publishDate?: string;
  publishTime?: string;
  publishTimezone?: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  logo?: string;
  tagline: string;
  description: string;
  establishedYear: string;
  currentDate: string;
  edition: string;
  contact: {
    email: string;
    phone: string;
    logo?: string;
    addressNY: {
      title: string;
      street: string;
      city: string;
      country: string;
    };
    addressLondon: {
      title: string;
      street: string;
      city: string;
      country: string;
    };
  };
  socialLinks: {
    twitter: string;
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  copyright: string;
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
