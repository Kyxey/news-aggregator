export type ApiSource = 'NewsAPI' | 'Guardian' | 'NYTimes';

export type ApiError = {
  name: 'ApiError';
  message: string;
  source: ApiSource;
  statusCode: number;
  userMessage: string;
  originalError?: unknown;
};

export function createApiError(
  source: ApiSource,
  statusCode: number,
  userMessage: string,
  originalError?: unknown
): ApiError {
  return {
    name: 'ApiError',
    message: `${source} API Error (${statusCode}): ${userMessage}`,
    source,
    statusCode,
    userMessage,
    originalError,
  };
}

export function createApiErrorFromResponse(
  source: ApiSource,
  statusCode: number,
  originalError?: unknown
): ApiError {
  let userMessage: string;

  // Map HTTP status codes to user-friendly messages
  switch (statusCode) {
    case 401:
      userMessage = 'Authentication failed. Please check your API key configuration.';
      break;
    case 429:
      userMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      break;
    case 500:
    case 502:
    case 503:
      userMessage = 'Server error. The service is temporarily unavailable.';
      break;
    case 404:
      userMessage = 'Resource not found. The requested content may no longer exist.';
      break;
    default:
      userMessage = `Request failed with status ${statusCode}. Please try again.`;
  }

  return createApiError(source, statusCode, userMessage, originalError);
}

export function createMissingApiKeyError(source: ApiSource): ApiError {
  return createApiError(
    source,
    0,
    `${source} API key is not configured. Please add it to your environment variables.`
  );
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'ApiError'
  );
}
