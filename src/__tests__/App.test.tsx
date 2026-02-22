import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    vi.stubGlobal('scrollTo', () => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

    expect(screen.getByTestId('app-title')).toHaveTextContent('News Aggregator');
    expect(screen.getByTestId('app-subtitle')).toHaveTextContent(/latest news from/i);
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

    expect(screen.getByTestId('loading-skeletons')).toBeInTheDocument();
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
      const articleTitles = screen.getAllByTestId('article-title');
      expect(articleTitles).toHaveLength(3);
      mockArticles.forEach((article, index) => {
        expect(articleTitles[index]).toHaveTextContent(article.title);
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

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toHaveTextContent(/error loading news/i);
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

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
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

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
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

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test query');

    const searchButton = screen.getByTestId('search-button');
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

    const nextButton = screen.getByTestId('next-button');
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
