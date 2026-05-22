'use client';

import { motion } from 'framer-motion';
import { useIsDark } from '@/store/useThemeStore';

/** Floating arrow button — rendered only when direction is non-null via AnimatePresence */
export function ScrollToCurrentButton({
  direction,
  targetRef,
}: {
  direction: 'up' | 'down';
  targetRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isDark = useIsDark();
  return (
    <motion.button
      key="scroll-to-current"
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.85 }}
      whileTap={{ y: 3, boxShadow: isDark ? '0 1px 0 #1E293B' : '0 1px 0 #D0D0D0' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        position: 'fixed',
        bottom: 84,
        right: 16,
        zIndex: 50,
        width: 48,
        height: 48,
        borderRadius: 14,
        border: 'none',
        cursor: 'pointer',
        background: isDark ? '#1E293B' : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isDark ? '0 4px 0 #0F172A' : '0 4px 0 #D0D0D0',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label={`Scroll ${direction} to current lesson`}
      onClick={() => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        style={{ transform: direction === 'down' ? 'rotate(180deg)' : undefined }}
      >
        <path
          d="M12 6L12 19"
          stroke="#3B82F6"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M5.5 12L12 5.5L18.5 12"
          stroke="#3B82F6"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
