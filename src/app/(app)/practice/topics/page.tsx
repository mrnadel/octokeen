'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession, useSessionActions, useProgress } from '@/store/useStore';
import { topics } from '@/data/topics';
import SessionView from '@/components/session/SessionView';
import { DailyLimitBanner } from '@/components/ui/DailyLimitBanner';
import { BookOpen, ArrowRight } from 'lucide-react';
import { cn, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import type { Difficulty, TopicId } from '@/data/types';

function TopicDeepDiveContent() {
  const searchParams = useSearchParams();
  const preselectedTopic = searchParams.get('topic');
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(preselectedTopic as TopicId | null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>(undefined);
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();
  const progress = useProgress();

  if (session || sessionSummary) {
    return <SessionView />;
  }

  const handleStart = () => {
    if (!selectedTopic) return;
    startSession('topic-deep-dive', { topicId: selectedTopic, difficulty: selectedDifficulty });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-primary-500" />
          Topic Deep Dive
        </h1>
        <p className="text-surface-500 mt-1">Choose a topic and difficulty, then go deep.</p>
      </div>

      <DailyLimitBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {topics.map((topic) => {
          const tp = progress.topicProgress.find(t => t.topicId === topic.id);
          const attempted = tp?.questionsAttempted ?? 0;
          const correct = tp?.questionsCorrect ?? 0;
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
          const isSelected = selectedTopic === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id as TopicId)}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{topic.icon}</span>
                <span className="font-semibold text-sm text-surface-900">{topic.name}</span>
              </div>
              <p className="text-xs text-surface-500 mb-3 line-clamp-2">{topic.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">
                  {attempted > 0 ? `${accuracy}% accuracy · ${attempted} questions` : 'Not started'}
                </span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  topic.interviewRelevance === 'critical' ? 'bg-red-50 text-red-600' :
                  topic.interviewRelevance === 'high' ? 'bg-amber-50 text-amber-600' :
                  'bg-surface-100 text-surface-500'
                )}>
                  {topic.interviewRelevance}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTopic && (
        <div className="card p-6 mb-6 animate-slide-up">
          <h3 className="font-semibold text-surface-900 mb-4">Select Difficulty (optional)</h3>
          <div className="flex gap-3 flex-wrap mb-6">
            <button
              onClick={() => setSelectedDifficulty(undefined)}
              className={cn(
                'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors',
                !selectedDifficulty
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-surface-200 text-surface-500 hover:border-surface-300'
              )}
            >
              All Levels
            </button>
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors',
                  selectedDifficulty === d
                    ? cn('border-current', getDifficultyColor(d))
                    : 'border-surface-200 text-surface-500 hover:border-surface-300'
                )}
              >
                {getDifficultyLabel(d)}
              </button>
            ))}
          </div>

          <button onClick={handleStart} className="btn-primary w-full sm:w-auto">
            Start Deep Dive <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopicDeepDivePage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-surface-500">Loading topics...</div>}>
      <TopicDeepDiveContent />
    </Suspense>
  );
}
