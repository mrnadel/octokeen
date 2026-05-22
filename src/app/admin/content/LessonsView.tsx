'use client';

import type { Unit, Lesson } from './courseEditorTypes';
import LessonForm from './LessonForm';
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

interface LessonsViewProps {
  unit: Unit;
  editingId: string | null;
  isAdding: boolean;
  saving: boolean;
  readOnly?: boolean;
  onBack: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (data: Record<string, unknown>, id?: string) => void;
  onDelete: (id: string, name: string) => void;
  onSelect: (lesson: Lesson) => void;
}

export default function LessonsView({
  unit,
  editingId,
  isAdding,
  saving,
  readOnly,
  onBack,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onSelect,
}: LessonsViewProps) {
  return (
    <>
      <div style={breadcrumbStyle}>
        <span style={breadcrumbLink} onClick={onBack}>
          Units
        </span>
        <span>&#8250;</span>
        <span style={{ fontWeight: 600, color: '#333' }}>
          {unit.icon} {unit.title}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button style={btnBack} onClick={onBack}>
          <span>&#8592;</span> Back
        </button>
      </div>

      <div style={headerRow}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Lessons</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>
            {unit.lessons.length} lesson
            {unit.lessons.length !== 1 ? 's' : ''} in {unit.title}
          </p>
        </div>
        {!isAdding && !readOnly && (
          <button style={btnPrimary} onClick={onAdd}>
            + Add Lesson
          </button>
        )}
      </div>

      {isAdding && (
        <LessonForm
          saving={saving}
          onSave={(data) => onSave(data)}
          onCancel={onCancelEdit}
        />
      )}

      {unit.lessons.map((lesson) => (
        <div key={lesson.id}>
          {editingId === lesson.id ? (
            <LessonForm
              lesson={lesson}
              saving={saving}
              onSave={(data) => onSave(data, lesson.id)}
              onCancel={onCancelEdit}
            />
          ) : (
            <div
              style={editorCardStyle}
              onClick={() => onSelect(lesson)}
            >
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
                    <span style={{ fontSize: 20 }}>{lesson.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>
                      {lesson.title}
                    </span>
                    <span style={badgeStyle('#F0F0F0', '#555')}>
                      {lesson.questions.length} question
                      {lesson.questions.length !== 1 ? 's' : ''}
                    </span>
                    <span style={badgeStyle('#E8F5E9', '#2E7D32')}>
                      {lesson.xpReward} XP
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: '#888',
                      margin: 0,
                      wordBreak: 'break-word',
                    }}
                  >
                    {lesson.description}
                  </p>
                </div>
                {!readOnly && (
                  <div
                    style={actionRow}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      style={btnSecondary}
                      onClick={() => onEdit(lesson.id)}
                    >
                      Edit
                    </button>
                    <button
                      style={btnDanger}
                      onClick={() => onDelete(lesson.id, lesson.title)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {unit.lessons.length === 0 && !isAdding && (
        <p
          style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            padding: 40,
          }}
        >
          No lessons yet. Click &quot;+ Add Lesson&quot; to create one.
        </p>
      )}
    </>
  );
}
