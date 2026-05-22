'use client';

import type { Unit, Lesson } from './courseEditorTypes';
import QuestionForm from './QuestionForm';
import { truncate } from './courseEditorUtils';
import {
  actionRow,
  badgeStyle,
  breadcrumbLink,
  breadcrumbStyle,
  btnBack,
  btnDanger,
  btnPrimary,
  btnSecondary,
  editorCardStyle,
  headerRow,
} from './courseEditorStyles';

const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  'multiple-choice': { bg: '#E3F2FD', fg: '#1565C0' },
  'true-false': { bg: '#FFF8E1', fg: '#F57F17' },
  'fill-blank': { bg: '#F3E5F5', fg: '#7B1FA2' },
  'teaching': { bg: '#E8F5E9', fg: '#2E7D32' },
  'sort-buckets': { bg: '#FFF3E0', fg: '#E65100' },
  'match-pairs': { bg: '#E0F7FA', fg: '#00695C' },
  'order-steps': { bg: '#FCE4EC', fg: '#AD1457' },
  'multi-select': { bg: '#E8EAF6', fg: '#283593' },
  'slider-estimate': { bg: '#F1F8E9', fg: '#33691E' },
  'scenario': { bg: '#EFEBE9', fg: '#4E342E' },
  'category-swipe': { bg: '#FDE0DC', fg: '#C62828' },
  'rank-order': { bg: '#E0F2F1', fg: '#004D40' },
  'pick-the-best': { bg: '#F3E5F5', fg: '#6A1B9A' },
  'image-tap': { bg: '#E3F2FD', fg: '#0D47A1' },
};

interface QuestionsViewProps {
  unit: Unit;
  lesson: Lesson;
  editingId: string | null;
  isAdding: boolean;
  saving: boolean;
  readOnly?: boolean;
  onBack: () => void;
  onBackToUnits: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (data: Record<string, unknown>, id?: string) => void;
  onDelete: (id: string, name: string) => void;
}

export default function QuestionsView({
  unit,
  lesson,
  editingId,
  isAdding,
  saving,
  readOnly,
  onBack,
  onBackToUnits,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: QuestionsViewProps) {
  return (
    <>
      <div style={breadcrumbStyle}>
        <span style={breadcrumbLink} onClick={onBackToUnits}>
          Units
        </span>
        <span>&#8250;</span>
        <span style={breadcrumbLink} onClick={onBack}>
          {unit.icon} {unit.title}
        </span>
        <span>&#8250;</span>
        <span style={{ fontWeight: 600, color: '#333' }}>
          {lesson.icon} {lesson.title}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button style={btnBack} onClick={onBack}>
          <span>&#8592;</span> Back
        </button>
      </div>

      <div style={headerRow}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
            Questions
          </h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>
            {lesson.questions.length} question
            {lesson.questions.length !== 1 ? 's' : ''} in {lesson.title}
          </p>
        </div>
        {!isAdding && !readOnly && (
          <button style={btnPrimary} onClick={onAdd}>
            + Add Question
          </button>
        )}
      </div>

      {isAdding && (
        <QuestionForm
          saving={saving}
          onSave={(data) => onSave(data)}
          onCancel={onCancelEdit}
        />
      )}

      {lesson.questions.map((q) => {
        const tc = TYPE_COLORS[q.type] || { bg: '#F0F0F0', fg: '#555' };
        return (
          <div key={q.id}>
            {editingId === q.id ? (
              <QuestionForm
                question={q}
                saving={saving}
                onSave={(data) => onSave(data, q.id)}
                onCancel={onCancelEdit}
              />
            ) : (
              <div style={{ ...editorCardStyle, cursor: 'default' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={badgeStyle(tc.bg, tc.fg)}>
                        {q.type}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        margin: '0 0 4px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {truncate(q.question, 150)}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: '#888',
                        margin: 0,
                        wordBreak: 'break-word',
                      }}
                    >
                      {truncate(q.explanation, 100)}
                    </p>
                  </div>
                  {!readOnly && (
                    <div style={actionRow}>
                      <button
                        style={btnSecondary}
                        onClick={() => onEdit(q.id)}
                      >
                        Edit
                      </button>
                      <button
                        style={btnDanger}
                        onClick={() =>
                          onDelete(q.id, truncate(q.question, 40))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {lesson.questions.length === 0 && !isAdding && (
        <p
          style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            padding: 40,
          }}
        >
          No questions yet. Click &quot;+ Add Question&quot; to create
          one.
        </p>
      )}
    </>
  );
}
