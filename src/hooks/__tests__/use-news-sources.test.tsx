import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNewsAPISources, useGuardianSections } from '../use-news-sources';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { mockNewsAPISources, mockGuardianSections } from '@/test/mock-data';

vi.mock('@/services/news-service', () => ({
  fetchNewsAPISources: vi.fn(),
  fetchGuardianSections: vi.fn(),
}));

import { fetchNewsAPISources, fetchGuardianSections } from '@/services/news-service';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNewsAPISources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches news sources successfully', async () => {
    vi.mocked(fetchNewsAPISources).mockResolvedValue(mockNewsAPISources);

    const { result } = renderHook(() => useNewsAPISources(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockNewsAPISources);
    expect(fetchNewsAPISources).toHaveBeenCalledWith();
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Failed to load NewsAPI sources');
    vi.mocked(fetchNewsAPISources).mockRejectedValue(error);

    const { result } = renderHook(() => useNewsAPISources(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(fetchNewsAPISources).toHaveBeenCalledWith();
  });
});

describe('useGuardianSections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches news sections successfully', async () => {
    vi.mocked(fetchGuardianSections).mockResolvedValue(mockGuardianSections);

    const { result } = renderHook(() => useGuardianSections(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGuardianSections);
    expect(fetchGuardianSections).toHaveBeenCalledWith();
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Failed to load Guardian sections');
    vi.mocked(fetchGuardianSections).mockRejectedValue(error);

    const { result } = renderHook(() => useGuardianSections(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(fetchGuardianSections).toHaveBeenCalledWith();
  });
});
