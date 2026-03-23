'use client';

import { useEffect, useState, useCallback } from 'react';

// --------------- Types ---------------

interface PracticeQuestion {
  id: string;
  type: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  question: string;
  explanation: string;
  interviewInsight: string;
  realWorldConnection: string;
  commonMistake: string;
  tags: string[];
  [key: string]: unknown;
}

interface FormData {
  type: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  question: string;
  explanation: string;
  interviewInsight: string;
  realWorldConnection: string;
  commonMistake: string;
  tags: string;
  typeDataJson: string;
}

// --------------- Constants ---------------

const TOPIC_OPTIONS = [
  'engineering-mechanics',
  'strength-of-materials',
  'thermodynamics',
  'heat-transfer',
  'fluid-mechanics',
  'materials-engineering',
  'manufacturing',
  'machine-elements',
  'design-tolerancing',
  'vibrations',
  'real-world-mechanisms',
];

const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced'];

const TYPE_OPTIONS = [
  'multiple-choice',
  'two-choice-tradeoff',
  'multi-select',
  'ranking',
  'scenario',
  'spot-the-flaw',
  'estimation',
  'confidence-rated',
  'what-fails-first',
  'design-decision',
  'material-selection',
];

const COMMON_FIELDS = [
  'id', 'type', 'topic', 'subtopic', 'difficulty', 'question',
  'explanation', 'interviewInsight', 'realWorldConnection',
  'commonMistake', 'tags', 'orderIndex', 'createdAt', 'updatedAt',
];

function emptyForm(): FormData {
  return {
    type: 'multiple-choice',
    topic: 'engineering-mechanics',
    subtopic: '',
    difficulty: 'beginner',
    question: '',
    explanation: '',
    interviewInsight: '',
    realWorldConnection: '',
    commonMistake: '',
    tags: '',
    typeDataJson: JSON.stringify({ options: [{ id: 'a', text: '' }], correctAnswer: 'a' }, null, 2),
  };
}

function extractTypeData(q: PracticeQuestion): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(q)) {
    if (!COMMON_FIELDS.includes(key)) {
      result[key] = q[key];
    }
  }
  return result;
}

function questionToForm(q: PracticeQuestion): FormData {
  const typeData = extractTypeData(q);
  return {
    type: q.type || 'multiple-choice',
    topic: q.topic || 'engineering-mechanics',
    subtopic: q.subtopic || '',
    difficulty: q.difficulty || 'beginner',
    question: q.question || '',
    explanation: q.explanation || '',
    interviewInsight: q.interviewInsight || '',
    realWorldConnection: q.realWorldConnection || '',
    commonMistake: q.commonMistake || '',
    tags: Array.isArray(q.tags) ? q.tags.join(', ') : '',
    typeDataJson: JSON.stringify(typeData, null, 2),
  };
}

function truncate(s: string, len: number): string {
  return s.length > len ? s.slice(0, len) + '...' : s;
}

// --------------- Styles ---------------

const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 6,
  background: bg,
  color,
  whiteSpace: 'nowrap',
});

const difficultyColors: Record<string, { bg: string; fg: string }> = {
  beginner: { bg: '#E8F5E9', fg: '#2E7D32' },
  intermediate: { bg: '#FFF8E1', fg: '#F57F17' },
  advanced: { bg: '#FFEBEE', fg: '#C62828' },
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: 13,
  fontFamily: 'system-ui',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 80,
  resize: 'vertical',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  background: 'white',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#444',
  marginBottom: 4,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const filterSelectStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 13,
  border: '1.5px solid #E5E5E5',
  borderRadius: 8,
  background: 'white',
  cursor: 'pointer',
  minWidth: 0,
  flex: '1 1 120px',
};

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 13,
  fontWeight: 700,
  background: '#111',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 13,
  fontWeight: 700,
  background: 'white',
  color: '#333',
  border: '1.5px solid #E5E5E5',
  borderRadius: 8,
  cursor: 'pointer',
};

const btnDanger: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 700,
  background: '#FFEBEE',
  color: '#C62828',
  border: '1px solid #FFCDD2',
  borderRadius: 6,
  cursor: 'pointer',
};

