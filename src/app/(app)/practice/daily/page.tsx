'use client';

import { useSession, useSessionActions, useProgress } from '@/store/useStore';
import SessionView from '@/components/session/SessionView';
import { Calendar, Star, Flame } from 'lucide-react';

const DAY_THEMES = [
  { dayName: 'Sunday', theme: 'Sunday Systems Review', description: 'Wrap up the week with a cross-topic review — connect concepts across disciplines.' },
  { dayName: 'Monday', theme: 'Mechanical Monday', description: 'Start the week strong with core mechanical engineering fundamentals.' },
  { dayName: 'Tuesday', theme: 'Tradeoff Tuesday', description: 'Engineering is all about tradeoffs. Practice weighing competing requirements.' },
  { dayName: 'Wednesday', theme: 'Materials Wednesday', description: 'Dive into material properties, selection criteria, and failure modes.' },
  { dayName: 'Thursday', theme: 'Thermo Thursday', description: 'Heat transfer, thermodynamics, and energy systems — stay sharp.' },
  { dayName: 'Friday', theme: 'Fluids Friday', description: 'Fluid mechanics, pipe flow, and turbomachinery fundamentals.' },
  { dayName: 'Saturday', theme: 'Saturday Special', description: 'A mixed challenge across all topics — test your breadth.' },
];

export default function DailyChallengePage() {
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();
  const progress = useProgress();

  if (session || sessionSummary) {
    return <SessionView />;
  }

  const today = new Date().getDay();
  const theme = DAY_THEMES[today];

  return (
    <div className="max-w-2xl mx-auto text-center px-4 sm:px-0 py-8 sm:py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 mb-4 sm:mb-6">
        <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-surface-900 mb-1">Daily Challenge</h1>
      <p className="text-base sm:text-lg font-semibold text-amber-600 mb-3">{theme.theme}</p>
      <p className="text-surface-500 mb-6 sm:mb-8 max-w-md mx-auto">
        {theme.description}
      </p>

      <div className="card p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-surface-800">Today&apos;s Challenge</span>
          </div>
          <span className="text-xs text-surface-400">{theme.dayName}</span>
        </div>
        <div className="text-sm text-surface-600 space-y-2">
          <p>5 questions from your course lessons</p>
          <p>Bonus XP for completing the challenge</p>
        </div>
        <div className="mt-4 pt-4 border-t border-surface-200 flex items-center gap-3 sm:gap-4 text-sm flex-wrap">
          <span className="flex items-center gap-1 text-amber-600">
            <Star className="w-4 h-4" /> Bonus XP
          </span>
          <span className="flex items-center gap-1 text-orange-600">
            <Flame className="w-4 h-4" /> Streak builder
          </span>
        </div>
      </div>


      <button
        onClick={() => startSession('daily-challenge')}
        className="btn-primary text-base sm:text-lg py-3 px-6 sm:px-8 w-full sm:w-auto bg-amber-500 hover:bg-amber-600"
      >
        Start Today&apos;s Challenge
      </button>
      <p className="text-xs text-surface-400 mt-3">
        {progress.dailyChallengesCompleted} challenges completed so far
      </p>
    </div>
  );
}
