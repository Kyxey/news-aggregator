import { X } from 'lucide-react';
import { DateRangeFilter } from './DateRangeFilter';
import { NewsApiFilter, GuardianFilter, NyTimesFilter } from './ApiSourceFilter';
import type { NewsAPICategory, NewsAPISource, GuardianSection, NYTimesDesk } from '@/types/news';

type FormState = {
  startDate?: Date;
  endDate?: Date;
  newsApiEnabled: boolean;
  newsApiCategory?: NewsAPICategory;
  newsApiSources: string[];
  guardianEnabled: boolean;
  guardianSections: string[];
  nytimesEnabled: boolean;
  nytimesDesks: NYTimesDesk[];
  nytimesAuthor: string;
};

type FilterSectionProps = {
  formState: FormState;
  newsApiSources: NewsAPISource[];
  guardianSections: GuardianSection[];
  loadingNewsApiSources: boolean;
  loadingSections: boolean;
  isLoading: boolean;
  onFormStateChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onNewsApiCategoryChange: (category?: NewsAPICategory) => void;
  onNewsApiSourceToggle: (sourceId: string) => void;
  onNewsApiSourceToggleAll: () => void;
  onGuardianSectionToggle: (sectionId: string) => void;
  onGuardianSectionToggleAll: () => void;
  onNytimesDeskToggle: (desk: NYTimesDesk) => void;
  onNytimesDeskToggleAll: () => void;
  onClearFilters: () => void;
};

export const FilterSection = ({
  formState,
  newsApiSources,
  guardianSections,
  loadingNewsApiSources,
  loadingSections,
  isLoading,
  onFormStateChange,
  onNewsApiCategoryChange,
  onNewsApiSourceToggle,
  onNewsApiSourceToggleAll,
  onGuardianSectionToggle,
  onGuardianSectionToggleAll,
  onNytimesDeskToggle,
  onNytimesDeskToggleAll,
  onClearFilters,
}: FilterSectionProps) => {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-6">
        <DateRangeFilter
          startDate={formState.startDate}
          endDate={formState.endDate}
          onStartDateChange={date => onFormStateChange('startDate', date)}
          onEndDateChange={date => onFormStateChange('endDate', date)}
          disabled={isLoading}
        />

        <NewsApiFilter
          enabled={formState.newsApiEnabled}
          category={formState.newsApiCategory}
          selectedSources={formState.newsApiSources}
          sources={newsApiSources}
          loadingSources={loadingNewsApiSources}
          onEnabledChange={enabled => onFormStateChange('newsApiEnabled', enabled)}
          onCategoryChange={onNewsApiCategoryChange}
          onSourceToggle={onNewsApiSourceToggle}
          onSourceToggleAll={onNewsApiSourceToggleAll}
          disabled={isLoading}
        />

        <GuardianFilter
          enabled={formState.guardianEnabled}
          selectedSections={formState.guardianSections}
          sections={guardianSections}
          loadingSections={loadingSections}
          onEnabledChange={enabled => onFormStateChange('guardianEnabled', enabled)}
          onSectionToggle={onGuardianSectionToggle}
          onSectionToggleAll={onGuardianSectionToggleAll}
          disabled={isLoading}
        />

        <NyTimesFilter
          enabled={formState.nytimesEnabled}
          selectedDesks={formState.nytimesDesks}
          author={formState.nytimesAuthor}
          onEnabledChange={enabled => onFormStateChange('nytimesEnabled', enabled)}
          onDeskToggle={onNytimesDeskToggle}
          onDeskToggleAll={onNytimesDeskToggleAll}
          onAuthorChange={author => onFormStateChange('nytimesAuthor', author)}
          disabled={isLoading}
        />

        <div className="flex gap-3 border-t border-gray-200 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