const btnEdit: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 700,
  background: '#E3F2FD',
  color: '#1565C0',
  border: '1px solid #BBDEFB',
  borderRadius: 6,
  cursor: 'pointer',
};

// --------------- Component ---------------

export default function PracticeEditor() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Edit / Add state
  const [editingId, setEditingId] = useState<string | null>(null); // null = not editing, 'new' = adding
  const [form, setForm] = useState<FormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content/questions');
      if (!res.ok) throw new Error('Failed to load questions');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Filter
  const filtered = questions.filter((q) => {
    if (topicFilter && q.topic !== topicFilter) return false;
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    if (typeFilter && q.type !== typeFilter) return false;
    return true;
  });

  // Start adding
  function handleAdd() {
    setEditingId('new');
    setForm(emptyForm());
    setFormError(null);
  }

  // Start editing
  function handleEdit(q: PracticeQuestion) {
    setEditingId(q.id);
    setForm(questionToForm(q));
    setFormError(null);
  }

  // Cancel
  function handleCancel() {
    setEditingId(null);
    setFormError(null);
  }

  // Save (create or update)
  async function handleSave() {
    setFormError(null);

    // Validate typeData JSON
    let typeData: Record<string, unknown>;
    try {
      typeData = JSON.parse(form.typeDataJson);
      if (typeof typeData !== 'object' || typeData === null || Array.isArray(typeData)) {
        setFormError('typeData must be a JSON object');
        return;
      }
    } catch {
      setFormError('Invalid JSON in typeData field');
      return;
    }

    // Validate required fields
    if (!form.question.trim()) {
      setFormError('Question text is required');
      return;
    }

    const body = {
      type: form.type,
      topic: form.topic,
      subtopic: form.subtopic,
      difficulty: form.difficulty,
      question: form.question,
      explanation: form.explanation,
      interviewInsight: form.interviewInsight,
      realWorldConnection: form.realWorldConnection,
      commonMistake: form.commonMistake,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      typeData,
    };

    setSaving(true);
    try {
      const isNew = editingId === 'new';
      const url = isNew
        ? '/api/admin/content/practice-questions'
        : `/api/admin/content/practice-questions/${editingId}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to ${isNew ? 'create' : 'update'} question`);
      }

      setEditingId(null);
      await fetchQuestions();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  // Delete
  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const res = await fetch(`/api/admin/content/practice-questions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete question');
      }
      if (editingId === id) setEditingId(null);
      await fetchQuestions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  // Update form field
  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // --------------- Render ---------------

  if (loading) {
    return <p style={{ padding: 20, color: '#666', fontSize: 14 }}>Loading questions...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: '#C62828', fontSize: 14, marginBottom: 12 }}>{error}</p>
        <button style={btnPrimary} onClick={fetchQuestions}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* Top bar: Add button + filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={btnPrimary} onClick={handleAdd}>+ Add Question</button>

        <select style={filterSelectStyle} value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
          <option value="">All Topics</option>
          {TOPIC_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select style={filterSelectStyle} value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="">All Difficulties</option>
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select style={filterSelectStyle} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <div style={{
        fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
        background: '#F0F0F0', color: '#555', marginBottom: 16, display: 'inline-block',
      }}>
        {filtered.length} question{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Add new form */}
      {editingId === 'new' && (
        <div style={{
          background: '#F8FAFF', borderRadius: 10, border: '1.5px solid #C5D5F6',
          padding: 16, marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Add New Question</h3>
          <QuestionForm
            form={form}
            onUpdate={updateField}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
            error={formError}
          />
        </div>
      )}

      {/* Question list */}
      {filtered.length === 0 && !loading && (
        <p style={{ color: '#999', fontSize: 14, padding: '12px 0' }}>No questions found.</p>
      )}

      {filtered.map((q) => {
        const dc = difficultyColors[q.difficulty] || { bg: '#F0F0F0', fg: '#555' };
        const isEditing = editingId === q.id;

        return (
          <div
            key={q.id}
            style={{
              background: isEditing ? '#F8FAFF' : 'white',
              borderRadius: 10,
              border: isEditing ? '1.5px solid #C5D5F6' : '1.5px solid #E5E5E5',
              padding: 12,
              marginBottom: 8,
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={badgeStyle('#E3F2FD', '#1565C0')}>{q.type}</span>
              <span style={badgeStyle('#F3E5F5', '#7B1FA2')}>{q.topic}</span>
              <span style={badgeStyle(dc.bg, dc.fg)}>{q.difficulty}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  style={btnEdit}
                  onClick={(e) => { e.stopPropagation(); handleEdit(q); }}
                >
                  Edit
                </button>
                <button
                  style={btnDanger}
                  onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Question text */}
            <div style={{
              fontSize: 13, lineHeight: 1.5, color: '#222',
              wordBreak: 'break-word', overflowWrap: 'anywhere',
            }}>
              {truncate(q.question, 80)}
            </div>

            {/* Inline edit form */}
            {isEditing && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #E5E5E5' }}>
                <QuestionForm
                  form={form}
                  onUpdate={updateField}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  saving={saving}
                  error={formError}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --------------- Question Form ---------------

function QuestionForm({
  form,
  onUpdate,
  onSave,
  onCancel,
  saving,
  error,
}: {
  form: FormData;
  onUpdate: (field: keyof FormData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Row: type + topic + difficulty */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Type</label>
          <select style={selectStyle} value={form.type} onChange={(e) => onUpdate('type', e.target.value)}>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Topic</label>
          <select style={selectStyle} value={form.topic} onChange={(e) => onUpdate('topic', e.target.value)}>
            {TOPIC_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Difficulty</label>
          <select style={selectStyle} value={form.difficulty} onChange={(e) => onUpdate('difficulty', e.target.value)}>
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subtopic */}
      <div>
        <label style={labelStyle}>Subtopic</label>
        <input
          style={inputStyle}
          type="text"
          value={form.subtopic}
          onChange={(e) => onUpdate('subtopic', e.target.value)}
          placeholder="e.g. Statics & Equilibrium"
        />
      </div>

      {/* Question */}
      <div>
        <label style={labelStyle}>Question</label>
        <textarea
          style={textareaStyle}
          value={form.question}
          onChange={(e) => onUpdate('question', e.target.value)}
          placeholder="Enter the question text..."
        />
      </div>

      {/* Explanation */}
      <div>
        <label style={labelStyle}>Explanation</label>
        <textarea
          style={textareaStyle}
          value={form.explanation}
          onChange={(e) => onUpdate('explanation', e.target.value)}
          placeholder="Detailed explanation of the answer..."
        />
      </div>

      {/* Interview Insight */}
      <div>
        <label style={labelStyle}>Interview Insight</label>
        <textarea
          style={textareaStyle}
          value={form.interviewInsight}
          onChange={(e) => onUpdate('interviewInsight', e.target.value)}
          placeholder="Why this matters in interviews..."
        />
      </div>

      {/* Real World Connection */}
      <div>
        <label style={labelStyle}>Real World Connection</label>
        <textarea
          style={textareaStyle}
          value={form.realWorldConnection}
          onChange={(e) => onUpdate('realWorldConnection', e.target.value)}
          placeholder="How this applies in real engineering..."
        />
      </div>

      {/* Common Mistake */}
      <div>
        <label style={labelStyle}>Common Mistake</label>
        <textarea
          style={textareaStyle}
          value={form.commonMistake}
          onChange={(e) => onUpdate('commonMistake', e.target.value)}
          placeholder="Common errors people make..."
        />
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>Tags (comma-separated)</label>
        <input
          style={inputStyle}
          type="text"
          value={form.tags}
          onChange={(e) => onUpdate('tags', e.target.value)}
          placeholder="statics, equilibrium, forces"
        />
      </div>

      {/* Type Data JSON */}
      <div>
        <label style={labelStyle}>Type Data (JSON)</label>
        <textarea
          style={{
            ...textareaStyle,
            fontFamily: 'monospace',
            fontSize: 12,
            minHeight: 200,
          }}
          value={form.typeDataJson}
          onChange={(e) => onUpdate('typeDataJson', e.target.value)}
        />
        <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
          Type-specific fields as JSON. Must be a valid JSON object.
        </p>
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: '#C62828', fontSize: 13, margin: 0 }}>{error}</p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={btnPrimary} onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button style={btnSecondary} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
