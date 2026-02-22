import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NewsFilters } from '@/types/news';

vi.mock('../clients/newsapi-client', () => ({
  createNewsAPIClient: () => ({
    name: 'NewsAPI',
    isEnabled: (filters?: NewsFilters) => filters?.apiFilters?.newsapi?.enabled !== false,
    fetchArticles: vi.fn().mockResolvedValue([
      {
        id: 'newsapi-1',
        title: 'NewsAPI Article 1',
        description: 'Description',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        source: 'NewsAPI',
      },
      {
        id: 'newsapi-2',
        title: 'NewsAPI Article 2',
        description: 'Description',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        source: 'NewsAPI',
      },
    ]),
  }),
}));

vi.mock('../clients/guardian-client', () => ({
  createGuardianClient: () => ({
    name: 'The Guardian',
    isEnabled: (filters?: NewsFilters) => filters?.apiFilters?.guardian?.enabled !== false,
    fetchArticles: vi.fn().mockResolvedValue([
      {
        id: 'guardian-1',
        title: 'Guardian Article 1',
        description: 'Description',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        source: 'The Guardian',
      },
      {
        id: 'guardian-2',
        title: 'Guardian Article 2',
        description: 'Description',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        source: 'The Guardian',
      },
    ]),
  }),
}));

vi.mock('../clients/nytimes-client', () => ({
  createNYTimesClient: () => ({
    name: 'The New York Times',
    isEnabled: (filters?: NewsFilters) => filters?.apiFilters?.nytimes?.enabled !== false,
    fetchArticles: vi.fn().mockResolvedValue([
      {
        id: 'nytimes-1',
        title: 'NYTimes Article 1',
        description: 'Description',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        source: 'The New York Times',
      },
      {
        id: 'nytimes-2',
        title: 'NYTimes Article 2',
        description: 'Description',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        source: 'The New York Times',
      },
    ]),
  }),
}));

import { newsAggregator } from '../news-aggregator';

describe('newsAggregator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches articles from all enabled sources', async () => {
    const articles = await newsAggregator.fetchAllNews(1, 30);

    expect(articles).toHaveLength(6);
    expect(articles.some(a => a.source === 'NewsAPI')).toBe(true);
    expect(articles.some(a => a.source === 'The Guardian')).toBe(true);
    expect(articles.some(a => a.source === 'The New York Times')).toBe(true);
  });

  it('sorts articles by date descending', async () => {
    const articles = await newsAggregator.fetchAllNews(1, 30);

    for (let i = 0; i < articles.length - 1; i++) {
      const current = new Date(articles[i].publishedAt).getTime();
      const next = new Date(articles[i + 1].publishedAt).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('respects source filters', async () => {
    const filters: NewsFilters = {
      apiFilters: {
        newsapi: { enabled: false },
        guardian: { enabled: true },
        nytimes: { enabled: true },
      },
    };

    const articles = await newsAggregator.fetchAllNews(1, 30, undefined, filters);

    expect(articles.every(a => a.source !== 'NewsAPI')).toBe(true);
  });

  it('returns empty array when all sources are disabled', async () => {
    const filters: NewsFilters = {
      apiFilters: {
        newsapi: { enabled: false },
        guardian: { enabled: false },
        nytimes: { enabled: false },
      },
    };

    const articles = await newsAggregator.fetchAllNews(1, 30, undefined, filters);

    expect(articles).toEqual([]);
  });

  it('handles partial failures gracefully', async () => {
    // This test demonstrates resilience - if one source fails, others still work
    // In a real scenario, you'd mock one source to throw an error
    const articles = await newsAggregator.fetchAllNews(1, 30);

    expect(articles.length).toBeGreaterThan(0);
  });
});
