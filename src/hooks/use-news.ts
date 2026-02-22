import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { newsAggregator } from '@/services/news-aggregator';
import type { NewsArticle, NewsFilters } from '@/types/news';

type UseNewsOptions = {
  page?: number;
  pageSize?: number;
  query?: string;
  filters?: NewsFilters;
};

export function useNews({
  page = 1,
  pageSize = 10,
  query,
  filters,
}: UseNewsOptions = {}): UseQueryResult<NewsArticle[], Error> {
  const queryClient = useQueryClient();

  const result = useQuery<NewsArticle[], Error>({
    queryKey: ['news', page, pageSize, query, filters],
    queryFn: () => newsAggregator.fetchAllNews(page, pageSize, query, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Prefetch next page when current page loads successfully
  // Only prefetch if we got enough results (otherwise we're probably at the end)
  useEffect(() => {
    if (result.data && result.data.length >= pageSize / 3) {
      queryClient.prefetchQuery({
        queryKey: ['news', page + 1, pageSize, query, filters],
        queryFn: () => newsAggregator.fetchAllNews(page + 1, pageSize, query, filters),
        staleTime: 1000 * 60 * 5,
      });
    }
  }, [result.data, page, pageSize, query, filters, queryClient]);

  return result;
}
