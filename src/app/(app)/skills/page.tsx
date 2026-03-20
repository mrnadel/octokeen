'use client';

import { useProgress } from '@/store/useStore';
import { topics } from '@/data/topics';
import { Target, Lock, CheckCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SkillMapPage() {
  const progress = useProgress();

  const getTopicStatus = (topicId: string) => {
    const tp = progress.topicProgress.find(t => t.topicId === topicId);
    if (!tp || tp.questionsAttempted === 0) return 'locked';
    const accuracy = tp.questionsCorrect / tp.questionsAttempted;
    const depth = Math.min(tp.questionsAttempted / 15, 1);
    const mastery = accuracy * depth;
    if (mastery >= 0.75) return 'mastered';
    if (mastery >= 0.4) return 'competent';
    if (tp.questionsAttempted >= 1) return 'in-progress';
    return 'locked';
  };

  const statusConfig = {
    locked: { label: 'Not Started', color: 'border-surface-300 bg-surface-50', icon: Lock, iconColor: 'text-surface-300' },
    'in-progress': { label: 'In Progress', color: 'border-blue-300 bg-blue-50', icon: Minus, iconColor: 'text-blue-500' },
    competent: { label: 'Competent', color: 'border-amber-300 bg-amber-50', icon: Target, iconColor: 'text-amber-500' },
    mastered: { label: 'Mastered', color: 'border-emerald-300 bg-emerald-50', icon: CheckCircle, iconColor: 'text-emerald-500' },
  };

  // Group topics by relevance
  const criticalTopics = topics.filter(t => t.interviewRelevance === 'critical');
  const highTopics = topics.filter(t => t.interviewRelevance === 'high');
  const mediumTopics = topics.filter(t => t.interviewRelevance === 'medium');

  const renderTopicNode = (topic: typeof topics[0]) => {
    const status = getTopicStatus(topic.id);
    const config = statusConfig[status];
    const StatusIcon = config.icon;
    const tp = progress.topicProgress.find(t => t.topicId === topic.id);
    const attempted = tp?.questionsAttempted ?? 0;
    const correct = tp?.questionsCorrect ?? 0;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return (
      <div key={topic.id} className={cn('card p-5 border-2 transition-all duration-200 hover:shadow-md', config.color)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{topic.icon}</span>
            <div>
              <h3 className="font-bold text-surface-900 text-sm">{topic.name}</h3>
              <span className={cn('text-xs font-medium flex items-center gap-1 mt-0.5', config.iconColor)}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </span>
            </div>
          </div>
          {attempted > 0 && (
            <span className="text-lg font-bold" style={{ color: topic.color }}>{accuracy}%</span>
          )}
        </div>

        {/* Subtopics */}
        <div className="space-y-1.5">
          {topic.subtopics.map(sub => {
            const subProgress = tp?.subtopicBreakdown?.[sub.name];
            const subAttempted = subProgress?.attempted ?? 0;
            const subCorrect = subProgress?.correct ?? 0;
            const subAccuracy = subAttempted > 0 ? Math.round((subCorrect / subAttempted) * 100) : 0;

            return (
              <div key={sub.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{
                  backgroundColor: subAttempted === 0 ? '#CBD5E1' :
                    subAccuracy >= 75 ? '#10B981' :
                    subAccuracy >= 50 ? '#F59E0B' : '#EF4444'
                }} />
                <span className="text-xs text-surface-600 flex-1 truncate">{sub.name}</span>
                {subAttempted > 0 && (
                  <span className="text-xs text-surface-400 font-mono">{subAccuracy}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
          <Target className="w-7 h-7 text-primary-500" />
          Skill Map
        </h1>
        <p className="text-surface-500 mt-1">Track your mastery across all engineering topics.</p>
      </div>

      {/* Empty State Encouragement */}
      {progress.topicProgress.every(tp => tp.questionsAttempted === 0) && progress.topicProgress.length === 0 && (
        <div className="card p-6 text-center">
          <Target className="w-10 h-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-600 font-medium mb-1">Your skill map is waiting to be filled</p>
          <p className="text-sm text-surface-500">Start practicing any topic to begin tracking your mastery.</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-surface-600">
              <Icon className={cn('w-3.5 h-3.5', config.iconColor)} />
              {config.label}
            </div>
          );
        })}
      </div>

      {/* Critical Topics */}
      <div>
        <h2 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Critical for Interviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalTopics.map(renderTopicNode)}
        </div>
      </div>

      {/* High Relevance */}
      <div>
        <h2 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          High Relevance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highTopics.map(renderTopicNode)}
        </div>
      </div>

      {/* Medium */}
      <div>
        <h2 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-surface-400" />
          Supporting Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediumTopics.map(renderTopicNode)}
        </div>
      </div>
    </div>
  );
}
