import { X } from 'lucide-react';

type FilterBadgeProps = {
  label: string;
  value: string;
  onClear: () => void;
  colorClass?: string;
};

export const FilterBadge = ({
  label,
  value,
  onClear,
  colorClass = 'bg-blue-100 text-blue-700 hover:bg-blue-200',
}: FilterBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}
    >
      {label}: {value}
      <button onClick={onClear} className="ml-1 rounded" aria-label={`Clear ${label}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};
