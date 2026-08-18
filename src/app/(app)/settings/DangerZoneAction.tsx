'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { SETTINGS_ROW } from './settingsRowStyles';

const EXPAND_TRANSITION = { duration: 0.3 } as const;
const FADE_IN = { initial: { opacity: 0 }, animate: { opacity: 1 } } as const;
const COLLAPSED = { height: 0, opacity: 0 } as const;
const EXPANDED = { height: 'auto', opacity: 1 } as const;

/** Which pane of the two-step confirmation is showing. */
const STEP = { closed: 0, warning: 1, confirm: 2 } as const;

export interface DangerZoneActionProps {
  /** Label on the collapsed row. */
  label: string;
  /** Tailwind text color for the collapsed row label. */
  labelClass: string;
  /** Extra classes on the collapsed row — used to override the divider color. */
  rowClass?: string;
  /** Bold headline inside the warning callout. */
  warningTitle: string;
  /** Supporting sentence inside the warning callout. */
  warningBody: string;
  /** Exact phrase the user must type to arm the action. */
  confirmPhrase: string;
  /** Label on the final destructive button. */
  confirmLabel: string;
  /** Tailwind classes for the final destructive button's fill and hover. */
  confirmButtonClass: string;
  /** Runs the destructive request; throw to surface an error. */
  onConfirm: () => Promise<void>;
  onError?: (message: string) => void;
}

/**
 * Collapsible "danger zone" row with a warning pane and a type-to-confirm pane.
 * Backs both the reset-progress and delete-account settings actions.
 */
export function DangerZoneAction({
  label,
  labelClass,
  rowClass = '',
  warningTitle,
  warningBody,
  confirmPhrase,
  confirmLabel,
  confirmButtonClass,
  onConfirm,
  onError,
}: DangerZoneActionProps) {
  const [step, setStep] = useState<number>(STEP.closed);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    setStep(STEP.closed);
    setConfirmText('');
    setError('');
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirmText !== confirmPhrase) return;
    setLoading(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      onError?.(message);
      setStep(STEP.confirm);
      setLoading(false);
    }
  }, [confirmText, confirmPhrase, onConfirm, onError]);

  return (
    <>
      <button
        onClick={() => {
          setStep(step === STEP.closed ? STEP.warning : STEP.closed);
          setConfirmText('');
          setError('');
        }}
        className={`${rowClass} ${SETTINGS_ROW.base} hover:bg-red-50/50 dark:hover:bg-red-900/20`}
      >
        <span className={`text-sm font-semibold flex-1 text-left ${labelClass}`}>{label}</span>
        <ChevronRight
          className={`${SETTINGS_ROW.chevron} transition-transform ${step > STEP.closed ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {step >= STEP.warning && (
          <motion.div
            initial={COLLAPSED}
            animate={EXPANDED}
            exit={COLLAPSED}
            transition={EXPAND_TRANSITION}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-red-50 dark:border-red-900/30 pt-4 space-y-3">
              {step === STEP.warning && (
                <WarningPane title={warningTitle} body={warningBody} onContinue={() => setStep(STEP.confirm)} onCancel={close} />
              )}
              {step === STEP.confirm && (
                <motion.div {...FADE_IN} className="space-y-3">
                  {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
                  <p className="text-xs text-gray-500 dark:text-surface-400">
                    Type{' '}
                    <span className="font-mono font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                      {confirmPhrase}
                    </span>{' '}
                    to confirm:
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type here..."
                    autoFocus
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-surface-700 border-2 border-gray-200 dark:border-surface-600 rounded-xl text-sm font-mono focus:outline-none focus:border-red-400 transition-all text-gray-800 dark:text-surface-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirm}
                      disabled={confirmText !== confirmPhrase || loading}
                      className={`flex-1 py-2.5 ${confirmButtonClass} disabled:bg-gray-200 dark:disabled:bg-surface-700 disabled:text-gray-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2`}
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {confirmLabel}
                    </button>
                    <CancelButton onClick={close} />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface WarningPaneProps {
  title: string;
  body: string;
  onContinue: () => void;
  onCancel: () => void;
}

function WarningPane({ title, body, onContinue, onCancel }: WarningPaneProps) {
  return (
    <motion.div {...FADE_IN} className="space-y-3">
      <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-xs text-red-700 dark:text-red-400 space-y-1">
          <p className="font-bold">{title}</p>
          <p>{body}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onContinue}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors"
        >
          I understand, continue
        </button>
        <CancelButton onClick={onCancel} />
      </div>
    </motion.div>
  );
}

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 bg-gray-100 dark:bg-surface-700 hover:bg-gray-200 dark:hover:bg-surface-600 text-gray-600 dark:text-surface-300 font-bold rounded-xl text-sm transition-colors"
    >
      Cancel
    </button>
  );
}
