import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../SearchForm';
import { mockNewsAPISources, mockGuardianSections } from '@/test/mock-data';

vi.mock('@/hooks/use-news-sources', () => ({
  useNewsAPISources: () => ({
    data: mockNewsAPISources,
    isLoading: false,
  }),
  useGuardianSections: () => ({
    data: mockGuardianSections,
    isLoading: false,
  }),
}));

describe('SearchForm', () => {
  it('renders search input and buttons', () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    expect(screen.getByPlaceholderText(/search news/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle filters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^search$/i)).toBeInTheDocument();
  });

  it('calls onSearch with query when form is submitted', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search news/i);
    await user.type(input, 'artificial intelligence');
    await user.click(screen.getByLabelText(/^search$/i));

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('artificial intelligence', expect.any(Object));
    });
  });

  it('toggles filter panel when filter button is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    const filterButton = screen.getByLabelText(/toggle filters/i);

    expect(screen.queryByText(/general filters/i)).not.toBeInTheDocument();

    await user.click(filterButton);
    expect(screen.getByText(/general filters/i)).toBeInTheDocument();

    await user.click(filterButton);
    expect(screen.queryByText(/general filters/i)).not.toBeInTheDocument();
  });

  it('disables inputs when loading', () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} isLoading={true} />);

    expect(screen.getByPlaceholderText(/search news/i)).toBeDisabled();
    expect(screen.getByLabelText(/^search$/i)).toBeDisabled();
  });

  it('trims whitespace from search query', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search news/i);
    await user.type(input, '  climate change  ');
    await user.click(screen.getByLabelText(/^search$/i));

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('climate change', expect.any(Object));
    });
  });

  it('includes all enabled sources in filters by default', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    await user.click(screen.getByLabelText(/^search$/i));

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith(
        '',
        expect.objectContaining({
          apiFilters: expect.objectContaining({
            newsapi: expect.objectContaining({ enabled: true }),
            guardian: expect.objectContaining({ enabled: true }),
            nytimes: expect.objectContaining({ enabled: true }),
          }),
        })
      );
    });
  });
});
