import { Newspaper } from 'lucide-react';
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow" data-testid="app-header">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <div className="flex-1">
              <h1
                className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                data-testid="app-title"
              >
                News Aggregator
              </h1>
              <p className="mt-1 text-sm text-gray-600" data-testid="app-subtitle">
                Latest news from NewsAPI, The Guardian, and The New York Times
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
