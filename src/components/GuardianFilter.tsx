import { useFormContext, Controller } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { Switch } from './Switch';
import { CheckboxList } from './CheckboxList';
import { toggleArraySelection, toggleItemInArray } from '@/lib/filter-utils';
import { useGuardianSections } from '@/hooks/use-news-sources';
import type { SearchFormData } from './SearchForm';

type GuardianFilterProps = {
  disabled?: boolean;
};

export const GuardianFilter = ({ disabled = false }: GuardianFilterProps) => {
  const { control, watch, setValue } = useFormContext<SearchFormData>();
  const { data: sections = [], isLoading: loadingSections } = useGuardianSections();

  const enabled = watch('guardianEnabled');
  const selectedSections = watch('guardianSections');

  const handleSectionToggle = useCallback(
    (sectionId: string) => {
      const newSections = toggleItemInArray(selectedSections, sectionId);
      setValue('guardianSections', newSections, { shouldDirty: true });
    },
    [selectedSections, setValue]
  );

  const sectionIds = useMemo(() => sections.map(s => s.id), [sections]);

  const handleSectionToggleAll = useCallback(() => {
    const newSections = toggleArraySelection(selectedSections, sectionIds);
    setValue('guardianSections', newSections, { shouldDirty: true });
  }, [selectedSections, sectionIds, setValue]);

  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          The Guardian
        </h4>
        <Controller
          name="guardianEnabled"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} disabled={disabled} />
          )}
        />
      </div>

      {enabled && (
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">Sections</label>
          <CheckboxList
            items={sections.map(s => ({ id: s.id, label: s.webTitle }))}
            selectedIds={selectedSections}
            onToggle={handleSectionToggle}
            onToggleAll={handleSectionToggleAll}
            isLoading={loadingSections}
            loadingMessage="Loading sections..."
          />
        </div>
      )}
    </div>
  );
};
