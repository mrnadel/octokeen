'use client';

import { useState, useMemo } from 'react';
import { allQuestions } from '@/data/questions';
import { topics } from '@/data/topics';
import { course } from '@/data/course';
import type { Question, TopicId, Difficulty } from '@/data/types';

// --------------- Helpers ---------------

function getCorrectAnswer(q: Question): string {
  switch (q.type) {
    case 'multiple-choice':
    case 'confidence-rated':
    case 'what-fails-first':
      return q.correctAnswer;
    case 'two-choice-tradeoff':
      return `Preferred: ${q.preferredAnswer}`;
    case 'multi-select':
      return q.correctAnswers.join(', ');
    case 'ranking':
      return q.correctOrder.join(' > ');
    case 'scenario':
      return q.keyTakeaway;
    case 'free-text':
    case 'explanation':
      return q.sampleAnswer.slice(0, 120) + (q.sampleAnswer.length > 120 ? '...' : '');
    case 'spot-the-flaw':
      return q.correctedStatement;
    case 'estimation':
      return `${q.acceptableRange.bestEstimate} ${q.acceptableRange.unit} (range: ${q.acceptableRange.low}-${q.acceptableRange.high})`;
    case 'design-decision':
      return `Best: ${q.bestOption}`;
    case 'material-selection':
      return `Best: ${q.bestChoice}`;
    default:
      return '(see details)';
  }
}

function truncate(s: string, len: number): string {
  return s.length > len ? s.slice(0, len) + '...' : s;
}

const topicNameMap: Record<string, string> = {};
for (const t of topics) {
  topicNameMap[t.id] = t.name;
}

// --------------- Styles ---------------

const containerStyle: React.CSSProperties = {
  maxWidth: 1000,
  margin: '0 auto',
  padding: '32px 24px',
  fontFamily: 'system-ui',
};

const tabBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 0,
  marginBottom: 24,
  borderRadius: 10,
  overflow: 'hidden',
  border: '1.5px solid #E5E5E5',
  width: 'fit-content',
};

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    background: active ? '#3B82F6' : 'white',
    color: active ? 'white' : '#333',
    transition: 'background 0.15s',
  };
}

const filterBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  marginBottom: 16,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 13,
  border: '1.5px solid #E5E5E5',
  borderRadius: 8,
  background: 'white',
  cursor: 'pointer',
  minWidth: 160,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontWeight: 700,
  textAlign: 'left',
  borderBottom: '2px solid #E5E5E5',
  fontSize: 12,
  textTransform: 'uppercase',
  color: '#666',
  letterSpacing: '0.03em',
};

function rowStyle(isExpanded: boolean): React.CSSProperties {
  return {
    borderBottom: '1px solid #F0F0F0',
    cursor: 'pointer',
    background: isExpanded ? '#F8FAFF' : 'white',
    transition: 'background 0.1s',
  };
}

const cellStyle: React.CSSProperties = {
  padding: '8px 10px',
  verticalAlign: 'top',
};

const monoCell: React.CSSProperties = {
  ...cellStyle,
  fontFamily: 'monospace',
  fontSize: 11,
};

const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 6,
  background: bg,
  color,
  whiteSpace: 'nowrap',
});

const difficultyColors: Record<Difficulty, { bg: string; fg: string }> = {
  beginner: { bg: '#E8F5E9', fg: '#2E7D32' },
  intermediate: { bg: '#FFF8E1', fg: '#F57F17' },
  advanced: { bg: '#FFEBEE', fg: '#C62828' },
};

const expandedDetailStyle: React.CSSProperties = {
  padding: '16px 20px',
  background: '#FAFBFF',
  borderBottom: '1px solid #E5E5E5',
  fontSize: 13,
  lineHeight: 1.6,
};

const detailLabelStyle: React.CSSProperties = {
  fontWeight: 700,
  color: '#444',
  marginBottom: 2,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 16px',
  cursor: 'pointer',
  borderRadius: 8,
  border: '1.5px solid #E5E5E5',
  marginBottom: 8,
  background: 'white',
  transition: 'background 0.1s',
};

const lessonRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 16px 10px 32px',
  cursor: 'pointer',
  borderBottom: '1px solid #F0F0F0',
  fontSize: 13,
  transition: 'background 0.1s',
};

const courseQuestionRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  padding: '8px 16px 8px 56px',
  borderBottom: '1px solid #F5F5F5',
  fontSize: 12,
  color: '#555',
};

const countBadge: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 12px',
  borderRadius: 20,
  background: '#F0F0F0',
  color: '#555',
  marginBottom: 24,
  display: 'inline-block',
};

// --------------- Component ---------------

type Tab = 'questions' | 'lessons';

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>('questions');

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Content Browser</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
        Browse all practice questions and course lessons.
      </p>

      <div style={tabBarStyle}>
        <button style={tabStyle(tab === 'questions')} onClick={() => setTab('questions')}>
          Practice Questions
        </button>
        <button style={tabStyle(tab === 'lessons')} onClick={() => setTab('lessons')}>
          Course Lessons
        </button>
      </div>

      {tab === 'questions' ? <QuestionsTab /> : <LessonsTab />}
    </div>
  );
}

