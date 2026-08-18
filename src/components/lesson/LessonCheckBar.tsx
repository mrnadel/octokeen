'use client';

import { GameButton } from '@/components/ui/GameButton';
import { useLessonColors } from '@/lib/lessonColors';

const CALC_BUTTON_SIZE = 48;
const IDLE_SHADOW = '0 3px 0 #CCCCCC';

export interface LessonCheckBarProps {
  hasSelection: boolean;
  onCheck: () => void;
  /** Omit to hide the calculator toggle (courses without calculation questions). */
  onToggleCalculator?: () => void;
  isCalcOpen: boolean;
  unitColor: string;
  accentBg: string;
  accentDark: string;
}

/** Pre-answer action bar: optional calculator toggle plus the Check button. */
export function LessonCheckBar({
  hasSelection,
  onCheck,
  onToggleCalculator,
  isCalcOpen,
  unitColor,
  accentBg,
  accentDark,
}: LessonCheckBarProps) {
  const c = useLessonColors();
  const iconColor = isCalcOpen ? unitColor : c.closeBtnStroke;

  return (
    <div
      style={{
        padding: '12px 20px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        borderTop: `2px solid ${c.headerBorder}`,
        background: c.cardBg,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="flex items-center gap-2.5">
        {onToggleCalculator && (
          <button
            onClick={onToggleCalculator}
            className="flex-shrink-0 flex items-center justify-center transition-transform active:scale-90"
            style={{
              width: CALC_BUTTON_SIZE,
              height: CALC_BUTTON_SIZE,
              borderRadius: 14,
              background: isCalcOpen ? accentBg : c.closeBtnBg,
              border: `2px solid ${isCalcOpen ? unitColor : c.headerBorder}`,
              boxShadow: isCalcOpen ? 'none' : IDLE_SHADOW,
              cursor: 'pointer',
            }}
            aria-label={isCalcOpen ? 'Close calculator' : 'Open calculator'}
            title="Calculator (`)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="16" height="20" rx="2" stroke={iconColor} strokeWidth="2" />
              <rect x="7" y="5" width="10" height="4" rx="1" fill={iconColor} />
              <circle cx="8.5" cy="13" r="1.1" fill={iconColor} />
              <circle cx="12" cy="13" r="1.1" fill={iconColor} />
              <circle cx="15.5" cy="13" r="1.1" fill={iconColor} />
              <circle cx="8.5" cy="17" r="1.1" fill={iconColor} />
              <circle cx="12" cy="17" r="1.1" fill={iconColor} />
              <circle cx="15.5" cy="17" r="1.1" fill={iconColor} />
            </svg>
          </button>
        )}

        <GameButton
          onClick={onCheck}
          disabled={!hasSelection}
          className="flex-1"
          style={hasSelection ? { background: unitColor, boxShadow: `0 4px 0 ${accentDark}` } : undefined}
        >
          Check
        </GameButton>
      </div>
    </div>
  );
}
