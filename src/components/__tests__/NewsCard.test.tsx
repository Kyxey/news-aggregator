import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { NewsCard } from '../NewsCard';
import { createMockArticle } from '@/test/mock-data';

describe('NewsCard', () => {
  it('renders article title and description', () => {
    const article = createMockArticle({
      title: 'Breaking News Story',
      description: 'This is a detailed description of the news story.',
    });

    render(<NewsCard article={article} />);

    expect(screen.getByText('Breaking News Story')).toBeInTheDocument();
    expect(screen.getByText(/detailed description/i)).toBeInTheDocument();
  });

  it('displays article source', () => {
    const article = createMockArticle({ source: 'The Guardian' });

    render(<NewsCard article={article} />);

    expect(screen.getByText('The Guardian')).toBeInTheDocument();
  });

  it('formats and displays publication date', () => {
    const article = createMockArticle({
      publishedAt: '2024-01-15T10:30:00Z',
    });

    render(<NewsCard article={article} />);

    expect(screen.getByText(/jan 15, 2024/i)).toBeInTheDocument();
  });

  it('displays author when provided', () => {
    const article = createMockArticle({ author: 'Jane Smith' });

    render(<NewsCard article={article} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('does not display author section when author is missing', () => {
    const article = createMockArticle({ author: undefined });

    render(<NewsCard article={article} />);

    const userIcon = document.querySelector('svg[class*="lucide-user"]');
    expect(userIcon).not.toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    const article = createMockArticle({
      title: 'Article with Image',
      imageUrl: 'https://example.com/image.jpg',
    });

    render(<NewsCard article={article} />);

    const image = screen.getByAltText('Article with Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows placeholder icon when no image is provided', () => {
    const article = createMockArticle({ imageUrl: undefined });

    render(<NewsCard article={article} />);

    const cameraIcon = document.querySelector('svg[class*="lucide-camera-off"]');
    expect(cameraIcon).toBeInTheDocument();
  });

  it('renders read more link with correct href', () => {
    const article = createMockArticle({
      url: 'https://example.com/article/123',
    });

    render(<NewsCard article={article} />);

    const link = screen.getByText(/read more/i).closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com/article/123');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies lazy loading to images', () => {
    const article = createMockArticle({
      title: 'Test Article',
      imageUrl: 'https://example.com/image.jpg',
    });

    render(<NewsCard article={article} />);

    const image = screen.getByAltText('Test Article');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});
