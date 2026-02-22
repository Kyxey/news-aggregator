import { DatePicker } from './DatePicker';

type DateRangeFilterProps = {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
  disabled?: boolean;
};

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
}: DateRangeFilterProps) => {
  const today = new Date();

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        General Filters
      </h4>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onSelect={onStartDateChange}
            placeholder="From date"
            disabled={disabled}
            maxDate={today}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onSelect={onEndDateChange}
            placeholder="To date"
            disabled={disabled}
            minDate={startDate}
            maxDate={today}
          />
        </div>
      </div>
    </div>
  );
};
