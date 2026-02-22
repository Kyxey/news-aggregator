import { useForm } from 'react-hook-form';
import { Search, Filter } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { FilterSection } from './FilterSection';
import { useNewsAPISources, useGuardianSections } from '@/hooks/use-news-sources';
import { toggleArraySelection, toggleItemInArray } from '@/lib/filter-utils';
import { NYTIMES_DESKS } from '@/lib/filter-constants';
import type { NewsFilters, NewsAPICategory, NYTimesDesk } from '@/types/news';

type SearchFormData = {
  query: string;
};

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

type SearchFormProps = {
  onSearch: (query: string, filters: NewsFilters) => void;
  isLoading?: boolean;
};

const initialFormState: FormState = {
  newsApiEnabled: true,
  newsApiSources: [],
  guardianEnabled: true,
  guardianSections: [],
  nytimesEnabled: true,
  nytimesDesks: [],
  nytimesAuthor: '',
};

export const SearchForm = ({ onSearch, isLoading = false }: SearchFormProps) => {
  const { register, handleSubmit, reset } = useForm<SearchFormData>();
  const [showFilters, setShowFilters] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const { data: newsApiSources = [], isLoading: loadingNewsApiSources } = useNewsAPISources();
  const { data: guardianSections = [], isLoading: loadingSections } = useGuardianSections();

  const updateFormState = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleNewsApiCategoryChange = useCallback(
    (category?: NewsAPICategory) => {
      updateFormState('newsApiCategory', category);
      if (category) {
        // NewsAPI doesn't allow category + sources in the same request
        updateFormState('newsApiSources', []);
      }
    },
    [updateFormState]
  );

  const handleNewsApiSourceToggle = useCallback(
    (sourceId: string) => {
      const newSources = toggleItemInArray(formState.newsApiSources, sourceId);
      updateFormState('newsApiSources', newSources);
      if (newSources.length > 0) {
        // Clear category when sources are selected (API limitation)
        updateFormState('newsApiCategory', undefined);
      }
    },
    [formState.newsApiSources, updateFormState]
  );

  const newsApiSourceIds = useMemo(() => newsApiSources.map(s => s.id), [newsApiSources]);

  const handleNewsApiSourceToggleAll = useCallback(() => {
    const newSources = toggleArraySelection(formState.newsApiSources, newsApiSourceIds);
    updateFormState('newsApiSources', newSources);
  }, [formState.newsApiSources, newsApiSourceIds, updateFormState]);

  const handleGuardianSectionToggle = useCallback(
    (sectionId: string) => {
      updateFormState('guardianSections', toggleItemInArray(formState.guardianSections, sectionId));
    },
    [formState.guardianSections, updateFormState]
  );

  const guardianSectionIds = useMemo(() => guardianSections.map(s => s.id), [guardianSections]);

  const handleGuardianSectionToggleAll = useCallback(() => {
    updateFormState(
      'guardianSections',
      toggleArraySelection(formState.guardianSections, guardianSectionIds)
    );
  }, [formState.guardianSections, guardianSectionIds, updateFormState]);

  const handleNytimesDeskToggle = useCallback(
    (desk: NYTimesDesk) => {
      updateFormState('nytimesDesks', toggleItemInArray(formState.nytimesDesks, desk));
    },
    [formState.nytimesDesks, updateFormState]
  );

  const nytimesDeskValues = useMemo(() => NYTIMES_DESKS.map(d => d.value), []);

  const handleNytimesDeskToggleAll = useCallback(() => {
    updateFormState(
      'nytimesDesks',
      toggleArraySelection(formState.nytimesDesks, nytimesDeskValues)
    );
  }, [formState.nytimesDesks, nytimesDeskValues, updateFormState]);

  const onSubmit = useCallback(
    (data: SearchFormData) => {
      const filters: NewsFilters = {
        startDate: formState.startDate,
        endDate: formState.endDate,
        apiFilters: {
          newsapi: {
            enabled: formState.newsApiEnabled,
            category: formState.newsApiCategory,
            sources: formState.newsApiSources.length > 0 ? formState.newsApiSources : undefined,
          },
          guardian: {
            enabled: formState.guardianEnabled,
            sections:
              formState.guardianSections.length > 0 ? formState.guardianSections : undefined,
          },
          nytimes: {
            enabled: formState.nytimesEnabled,
            desks: formState.nytimesDesks.length > 0 ? formState.nytimesDesks : undefined,
            author: formState.nytimesAuthor?.trim() || undefined,
          },
        },
      };
      onSearch(data.query.trim(), filters);
    },
    [formState, onSearch]
  );

  const handleClearFilters = useCallback(() => {
    reset({ query: '' });
    setFormState(initialFormState);
    onSearch('', {});
  }, [reset, onSearch]);

  const hasActiveFilters = useMemo(
    () =>
      formState.startDate ||
      formState.endDate ||
      formState.newsApiCategory ||
      formState.newsApiSources.length > 0 ||
      formState.guardianSections.length > 0 ||
      formState.nytimesDesks.length > 0 ||
      !formState.newsApiEnabled ||
      !formState.guardianEnabled ||
      !formState.nytimesEnabled,
    [formState]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex gap-2">
        <input
          {...register('query')}
          type="text"
          placeholder="Search news across all sources..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center rounded-lg px-4 py-2 transition-colors ${
            hasActiveFilters
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Toggle filters"
        >
          <Filter className="h-5 w-5" />
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {showFilters && (
        <FilterSection
          formState={formState}
          newsApiSources={newsApiSources}
          guardianSections={guardianSections}
          loadingNewsApiSources={loadingNewsApiSources}
          loadingSections={loadingSections}
          isLoading={isLoading}
          onFormStateChange={updateFormState}
          onNewsApiCategoryChange={handleNewsApiCategoryChange}
          onNewsApiSourceToggle={handleNewsApiSourceToggle}
          onNewsApiSourceToggleAll={handleNewsApiSourceToggleAll}
          onGuardianSectionToggle={handleGuardianSectionToggle}
          onGuardianSectionToggleAll={handleGuardianSectionToggleAll}
          onNytimesDeskToggle={handleNytimesDeskToggle}
          onNytimesDeskToggleAll={handleNytimesDeskToggleAll}
          onClearFilters={handleClearFilters}
        />
      )}
    </form>
  );
};
