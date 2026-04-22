export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 space-y-3">
            <div className="h-20 w-20 mx-auto rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-40 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl space-y-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 border-b border-gray-200 dark:border-gray-700 last:border-0" />
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 space-y-6">
          <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
