import { Switch } from './Switch';
import { CheckboxList } from './CheckboxList';
import { NEWSAPI_CATEGORIES, NYTIMES_DESKS } from '@/lib/filter-constants';
import type { NewsAPICategory, NewsAPISource, GuardianSection, NYTimesDesk } from '@/types/news';

type NewsApiFilterProps = {
  enabled: boolean;
  category?: NewsAPICategory;
  selectedSources: string[];
  sources: NewsAPISource[];
  loadingSources: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onCategoryChange: (category?: NewsAPICategory) => void;
  onSourceToggle: (sourceId: string) => void;
  onSourceToggleAll: () => void;
  disabled?: boolean;
};

export const NewsApiFilter = ({
  enabled,
  category,
  selectedSources,
  sources,
  loadingSources,
  onEnabledChange,
  onCategoryChange,
  onSourceToggle,
  onSourceToggleAll,
  disabled = false,
}: NewsApiFilterProps) => {
  const categoryDisabled = selectedSources.length > 0;
  const sourcesDisabled = !!category;

  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">NewsAPI</h4>
        <Switch checked={enabled} onChange={onEnabledChange} disabled={disabled} />
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
                    onChange={() => onCategoryChange(cat.value)}
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
                onClick={() => onCategoryChange(undefined)}
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
              onToggle={onSourceToggle}
              onToggleAll={onSourceToggleAll}
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

type GuardianFilterProps = {
  enabled: boolean;
  selectedSections: string[];
  sections: GuardianSection[];
  loadingSections: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onSectionToggle: (sectionId: string) => void;
  onSectionToggleAll: () => void;
  disabled?: boolean;
};

export const GuardianFilter = ({
  enabled,
  selectedSections,
  sections,
  loadingSections,
  onEnabledChange,
  onSectionToggle,
  onSectionToggleAll,
  disabled = false,
}: GuardianFilterProps) => {
  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          The Guardian
        </h4>
        <Switch checked={enabled} onChange={onEnabledChange} disabled={disabled} />
      </div>

      {enabled && (
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">Sections</label>
          <CheckboxList
            items={sections.map(s => ({ id: s.id, label: s.webTitle }))}
            selectedIds={selectedSections}
            onToggle={onSectionToggle}
            onToggleAll={onSectionToggleAll}
            isLoading={loadingSections}
            loadingMessage="Loading sections..."
          />
        </div>
      )}
    </div>
  );
};

type NyTimesFilterProps = {
  enabled: boolean;
  selectedDesks: NYTimesDesk[];
  author: string;
  onEnabledChange: (enabled: boolean) => void;
  onDeskToggle: (desk: NYTimesDesk) => void;
  onDeskToggleAll: () => void;
  onAuthorChange: (author: string) => void;
  disabled?: boolean;
};

export const NyTimesFilter = ({
  enabled,
  selectedDesks,
  author,
  onEnabledChange,
  onDeskToggle,
  onDeskToggleAll,
  onAuthorChange,
  disabled = false,
}: NyTimesFilterProps) => {
  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          The New York Times
        </h4>
        <Switch checked={enabled} onChange={onEnabledChange} disabled={disabled} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">Desks</label>
            <CheckboxList
              items={NYTIMES_DESKS.map(d => ({ id: d.value, label: d.label }))}
              selectedIds={selectedDesks}
              onToggle={onDeskToggle}
              onToggleAll={onDeskToggleAll}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={e => onAuthorChange(e.target.value)}
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
