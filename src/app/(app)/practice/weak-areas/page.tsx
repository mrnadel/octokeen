'use client';

import { useSession, useSessionActions, useProgress } from '@/store/useStore';
import SessionView from '@/components/session/SessionView';
import { DailyLimitBanner } from '@/components/ui/DailyLimitBanner';
import { UpgradeGate } from '@/components/ui/UpgradeGate';
import { FEATURES } from '@/lib/pricing';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { topics } from '@/data/topics';
import Link from 'next/link';

export default function WeakAreasPage() {
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();
  const progress = useProgress();

  if (session || sessionSummary) {
    return <SessionView />;
  }

  const weakTopics = progress.topicProgress
    .filter(tp => tp.questionsAttempted >= 3 && (tp.questionsCorrect / tp.questionsAttempted) < 0.65)
    .map(tp => ({
      ...tp,
      topic: topics.find(t => t.id === tp.topicId),
      accuracy: Math.round((tp.questionsCorrect / tp.questionsAttempted) * 100),
    }))
    .filter((tp): tp is typeof tp & { topic: NonNullable<typeof tp.topic> } => tp.topic != null)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-3">Weak Areas</h1>
        <p className="text-surface-500 max-w-md mx-auto">
          Focus on topics where you&apos;re struggling. These questions are selected to strengthen your weakest points.
        </p>
      </div>

      <UpgradeGate feature={FEATURES.ALL_PRACTICE_MODES} reason="Weak areas practice targets your lowest-scoring topics to improve fastest.">
        <DailyLimitBanner />

        {weakTopics.length > 0 ? (
          <>
            <div className="space-y-3 mb-8">
              {weakTopics.map(({ topic, accuracy, questionsAttempted }) => (
                <div key={topic.id} className="card p-4 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${topic.color}15` }}
                  >
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-surface-900">{topic.name}</p>
                    <p className="text-sm text-surface-500">
                      {accuracy}% accuracy · {questionsAttempted} questions attempted
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="badge-error">{accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => startSession('weak-areas')}
              className="btn-primary w-full text-lg py-3 bg-red-500 hover:bg-red-600"
            >
              Start Weak Areas Practice <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-surface-500 mb-4">
              No weak areas detected yet. Keep practicing to build your profile!
            </p>
            <Link href="/practice/adaptive" className="btn-primary">
              Try Adaptive Practice
            </Link>
          </div>
        )}
      </UpgradeGate>
    </div>
  );
}
