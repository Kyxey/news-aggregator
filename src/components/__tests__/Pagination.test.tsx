import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders previous and next buttons', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={true} />);

    expect(screen.getByText(/previous/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={true} />);

    const prevButton = screen.getByText(/previous/i).closest('button');
    expect(prevButton).toBeDisabled();
  });

  it('enables previous button when not on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} onPageChange={onPageChange} hasMore={true} />);

    const prevButton = screen.getByText(/previous/i).closest('button');
    expect(prevButton).not.toBeDisabled();
  });

  it('disables next button when hasMore is false', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={false} />);

    const nextButton = screen.getByText(/next/i).closest('button');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with previous page when previous is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} onPageChange={onPageChange} hasMore={true} />);

    const prevButton = screen.getByText(/previous/i);
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page when next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={true} />);

    const nextButton = screen.getByText(/next/i);
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('displays current page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} onPageChange={onPageChange} hasMore={true} />);

    expect(screen.getByText(/page 5/i)).toBeInTheDocument();
  });
});
