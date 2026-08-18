'use client';

/**
 * Hover tooltip explaining why a shop action is unavailable.
 * Shared by every shop card variant — the markup lived in two places before.
 * Render inside a `relative group` wrapper; visibility is driven by `group-hover`.
 */
interface ShopDisabledTooltipProps {
  reason: string;
}

export function ShopDisabledTooltip({ reason }: ShopDisabledTooltipProps) {
  return (
    <div
      className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
      style={{ background: '#1F2937' }}
    >
      {reason}
    </div>
  );
}
