import { AlertCircle, RefreshCw, Key, Clock, Server } from 'lucide-react';
import { isApiError } from '@/lib/api-error';

type ErrorMessageProps = {
  error?: Error | unknown;
  message?: string;
  onRetry?: () => void;
};

export const ErrorMessage = ({ error, message, onRetry }: ErrorMessageProps) => {
  let displayMessage = message || 'An unexpected error occurred';
  let statusCode = 0;
  let source = '';

  if (error && isApiError(error)) {
    displayMessage = error.userMessage;
    statusCode = error.statusCode;
    source = error.source;
  } else if (error instanceof Error) {
    displayMessage = error.message;
  }

  const renderIcon = () => {
    const iconClass = 'mx-auto h-12 w-12 text-red-600';

    switch (statusCode) {
      case 401:
        return <Key className={iconClass} />;
      case 429:
        return <Clock className={iconClass} />;
      case 500:
      case 502:
      case 503:
        return <Server className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center" data-testid="error-message">
      <div className="max-w-md rounded-lg bg-red-50 p-6 text-center">
        {renderIcon()}
        <h2 className="mt-4 text-lg font-semibold text-red-900" data-testid="error-title">
          {source ? `${source} Error` : 'Error Loading News'}
        </h2>
        <p className="mt-2 text-sm text-red-700" data-testid="error-description">
          {displayMessage}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            data-testid="retry-button"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
