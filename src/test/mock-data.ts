import type { NewsArticle, NewsFilters, NewsAPISource, GuardianSection } from '@/types/news';

export function createMockArticle(overrides?: Partial<NewsArticle>): NewsArticle {
  const defaults: NewsArticle = {
    id: `article-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Breaking: Major Tech Announcement',
    description: 'A significant development in the technology sector has been announced today.',
    url: 'https://example.com/article',
    imageUrl: 'https://example.com/image.jpg',
    publishedAt: new Date().toISOString(),
    source: 'NewsAPI',
    author: 'John Doe',
    category: 'technology',
  };

  return { ...defaults, ...overrides };
}

export function createMockArticles(count: number, overrides?: Partial<NewsArticle>): NewsArticle[] {
  return Array.from({ length: count }, (_, i) =>
    createMockArticle({
      id: `article-${i}`,
      title: `Article ${i + 1}`,
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      ...overrides,
    })
  );
}

export const mockNewsAPISources: NewsAPISource[] = [
  {
    id: 'bbc-news',
    name: 'BBC News',
    description:
      'Use BBC News for up-to-the-minute news, breaking news, video, audio and feature stories.',
    url: 'http://www.bbc.co.uk/news',
    category: 'general',
    language: 'en',
    country: 'gb',
  },
  {
    id: 'cnn',
    name: 'CNN',
    description:
      'View the latest news and breaking news today for U.S., world, weather, entertainment, politics and health.',
    url: 'http://us.cnn.com',
    category: 'general',
    language: 'en',
    country: 'us',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    description:
      'TechCrunch is a leading technology media property, dedicated to obsessively profiling startups.',
    url: 'https://techcrunch.com',
    category: 'technology',
    language: 'en',
    country: 'us',
  },
];

export const mockGuardianSections: GuardianSection[] = [
  { id: 'world', webTitle: 'World news' },
  { id: 'politics', webTitle: 'Politics' },
  { id: 'technology', webTitle: 'Technology' },
  { id: 'business', webTitle: 'Business' },
];

export function createMockFilters(overrides?: Partial<NewsFilters>): NewsFilters {
  return {
    apiFilters: {
      newsapi: { enabled: true },
      guardian: { enabled: true },
      nytimes: { enabled: true },
    },
    ...overrides,
  };
}
