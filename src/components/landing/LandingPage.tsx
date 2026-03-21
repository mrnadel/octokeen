'use client';

import Link from 'next/link';

const TOPICS = [
  { name: 'Statics', color: '#6366F1' },
  { name: 'Dynamics', color: '#8B5CF6' },
  { name: 'Strength of Materials', color: '#EC4899' },
  { name: 'Thermo', color: '#F59E0B' },
  { name: 'Heat Transfer', color: '#EF4444' },
  { name: 'Fluids', color: '#3B82F6' },
  { name: 'Materials', color: '#10B981' },
  { name: 'Machine Elements', color: '#64748B' },
  { name: 'GD&T', color: '#D946EF' },
  { name: 'Interview Prep', color: '#0EA5E9' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* ── Hero ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Logo */}
        <div
          className="w-28 h-28 bg-white rounded-[28px] flex items-center justify-center mb-8"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
        >
          <span className="text-6xl leading-none">&#x2699;&#xFE0F;</span>
        </div>

        <h1 className="text-[1.75rem] leading-[1.2] font-black text-center text-surface-900 mb-3">
          Learn mechanical engineering<br />
          the way that actually sticks.
        </h1>

        <p className="text-surface-400 text-[15px] text-center leading-relaxed mb-10 max-w-[300px]">
          Bite-sized lessons, real interview questions, and a course that feels like a game.
        </p>

        {/* CTA */}
        <Link
          href="/register"
          className="w-full max-w-[300px] block py-4 text-white font-extrabold rounded-2xl text-center text-[17px] tracking-wide transition-transform active:translate-y-[2px]"
          style={{
            background: '#58CC02',
            boxShadow: '0 5px 0 #46A302',
          }}
        >
          GET STARTED
        </Link>

        <Link
          href="/login"
          className="mt-4 text-[15px] font-bold text-[#1CB0F6] tracking-wide"
        >
          I ALREADY HAVE AN ACCOUNT
        </Link>
      </div>

      {/* ── Topics strip ── */}
      <div className="px-6 pb-12">
        <p className="text-xs font-bold text-surface-300 uppercase tracking-widest text-center mb-4">
          10 units &middot; 200+ questions
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {TOPICS.map((t) => (
            <span
              key={t.name}
              className="px-3 py-1.5 rounded-full text-[13px] font-bold text-white"
              style={{ background: t.color }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
