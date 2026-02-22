import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNews } from '../use-news';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { createMockArticles } from '@/test/mock-data';

vi.mock('@/services/news-aggregator', () => ({
  newsAggregator: {
    fetchAllNews: vi.fn(),
  },
}));

import { newsAggregator } from '@/services/news-aggregator';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches news articles successfully', async () => {
    const mockArticles = createMockArticles(10);
    vi.mocked(newsAggregator.fetchAllNews).mockResolvedValue(mockArticles);

    const { result } = renderHook(() => useNews({ page: 1, pageSize: 10 }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockArticles);
    expect(newsAggregator.fetchAllNews).toHaveBeenCalledWith(1, 10, undefined, undefined);
  });

  it('passes query and filters to the aggregator', async () => {
    const mockArticles = createMockArticles(5);
    vi.mocked(newsAggregator.fetchAllNews).mockResolvedValue(mockArticles);

    const filters = {
      apiFilters: {
        newsapi: { enabled: true, category: 'technology' as const },
      },
    };

    renderHook(() => useNews({ page: 1, pageSize: 10, query: 'AI', filters }), { wrapper });

    await waitFor(() => {
      expect(newsAggregator.fetchAllNews).toHaveBeenCalledWith(1, 10, 'AI', filters);
    });
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Failed to fetch news');
    vi.mocked(newsAggregator.fetchAllNews).mockRejectedValue(error);

    const { result } = renderHook(() => useNews({ page: 1, pageSize: 10 }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });

  it('uses default values when no options provided', async () => {
    const mockArticles = createMockArticles(10);
    vi.mocked(newsAggregator.fetchAllNews).mockResolvedValue(mockArticles);

    renderHook(() => useNews(), { wrapper });

    await waitFor(() => {
      expect(newsAggregator.fetchAllNews).toHaveBeenCalledWith(1, 10, undefined, undefined);
    });
  });

  it('updates when page changes', async () => {
    const mockArticles = createMockArticles(10);
    vi.mocked(newsAggregator.fetchAllNews).mockResolvedValue(mockArticles);

    const { result, rerender } = renderHook(({ page }) => useNews({ page, pageSize: 10 }), {
      wrapper,
      initialProps: { page: 1 },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ page: 2 });

    await waitFor(() => {
      expect(newsAggregator.fetchAllNews).toHaveBeenCalledWith(2, 10, undefined, undefined);
    });
  });
});
