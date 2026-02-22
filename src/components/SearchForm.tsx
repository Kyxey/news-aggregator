import { useForm, FormProvider } from 'react-hook-form';
import { Search, Filter } from 'lucide-react';
import { useState, useCallback } from 'react';
import { FilterSection } from './FilterSection';
import type { NewsFilters, NewsAPICategory, NYTimesDesk } from '@/types/news';

export type SearchFormData = {
  query: string;
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

type SearchFormProps = {
  onSearch: (query: string, filters: NewsFilters) => void;
  isLoading?: boolean;
};

const defaultValues: SearchFormData = {
  query: '',
  newsApiEnabled: true,
  newsApiSources: [],
  guardianEnabled: true,
  guardianSections: [],
  nytimesEnabled: true,
  nytimesDesks: [],
  nytimesAuthor: '',
};

export const SearchForm = ({ onSearch, isLoading = false }: SearchFormProps) => {
  const methods = useForm<SearchFormData>({
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const [showFilters, setShowFilters] = useState(false);

  const onSubmit = useCallback(
    (data: SearchFormData) => {
      const filters: NewsFilters = {
        startDate: data.startDate,
        endDate: data.endDate,
        apiFilters: {
          newsapi: {
            enabled: data.newsApiEnabled,
            category: data.newsApiCategory,
            sources: data.newsApiSources.length > 0 ? data.newsApiSources : undefined,
          },
          guardian: {
            enabled: data.guardianEnabled,
            sections: data.guardianSections.length > 0 ? data.guardianSections : undefined,
          },
          nytimes: {
            enabled: data.nytimesEnabled,
            desks: data.nytimesDesks.length > 0 ? data.nytimesDesks : undefined,
            author: data.nytimesAuthor?.trim() || undefined,
          },
        },
      };
      onSearch(data.query.trim(), filters);
    },
    [onSearch]
  );

  const handleClearFilters = useCallback(() => {
    reset(defaultValues);
    onSearch('', {});
  }, [reset, onSearch]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex gap-2">
          <input
            {...register('query')}
            type="text"
            placeholder="Search news across all sources..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            data-testid="search-input"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center rounded-lg px-4 py-2 transition-colors ${
              isDirty
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Toggle filters"
            data-testid="toggle-filters-button"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Search"
            data-testid="search-button"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {showFilters && <FilterSection isLoading={isLoading} onClearFilters={handleClearFilters} />}
      </form>
    </FormProvider>
  );
};
