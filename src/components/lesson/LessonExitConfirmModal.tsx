'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonColors } from '@/lib/lessonColors';

interface LessonExitConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LessonExitConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}: LessonExitConfirmModalProps) {
  const c = useLessonColors();
  const exitDialogRef = useRef<HTMLDivElement>(null);

  // Focus trap for exit confirm dialog
  useEffect(() => {
    if (!show || !exitDialogRef.current) return;
    const dialog = exitDialogRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableEls = dialog.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusableEls.length === 0) return;
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    firstEl.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    dialog.addEventListener('keydown', handleTab);
    return () => dialog.removeEventListener('keydown', handleTab);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          onClick={onCancel}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            ref={exitDialogRef}
            className="relative w-full sm:w-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-title"
            style={{
              maxWidth: 480,
              borderRadius: 24,
              padding: '20px 20px 32px',
              background: c.cardBg,
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              id="exit-confirm-title"
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: c.title,
                marginBottom: 4,
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: c.subtitle,
                marginBottom: 20,
              }}
            >
              {message}
            </p>
            <div className="flex" style={{ gap: 12 }}>
              <motion.button
                data-testid="keep-going-button"
                onClick={onCancel}
                whileTap={{ y: 3, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }}
                className="flex-1"
                style={{
                  padding: '14px 0',
                  borderRadius: 16,
                  fontSize: 14,
                  fontWeight: 800,
                  color: c.subtitle,
                  background: c.skipBg,
                  boxShadow: '0 3px 0 #E0E0E0',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Keep going
              </motion.button>
              <motion.button
                onClick={onConfirm}
                whileTap={{ y: 4, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }}
                className="flex-1"
                style={{
                  padding: '14px 0',
                  borderRadius: 16,
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: '#FF4B4B',
                  boxShadow: '0 4px 0 #CC2D2D',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Quit
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
