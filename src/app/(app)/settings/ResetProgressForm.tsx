'use client';

import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useMasteryStore } from '@/store/useMasteryStore';
import { DangerZoneAction } from './DangerZoneAction';

const CONFIRM_PHRASE = 'RESET MY PROGRESS';

interface ResetProgressFormProps {
  displayName: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function ResetProgressForm({ displayName, onSuccess, onError }: ResetProgressFormProps) {
  const handleReset = useCallback(async (): Promise<void> => {
    const res = await fetch('/api/user/reset-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: CONFIRM_PHRASE }),
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
    onSuccess?.();
    window.location.reload();
  }, [displayName, onSuccess]);

  return (
    <DangerZoneAction
      label="Reset all progress"
      labelClass="text-gray-600 dark:text-surface-300"
      warningTitle="This action is permanent and cannot be undone."
      warningBody="All XP, streaks, lessons, mastery, and achievements will be erased."
      confirmPhrase={CONFIRM_PHRASE}
      confirmLabel="Permanently Reset Everything"
      confirmButtonClass="bg-red-500 hover:bg-red-600"
      onConfirm={handleReset}
      onError={onError}
    />
  );
}
