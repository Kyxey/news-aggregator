import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { fetchNewsAPISources, fetchGuardianSections } from '@/services/news-service';
import type { NewsAPISource, GuardianSection } from '@/types/news';

export function useNewsAPISources(): UseQueryResult<NewsAPISource[], Error> {
  return useQuery<NewsAPISource[], Error>({
    queryKey: ['newsapi', 'sources'],
    queryFn: async () => {
      try {
        return await fetchNewsAPISources();
      } catch (error) {
        console.warn('Failed to load NewsAPI sources:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

export function useGuardianSections(): UseQueryResult<GuardianSection[], Error> {
  return useQuery<GuardianSection[], Error>({
    queryKey: ['guardian', 'sections'],
    queryFn: async () => {
      try {
        return await fetchGuardianSections();
      } catch (error) {
        console.warn('Failed to load Guardian sections:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
