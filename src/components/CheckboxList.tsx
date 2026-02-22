type CheckboxItem<T = string> = {
  id: T;
  label: string;
};

type CheckboxListProps<T = string> = {
  items: CheckboxItem<T>[];
  selectedIds: T[];
  onToggle: (id: T) => void;
  onToggleAll: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingMessage?: string;
};

export const CheckboxList = <T extends string = string>({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  isLoading = false,
  disabled = false,
  loadingMessage = 'Loading...',
}: CheckboxListProps<T>) => {
  if (isLoading) {
    return <p className="text-sm text-gray-500">{loadingMessage}</p>;
  }

  const allSelected = selectedIds.length === 0 || selectedIds.length === items.length;

  return (
    <div className="space-y-2">
      <label
        className={`flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'hover:bg-gray-50 cursor-pointer bg-gray-50'
        }`}
      >
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <span className="font-medium text-gray-700">All</span>
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-48 overflow-y-auto">
        {items.map(item => (
          <label
            key={item.id}
            className={`flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm transition-colors ${
              disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                : 'hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => onToggle(item.id)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
