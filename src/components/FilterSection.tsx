import { X } from 'lucide-react';
import { DateRangeFilter } from './DateRangeFilter';
import { NewsApiFilter } from './NewsApiFilter';
import { GuardianFilter } from './GuardianFilter';
import { NyTimesFilter } from './NyTimesFilter';

type FilterSectionProps = {
  isLoading: boolean;
  onClearFilters: () => void;
};

export const FilterSection = ({ isLoading, onClearFilters }: FilterSectionProps) => {
  return (
    <div
      className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      data-testid="filter-section"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-6">
        <DateRangeFilter disabled={isLoading} />

        <NewsApiFilter disabled={isLoading} />

        <GuardianFilter disabled={isLoading} />

        <NyTimesFilter disabled={isLoading} />

        <div className="flex gap-3 border-t border-gray-200 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="apply-filters-button"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="clear-filters-button"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
