/**
 * API response types for external news services.
 * These types represent the raw data structures returned by each API.
 */

export type NewsAPIResponse = {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
  }>;
};

export type NewsAPISourcesResponse = {
  status: string;
  sources: Array<{
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
  }>;
};

export type GuardianAPIResponse = {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      webTitle: string;
      webUrl: string;
      fields?: {
        thumbnail?: string;
        trailText?: string;
        byline?: string;
      };
      webPublicationDate: string;
    }>;
  };
};

export type GuardianSectionsResponse = {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      webTitle: string;
      webUrl: string;
      apiUrl: string;
      editions: Array<{
        id: string;
        webTitle: string;
        webUrl: string;
        apiUrl: string;
      }>;
    }>;
  };
};

export type NYTimesAPIResponse = {
  status: string;
  response: {
    docs: Array<{
      _id: string;
      web_url: string;
      headline: { main: string };
      abstract: string;
      pub_date: string;
      byline?: { original: string };
      multimedia?: Array<{ url: string }>;
      section_name?: string;
    }>;
  };
};
