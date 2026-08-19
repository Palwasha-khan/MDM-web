export function SkeletonBox({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export function SkeletonCards({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-200 p-4">
          <SkeletonBox className="h-3 w-20 mb-3" />
          <SkeletonBox className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3 border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBox key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}