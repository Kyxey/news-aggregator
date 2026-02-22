/**
 * Domain types for the news aggregator application.
 * These types represent the normalized data structures used throughout the app.
 */

export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  author?: string;
  category?: string;
};

export type NewsPublisher = 'newsapi' | 'guardian' | 'nytimes';

export type NewsAPICategory =
  | 'business'
  | 'entertainment'
  | 'general'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

export type NewsAPISource = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
};

export type GuardianSection = {
  id: string;
  webTitle: string;
};

export type NYTimesDesk =
  | 'Arts&Leisure'
  | 'BookReview'
  | 'Business'
  | 'Climate'
  | 'Corrections'
  | 'Culture'
  | 'Dining'
  | 'Español'
  | 'Express'
  | 'Foreign'
  | 'Games'
  | 'Graphics'
  | 'Learning'
  | 'Letters'
  | 'Magazine'
  | 'Metro'
  | 'NYTNow'
  | 'National'
  | 'Obits'
  | 'OpEd'
  | 'Podcasts'
  | 'Politics'
  | 'RealEstate'
  | 'Science'
  | 'Styles'
  | 'Summary'
  | 'SundayBusiness'
  | 'TStyle'
  | 'Travel'
  | 'Washington'
  | 'Weather'
  | 'Weekend'
  | 'Well';

/**
 * NewsAPI-specific filters.
 * Note: category and sources are mutually exclusive per NewsAPI documentation.
 */
export type NewsAPIFilters = {
  enabled: boolean;
  category?: NewsAPICategory;
  sources?: string[];
};

export type GuardianFilters = {
  enabled: boolean;
  sections?: string[];
};

export type NYTimesFilters = {
  enabled: boolean;
  desks?: NYTimesDesk[];
  author?: string;
};

export type APIFilters = {
  newsapi?: NewsAPIFilters;
  guardian?: GuardianFilters;
  nytimes?: NYTimesFilters;
};

/**
 * Filters for searching news articles across all sources.
 * Date filters apply to all sources, while apiFilters are source-specific.
 */
export type NewsFilters = {
  startDate?: Date;
  endDate?: Date;
  apiFilters?: APIFilters;
};
