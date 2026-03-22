'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';

export function PracticeCard() {
  const progress = useStore((s) => s.progress);

  const weakCount = progress.weakAreas.length;
  const topicsAttempted = progress.topicProgress.filter(
    (t) => t.questionsAttempted > 0
  ).length;

  const subtitle =
    weakCount > 0
      ? `${weakCount} weak ${weakCount === 1 ? 'area' : 'areas'} to improve`
      : topicsAttempted > 0
        ? 'Reinforce what you know'
        : 'Personalized questions based on your progress';

  return (
    <div className="px-3 sm:px-4" style={{ paddingTop: 12 }}>
      <Link
        href="/practice/smart"
        className="block transition-transform active:scale-[0.98]"
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
          boxShadow: '0 4px 0 #4C1D95, 0 6px 20px rgba(124, 58, 237, 0.25)',
          textDecoration: 'none',
        }}
      >
        <div
          className="flex items-center"
          style={{ padding: '20px 20px 18px' }}
        >
          {/* Text */}
          <div className="flex-1 min-w-0">
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginBottom: 4,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Smart Practice
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#FFFFFF',
              }}
            >
              Practice Your Weak Areas
            </div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.7)',
                marginTop: 3,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Icon area */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              marginLeft: 12,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ fontSize: 32 }}>🧠</span>
          </div>
        </div>

        {/* Bottom bar with GO button */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '0 20px 16px' }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            10 personalized questions
          </div>
          <div
            style={{
              background: '#FFFFFF',
              color: '#7C3AED',
              fontSize: 13,
              fontWeight: 800,
              padding: '8px 24px',
              borderRadius: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
            }}
          >
            Go
          </div>
        </div>
      </Link>
    </div>
  );
}
