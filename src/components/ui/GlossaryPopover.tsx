'use client';

import { useEffect, useRef, useState } from 'react';

interface GlossaryPopoverProps {
  entry: { term: string; definition: string; relatedTerms?: string[] };
  anchorRect: DOMRect;
  accentColor: string;
  onClose: () => void;
  onRelatedTermClick: (term: string) => void;
}

export function GlossaryPopover({
  entry,
  anchorRect,
  accentColor,
  onClose,
  onRelatedTermClick,
}: GlossaryPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<'above' | 'below'>('below');

  useEffect(() => {
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    setPlacement(spaceBelow < 180 && spaceAbove > spaceBelow ? 'above' : 'below');
  }, [anchorRect]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function handleScroll() {
      onClose();
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  const top = placement === 'below'
    ? anchorRect.bottom + 6
    : anchorRect.top - 6;

  const rawLeft = anchorRect.left + anchorRect.width / 2 - 140;
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth - 288));

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={entry.term}
      style={{
        position: 'fixed',
        top: placement === 'below' ? top : undefined,
        bottom: placement === 'above' ? window.innerHeight - top : undefined,
        left,
        zIndex: 9999,
      }}
      className="w-[280px] rounded-xl border border-surface-200 bg-white p-3.5 shadow-lg animate-scale-in dark:border-surface-700 dark:bg-surface-900"
    >
      {/* Arrow */}
      <div
        className="bg-white border border-surface-200 dark:bg-surface-900 dark:border-surface-700"
        style={{
          position: 'absolute',
          [placement === 'below' ? 'top' : 'bottom']: -6,
          left: Math.min(Math.max(anchorRect.left + anchorRect.width / 2 - left - 6, 8), 264),
          width: 12,
          height: 12,
          borderRight: 'none',
          borderBottom: placement === 'below' ? 'none' : undefined,
          borderTop: placement === 'above' ? 'none' : undefined,
          transform: placement === 'below' ? 'rotate(45deg)' : 'rotate(-135deg)',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
      />

      <p className="text-sm font-bold" style={{ color: accentColor }}>
        {entry.term}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-surface-500">
        {entry.definition}
      </p>

      {entry.relatedTerms && entry.relatedTerms.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.relatedTerms.map(rt => (
            <button
              key={rt}
              type="button"
              onClick={() => onRelatedTermClick(rt)}
              className="rounded-full border border-surface-200 px-2 py-0.5 text-xs text-surface-500 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              {rt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
