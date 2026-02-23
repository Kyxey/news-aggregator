import { useState, type MouseEvent } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/style.css';

type DatePickerProps = {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function DatePicker({
  selected,
  onSelect,
  placeholder = 'Select a date',
  disabled = false,
  error,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    setIsOpen(false);
  };

  const handleClear = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white hover:border-gray-400'}`}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
          {selected ? format(selected, 'PPP') : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selected && !disabled && (
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" onClick={handleClear} />
          )}
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </button>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-full z-20 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={[
                { after: maxDate || new Date() },
                ...(minDate ? [{ before: minDate }] : []),
              ]}
              className="rdp-custom"
            />
          </div>
        </>
      )}
    </div>
  );
}
