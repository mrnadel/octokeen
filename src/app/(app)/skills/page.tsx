'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { topics } from '@/data/topics';
import { course } from '@/data/course';
import Link from 'next/link';
import { ChevronLeft, TrendingUp, AlertTriangle, Trophy } from 'lucide-react';

/* ── helpers ── */

type Mastery = 'untouched' | 'weak' | 'growing' | 'strong' | 'mastered';

function getMastery(attempted: number, correct: number): { level: Mastery; score: number } {
  if (attempted === 0) return { level: 'untouched', score: 0 };
  const accuracy = correct / attempted;
  const depth = Math.min(attempted / 15, 1);
  const score = Math.round(accuracy * depth * 100);
  if (score >= 75) return { level: 'mastered', score };
  if (score >= 50) return { level: 'strong', score };
  if (score >= 25) return { level: 'growing', score };
  return { level: 'weak', score };
}

const masteryMeta: Record<Mastery, { label: string; color: string; bg: string }> = {
  untouched: { label: 'Not started', color: '#C0C0C0', bg: '#F5F5F5' },
  weak:      { label: 'Needs work',  color: '#EF4444', bg: '#FEF2F2' },
  growing:   { label: 'Growing',     color: '#F59E0B', bg: '#FFFBEB' },
  strong:    { label: 'Strong',      color: '#3B82F6', bg: '#EFF6FF' },
  mastered:  { label: 'Mastered',    color: '#10B981', bg: '#ECFDF5' },
};

/* ── page ── */

