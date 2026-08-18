'use client';

import { useState } from 'react';
import type { Lesson } from './courseEditorTypes';
import AdminFormShell from './AdminFormShell';
import AdminFormField from './AdminFormField';
import { inputStyle, textareaStyle } from './courseEditorStyles';

const DEFAULT_XP_REWARD = 10;
const FIELD_ROW: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap' };
const HALF_FIELD: React.CSSProperties = { flex: '1 1 120px' };

interface LessonFormProps {
  lesson?: Lesson;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function LessonForm({ lesson, saving, onSave, onCancel }: LessonFormProps) {
  const [title, setTitle] = useState(lesson?.title ?? '');
  const [description, setDescription] = useState(lesson?.description ?? '');
  const [icon, setIcon] = useState(lesson?.icon ?? '');
  const [xpReward, setXpReward] = useState(lesson?.xpReward ?? DEFAULT_XP_REWARD);

  function handleSave() {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      icon: icon.trim(),
      xpReward,
    });
  }

  return (
    <AdminFormShell
      heading={lesson ? 'Edit Lesson' : 'Add New Lesson'}
      submitLabel={lesson ? 'Update Lesson' : 'Create Lesson'}
      saving={saving}
      onSubmit={handleSave}
      onCancel={onCancel}
    >
      <AdminFormField label="Title">
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Free Body Diagrams"
        />
      </AdminFormField>

      <AdminFormField label="Description">
        <textarea
          style={textareaStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lesson description..."
        />
      </AdminFormField>

      <div style={FIELD_ROW}>
        <AdminFormField label="Icon (emoji)" style={HALF_FIELD}>
          <input
            style={inputStyle}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g., &#x1F4D0;"
          />
        </AdminFormField>

        <AdminFormField label="XP Reward" style={HALF_FIELD}>
          <input
            style={inputStyle}
            type="number"
            min={0}
            value={xpReward}
            onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
          />
        </AdminFormField>
      </div>
    </AdminFormShell>
  );
}
