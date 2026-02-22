import type { NewsArticle, NewsFilters } from '../../types/news';
import type { NewsAPIResponse } from '../../types/api';
import type { NewsSource } from '../../types/news-source';
import { createMissingApiKeyError, createApiErrorFromResponse } from '../../lib/api-error';
import { formatDateISO } from '../../lib/date-utils';

const API_KEY = import.meta.env.REACT_APP_NEWSAPI_KEY;

function isEnabled(filters?: NewsFilters): boolean {
  return filters?.apiFilters?.newsapi?.enabled ?? true;
}

async function fetchArticles(
  page: number,
  pageSize: number,
  query?: string,
  filters?: NewsFilters
): Promise<NewsArticle[]> {
  if (!API_KEY) {
    throw createMissingApiKeyError('NewsAPI');
  }

  const params = new window.URLSearchParams();
  const category = filters?.apiFilters?.newsapi?.category;
  const sources = filters?.apiFilters?.newsapi?.sources;

  let endpoint = 'everything';

  // NewsAPI has different endpoints with different capabilities
  if (sources && sources.length > 0) {
    // When filtering by sources, must use 'everything' endpoint
    params.append('sources', sources.join(','));
    if (query) params.append('q', query);
    params.append('sortBy', 'publishedAt');
  } else if (category && !query) {
    // Category filtering only works with 'top-headlines'
    endpoint = 'top-headlines';
    params.append('category', category);
  } else {
    // Default search: use broad query to get results
    params.append('q', query || 'news OR world OR politics OR business OR technology');
    if (category) {
      const currentQuery = params.get('q') || '';
      params.set('q', `${currentQuery} AND ${category}`);
    }
    params.append('sortBy', 'publishedAt');
  }

  params.append('language', 'en');

  if (filters?.startDate) {
    params.append('from', formatDateISO(filters.startDate));
  }
  if (filters?.endDate) {
    params.append('to', formatDateISO(filters.endDate));
  }

  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  params.append('apiKey', API_KEY);

  const url = `https://newsapi.org/v2/${endpoint}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw createApiErrorFromResponse('NewsAPI', response.status);
  }

  const data: NewsAPIResponse = await response.json();

  return data.articles.map(article => ({
    id: `newsapi-${article.url}`,
    title: article.title,
    description: article.description || '',
    url: article.url,
    imageUrl: article.urlToImage || undefined,
    publishedAt: article.publishedAt,
    source: article.source.name,
    author: article.author || undefined,
  }));
}

export function createNewsAPIClient(): NewsSource {
  return {
    name: 'NewsAPI',
    id: 'newsapi',
    isEnabled,
    fetchArticles,
  };
}
