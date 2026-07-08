export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
    />
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-5 w-5 rounded-full" />
      </div>
      <SkeletonBlock className="h-8 w-16" />
    </div>
  );
}

export function SkeletonChartCard({ className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-[350px] ${className}`}
    >
      <SkeletonBlock className="h-5 w-40 mb-6" />
      <SkeletonBlock className="h-[250px] w-full" />
    </div>
  );
}