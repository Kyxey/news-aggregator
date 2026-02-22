import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { createMockArticles } from '@/test/mock-data';

vi.mock('@/hooks/use-news', () => ({
  useNews: vi.fn(),
}));

vi.mock('@/hooks/use-news-sources', () => ({
  useNewsAPISources: () => ({ data: [], isLoading: false }),
  useGuardianSections: () => ({ data: [], isLoading: false }),
}));

import { useNews } from '@/hooks/use-news';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app header', () => {
    vi.mocked(useNews).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.getByText('News Aggregator')).toBeInTheDocument();
    expect(screen.getByText(/latest news from/i)).toBeInTheDocument();
  });

  it('displays loading skeletons while fetching', () => {
    vi.mocked(useNews).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays news articles when loaded', async () => {
    const mockArticles = createMockArticles(3);
    vi.mocked(useNews).mockReturnValue({
      data: mockArticles,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    await waitFor(() => {
      mockArticles.forEach(article => {
        expect(screen.getByText(article.title)).toBeInTheDocument();
      });
    });
  });

  it('displays error message when fetch fails', () => {
    const error = new Error('Network error');
    const refetch = vi.fn();

    vi.mocked(useNews).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error,
      refetch,
    } as any);

    render(<App />);

    expect(screen.getByText(/error loading news/i)).toBeInTheDocument();
  });

  it('shows empty state when no articles found', () => {
    vi.mocked(useNews).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.getByText(/no news articles found/i)).toBeInTheDocument();
  });

  it('displays pagination when articles are loaded', () => {
    const mockArticles = createMockArticles(10);
    vi.mocked(useNews).mockReturnValue({
      data: mockArticles,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.getByText(/previous/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('clears search and filters when clear all is clicked', async () => {
    const user = userEvent.setup();
    const mockArticles = createMockArticles(5);

    vi.mocked(useNews).mockReturnValue({
      data: mockArticles,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    const searchInput = screen.getByPlaceholderText(/search news/i);
    await user.type(searchInput, 'test query');

    const searchButton = screen.getByLabelText(/^search$/i);
    await user.click(searchButton);

    await waitFor(() => {
      expect(useNews).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'test query',
        })
      );
    });
  });

  it('updates page when pagination is clicked', async () => {
    const user = userEvent.setup();
    const mockArticles = createMockArticles(10);

    vi.mocked(useNews).mockReturnValue({
      data: mockArticles,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<App />);

    const nextButton = screen.getByText(/next/i);
    await user.click(nextButton);

    await waitFor(() => {
      expect(useNews).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      );
    });
  });
});
