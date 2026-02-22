export const NewsCardSkeleton = () => {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
      <div className="aspect-video w-full animate-pulse bg-gray-200" />

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          <span className="text-gray-300">•</span>
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-2 space-y-2">
          <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    </article>
  );
};
