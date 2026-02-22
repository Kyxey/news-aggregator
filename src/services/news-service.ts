import type { NewsAPISource, GuardianSection } from '../types/news';
import type { NewsAPISourcesResponse, GuardianSectionsResponse } from '../types/api';
import { createMissingApiKeyError, createApiErrorFromResponse } from '../lib/api-error';

const NEWSAPI_KEY = import.meta.env.REACT_APP_NEWSAPI_KEY;
const GUARDIAN_API_KEY = import.meta.env.REACT_APP_GUARDIAN_API_KEY;

export async function fetchNewsAPISources(): Promise<NewsAPISource[]> {
  if (!NEWSAPI_KEY) {
    throw createMissingApiKeyError('NewsAPI');
  }

  const url = `https://newsapi.org/v2/top-headlines/sources?apiKey=${NEWSAPI_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw createApiErrorFromResponse('NewsAPI', response.status);
  }

  const data: NewsAPISourcesResponse = await response.json();
  return data.sources;
}

export async function fetchGuardianSections(): Promise<GuardianSection[]> {
  if (!GUARDIAN_API_KEY) {
    throw createMissingApiKeyError('Guardian');
  }

  const url = `https://content.guardianapis.com/sections?api-key=${GUARDIAN_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw createApiErrorFromResponse('Guardian', response.status);
  }

  const data: GuardianSectionsResponse = await response.json();
  return data.response.results.map(section => ({
    id: section.id,
    webTitle: section.webTitle,
  }));
}
