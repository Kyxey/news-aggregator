import { SearchX } from 'lucide-react';

type EmptyStateProps = {
  hasActiveFilters: boolean;
};

export const EmptyState = ({ hasActiveFilters }: EmptyStateProps) => {
  return (
    <div className="py-12 text-center text-gray-500" data-testid="empty-state">
      <SearchX className="w-14 h-14 mx-auto" />
      <p>
        {hasActiveFilters
          ? 'No news articles found matching your criteria.'
          : 'No news articles found.'}
      </p>
    </div>
  );
};
