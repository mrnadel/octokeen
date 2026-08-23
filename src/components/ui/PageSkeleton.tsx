/**
 * Route-level loading placeholder.
 *
 * Rendered by each nav destination's `loading.tsx`. Without a loading boundary
 * a navigation blocks on the RSC response, so the old page stays on screen and
 * the tap reads as a dead click. With one, the shell swaps immediately and this
 * stands in until the real page streams in.
 *
 * The header block mirrors `PageHeader` so the swap doesn't shift layout.
 */
export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* Header — matches PageHeader's sticky bar metrics */}
      <div className="sticky top-0 z-30 bg-white dark:bg-surface-900 px-4 sm:px-5 py-3 border-b-2 border-[#E5E5E5] dark:border-surface-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#F0F0F0] dark:bg-surface-800 lg:hidden" />
          <div className="flex-1 min-w-0">
            <div className="h-5 w-36 rounded-lg bg-surface-100 dark:bg-surface-800" />
            <div className="h-3 w-52 mt-1.5 rounded bg-surface-100 dark:bg-surface-800" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-5 pt-4 pb-8 space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white dark:bg-surface-900 border border-gray-100 dark:border-surface-700"
          />
        ))}
      </div>
    </div>
  );
}
