import { useState, useCallback, useMemo } from 'react';
import { useNews } from '@/hooks/use-news';
import { NewsGrid } from '../components/NewsGrid';
import { SearchForm } from '../components/SearchForm';
import { FilterBadges } from '../components/FilterBadges';
import { Pagination } from '../components/Pagination';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import type { NewsFilters } from '@/types/news';
import { clearFilterByKey, hasAnyActiveFilters } from '@/lib/filter-utils';

type FilterKey =
  | 'startDate'
  | 'endDate'
  | 'newsapi-category'
  | 'newsapi-sources'
  | 'guardian-sections'
  | 'nytimes-desks'
  | 'nytimes-author';

const PAGE_SIZE = 30;

export const NewsPage = () => {
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
    setFilters(prevFilters => clearFilterByKey(prevFilters, filterKey));
    setCurrentPage(1);
  }, []);

  const handleClearSearchQuery = useCallback(() => {
    setSearchQuery(undefined);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(
    () => hasAnyActiveFilters(searchQuery, filters),
    [searchQuery, filters]
  );

  return (
    <div className="mb-6">
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      <FilterBadges
        searchQuery={searchQuery}
        filters={filters}
        onClearSearchQuery={handleClearSearchQuery}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearSearch}
      />

      {isLoading && <NewsGrid.Skeleton count={PAGE_SIZE / 3} />}

      {isError && <ErrorMessage error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && articles && (
        <>
          {articles.length === 0 ? (
            <EmptyState hasActiveFilters={hasActiveFilters} />
          ) : (
            <>
              <NewsGrid articles={articles} />
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  hasMore={articles.length >= PAGE_SIZE / 3}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
