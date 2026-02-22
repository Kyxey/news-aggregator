import { useFormContext, Controller } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { Switch } from './Switch';
import { CheckboxList } from './CheckboxList';
import { NEWSAPI_CATEGORIES } from '@/lib/filter-constants';
import { toggleArraySelection, toggleItemInArray } from '@/lib/filter-utils';
import { useNewsAPISources } from '@/hooks/use-news-sources';
import type { NewsAPICategory } from '@/types/news';
import type { SearchFormData } from './SearchForm';

type NewsApiFilterProps = {
  disabled?: boolean;
};

export const NewsApiFilter = ({ disabled = false }: NewsApiFilterProps) => {
  const { control, watch, setValue } = useFormContext<SearchFormData>();
  const { data: sources = [], isLoading: loadingSources } = useNewsAPISources();

  const enabled = watch('newsApiEnabled');
  const category = watch('newsApiCategory');
  const selectedSources = watch('newsApiSources');

  const categoryDisabled = selectedSources.length > 0;
  const sourcesDisabled = !!category;

  const handleCategoryChange = useCallback(
    (newCategory?: string) => {
      setValue('newsApiCategory', newCategory as NewsAPICategory | undefined, {
        shouldDirty: true,
      });
      if (newCategory) {
        // NewsAPI doesn't allow category + sources in the same request
        setValue('newsApiSources', [], { shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleSourceToggle = useCallback(
    (sourceId: string) => {
      const newSources = toggleItemInArray(selectedSources, sourceId);
      setValue('newsApiSources', newSources, { shouldDirty: true });
      if (newSources.length > 0) {
        // Clear category when sources are selected (API limitation)
        setValue('newsApiCategory', undefined, { shouldDirty: true });
      }
    },
    [selectedSources, setValue]
  );

  const sourceIds = useMemo(() => sources.map(s => s.id), [sources]);

  const handleSourceToggleAll = useCallback(() => {
    const newSources = toggleArraySelection(selectedSources, sourceIds);
    setValue('newsApiSources', newSources, { shouldDirty: true });
  }, [selectedSources, sourceIds, setValue]);

  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">NewsAPI</h4>
        <Controller
          name="newsApiEnabled"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} disabled={disabled} />
          )}
        />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">
              Category (select one)
              {categoryDisabled && (
                <span className="ml-2 text-xs text-orange-600">(disabled - sources selected)</span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {NEWSAPI_CATEGORIES.map(cat => (
                <label
                  key={cat.value}
                  className={`flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm transition-colors ${
                    categoryDisabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-50'
                      : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="newsapi-category"
                    checked={category === cat.value}
                    onChange={() => handleCategoryChange(cat.value)}
                    disabled={disabled || categoryDisabled}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{cat.label}</span>
                </label>
              ))}
            </div>
            {category && !categoryDisabled && (
              <button
                type="button"
                onClick={() => handleCategoryChange(undefined)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700"
              >
                Clear category
              </button>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">
              Sources
              {sourcesDisabled && (
                <span className="ml-2 text-xs text-orange-600">(disabled - category selected)</span>
              )}
            </label>
            <CheckboxList
              items={sources.map(s => ({ id: s.id, label: s.name }))}
              selectedIds={selectedSources}
              onToggle={handleSourceToggle}
              onToggleAll={handleSourceToggleAll}
              isLoading={loadingSources}
              disabled={sourcesDisabled}
              loadingMessage="Loading sources..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
