export function AssetCardSkeleton() {
  return (
    <div className="card-item p-4 flex flex-col h-full animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] rounded-xl bg-ink-700/50 mb-4" />

      {/* Title */}
      <div className="h-5 bg-ink-700/50 rounded-md w-3/4 mb-3" />

      {/* Description lines */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-ink-700/40 rounded w-full" />
        <div className="h-3 bg-ink-700/40 rounded w-5/6" />
      </div>

      {/* Meta row */}
      <div className="mt-auto pt-4 border-t border-ink-600/40 grid grid-cols-3 gap-2">
        <div className="space-y-1.5">
          <div className="h-2 bg-ink-700/40 rounded w-10" />
          <div className="h-3 bg-ink-700/60 rounded w-14" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-ink-700/40 rounded w-8" />
          <div className="h-3 bg-ink-700/60 rounded w-12" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-ink-700/40 rounded w-8" />
          <div className="h-3 bg-ink-700/60 rounded w-10" />
        </div>
      </div>
    </div>
  );
}