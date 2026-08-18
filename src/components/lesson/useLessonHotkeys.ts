'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { QuestionCardHandle } from './QuestionCard';

const OPTION_LETTERS = ['a', 'b', 'c', 'd', 'e'] as const;
const LETTER_A_CHAR_CODE = 97;
const DIGIT_KEY = /^[1-9]$/;
const CALCULATOR_SELECTOR = '[aria-label="Engineering calculator"]';

export interface LessonHotkeysOptions {
  questionRef: RefObject<QuestionCardHandle | null>;
  showExitConfirm: boolean;
  isCurrentAnswered: boolean;
  isTeaching: boolean;
  hasSelection: boolean;
  onCheck: () => void;
  onContinue: () => void;
  onTeachingGotIt: () => void;
  onExit: () => void;
  onCancelExit: () => void;
  onToggleCalculator: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const isField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
  return isField && !(target as HTMLInputElement).disabled;
}

function selectByDigit(handle: QuestionCardHandle | null, index: number): void {
  if (!handle) return;
  if (handle.questionType === 'fill-blank') {
    handle.selectWord(index);
  } else if (handle.questionType === 'true-false') {
    if (index === 0) handle.selectBool(true);
    else if (index === 1) handle.selectBool(false);
  } else {
    handle.selectOption(index);
  }
}

/** Global keyboard shortcuts for the lesson view: answer selection, check/continue, exit, calculator. */
export function useLessonHotkeys({
  questionRef,
  showExitConfirm,
  isCurrentAnswered,
  isTeaching,
  hasSelection,
  onCheck,
  onContinue,
  onTeachingGotIt,
  onExit,
  onCancelExit,
  onToggleCalculator,
}: LessonHotkeysOptions): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // The calculator owns its own keys while focused
      if (document.activeElement?.closest(CALCULATOR_SELECTOR)) return;

      if (showExitConfirm) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancelExit();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }

      if (e.key === '`') {
        e.preventDefault();
        onToggleCalculator();
        return;
      }

      if (isTypingTarget(e.target)) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isTeaching) onTeachingGotIt();
        else if (isCurrentAnswered) onContinue();
        else if (hasSelection) onCheck();
        return;
      }

      if (isCurrentAnswered) return;

      const key = e.key.toLowerCase();
      const handle = questionRef.current;
      if (DIGIT_KEY.test(key)) {
        selectByDigit(handle, parseInt(key, 10) - 1);
      } else if (OPTION_LETTERS.includes(key as (typeof OPTION_LETTERS)[number])) {
        handle?.selectOption(key.charCodeAt(0) - LETTER_A_CHAR_CODE);
      } else if (key === 't') {
        handle?.selectBool(true);
      } else if (key === 'f') {
        handle?.selectBool(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    questionRef,
    showExitConfirm,
    isCurrentAnswered,
    isTeaching,
    hasSelection,
    onCheck,
    onContinue,
    onTeachingGotIt,
    onExit,
    onCancelExit,
    onToggleCalculator,
  ]);
}
