import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from './NewsCardSkeleton';
import type { Article } from '@/types/news';

type NewsGridProps = {
  articles: Article[];
};

const NewsGridBase = ({ articles }: NewsGridProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="articles-grid">
      {articles.map(article => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
};

type NewsGridSkeletonProps = {
  count: number;
};

const NewsGridSkeleton = ({ count }: NewsGridSkeletonProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="loading-skeletons">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const NewsGrid = Object.assign(NewsGridBase, {
  Skeleton: NewsGridSkeleton,
});
