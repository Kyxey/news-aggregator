import { useFormContext, Controller } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { Switch } from './Switch';
import { CheckboxList } from './CheckboxList';
import { NYTIMES_DESKS } from '@/lib/filter-constants';
import { toggleArraySelection, toggleItemInArray } from '@/lib/filter-utils';
import type { NYTimesDesk } from '@/types/news';
import type { SearchFormData } from './SearchForm';

type NyTimesFilterProps = {
  disabled?: boolean;
};

export const NyTimesFilter = ({ disabled = false }: NyTimesFilterProps) => {
  const { control, watch, setValue, register } = useFormContext<SearchFormData>();
  const enabled = watch('nytimesEnabled');
  const selectedDesks = watch('nytimesDesks');

  const handleDeskToggle = useCallback(
    (desk: string) => {
      const newDesks = toggleItemInArray(selectedDesks, desk as NYTimesDesk);
      setValue('nytimesDesks', newDesks as NYTimesDesk[], { shouldDirty: true });
    },
    [selectedDesks, setValue]
  );

  const deskValues = useMemo(() => NYTIMES_DESKS.map(d => d.value), []);

  const handleDeskToggleAll = useCallback(() => {
    const newDesks = toggleArraySelection(selectedDesks, deskValues);
    setValue('nytimesDesks', newDesks as NYTimesDesk[], { shouldDirty: true });
  }, [selectedDesks, deskValues, setValue]);

  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          The New York Times
        </h3>
        <Controller
          name="nytimesEnabled"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} disabled={disabled} />
          )}
        />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">Desks</label>
            <CheckboxList
              items={NYTIMES_DESKS.map(d => ({ id: d.value, label: d.label }))}
              selectedIds={selectedDesks}
              onToggle={handleDeskToggle}
              onToggleAll={handleDeskToggleAll}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Author</label>
            <input
              {...register('nytimesAuthor')}
              type="text"
              placeholder="Author name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};
