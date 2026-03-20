'use client';

import { useProgress } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { topics } from '@/data/topics';
import Link from 'next/link';

export default function InterviewReadiness() {
  const progress = useProgress();

  // Calculate readiness score
  const topicScores = topics.map(topic => {
    const tp = progress.topicProgress.find(t => t.topicId === topic.id);
    const attempted = tp?.questionsAttempted ?? 0;
    const correct = tp?.questionsCorrect ?? 0;
    const accuracy = attempted > 0 ? correct / attempted : 0;
    const depth = Math.min(attempted / 15, 1);
    return { topic, accuracy, depth, score: Math.round(accuracy * depth * 100), attempted };
  });

  const overallReadiness = Math.round(
    topicScores.reduce((sum, t) => sum + t.score, 0) / topics.length
  );

  const weakTopics = topicScores
    .filter(t => t.attempted >= 3 && t.accuracy < 0.65)
    .sort((a, b) => a.score - b.score);

  const strongTopics = topicScores
    .filter(t => t.attempted >= 5 && t.accuracy >= 0.75)
    .sort((a, b) => b.score - a.score);

  const untestedTopics = topicScores.filter(t => t.attempted < 3);

  const getReadinessLabel = (score: number) => {
    if (score >= 75) return { label: 'Interview Ready', color: 'text-emerald-600', ring: 'stroke-emerald-500' };
    if (score >= 50) return { label: 'Getting There', color: 'text-amber-600', ring: 'stroke-amber-500' };
    if (score >= 25) return { label: 'Building Foundation', color: 'text-orange-600', ring: 'stroke-orange-500' };
    return { label: 'Getting Started', color: 'text-surface-500', ring: 'stroke-surface-300' };
  };

  const readiness = getReadinessLabel(overallReadiness);

  return (
    <div className="card p-5">
      <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary-500" />
        Interview Readiness
      </h2>

      <div className="flex items-center gap-6 mb-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24 shrink-0" role="progressbar" aria-valuenow={overallReadiness} aria-valuemin={0} aria-valuemax={100} aria-label={`Interview readiness: ${overallReadiness} out of 100`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-surface-200" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              className={readiness.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${overallReadiness * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-surface-900">{overallReadiness}</span>
            <span className="text-[10px] text-surface-500">/ 100</span>
          </div>
        </div>

        <div>
          <p className={cn('text-lg font-bold', readiness.color)}>{readiness.label}</p>
          <p className="text-sm text-surface-500 mt-1">
            {overallReadiness >= 75
              ? 'You\'re well-prepared across core topics.'
              : overallReadiness >= 50
              ? 'Good foundation! Focus on weak areas to keep improving.'
              : 'Keep practicing to improve your readiness.'
            }
          </p>
        </div>
      </div>

      {/* Weak Areas */}
      {weakTopics.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Needs Work
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakTopics.slice(0, 4).map(({ topic }) => (
              <Link
                key={topic.id}
                href={`/practice/topics?topic=${topic.id}`}
                className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
              >
                {topic.icon} {topic.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {strongTopics.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Strong Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {strongTopics.slice(0, 4).map(({ topic }) => (
              <span key={topic.id} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {topic.icon} {topic.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Untested */}
      {untestedTopics.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-surface-500 mb-2">Not Yet Tested</h3>
          <div className="flex flex-wrap gap-2">
            {untestedTopics.map(({ topic }) => (
              <Link
                key={topic.id}
                href={`/practice/topics?topic=${topic.id}`}
                className="text-xs px-2.5 py-1 rounded-full bg-surface-100 text-surface-500 border border-surface-200 hover:bg-surface-200 transition-colors"
              >
                {topic.icon} {topic.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
