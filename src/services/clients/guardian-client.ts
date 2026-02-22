import type { NewsArticle, NewsFilters } from '@/types/news';
import type { GuardianAPIResponse } from '@/types/api';
import type { NewsSource } from '@/types/news-source';
import { createMissingApiKeyError, createApiErrorFromResponse } from '@/lib/api-error';
import { formatDateISO } from '@/lib/date-utils';

const API_KEY = import.meta.env.REACT_APP_GUARDIAN_API_KEY;

function isEnabled(filters?: NewsFilters): boolean {
  return filters?.apiFilters?.guardian?.enabled ?? true;
}

async function fetchArticles(
  page: number,
  pageSize: number,
  query?: string,
  filters?: NewsFilters
): Promise<NewsArticle[]> {
  if (!API_KEY) {
    throw createMissingApiKeyError('Guardian');
  }

  const params = new window.URLSearchParams();

  params.append('lang', 'en');

  if (query) {
    params.append('q', query);
  }

  if (filters?.startDate) {
    params.append('from-date', formatDateISO(filters.startDate));
  }
  if (filters?.endDate) {
    params.append('to-date', formatDateISO(filters.endDate));
  }

  const sections = filters?.apiFilters?.guardian?.sections;
  if (sections && sections.length > 0) {
    // Guardian API accepts pipe-separated section IDs
    params.append('section', sections.join('|'));
  }

  params.append('page', page.toString());
  params.append('page-size', pageSize.toString());
  // Request additional fields - not all articles have thumbnails
  params.append('show-fields', 'thumbnail,trailText,byline');
  params.append('api-key', API_KEY);

  const url = `https://content.guardianapis.com/search?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw createApiErrorFromResponse('Guardian', response.status);
  }

  const data: GuardianAPIResponse = await response.json();

  return data.response.results.map(article => ({
    id: `guardian-${article.id}`,
    title: article.webTitle,
    description: article.fields?.trailText || '',
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail,
    publishedAt: article.webPublicationDate,
    source: 'The Guardian',
    author: article.fields?.byline,
  }));
}

export function createGuardianClient(): NewsSource {
  return {
    name: 'Guardian',
    id: 'guardian',
    isEnabled,
    fetchArticles,
  };
}
