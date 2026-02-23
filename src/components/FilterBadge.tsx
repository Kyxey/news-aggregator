import { X } from 'lucide-react';

type Variants = 'blue' | 'green' | 'orange' | 'indigo' | 'pink';

type FilterBadgeProps = {
  label: string;
  value: string;
  onClear: () => void;
  variant?: Variants;
};

const variants: Record<Variants, string> = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
};

export const FilterBadge = ({ label, value, onClear, variant = 'blue' }: FilterBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {label}: {value}
      <button onClick={onClear} className="ml-1 rounded" aria-label={`Clear ${label}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};
