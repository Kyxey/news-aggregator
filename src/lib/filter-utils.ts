export const toggleArraySelection = <T>(currentSelection: T[], allItems: T[]): T[] => {
  if (currentSelection.length === 0 || currentSelection.length === allItems.length) {
    return [];
  }
  return [...allItems];
};

export const toggleItemInArray = <T>(currentSelection: T[], item: T): T[] => {
  if (currentSelection.includes(item)) {
    return currentSelection.filter(i => i !== item);
  }
  return [...currentSelection, item];
};

import type { NewsFilters } from '@/types/news';

type FilterKey =
  | 'startDate'
  | 'endDate'
  | 'newsapi-category'
  | 'newsapi-sources'
  | 'guardian-sections'
  | 'nytimes-desks'
  | 'nytimes-author';

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

export const clearFilterByKey = (filters: NewsFilters, filterKey: FilterKey): NewsFilters => {
  const clearFn = FILTER_CONFIG[filterKey];
  return clearFn ? clearFn(filters) : filters;
};

export const hasAnyActiveFilters = (
  searchQuery: string | undefined,
  filters: NewsFilters
): boolean => {
  return Boolean(
    searchQuery ||
    filters.startDate ||
    filters.endDate ||
    filters.apiFilters?.newsapi?.category ||
    filters.apiFilters?.newsapi?.sources ||
    filters.apiFilters?.guardian?.sections ||
    filters.apiFilters?.nytimes?.desks ||
    filters.apiFilters?.nytimes?.author
  );
};
