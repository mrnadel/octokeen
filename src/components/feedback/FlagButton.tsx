'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Check } from 'lucide-react';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import type { ContentFeedbackType, FeedbackReason } from '@/data/types';
import { VALID_REASONS } from '@/data/types';

const REASON_LABELS: Record<FeedbackReason, string> = {
  confusing: 'Confusing',
  incorrect: 'Incorrect',
  'too-easy': 'Too Easy',
  'too-hard': 'Too Hard',
};

interface Props {
  contentType: ContentFeedbackType;
  contentId: string;
}

export default function FlagButton({ contentType, contentId }: Props) {
  const flagKey = `${contentType}:${contentId}`;
  const existingReason = useFeedbackStore((s) => s.flags[flagKey] ?? null);
  const setStoreFlag = useFeedbackStore((s) => s.setFlag);
  const removeStoreFlag = useFeedbackStore((s) => s.removeFlag);

  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFlagClick = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleSelectReason = useCallback(
    async (reason: FeedbackReason) => {
      setSubmitting(true);
      // Optimistic update
      setStoreFlag(contentType, contentId, reason);
      setShowConfirm(true);
      setExpanded(false);

      try {
        await fetch('/api/content-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType, contentId, reason }),
        });
      } catch {
        // Revert on failure
        removeStoreFlag(contentType, contentId);
      } finally {
        setSubmitting(false);
        setTimeout(() => setShowConfirm(false), 1500);
      }
    },
    [contentType, contentId, setStoreFlag, removeStoreFlag]
  );

  const handleRemoveFlag = useCallback(async () => {
    setSubmitting(true);
    removeStoreFlag(contentType, contentId);
    setExpanded(false);

    try {
      await fetch('/api/content-feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId }),
      });
    } catch {
      // Silently fail — can't easily revert without knowing old reason
    } finally {
      setSubmitting(false);
    }
  }, [contentType, contentId, removeStoreFlag]);

  const isFlagged = !!existingReason;

  return (
    <div className="flex items-center justify-end gap-2" style={{ minHeight: 32 }}>
      <AnimatePresence mode="wait">
        {showConfirm && (
          <motion.span
            key="confirm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 12, fontWeight: 700, color: '#58A700' }}
            className="flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Flagged
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="chips"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-1 overflow-hidden"
          >
            {isFlagged ? (
              <button
                onClick={handleRemoveFlag}
                disabled={submitting}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 12,
                  border: '1.5px solid #FF4B4B',
                  background: '#FFF0F0',
                  color: '#EA2B2B',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Remove flag
              </button>
            ) : (
              VALID_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleSelectReason(reason)}
                  disabled={submitting}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 12,
                    border: '1.5px solid #E5E5E5',
                    background: '#F5F5F5',
                    color: '#3C3C3C',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  className="transition-colors hover:border-[#AFAFAF] hover:bg-[#EBEBEB]"
                >
                  {REASON_LABELS[reason]}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleFlagClick}
        disabled={submitting}
        aria-label={`Flag content ${contentId}`}
        className="flex items-center justify-center transition-transform active:scale-90"
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          border: 'none',
          background: isFlagged ? '#FFF0F0' : 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Flag
          className="w-4 h-4"
          style={{ color: isFlagged ? '#EA2B2B' : '#AFAFAF' }}
          fill={isFlagged ? '#EA2B2B' : 'none'}
        />
      </button>
    </div>
  );
}
