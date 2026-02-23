import { memo, useMemo } from 'react';
import { X } from 'lucide-react';
import { FilterBadge } from './FilterBadge';
import type { NewsFilters } from '@/types/news';

type FilterBadgesProps = {
  searchQuery?: string;
  filters: NewsFilters;
  onClearSearchQuery: () => void;
  onClearFilter: (filterKey: FilterKey) => void;
  onClearAll: () => void;
};

type FilterKey =
  | 'startDate'
  | 'endDate'
  | 'newsapi-category'
  | 'newsapi-sources'
  | 'guardian-sections'
  | 'nytimes-desks'
  | 'nytimes-author';

const FilterBadgesComponent = ({
  searchQuery,
  filters,
  onClearSearchQuery,
  onClearFilter,
  onClearAll,
}: FilterBadgesProps) => {
  const hasActiveFilters = useMemo(
    () =>
      filters.startDate ||
      filters.endDate ||
      filters.apiFilters?.newsapi?.category ||
      (filters.apiFilters?.newsapi?.sources && filters.apiFilters.newsapi.sources.length > 0) ||
      (filters.apiFilters?.guardian?.sections && filters.apiFilters.guardian.sections.length > 0) ||
      (filters.apiFilters?.nytimes?.desks && filters.apiFilters.nytimes.desks.length > 0) ||
      filters.apiFilters?.nytimes?.author,
    [filters]
  );

  if (!searchQuery && !hasActiveFilters) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {searchQuery && (
        <FilterBadge label="Search" value={searchQuery} onClear={onClearSearchQuery} />
      )}

      {filters.startDate && (
        <FilterBadge
          label="From"
          value={filters.startDate.toLocaleDateString()}
          onClear={() => onClearFilter('startDate')}
          variant="green"
        />
      )}

      {filters.endDate && (
        <FilterBadge
          label="To"
          value={filters.endDate.toLocaleDateString()}
          onClear={() => onClearFilter('endDate')}
          variant="green"
        />
      )}

      {filters.apiFilters?.newsapi?.category && (
        <FilterBadge
          label="NewsAPI"
          value={filters.apiFilters.newsapi.category}
          onClear={() => onClearFilter('newsapi-category')}
        />
      )}

      {filters.apiFilters?.newsapi?.sources && filters.apiFilters.newsapi.sources.length > 0 && (
        <FilterBadge
          label="NewsAPI"
          value={`${filters.apiFilters.newsapi.sources.length} source${
            filters.apiFilters.newsapi.sources.length > 1 ? 's' : ''
          }`}
          onClear={() => onClearFilter('newsapi-sources')}
        />
      )}

      {filters.apiFilters?.guardian?.sections &&
        filters.apiFilters.guardian.sections.length > 0 && (
          <FilterBadge
            label="Guardian"
            value={`${filters.apiFilters.guardian.sections.length} section${
              filters.apiFilters.guardian.sections.length > 1 ? 's' : ''
            }`}
            onClear={() => onClearFilter('guardian-sections')}
            variant="orange"
          />
        )}

      {filters.apiFilters?.nytimes?.desks && filters.apiFilters.nytimes.desks.length > 0 && (
        <FilterBadge
          label="NYT"
          value={`${filters.apiFilters.nytimes.desks.length} desk${
            filters.apiFilters.nytimes.desks.length > 1 ? 's' : ''
          }`}
          onClear={() => onClearFilter('nytimes-desks')}
          variant="indigo"
        />
      )}

      {filters.apiFilters?.nytimes?.author && (
        <FilterBadge
          label="NYT Author"
          value={filters.apiFilters.nytimes.author}
          onClear={() => onClearFilter('nytimes-author')}
          variant="pink"
        />
      )}

      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
        data-testid="clear-all-filters-button"
      >
        Clear all
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export const FilterBadges = memo(FilterBadgesComponent);
