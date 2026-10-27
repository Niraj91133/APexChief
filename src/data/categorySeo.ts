export interface CategorySeoData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introContent: string;
  keywords: string;
}

export const CATEGORY_SEO_DATA: Record<string, CategorySeoData> = {
  all: {
    slug: 'all',
    metaTitle: 'UAE Articles & Latest Blogs',
    metaDescription:
      'Explore business, technology, leadership and industry articles covering emerging trends, expert insights and developments in the UAE and global markets. Read now!',
    h1: 'Explore Articles and Latest Blogs!',
    introContent:
      'Discover informative UAE articles and the latest blogs covering business, technology, leadership, real estate and more. Explore diverse topics, industry developments and expert perspectives to stay updated on emerging trends across the UAE and beyond.',
    keywords: 'uae articles, blog websites, latest articles, best blogging platform',
  },
  category: {
    slug: 'category',
    metaTitle: 'UAE Articles & Latest Blogs',
    metaDescription:
      'Explore business, technology, leadership and industry articles covering emerging trends, expert insights and developments in the UAE and global markets. Read now!',
    h1: 'Explore Articles and Latest Blogs!',
    introContent:
      'Discover informative UAE articles and the latest blogs covering business, technology, leadership, real estate and more. Explore diverse topics, industry developments and expert perspectives to stay updated on emerging trends across the UAE and beyond.',
    keywords: 'uae articles, blog websites, latest articles, best blogging platform',
  },
  interview: {
    slug: 'interview',
    metaTitle: 'Business Leader & CEO Interviews',
    metaDescription:
      'Read interviews with business leaders, founders and entrepreneurs. Discover their experiences, leadership lessons and insights into the UAE and global markets.',
    h1: 'Business Leader, CEO and Founder Interviews',
    introContent:
      'Explore interviews with business leaders, CEOs, founders and entrepreneurs sharing their experiences, challenges and achievements. Read insightful interview articles featuring leadership lessons, business strategies and perspectives from professionals shaping industries in the UAE and worldwide.',
    keywords: 'business leaders interviews, ceo interviews, founder interviews, interview articles',
  },
  'top-list': {
    slug: 'top-list',
    metaTitle: 'Top Startups & Startup Companies',
    metaDescription:
      'Explore top startups, emerging startup companies and curated top list articles. Discover innovative businesses, industry leaders and companies to watch in the UAE and beyond.',
    h1: 'Top Startups and Companies to Know',
    introContent:
      'Discover top startups, innovative startup companies and curated lists of notable businesses across different industries. Explore top list articles highlighting emerging ventures, successful organisations and companies making an impact in the UAE and global markets.',
    keywords: 'top startups, startup companies, topList articles',
  },
  leadership: {
    slug: 'leadership',
    metaTitle: 'Leadership Insights & Strategies',
    metaDescription:
      'Explore leadership insights, practical leadership strategies and informative leadership articles covering management, decision-making, team development and business growth.',
    h1: 'Leadership Insights and Strategies',
    introContent:
      'Discover perspectives on decision-making, team building, business growth and organisational development to understand how leaders can navigate challenges and drive success.',
    keywords: 'leadership insights, leadership strategies, leadership articles',
  },
  technology: {
    slug: 'technology',
    metaTitle: 'Technology Trends & Digital Transformation UAE',
    metaDescription:
      'Explore technology trends, business technology and digital transformation in the UAE. Discover emerging innovations, tech trends and developments shaping modern industries.',
    h1: 'Technology Trends and Business Innovation',
    introContent:
      'Stay informed about technology trends, business technology and digital transformation in the UAE. Explore articles on emerging innovations, artificial intelligence, automation and digital solutions transforming businesses and industries across the region and worldwide.',
    keywords: 'technology trends, business technology, digital transformation uae, tech trends',
  },
  business: {
    slug: 'business',
    metaTitle: 'Business Articles, News & Trends in the UAE',
    metaDescription:
      'Explore business articles, UAE business news and the latest business trends. Discover company developments, market insights, business strategies and industry opportunities.',
    h1: 'Business Articles, News and Trends',
    introContent:
      'Explore business articles covering company developments, business strategies, market opportunities and emerging business trends. Stay informed about UAE business news and industry insights that help readers understand the changing business landscape and opportunities for growth.',
    keywords: 'business articles, business news uae, business trends',
  },
  news: {
    slug: 'news',
    metaTitle: 'UAE Business News & Economic Updates',
    metaDescription:
      'Stay updated with UAE business news, the latest UAE news, economic developments and industry news. Explore important stories shaping businesses and markets.',
    h1: 'UAE Business News and Industry Updates',
    introContent:
      'Stay informed with UAE business news, the latest UAE news and important industry developments. Explore economic news, market updates and business stories covering the events, trends and changes influencing industries across the UAE and global markets.',
    keywords: 'uae business news, latest uae news, economic news uae, industry news',
  },
  'real-estate': {
    slug: 'real-estate',
    metaTitle: 'UAE Real Estate Market & Dubai Property News',
    metaDescription:
      'Explore the UAE real estate market, Dubai property market trends and Dubai real estate news. Discover property developments, market insights and industry updates.',
    h1: 'UAE Real Estate Market and Dubai Property Trends',
    introContent:
      'Explore the UAE real estate market through articles covering Dubai property market developments, property trends and Dubai real estate news. Discover insights into residential and commercial real estate, market developments and investment-related topics shaping the UAE property sector.',
    keywords: 'uae real estate market, dubai property market, dubai real estate news',
  },
  health: {
    slug: 'health',
    metaTitle: 'Healthcare Industry Trends & Health Insights',
    metaDescription:
      'Explore healthcare industry trends, current healthcare developments and health and wellness blogs. Discover health-related insights, medical innovation and emerging healthcare topics.',
    h1: 'Healthcare Industry Trends and Health Insights',
    introContent:
      'Explore healthcare industry trends, current healthcare developments and informative health and wellness blogs. Discover articles covering healthcare innovation, medical technology, health-related topics and changing approaches to health and wellness in the UAE and worldwide.',
    keywords: 'healthcare industry trends, current healthcare trends, health and wellness blogs, health related blogs',
  },
  retail: {
    slug: 'retail',
    metaTitle: 'UAE Retail Market, E-commerce & Industry Trends',
    metaDescription:
      'Discover retail industry trends, e-commerce in the UAE and developments in the UAE retail market. Explore consumer behaviour, retail technology and changing shopping trends.',
    h1: 'Retail Industry Trends and E-commerce',
    introContent:
      'Explore retail industry trends, e-commerce developments in the UAE and changes shaping the UAE retail market. Discover insights into consumer behaviour, digital shopping, retail technology and evolving customer expectations across the region.',
    keywords: 'retail industry trends, e commerce uae, uae retail market',
  },
  hospitality: {
    slug: 'hospitality',
    metaTitle: 'UAE Hospitality Industry & Trends',
    metaDescription:
      'Explore hospitality industry trends and the UAE hospitality industry. Discover insights into hotels, tourism, guest experiences and developments shaping hospitality businesses.',
    h1: 'Hospitality Industry and Emerging Trends',
    introContent:
      'Explore hospitality industry trends and developments shaping the UAE hospitality industry. Discover articles covering hotels, tourism, guest experiences, service innovation and changing customer expectations across the region\'s hospitality sector.',
    keywords: 'hospitality industry trends, uae hospitality industry',
  },
  lifestyle: {
    slug: 'lifestyle',
    metaTitle: 'Modern Living, Lifestyle & Design',
    metaDescription:
      'Explore modern living, lifestyle and design ideas covering contemporary spaces, everyday experiences, emerging lifestyle trends and inspiration for life in the UAE and beyond.',
    h1: 'Modern Living, Lifestyle and Design',
    introContent:
      'Discover ideas and perspectives on modern living, lifestyle and design. Explore articles covering contemporary lifestyles, design inspiration, changing preferences and trends that influence how people live, work and experience everyday life in the UAE and beyond.',
    keywords: 'modern living, lifestyle and design',
  },
  startups: {
    slug: 'startups',
    metaTitle: 'Startups in UAE & Dubai Startup Ecosystem',
    metaDescription:
      'Explore startups in the UAE, the UAE startup ecosystem and business startups in Dubai. Discover entrepreneurship, startup growth, funding developments and innovation.',
    h1: 'Startups in the UAE and Dubai\'s Startup Ecosystem',
    introContent:
      'Explore startups in the UAE and discover developments shaping the UAE startup ecosystem. Read about business startups in Dubai, entrepreneurship, innovative business ideas, startup growth and funding opportunities influencing the region\'s entrepreneurial landscape.',
    keywords: 'startups in uae, uae startup ecosystem, business startup in dubai',
  },
  opinion: {
    slug: 'opinion',
    metaTitle: 'Business Opinions, Insights & Industry Perspectives',
    metaDescription:
      'Explore business opinions and insights, expert commentary and industry perspectives on leadership, technology, markets and the developments shaping modern businesses.',
    h1: 'Business Opinions, Insights and Industry Perspectives',
    introContent:
      'Explore business opinions and insights from different industry perspectives. Read commentary on leadership, technology, business developments and emerging market trends to understand the ideas, viewpoints and discussions shaping modern industries in the UAE and worldwide.',
    keywords: 'industry perspectives, business opinions and insights',
  },
};

export function getCategorySeo(slug?: string): CategorySeoData {
  if (!slug) return CATEGORY_SEO_DATA.all;
  const clean = slug.toLowerCase().trim().replace(/[-\s]/g, '');

  for (const [key, val] of Object.entries(CATEGORY_SEO_DATA)) {
    if (key.replace(/[-\s]/g, '') === clean) {
      return val;
    }
  }

  // Fallback
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    slug,
    metaTitle: `${formatted} Articles & Industry News`,
    metaDescription: `Explore latest ${formatted} reporting, executive insights, market intelligence and industry dispatches on ApexChief.`,
    h1: `${formatted} Articles and Industry Insights`,
    introContent: `Explore in-depth reporting, thought leadership and market intelligence on ${formatted} across the UAE and global markets.`,
    keywords: `${slug}, ${slug} uae, business, apexchief`,
  };
}
