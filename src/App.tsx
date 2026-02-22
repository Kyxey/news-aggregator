import { useState, useCallback, useMemo } from 'react';
import { Newspaper, SearchX } from 'lucide-react';
import { useNews } from './hooks/use-news';
import { NewsCard } from './components/NewsCard';
import { NewsCardSkeleton } from './components/NewsCardSkeleton';
import { Pagination } from './components/Pagination';
import { ErrorMessage } from './components/ErrorMessage';
import { SearchForm } from './components/SearchForm';
import { FilterBadges } from './components/FilterBadges';
import type { NewsFilters } from './types/news';
import './index.css';

type FilterKey =
  | 'startDate'
  | 'endDate'
  | 'newsapi-category'
  | 'newsapi-sources'
  | 'guardian-sections'
  | 'nytimes-desks'
  | 'nytimes-author';

/*
 * TODO: This could probably be refactored into a helper function
 * but it works fine and is easy to understand
 */
const FILTER_CONFIG: Record<FilterKey, (filters: NewsFilters) => NewsFilters> = {
  startDate: filters => ({ ...filters, startDate: undefined }),
  endDate: filters => ({ ...filters, endDate: undefined }),
  'newsapi-category': filters => ({
    ...filters,
    apiFilters: {
      ...filters.apiFilters,
      newsapi: {
        ...filters.apiFilters?.newsapi,
        enabled: filters.apiFilters?.newsapi?.enabled ?? true,
        category: undefined,
      },
    },
  }),
  'newsapi-sources': filters => ({
    ...filters,
    apiFilters: {
      ...filters.apiFilters,
      newsapi: {
        ...filters.apiFilters?.newsapi,
        enabled: filters.apiFilters?.newsapi?.enabled ?? true,
        sources: undefined,
      },
    },
  }),
  'guardian-sections': filters => ({
    ...filters,
    apiFilters: {
      ...filters.apiFilters,
      guardian: {
        ...filters.apiFilters?.guardian,
        enabled: filters.apiFilters?.guardian?.enabled ?? true,
        sections: undefined,
      },
    },
  }),
  'nytimes-desks': filters => ({
    ...filters,
    apiFilters: {
      ...filters.apiFilters,
      nytimes: {
        ...filters.apiFilters?.nytimes,
        enabled: filters.apiFilters?.nytimes?.enabled ?? true,
        desks: undefined,
      },
    },
  }),
  'nytimes-author': filters => ({
    ...filters,
    apiFilters: {
      ...filters.apiFilters,
      nytimes: {
        ...filters.apiFilters?.nytimes,
        enabled: filters.apiFilters?.nytimes?.enabled ?? true,
        author: undefined,
      },
    },
  }),
};

const App = () => {
  const PAGE_SIZE = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<NewsFilters>({});

  const {
    data: articles,
    isLoading,
    isError,
    error,
    refetch,
  } = useNews({
    page: currentPage,
    pageSize: PAGE_SIZE,
    query: searchQuery,
    filters,
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((query: string, newFilters: NewsFilters) => {
    setSearchQuery(query || undefined);
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery(undefined);
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleClearFilter = useCallback((filterKey: FilterKey) => {
    const clearFn = FILTER_CONFIG[filterKey];
    if (clearFn) {
      setFilters(clearFn);
      setCurrentPage(1);
    }
  }, []);

  const handleClearSearchQuery = useCallback(() => {
    setSearchQuery(undefined);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        searchQuery ||
        filters.startDate ||
        filters.endDate ||
        filters.apiFilters?.newsapi?.category ||
        filters.apiFilters?.newsapi?.sources ||
        filters.apiFilters?.guardian?.sections ||
        filters.apiFilters?.nytimes?.desks ||
        filters.apiFilters?.nytimes?.author
      ),
    [searchQuery, filters]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow" data-testid="app-header">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <div className="flex-1">
              <h1
                className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                data-testid="app-title"
              >
                News Aggregator
              </h1>
              <p className="mt-1 text-sm text-gray-600" data-testid="app-subtitle">
                Latest news from NewsAPI, The Guardian, and The New York Times
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          <FilterBadges
            searchQuery={searchQuery}
            filters={filters}
            onClearSearchQuery={handleClearSearchQuery}
            onClearFilter={handleClearFilter}
            onClearAll={handleClearSearch}
          />
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="loading-skeletons">
            {Array.from({ length: PAGE_SIZE / 3 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && <ErrorMessage error={error} onRetry={() => refetch()} />}

        {!isLoading && !isError && articles && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="articles-grid">
              {articles.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {articles.length === 0 && (
              <div className="py-12 text-center text-gray-500" data-testid="empty-state">
                <SearchX className="w-14 h-14 mx-auto" />
                <p>
                  {hasActiveFilters
                    ? 'No news articles found matching your criteria.'
                    : 'No news articles found.'}
                </p>
              </div>
            )}

            {articles.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  hasMore={articles.length >= PAGE_SIZE / 3}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