export default function SkillMapPage() {
  const progress = useProgress();
  const courseProgress = useCourseStore((s) => s.progress);
  const startLesson = useCourseStore((s) => s.startLesson);

  const analyzed = useMemo(() => {
    const result = topics.map((topic) => {
      const tp = progress.topicProgress.find((t) => t.topicId === topic.id);
      const attempted = tp?.questionsAttempted ?? 0;
      const correct = tp?.questionsCorrect ?? 0;
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const { level, score } = getMastery(attempted, correct);

      const subs = topic.subtopics.map((sub) => {
        const sp = tp?.subtopicBreakdown?.[sub.name];
        const sa = sp?.attempted ?? 0;
        const sc = sp?.correct ?? 0;
        const sAcc = sa > 0 ? Math.round((sc / sa) * 100) : 0;
        const sm = getMastery(sa, sc);
        return { ...sub, attempted: sa, correct: sc, accuracy: sAcc, ...sm };
      });

      return { ...topic, attempted, correct, accuracy, level, score, subs };
    });

    return result;
  }, [progress.topicProgress]);

  // Overall readiness score (weighted by interview relevance)
  const readiness = useMemo(() => {
    const weights = { critical: 3, high: 2, medium: 1 };
    let totalWeight = 0;
    let weightedScore = 0;
    for (const t of analyzed) {
      const w = weights[t.interviewRelevance as keyof typeof weights] ?? 1;
      totalWeight += w;
      weightedScore += t.score * w;
    }
    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }, [analyzed]);

  // Sorted lists
  const strengths = analyzed.filter((t) => t.level === 'mastered' || t.level === 'strong');
  const weaknesses = analyzed
    .filter((t) => t.level === 'weak' && t.attempted > 0)
    .sort((a, b) => a.score - b.score);
  const untouched = analyzed.filter((t) => t.level === 'untouched');
  const growing = analyzed.filter((t) => t.level === 'growing');

  // Find the best lesson to practice a topic
  const findLessonForTopic = (topicId: string) => {
    for (let ui = 0; ui < course.length; ui++) {
      for (let li = 0; li < course[ui].lessons.length; li++) {
        const lesson = course[ui].lessons[li];
        const tag = lesson.id.toLowerCase();
        const tid = topicId.toLowerCase().replace(/[^a-z]/g, '');
        if (tag.includes(tid.slice(0, 4)) && !courseProgress.completedLessons[lesson.id]) {
          return { unitIndex: ui, lessonIndex: li, lesson };
        }
      }
    }
    return null;
  };

  // Readiness ring color
  const ringColor =
    readiness >= 70 ? '#10B981' : readiness >= 40 ? '#F59E0B' : readiness >= 1 ? '#EF4444' : '#E5E5E5';
  const ringMessage =
    readiness >= 70
      ? 'Looking great for interviews!'
      : readiness >= 40
        ? 'Getting there — keep practicing!'
        : readiness >= 1
          ? 'Keep going — every lesson counts'
          : 'Start lessons to build your skills';

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 bg-white"
        style={{ borderBottom: '2px solid #E5E5E5', padding: '12px 20px' }}
      >
        <div className="flex items-center" style={{ gap: 12 }}>
          <Link
            href="/"
            className="flex items-center justify-center transition-transform active:scale-90"
            style={{ width: 36, height: 36, borderRadius: 10, background: '#F0F0F0' }}
          >
            <ChevronLeft style={{ width: 20, height: 20, color: '#777' }} />
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3C3C3C' }}>Interview Readiness</h1>
        </div>
      </header>

      <div style={{ padding: '20px 20px 40px', maxWidth: 600, margin: '0 auto' }}>
        {/* ── Readiness Score Ring ── */}
        <motion.div
          className="flex flex-col items-center"
          style={{
            background: 'white',
            borderRadius: 20,
            padding: '28px 20px 24px',
            border: '2px solid #E5E5E5',
            marginBottom: 20,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 16 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#F0F0F0" strokeWidth="10" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - readiness / 100)}`}
                transform="rotate(-90 60 60)"
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - readiness / 100) }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.span
                style={{ fontSize: 32, fontWeight: 900, color: ringColor, lineHeight: 1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {readiness}
              </motion.span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#AFAFAF', marginTop: 2 }}>
                / 100
              </span>
            </div>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#3C3C3C', textAlign: 'center' }}>
            {ringMessage}
          </p>
          {/* Quick counts */}
          <div className="flex items-center justify-center" style={{ gap: 16, marginTop: 14 }}>
            {[
              { n: strengths.length, label: 'Strong', color: '#10B981' },
              { n: growing.length, label: 'Growing', color: '#F59E0B' },
              { n: weaknesses.length, label: 'Weak', color: '#EF4444' },
              { n: untouched.length, label: 'New', color: '#C0C0C0' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center" style={{ minWidth: 48 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  {s.n}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#AFAFAF', marginTop: 3 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Weaknesses (priority) ── */}
        {weaknesses.length > 0 && (
          <Section
            icon={<AlertTriangle style={{ width: 16, height: 16, color: '#EF4444' }} />}
            title="Focus Areas"
            subtitle="These need the most work for interviews"
            color="#EF4444"
            delay={0.1}
          >
            {weaknesses.map((t) => (
              <TopicRow
                key={t.id}
                topic={t}
                onPractice={() => {
                  const loc = findLessonForTopic(t.id);
                  if (loc) startLesson(loc.unitIndex, loc.lessonIndex);
                }}
              />
            ))}
          </Section>
        )}

        {/* ── Growing ── */}
        {growing.length > 0 && (
          <Section
            icon={<TrendingUp style={{ width: 16, height: 16, color: '#F59E0B' }} />}
            title="Almost There"
            subtitle="A few more lessons to lock these in"
            color="#F59E0B"
            delay={0.15}
          >
            {growing.map((t) => (
              <TopicRow
                key={t.id}
                topic={t}
                onPractice={() => {
                  const loc = findLessonForTopic(t.id);
                  if (loc) startLesson(loc.unitIndex, loc.lessonIndex);
                }}
              />
            ))}
          </Section>
        )}

        {/* ── Strengths ── */}
        {strengths.length > 0 && (
          <Section
            icon={<Trophy style={{ width: 16, height: 16, color: '#10B981' }} />}
            title="Your Strengths"
            subtitle="You'd do well if asked about these"
            color="#10B981"
            delay={0.2}
          >
            {strengths.map((t) => (
              <TopicRow key={t.id} topic={t} compact />
            ))}
          </Section>
        )}

        {/* ── Not started ── */}
        {untouched.length > 0 && (
          <Section
            icon={<span style={{ fontSize: 14 }}>🆕</span>}
            title="Unexplored"
            subtitle="Start these to discover where you stand"
            color="#C0C0C0"
            delay={0.25}
          >
            {untouched.map((t) => (
              <TopicRow
                key={t.id}
                topic={t}
                compact
                onPractice={() => {
                  const loc = findLessonForTopic(t.id);
                  if (loc) startLesson(loc.unitIndex, loc.lessonIndex);
                }}
              />
            ))}
          </Section>
        )}

        {/* ── Full Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 8 }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#AFAFAF',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            All Topics
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analyzed.map((t) => {
              const meta = masteryMeta[t.level];
              return (
                <div
                  key={t.id}
                  className="flex items-center"
                  style={{
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: 'white',
                    border: '1.5px solid #ECECEC',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between" style={{ gap: 6 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: '#3C3C3C',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t.name}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: meta.color, flexShrink: 0 }}>
                        {t.score > 0 ? `${t.score}%` : '—'}
                      </span>
                    </div>
                    {/* Mini bar */}
                    <div
                      style={{
                        height: 4,
                        borderRadius: 2,
                        background: '#F0F0F0',
                        marginTop: 6,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${t.score}%`,
                          borderRadius: 2,
                          background: meta.color,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Section wrapper ── */

function Section({
  icon,
  title,
  subtitle,
  color,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ marginBottom: 20 }}
    >
      <div className="flex items-center" style={{ gap: 8, marginBottom: 4, padding: '0 2px' }}>
        {icon}
        <span style={{ fontSize: 15, fontWeight: 800, color }}>{title}</span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#AFAFAF', marginBottom: 10, padding: '0 2px' }}>
        {subtitle}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </motion.div>
  );
}

/* ── Topic Row ── */

type AnalyzedTopic = ReturnType<typeof useMemo> extends (infer T)[] ? T : never;

function TopicRow({
  topic,
  compact,
  onPractice,
}: {
  topic: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    interviewRelevance: string;
    level: Mastery;
    score: number;
    accuracy: number;
    attempted: number;
    subs: { id: string; name: string; level: Mastery; score: number; accuracy: number; attempted: number }[];
  };
  compact?: boolean;
  onPractice?: () => void;
}) {
  const meta = masteryMeta[topic.level];
  const relevanceLabel =
    topic.interviewRelevance === 'critical'
      ? '🔴 Critical'
      : topic.interviewRelevance === 'high'
        ? '🟡 High'
        : '⚪ Medium';

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        border: `2px solid ${meta.color}25`,
        padding: compact ? '14px 16px' : '16px 16px 14px',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Header */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: meta.bg,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {topic.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center justify-between" style={{ gap: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#3C3C3C', lineHeight: 1.2 }}>
              {topic.name}
            </h3>
            {topic.attempted > 0 && (
              <span style={{ fontSize: 20, fontWeight: 900, color: meta.color, flexShrink: 0 }}>
                {topic.score}%
              </span>
            )}
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 3 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: meta.color,
                padding: '1px 6px',
                borderRadius: 6,
                background: meta.bg,
              }}
            >
              {meta.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#CFCFCF' }}>{relevanceLabel}</span>
          </div>
        </div>
      </div>

      {/* Subtopic breakdown (only for non-compact) */}
      {!compact && topic.subs.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {topic.subs.map((sub) => {
            const sm = masteryMeta[sub.level];
            return (
              <div key={sub.id} className="flex items-center" style={{ gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: sm.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: 600,
                    color: sub.attempted > 0 ? '#3C3C3C' : '#AFAFAF',
                  }}
                >
                  {sub.name}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: sm.color, minWidth: 30, textAlign: 'right' }}>
                  {sub.attempted > 0 ? `${sub.accuracy}%` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Practice CTA */}
      {onPractice && (
        <button
          onClick={onPractice}
          className="w-full transition-transform active:scale-[0.98]"
          style={{
            marginTop: 12,
            padding: '10px 0',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 800,
            color: 'white',
            background: topic.level === 'untouched' ? '#3C3C3C' : meta.color,
            boxShadow: `0 3px 0 ${topic.level === 'untouched' ? '#2A2A2A' : meta.color}CC`,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {topic.level === 'untouched' ? 'Start Learning' : 'Practice Now'}
        </button>
      )}
    </div>
  );
}
