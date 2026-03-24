'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Check, X } from 'lucide-react';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import type { ContentFeedbackType, FeedbackReason } from '@/data/types';
import { VALID_REASONS } from '@/data/types';

const REASON_LABELS: Record<FeedbackReason, string> = {
  confusing: 'Confusing',
  incorrect: 'Incorrect',
  'too-easy': 'Too Easy',
  'too-hard': 'Too Hard',
  'bad-graphic': 'Bad Graphic',
  other: 'Other...',
};

interface Props {
  contentType: ContentFeedbackType;
  contentId: string;
  hasGraphic?: boolean;
}

export default function FlagButton({ contentType, contentId, hasGraphic }: Props) {
  const flagKey = `${contentType}:${contentId}`;
  const existingReason = useFeedbackStore((s) => s.flags[flagKey] ?? null);
  const existingComment = useFeedbackStore((s) => s.comments[flagKey] ?? '');
  const setStoreFlag = useFeedbackStore((s) => s.setFlag);
  const setStoreComment = useFeedbackStore((s) => s.setComment);
  const removeStoreFlag = useFeedbackStore((s) => s.removeFlag);

  const visibleReasons = hasGraphic
    ? VALID_REASONS
    : VALID_REASONS.filter((r) => r !== 'bad-graphic');

  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowOtherInput(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Focus textarea when "Other" input opens
  useEffect(() => {
    if (showOtherInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showOtherInput]);

  const submitFlag = useCallback(
    async (reason: FeedbackReason, comment?: string | null) => {
      try {
        await fetch('/api/content-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType, contentId, reason, comment: comment || null }),
        });
      } catch {
        removeStoreFlag(contentType, contentId);
      }
    },
    [contentType, contentId, removeStoreFlag]
  );

  const handleSelectReason = useCallback(
    async (reason: FeedbackReason) => {
      if (reason === 'other') {
        setOtherText(existingReason === 'other' ? existingComment : '');
        setShowOtherInput(true);
        return;
      }
      setSubmitting(true);
      setStoreFlag(contentType, contentId, reason);
      setMenuOpen(false);
      setShowOtherInput(false);
      setShowConfirm(true);

      await submitFlag(reason);
      setSubmitting(false);
      setTimeout(() => setShowConfirm(false), 1500);
    },
    [contentType, contentId, setStoreFlag, submitFlag, existingReason, existingComment]
  );

  const handleSubmitOther = useCallback(async () => {
    const trimmed = otherText.trim();
    if (trimmed.length < 3) return;
    setSubmitting(true);
    setStoreFlag(contentType, contentId, 'other');
    setStoreComment(contentType, contentId, trimmed);
    setMenuOpen(false);
    setShowOtherInput(false);
    setShowConfirm(true);

    await submitFlag('other', trimmed);
    setSubmitting(false);
    setTimeout(() => setShowConfirm(false), 1500);
  }, [otherText, contentType, contentId, setStoreFlag, setStoreComment, submitFlag]);

  const handleRemoveFlag = useCallback(async () => {
    setSubmitting(true);
    removeStoreFlag(contentType, contentId);
    setMenuOpen(false);
    setShowOtherInput(false);

    try {
      await fetch('/api/content-feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId }),
      });
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  }, [contentType, contentId, removeStoreFlag]);

  const isFlagged = !!existingReason;

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
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

      <button
        onClick={() => { setMenuOpen((v) => !v); setShowOtherInput(false); }}
        disabled={submitting}
        aria-label={`Flag content ${contentId}`}
        className="flex items-center justify-center transition-transform active:scale-90"
        style={{
          width: 44,
          height: 44,
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

      {/* Context Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: 6,
              background: 'white',
              borderRadius: 14,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
              padding: 4,
              minWidth: 180,
              zIndex: 50,
            }}
          >
            <div style={{ padding: '6px 10px 4px', fontSize: 11, fontWeight: 800, color: '#AFAFAF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Report issue
            </div>

            {visibleReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => handleSelectReason(reason)}
                disabled={submitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 10px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: existingReason === reason ? '#EA2B2B' : '#3C3C3C',
                  background: existingReason === reason ? '#FFF0F0' : 'transparent',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: 40,
                }}
                className="transition-colors hover:bg-gray-50"
              >
                {REASON_LABELS[reason]}
                {existingReason === reason && reason !== 'other' && (
                  <Check className="w-3.5 h-3.5 ml-auto" style={{ color: '#EA2B2B' }} />
                )}
              </button>
            ))}

            {/* "Other" text input */}
            <AnimatePresence>
              {showOtherInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', padding: '0 4px' }}
                >
                  <textarea
                    ref={inputRef}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value.slice(0, 200))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitOther();
                      }
                      if (e.key === 'Escape') {
                        setShowOtherInput(false);
                      }
                      e.stopPropagation();
                    }}
                    placeholder="Describe the issue (3-200 chars)"
                    rows={2}
                    style={{
                      width: '100%',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '8px 8px',
                      borderRadius: 8,
                      border: '1.5px solid #E5E5E5',
                      background: '#FAFAFA',
                      color: '#3C3C3C',
                      resize: 'none',
                      outline: 'none',
                      lineHeight: 1.4,
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 6px' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: otherText.trim().length < 3 ? '#EA2B2B' : '#AFAFAF' }}>
                      {otherText.length}/200
                    </span>
                    <button
                      onClick={handleSubmitOther}
                      disabled={submitting || otherText.trim().length < 3}
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: otherText.trim().length >= 3 ? '#F5B800' : '#E5E5E5',
                        color: otherText.trim().length >= 3 ? 'white' : '#CFCFCF',
                        cursor: otherText.trim().length >= 3 ? 'pointer' : 'default',
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remove flag option */}
            {isFlagged && (
              <>
                <div style={{ height: 1, background: '#F0F0F0', margin: '2px 6px' }} />
                <button
                  onClick={handleRemoveFlag}
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    width: '100%',
                    padding: '10px 10px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#EA2B2B',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: 40,
                  }}
                  className="transition-colors hover:bg-red-50"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove flag
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
