import type { NewsArticle, NewsFilters } from '../../types/news';
import type { NYTimesAPIResponse } from '../../types/api';
import type { NewsSource } from '../../types/news-source';
import { createMissingApiKeyError, createApiErrorFromResponse } from '../../lib/api-error';
import { formatDateCompact } from '../../lib/date-utils';

const API_KEY = import.meta.env.REACT_APP_NYTIMES_API_KEY;

function isEnabled(filters?: NewsFilters): boolean {
  return filters?.apiFilters?.nytimes?.enabled ?? true;
}

async function fetchArticles(
  page: number,
  _pageSize: number,
  query?: string,
  filters?: NewsFilters
): Promise<NewsArticle[]> {
  if (!API_KEY) {
    throw createMissingApiKeyError('NYTimes');
  }

  const params = new window.URLSearchParams();

  params.append('language.name', 'en');

  if (query) {
    params.append('q', query);
  }

  if (filters?.startDate) {
    params.append('begin_date', formatDateCompact(filters.startDate));
  }
  if (filters?.endDate) {
    params.append('end_date', formatDateCompact(filters.endDate));
  }

  const filterQueryParts: string[] = [];

  const desks = filters?.apiFilters?.nytimes?.desks;
  if (desks && desks.length > 0) {
    const deskFilter = desks.map(desk => `"${desk}"`).join(', ');
    filterQueryParts.push(`desk:(${deskFilter})`);
  }

  const author = filters?.apiFilters?.nytimes?.author;
  if (author) {
    filterQueryParts.push(`credits.creator.displayName:"${author}"`);
  }

  if (filterQueryParts.length > 0) {
    params.append('fq', filterQueryParts.join(' AND '));
  }

  params.append('page', (page - 1).toString());
  params.append('api-key', API_KEY);

  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw createApiErrorFromResponse('NYTimes', response.status);
  }

  const data: NYTimesAPIResponse = await response.json();

  return data.response.docs.map(article => ({
    id: `nytimes-${article._id}`,
    title: article.headline.main,
    description: article.abstract,
    url: article.web_url,
    imageUrl: article.multimedia?.[0]?.url
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : undefined,
    publishedAt: article.pub_date,
    source: 'The New York Times',
    author: article.byline?.original.slice(3),
    category: article.section_name,
  }));
}

export function createNYTimesClient(): NewsSource {
  return {
    name: 'NYTimes',
    id: 'nytimes',
    isEnabled,
    fetchArticles,
  };
}
