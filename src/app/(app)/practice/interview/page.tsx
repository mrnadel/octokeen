'use client';

import { useSession, useSessionActions } from '@/store/useStore';
import SessionView from '@/components/session/SessionView';
import { DailyLimitBanner } from '@/components/ui/DailyLimitBanner';
import { UpgradeGate } from '@/components/ui/UpgradeGate';
import { FEATURES } from '@/lib/pricing';
import { Timer, AlertCircle, Target, Clock, Shuffle } from 'lucide-react';

export default function InterviewSimPage() {
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();

  if (session || sessionSummary) {
    return <SessionView />;
  }

  return (
    <div className="max-w-2xl mx-auto text-center px-4 sm:px-0 py-8 sm:py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 mb-4 sm:mb-6">
        <Timer className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-surface-900 mb-3">Interview Simulation</h1>
      <p className="text-surface-500 mb-6 sm:mb-8 max-w-md mx-auto">
        Simulate a real technical interview. Timed, mixed topics, varied question types.
        Test your readiness under pressure.
      </p>

      {/* What to expect */}
      <div className="card p-4 sm:p-6 mb-6 sm:mb-8 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-surface-800 mb-4">What to expect:</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-surface-600">
            <Clock className="w-4 h-4 text-purple-500 shrink-0" />
            <span>30 minute time limit</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-surface-600">
            <Target className="w-4 h-4 text-purple-500 shrink-0" />
            <span>15 questions across all topics</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-surface-600">
            <Shuffle className="w-4 h-4 text-purple-500 shrink-0" />
            <span>Mixed difficulty and question types</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-surface-600">
            <AlertCircle className="w-4 h-4 text-purple-500 shrink-0" />
            <span>Interview readiness score at the end</span>
          </div>
        </div>
      </div>

      <UpgradeGate feature={FEATURES.INTERVIEW_READINESS} reason="Interview simulation with readiness scoring is a Pro feature.">
        <DailyLimitBanner />

        <button
          onClick={() => startSession('interview-sim')}
          className="btn-primary text-base sm:text-lg py-3 px-6 sm:px-8 w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
        >
          Begin Interview Simulation
        </button>
        <p className="text-xs text-surface-400 mt-3">The timer starts immediately</p>
      </UpgradeGate>
    </div>
  );
}
