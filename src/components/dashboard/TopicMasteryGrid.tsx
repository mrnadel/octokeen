'use client';

import Link from 'next/link';
import { useProgress } from '@/store/useStore';
import { topics } from '@/data/topics';
import { cn } from '@/lib/utils';

export default function TopicMasteryGrid() {
  const progress = useProgress();

  return (
    <div className="card p-5">
      <h2 className="font-bold text-surface-900 mb-4">Topic Mastery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic) => {
          const tp = progress.topicProgress.find(t => t.topicId === topic.id);
          const attempted = tp?.questionsAttempted ?? 0;
          const correct = tp?.questionsCorrect ?? 0;
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
          const mastery = Math.min(Math.round((accuracy * Math.min(attempted / 15, 1))), 100);

          return (
            <Link
              key={topic.id}
              href={`/practice/topics?topic=${topic.id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 hover:border-surface-300 hover:bg-surface-50 transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${topic.color}15` }}
              >
                {topic.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800 truncate group-hover:text-surface-900">
                  {topic.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${mastery}%`,
                        backgroundColor: topic.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-surface-500 font-medium w-8 text-right">
                    {mastery}%
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
