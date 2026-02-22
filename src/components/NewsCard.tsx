import { memo } from 'react';
import { ExternalLink, Calendar, User, CameraOff } from 'lucide-react';
import { format } from 'date-fns';
import type { NewsArticle } from '@/types/news';

type NewsCardProps = {
  article: NewsArticle;
};

const NewsCardComponent = ({ article }: NewsCardProps) => {
  const formattedDate = format(new Date(article.publishedAt), 'MMM dd, yyyy');

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <CameraOff className="mx-auto w-24 h-full text-gray-400" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-blue-600">{article.source}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={article.publishedAt}>{formattedDate}</time>
          </div>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">{article.title}</h3>

        {article.description && (
          <p className="mb-3 line-clamp-3 flex-1 text-sm text-gray-600">{article.description}</p>
        )}

        {article.author && (
          <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Read more
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};

export const NewsCard = memo(NewsCardComponent);
