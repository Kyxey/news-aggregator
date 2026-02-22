import type { NewsArticle, NewsFilters } from '@/types/news';
import type { NewsSource } from '@/types/news-source';
import { isApiError } from '@/lib/api-error';
import { createNewsAPIClient } from './clients/newsapi-client';
import { createGuardianClient } from './clients/guardian-client';
import { createNYTimesClient } from './clients/nytimes-client';

type NewsAggregator = {
  sources: NewsSource[];
  registerSource: (source: NewsSource) => void;
  fetchAllNews: (
    page: number,
    pageSize: number,
    query?: string,
    filters?: NewsFilters
  ) => Promise<NewsArticle[]>;
};

function createNewsAggregator(): NewsAggregator {
  const sources: NewsSource[] = [];

  function registerSource(source: NewsSource): void {
    sources.push(source);
  }

  async function fetchAllNews(
    page: number,
    pageSize: number,
    query?: string,
    filters?: NewsFilters
  ): Promise<NewsArticle[]> {
    const enabledSources = sources.filter(source => source.isEnabled(filters));

    if (enabledSources.length === 0) {
      return [];
    }

    // Split pageSize evenly across enabled sources
    // This ensures we get a balanced mix from each API
    const itemsPerSource = Math.floor(pageSize / enabledSources.length);

    const promises = enabledSources.map(source =>
      source.fetchArticles(page, itemsPerSource, query, filters)
    );

    const results = await Promise.allSettled(promises);

    const allArticles: NewsArticle[] = [];
    const errors: unknown[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      } else {
        const sourceName = enabledSources[index].name;
        console.error(`Failed to fetch from ${sourceName}:`, result.reason);

        if (isApiError(result.reason)) {
          errors.push(result.reason);
        }
      }
    });

    // Only throw if all sources failed
    if (allArticles.length === 0 && errors.length > 0) {
      throw errors[0];
    }

    // Sort by date descending - most recent first
    return allArticles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  return {
    sources,
    registerSource,
    fetchAllNews,
  };
}

const aggregator = createNewsAggregator();
aggregator.registerSource(createNewsAPIClient());
aggregator.registerSource(createGuardianClient());
aggregator.registerSource(createNYTimesClient());

export const newsAggregator = aggregator;
