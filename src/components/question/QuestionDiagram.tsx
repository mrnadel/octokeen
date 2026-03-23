'use client';

import { useState, useCallback } from 'react';

interface QuestionDiagramProps {
  svg: string;
  className?: string;
}

export default function QuestionDiagram({ svg, className = '' }: QuestionDiagramProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => setExpanded(v => !v), []);

  return (
    <>
      {/* Inline diagram — full-bleed, tappable */}
      <button
        type="button"
        onClick={toggle}
        className={`diagram-container group relative w-full my-4 rounded-xl bg-[#0F172A] border border-surface-200/30 cursor-zoom-in overflow-hidden ${className}`}
        aria-label="Tap to enlarge diagram"
      >
        <div
          className="diagram-svg w-full px-2 py-4 sm:px-4 sm:py-5"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        {/* Expand hint */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          Tap to enlarge
        </div>
      </button>

      {/* Fullscreen overlay */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={toggle}
          role="dialog"
          aria-label="Enlarged diagram"
        >
          <button
            type="button"
            onClick={toggle}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="diagram-svg diagram-expanded w-full max-w-[95vw] max-h-[80vh] px-4"
            dangerouslySetInnerHTML={{ __html: svg }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
