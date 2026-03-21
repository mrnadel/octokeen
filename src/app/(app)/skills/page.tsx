'use client';

import { useProgress } from '@/store/useStore';
import { topics } from '@/data/topics';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type TopicStatus = 'locked' | 'in-progress' | 'competent' | 'mastered';

const statusConfig: Record<TopicStatus, { label: string; bg: string; border: string; text: string; dot: string }> = {
  locked:        { label: 'Not Started', bg: '#F7F7F7', border: '#ECECEC', text: '#AFAFAF', dot: '#DCDCDC' },
  'in-progress': { label: 'In Progress', bg: '#EFF6FF', border: '#BFDBFE', text: '#3B82F6', dot: '#3B82F6' },
  competent:     { label: 'Competent',   bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', dot: '#F59E0B' },
  mastered:      { label: 'Mastered',    bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', dot: '#10B981' },
};

const sectionConfig = [
  { key: 'critical' as const, label: 'Critical for Interviews', dot: '#EF4444' },
  { key: 'high' as const,     label: 'High Relevance',         dot: '#F59E0B' },
  { key: 'medium' as const,   label: 'Supporting Topics',      dot: '#AFAFAF' },
];

export default function SkillMapPage() {
  const progress = useProgress();

  const getTopicStatus = (topicId: string): TopicStatus => {
    const tp = progress.topicProgress.find(t => t.topicId === topicId);
    if (!tp || tp.questionsAttempted === 0) return 'locked';
    const accuracy = tp.questionsCorrect / tp.questionsAttempted;
    const depth = Math.min(tp.questionsAttempted / 15, 1);
    const mastery = accuracy * depth;
    if (mastery >= 0.75) return 'mastered';
    if (mastery >= 0.4) return 'competent';
    return 'in-progress';
  };

  const grouped = {
    critical: topics.filter(t => t.interviewRelevance === 'critical'),
    high: topics.filter(t => t.interviewRelevance === 'high'),
    medium: topics.filter(t => t.interviewRelevance === 'medium'),
  };

  // Summary stats
  const statusCounts = topics.reduce((acc, t) => {
    const s = getTopicStatus(t.id);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<TopicStatus, number>);

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
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#F0F0F0',
            }}
          >
            <ChevronLeft style={{ width: 20, height: 20, color: '#777' }} />
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3C3C3C', lineHeight: 1.2 }}>
              Skill Map
            </h1>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#AFAFAF', marginTop: 1 }}>
              Track your topic mastery
            </p>
          </div>
        </div>
      </header>

      {/* Summary pills */}
      <div style={{ padding: '16px 20px 0' }}>
        <div className="flex" style={{ gap: 8, overflowX: 'auto' }}>
          {([
            { key: 'mastered' as TopicStatus,    emoji: '\u2705', label: 'Mastered' },
            { key: 'competent' as TopicStatus,   emoji: '\uD83D\uDFE1', label: 'Competent' },
            { key: 'in-progress' as TopicStatus, emoji: '\uD83D\uDD35', label: 'In Progress' },
            { key: 'locked' as TopicStatus,      emoji: '\u26AA', label: 'Not Started' },
          ]).map(({ key, emoji, label }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 20,
                background: 'white',
                border: '1.5px solid #ECECEC',
                fontSize: 12,
                fontWeight: 700,
                color: '#3C3C3C',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11 }}>{emoji}</span>
              <span>{statusCounts[key] || 0}</span>
              <span style={{ color: '#AFAFAF', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: '20px 20px 32px' }}>
        {sectionConfig.map(({ key, label, dot }) => {
          const sectionTopics = grouped[key];
          if (sectionTopics.length === 0) return null;

          return (
            <div key={key} style={{ marginBottom: 28 }}>
              {/* Section label */}
              <div
                className="flex items-center"
                style={{ gap: 8, marginBottom: 12, padding: '0 2px' }}
              >
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: dot,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#777', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {label}
                </span>
              </div>

              {/* Topic cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sectionTopics.map(topic => {
                  const status = getTopicStatus(topic.id);
                  const cfg = statusConfig[status];
                  const tp = progress.topicProgress.find(t => t.topicId === topic.id);
                  const attempted = tp?.questionsAttempted ?? 0;
                  const correct = tp?.questionsCorrect ?? 0;
                  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
                  const masteryRaw = attempted > 0
                    ? (correct / attempted) * Math.min(attempted / 15, 1)
                    : 0;
                  const masteryPercent = Math.round(masteryRaw * 100);

                  return (
                    <div
                      key={topic.id}
                      style={{
                        background: 'white',
                        borderRadius: 14,
                        border: `2px solid ${cfg.border}`,
                        padding: 16,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                    >
                      {/* Top row: icon + name + accuracy */}
                      <div className="flex items-center" style={{ gap: 12, marginBottom: 10 }}>
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 12,
                            background: cfg.bg,
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
                            {attempted > 0 && (
                              <span style={{ fontSize: 18, fontWeight: 800, color: cfg.text, flexShrink: 0 }}>
                                {accuracy}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center" style={{ gap: 6, marginTop: 3 }}>
                            <div style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: cfg.dot,
                              flexShrink: 0,
                            }} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: cfg.text }}>
                              {cfg.label}
                            </span>
                            {attempted > 0 && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#CFCFCF', marginLeft: 4 }}>
                                {attempted} answered
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mastery progress bar */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{
                          height: 6,
                          borderRadius: 3,
                          background: '#F0F0F0',
                          overflow: 'hidden',
                        }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${masteryPercent}%`,
                              borderRadius: 3,
                              background: cfg.dot,
                              transition: 'width 0.4s ease-out',
                            }}
                          />
                        </div>
                      </div>

                      {/* Subtopics */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {topic.subtopics.map(sub => {
                          const subProg = tp?.subtopicBreakdown?.[sub.name];
                          const subAttempted = subProg?.attempted ?? 0;
                          const subCorrect = subProg?.correct ?? 0;
                          const subAcc = subAttempted > 0 ? Math.round((subCorrect / subAttempted) * 100) : 0;
                          const subColor = subAttempted === 0 ? '#E5E5E5' :
                            subAcc >= 75 ? '#10B981' :
                            subAcc >= 50 ? '#F59E0B' : '#EF4444';

                          return (
                            <div
                              key={sub.id}
                              className="flex items-center"
                              style={{
                                gap: 5,
                                padding: '3px 8px',
                                borderRadius: 8,
                                background: subAttempted === 0 ? '#F7F7F7' : `${subColor}12`,
                                border: `1px solid ${subAttempted === 0 ? '#ECECEC' : subColor + '30'}`,
                              }}
                            >
                              <div style={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: subColor,
                                flexShrink: 0,
                              }} />
                              <span style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: subAttempted === 0 ? '#AFAFAF' : '#3C3C3C',
                                whiteSpace: 'nowrap',
                              }}>
                                {sub.name}
                              </span>
                              {subAttempted > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: subColor }}>
                                  {subAcc}%
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
