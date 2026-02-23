import { describe, it, expect } from 'vitest';
import {
  createApiError,
  createApiErrorFromResponse,
  createMissingApiKeyError,
  isApiError,
  type ApiError,
} from '../api-error';

describe('api-error', () => {
  describe('createApiError', () => {
    it('creates an ApiError with all properties', () => {
      const result = createApiError('NewsAPI', 500, 'Server error occurred');

      expect(result).toEqual({
        name: 'ApiError',
        message: 'NewsAPI API Error (500): Server error occurred',
        source: 'NewsAPI',
        statusCode: 500,
        userMessage: 'Server error occurred',
        originalError: undefined,
      });
    });

    it('includes originalError when provided', () => {
      const originalError = new Error('Network timeout');
      const result = createApiError('Guardian', 503, 'Service unavailable', originalError);

      expect(result.originalError).toBe(originalError);
      expect(result.message).toEqual('Guardian API Error (503): Service unavailable');
    });

    it('works with different API sources', () => {
      const newsApiError = createApiError('NewsAPI', 401, 'Unauthorized');
      const guardianError = createApiError('Guardian', 429, 'Rate limited');
      const nyTimesError = createApiError('NYTimes', 404, 'Not found');

      expect(newsApiError.source).toBe('NewsAPI');
      expect(guardianError.source).toBe('Guardian');
      expect(nyTimesError.source).toBe('NYTimes');
    });
  });

  describe('createApiErrorFromResponse', () => {
    it('handles 401 unauthorized error', () => {
      const result = createApiErrorFromResponse('NewsAPI', 401);

      expect(result.statusCode).toBe(401);
      expect(result.userMessage).toBe(
        'Authentication failed. Please check your API key configuration.'
      );
      expect(result.source).toBe('NewsAPI');
    });

    it('handles 429 rate limit error', () => {
      const result = createApiErrorFromResponse('Guardian', 429);

      expect(result.statusCode).toBe(429);
      expect(result.userMessage).toBe('Rate limit exceeded. Please try again in a few minutes.');
    });

    it('handles 500 server error', () => {
      const result = createApiErrorFromResponse('NYTimes', 500);

      expect(result.statusCode).toBe(500);
      expect(result.userMessage).toBe('Server error. The service is temporarily unavailable.');
    });

    it('handles 502 bad gateway error', () => {
      const result = createApiErrorFromResponse('NewsAPI', 502);

      expect(result.statusCode).toBe(502);
      expect(result.userMessage).toBe('Server error. The service is temporarily unavailable.');
    });

    it('handles 503 service unavailable error', () => {
      const result = createApiErrorFromResponse('Guardian', 503);

      expect(result.statusCode).toBe(503);
      expect(result.userMessage).toBe('Server error. The service is temporarily unavailable.');
    });

    it('handles 404 not found error', () => {
      const result = createApiErrorFromResponse('NYTimes', 404);

      expect(result.statusCode).toBe(404);
      expect(result.userMessage).toBe(
        'Resource not found. The requested content may no longer exist.'
      );
    });

    it('handles unknown status codes with generic message', () => {
      const result = createApiErrorFromResponse('NewsAPI', 418);

      expect(result.statusCode).toBe(418);
      expect(result.userMessage).toBe('Request failed with status 418. Please try again.');
    });

    it('includes originalError when provided', () => {
      const originalError = { response: { status: 500 } };
      const result = createApiErrorFromResponse('Guardian', 500, originalError);

      expect(result.originalError).toBe(originalError);
    });

    it('creates proper error message format', () => {
      const result = createApiErrorFromResponse('NYTimes', 429);

      expect(result.message).toBe(
        'NYTimes API Error (429): Rate limit exceeded. Please try again in a few minutes.'
      );
      expect(result.name).toBe('ApiError');
    });
  });

  describe('createMissingApiKeyError', () => {
    it('creates error for missing NewsAPI key', () => {
      const result = createMissingApiKeyError('NewsAPI');

      expect(result.source).toBe('NewsAPI');
      expect(result.statusCode).toBe(0);
      expect(result.userMessage).toBe(
        'NewsAPI API key is not configured. Please add it to your environment variables.'
      );
      expect(result.name).toBe('ApiError');
    });

    it('creates error for missing Guardian key', () => {
      const result = createMissingApiKeyError('Guardian');

      expect(result.source).toBe('Guardian');
      expect(result.userMessage).toBe(
        'Guardian API key is not configured. Please add it to your environment variables.'
      );
    });

    it('creates error for missing NYTimes key', () => {
      const result = createMissingApiKeyError('NYTimes');

      expect(result.source).toBe('NYTimes');
      expect(result.userMessage).toBe(
        'NYTimes API key is not configured. Please add it to your environment variables.'
      );
    });

    it('creates proper error message format', () => {
      const result = createMissingApiKeyError('NewsAPI');

      expect(result.message).toBe(
        'NewsAPI API Error (0): NewsAPI API key is not configured. Please add it to your environment variables.'
      );
    });
  });

  describe('isApiError', () => {
    it('returns true for valid ApiError', () => {
      const error = createApiError('NewsAPI', 500, 'Server error');

      expect(isApiError(error)).toBe(true);
    });

    it('returns false for regular Error', () => {
      const error = new Error('Regular error');

      expect(isApiError(error)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isApiError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isApiError(undefined)).toBe(false);
    });

    it('returns false for string', () => {
      expect(isApiError('error string')).toBe(false);
    });

    it('returns false for number', () => {
      expect(isApiError(500)).toBe(false);
    });

    it('returns false for object without name property', () => {
      const obj = { message: 'error', statusCode: 500 };

      expect(isApiError(obj)).toBe(false);
    });

    it('returns false for object with wrong name', () => {
      const obj = { name: 'Error', message: 'error', statusCode: 500 };

      expect(isApiError(obj)).toBe(false);
    });

    it('returns true for manually created ApiError-like object', () => {
      const error: ApiError = {
        name: 'ApiError',
        message: 'Test error',
        source: 'Guardian',
        statusCode: 404,
        userMessage: 'Not found',
      };

      expect(isApiError(error)).toBe(true);
    });
  });
});
