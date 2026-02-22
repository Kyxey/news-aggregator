import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders previous and next buttons', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={true} />);

    expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={true} />);

    expect(screen.getByTestId('previous-button')).toBeDisabled();
  });

  it('enables previous button when not on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} onPageChange={onPageChange} hasMore={true} />);

    expect(screen.getByTestId('previous-button')).not.toBeDisabled();
  });

  it('disables next button when hasMore is false', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={false} />);

    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('calls onPageChange with previous page when previous is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} onPageChange={onPageChange} hasMore={true} />);

    await user.click(screen.getByTestId('previous-button'));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page when next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} onPageChange={onPageChange} hasMore={true} />);

    await user.click(screen.getByTestId('next-button'));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('displays current page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} onPageChange={onPageChange} hasMore={true} />);

    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 5');
  });
});