// --------------- Practice Questions Tab ---------------

function QuestionsTab() {
  const [topicFilter, setTopicFilter] = useState<TopicId | ''>('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = allQuestions;
    if (topicFilter) result = result.filter((q) => q.topic === topicFilter);
    if (difficultyFilter) result = result.filter((q) => q.difficulty === difficultyFilter);
    return result;
  }, [topicFilter, difficultyFilter]);

  return (
    <>
      <div style={filterBarStyle}>
        <select
          style={selectStyle}
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value as TopicId | '')}
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | '')}
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div style={countBadge}>{filtered.length} questions</div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Topic</th>
            <th style={thStyle}>Subtopic</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Difficulty</th>
            <th style={thStyle}>Question</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q) => {
            const isExpanded = expandedId === q.id;
            const dc = difficultyColors[q.difficulty];
            return (
              <QuestionRow
                key={q.id}
                q={q}
                isExpanded={isExpanded}
                dc={dc}
                onToggle={() => setExpandedId(isExpanded ? null : q.id)}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function QuestionRow({
  q,
  isExpanded,
  dc,
  onToggle,
}: {
  q: Question;
  isExpanded: boolean;
  dc: { bg: string; fg: string };
  onToggle: () => void;
}) {
  return (
    <>
      <tr style={rowStyle(isExpanded)} onClick={onToggle}>
        <td style={monoCell}>{q.id}</td>
        <td style={cellStyle}>{topicNameMap[q.topic] ?? q.topic}</td>
        <td style={cellStyle}>{q.subtopic}</td>
        <td style={cellStyle}>
          <span style={badgeStyle('#E3F2FD', '#1565C0')}>{q.type}</span>
        </td>
        <td style={cellStyle}>
          <span style={badgeStyle(dc.bg, dc.fg)}>{q.difficulty}</span>
        </td>
        <td style={cellStyle}>{truncate(q.question, 60)}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} style={expandedDetailStyle}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <div style={detailLabelStyle}>Full Question</div>
                <div>{q.question}</div>
              </div>
              <div>
                <div style={detailLabelStyle}>Explanation</div>
                <div>{q.explanation}</div>
              </div>
              <div>
                <div style={detailLabelStyle}>Interview Insight</div>
                <div>{q.interviewInsight}</div>
              </div>
              <div>
                <div style={detailLabelStyle}>Correct Answer</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13 }}>{getCorrectAnswer(q)}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// --------------- Course Lessons Tab ---------------

function LessonsTab() {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const totalLessons = useMemo(
    () => course.reduce((s, u) => s + u.lessons.length, 0),
    []
  );
  const totalQuestions = useMemo(
    () =>
      course.reduce(
        (s, u) => s + u.lessons.reduce((ls, l) => ls + l.questions.length, 0),
        0
      ),
    []
  );

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <span style={countBadge}>{course.length} units</span>
        <span style={countBadge}>{totalLessons} lessons</span>
        <span style={countBadge}>{totalQuestions} questions</span>
      </div>

      {course.map((unit) => {
        const isUnitExpanded = expandedUnit === unit.id;
        const unitQuestions = unit.lessons.reduce((s, l) => s + l.questions.length, 0);

        return (
          <div key={unit.id} style={{ marginBottom: 4 }}>
            <div
              style={{
                ...sectionHeaderStyle,
                background: isUnitExpanded ? '#F8FAFF' : 'white',
              }}
              onClick={() => setExpandedUnit(isUnitExpanded ? null : unit.id)}
            >
              <div>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{unit.title}</span>
                <span style={{ color: '#999', fontSize: 13, marginLeft: 12 }}>
                  {unit.lessons.length} lessons &middot; {unitQuestions} questions
                </span>
              </div>
              <span style={{ fontSize: 16, color: '#999' }}>{isUnitExpanded ? '\u25B2' : '\u25BC'}</span>
            </div>

            {isUnitExpanded &&
              unit.lessons.map((lesson) => {
                const isLessonExpanded = expandedLesson === lesson.id;

                return (
                  <div key={lesson.id}>
                    <div
                      style={{
                        ...lessonRowStyle,
                        background: isLessonExpanded ? '#F5F7FF' : 'transparent',
                      }}
                      onClick={() => setExpandedLesson(isLessonExpanded ? null : lesson.id)}
                    >
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#999', marginRight: 10 }}>
                          {lesson.id}
                        </span>
                        <span style={{ fontWeight: 600 }}>{lesson.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={badgeStyle('#F0F0F0', '#555')}>
                          {lesson.questions.length} q
                        </span>
                        <span style={{ fontSize: 14, color: '#999' }}>
                          {isLessonExpanded ? '\u25B2' : '\u25BC'}
                        </span>
                      </div>
                    </div>

                    {isLessonExpanded &&
                      lesson.questions.map((cq) => (
                        <div key={cq.id} style={courseQuestionRowStyle}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#999', minWidth: 80 }}>
                            {cq.id}
                          </span>
                          <span style={badgeStyle('#E3F2FD', '#1565C0')}>{cq.type}</span>
                          <span>{truncate(cq.question, 60)}</span>
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
}
