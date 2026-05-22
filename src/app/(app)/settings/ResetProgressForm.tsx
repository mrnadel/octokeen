'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useMasteryStore } from '@/store/useMasteryStore';

interface ResetProgressFormProps {
  displayName: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function ResetProgressForm({ displayName, onSuccess, onError }: ResetProgressFormProps) {
  const [step, setStep] = useState(0);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = useCallback(async () => {
    if (confirmText !== 'RESET MY PROGRESS') return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/reset-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: 'RESET MY PROGRESS' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset');
      }
      useStore.getState().resetProgress();
      useCourseStore.setState({
        progress: {
          displayName,
          totalXp: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: '',
          activeDays: [],
          completedLessons: {},
        },
      });
      useMasteryStore.getState().clearEvents();
      setStep(0);
      setConfirmText('');
      onSuccess?.();
      window.location.reload();
    } catch (err: any) {
      const errorMsg = err.message || 'Something went wrong';
      setError(errorMsg);
      onError?.(errorMsg);
      setStep(2);
      setLoading(false);
    }
  }, [confirmText, displayName, onSuccess, onError]);

  const divider = 'border-t border-gray-100 dark:border-surface-700';
  const rowBase = 'flex items-center w-full px-4 py-3 transition-colors';
  const chevron = 'w-4 h-4 text-gray-300 dark:text-surface-600 shrink-0 ml-1';

  return (
    <>
      <button
        onClick={() => {
          setStep(step === 0 ? 1 : 0);
          setConfirmText('');
          setError('');
        }}
        className={`${rowBase} hover:bg-red-50/50 dark:hover:bg-red-900/20`}
      >
        <span className="text-sm font-semibold text-gray-600 dark:text-surface-300 flex-1 text-left">
          Reset all progress
        </span>
        <ChevronRight className={`${chevron} transition-transform ${step > 0 ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-red-50 dark:border-red-900/30 pt-4 space-y-3">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-700 dark:text-red-400 space-y-1">
                      <p className="font-bold">This action is permanent and cannot be undone.</p>
                      <p>All XP, streaks, lessons, mastery, and achievements will be erased.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors"
                    >
                      I understand, continue
                    </button>
                    <button
                      onClick={() => {
                        setStep(0);
                        setConfirmText('');
                      }}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-surface-700 hover:bg-gray-200 dark:hover:bg-surface-600 text-gray-600 dark:text-surface-300 font-bold rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
                  <p className="text-xs text-gray-500 dark:text-surface-400">
                    Type <span className="font-mono font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">RESET MY PROGRESS</span> to
                    confirm:
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
                      onClick={handleReset}
                      disabled={confirmText !== 'RESET MY PROGRESS' || loading}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 dark:disabled:bg-surface-700 disabled:text-gray-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Permanently Reset Everything
                    </button>
                    <button
                      onClick={() => {
                        setStep(0);
                        setConfirmText('');
                        setError('');
                      }}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-surface-700 hover:bg-gray-200 dark:hover:bg-surface-600 text-gray-600 dark:text-surface-300 font-bold rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                  <span className="text-sm font-bold text-gray-500 dark:text-surface-400">
                    Resetting all progress...
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
