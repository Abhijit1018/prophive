export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-56 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
          <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
