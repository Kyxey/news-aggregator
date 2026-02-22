import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore?: boolean;
};

export const Pagination = ({ currentPage, onPageChange, hasMore = true }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4" data-testid="pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
        data-testid="previous-button"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="text-sm font-medium text-gray-700" data-testid="current-page">
        Page {currentPage}
      </span>

      <button
        onClick={handleNext}
        disabled={!hasMore}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
        data-testid="next-button"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
