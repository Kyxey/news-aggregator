import type { NewsArticle, NewsFilters } from './news';

/**
 * Configuration for a news source.
 */
export type NewsSourceConfig = {
  enabled: boolean;
};

/**
 * Contract for a news source implementation.
 * Each news API client must implement this interface to be used by the aggregator.
 */
export type NewsSource = {
  readonly name: string;
  readonly id: string;

  isEnabled(filters?: NewsFilters): boolean;
  fetchArticles(
    page: number,
    pageSize: number,
    query?: string,
    filters?: NewsFilters
  ): Promise<NewsArticle[]>;
};
