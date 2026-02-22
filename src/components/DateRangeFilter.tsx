import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from './DatePicker';
import type { SearchFormData } from './SearchForm';

type DateRangeFilterProps = {
  disabled?: boolean;
};

export const DateRangeFilter = ({ disabled = false }: DateRangeFilterProps) => {
  const { control, watch } = useFormContext<SearchFormData>();
  const startDate = watch('startDate');
  const today = new Date();

  return (
    <div className="space-y-4" data-testid="date-range-filter">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        General Filters
      </h4>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Start Date</label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
                placeholder="From date"
                disabled={disabled}
                maxDate={today}
              />
            )}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">End Date</label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
                placeholder="To date"
                disabled={disabled}
                minDate={startDate}
                maxDate={today}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
