# News Aggregator

A news aggregation platform that pulls articles from multiple sources (NewsAPI, The Guardian, and The New York Times) into a single, searchable interface. Built with React, TypeScript, and React Query.

## Table of Contents

- [News Aggregator](#news-aggregator)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
    - [Development](#development)
    - [Build](#build)
  - [Docker Setup](#docker-setup)
    - [Development with Docker](#development-with-docker)
    - [Production with Docker](#production-with-docker)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)
    - [API Rate Limits](#api-rate-limits)
    - [CORS Issues](#cors-issues)
    - [Build Errors](#build-errors)
    - [Docker Issues](#docker-issues)
  - [Known Issues](#known-issues)
  - [License](#license)

## Tech Stack

- React 19
- TypeScript
- RSBuild
- Tailwind CSS
- React Query
- React Hook Form
- React Day Picker
- Lucide React
- ESLint & Prettier
- Husky & lint-staged

## Getting Started

### Prerequisites

- Node.js 18+ (tested on 18.x and 20.x)
- pnpm 8+ (or npm/yarn if you prefer)
- API keys for:
  - [NewsAPI](https://newsapi.org/) (free tier works)
  - [The Guardian](https://open-platform.theguardian.com/)
  - [The New York Times](https://developer.nytimes.com/)

Or use Docker.

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file with your API keys:

```env
REACT_APP_NEWSAPI_KEY=your_newsapi_key_here
REACT_APP_GUARDIAN_KEY=your_guardian_key_here
REACT_APP_NYTIMES_KEY=your_nytimes_key_here
```

### Development

```bash
# Start development server
pnpm dev
```

The app will open at `http://localhost:3000`

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Docker Setup

This project is fully dockerized with separate configurations for development and production.

### Development with Docker

```bash
# Build and run in development mode
docker-compose --profile dev up --build
```

Access at: http://localhost:3000

### Production with Docker

```bash
# Build and run in production mode
docker-compose --profile prod up --build
```

Access at: http://localhost:8080

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

## Scripts

- **`pnpm dev`**: Start development server
- **`pnpm build`**: Build for production
- **`pnpm preview`**: Preview production build
- **`pnpm lint`**: Run ESLint
- **`pnpm lint:fix`**: Fix ESLint errors
- **`pnpm format`**: Format code with Prettier
- **`pnpm format:check`**: Check code formatting
- **`pnpm docker:dev`**: Start development server on Docker
- **`pnpm docker:prod`**: Start production server on Docker
- **`pnpm docker:dev:down`**: Stop development server on Docker
- **`pnpm docker:prod:down`**: Stop production server on Docker

## Project Structure

```
src/
├── components/          # React components
│   ├── NewsCard.tsx            # Article card (memoized for performance)
│   ├── NewsCardSkeleton.tsx    # Loading skeleton
│   ├── SearchForm.tsx          # Search and filter form
│   ├── FilterBadges.tsx        # Active filter badges
│   ├── Pagination.tsx          # Page navigation
│   └── ...
├── hooks/               # Custom React hooks
│   ├── use-news.ts             # Main news fetching hook with prefetching
│   ├── use-news-sources.ts     # Fetch available sources/sections
│   └── use-news-search.ts      # Search-specific hook
├── services/            # API clients
│   ├── news-aggregator.ts      # Main aggregator service
│   └── clients/
│       ├── newsapi-client.ts   # NewsAPI integration
│       ├── guardian-client.ts  # Guardian API integration
│       └── nytimes-client.ts   # NYT API integration
├── lib/                 # Utilities and configurations
│   ├── api-error.ts            # Error handling utilities
│   ├── query-client.ts         # React Query configuration
│   └── filter-utils.ts         # Filter helper functions
├── types/               # TypeScript type definitions
│   ├── news.ts                 # News article types
│   ├── api.ts                  # API response types
│   └── news-source.ts          # Source interface
├── App.tsx              # Main app component
└── index.tsx            # App entry point
```

## Troubleshooting

### API Rate Limits

If you hit rate limits, the app will gracefully degrade and show results from available sources.

### CORS Issues

If you encounter CORS errors in development:

1. Make sure you're using valid API keys
2. Some APIs require requests from registered domains
3. Consider using a proxy in development (see `rsbuild.config.ts`)

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear RSBuild cache
rm -rf dist node_modules/.cache
```

### Docker Issues

```bash
# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker-compose logs -f
```

## Known Issues

- NewsAPI doesn't support combining category filters with source filters (API limitation)
- Date range filtering may not work consistently across all sources due to API differences
- Some Guardian and New York Times articles may not have images (APIs don't always provide them)
- No automated tests yet

## License

MIT
