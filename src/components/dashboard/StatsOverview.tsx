'use client';

import { useProgress } from '@/store/useStore';
import { Target, Flame, Zap, CheckCircle, BookOpen, TrendingUp } from 'lucide-react';

export default function StatsOverview() {
  const progress = useProgress();

  const accuracy = progress.totalQuestionsAttempted > 0
    ? Math.round((progress.totalQuestionsCorrect / progress.totalQuestionsAttempted) * 100)
    : 0;

  const stats = [
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: Target,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Current Streak',
      value: `${progress.currentStreak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Total XP',
      value: progress.totalXp.toLocaleString(),
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Questions',
      value: progress.totalQuestionsAttempted.toString(),
      icon: CheckCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Topics Covered',
      value: `${progress.topicProgress.filter(t => t.questionsAttempted > 0).length}/11`,
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      label: 'Sessions',
      value: progress.sessionHistory.length.toString(),
      icon: TrendingUp,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="card-hover p-4">
          <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
          <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
