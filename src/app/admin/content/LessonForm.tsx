'use client';

import { useState } from 'react';
import type { Lesson } from './courseEditorTypes';
import {
  btnPrimary,
  btnSecondary,
  formActions,
  formFieldStyle,
  formSectionStyle,
  inputStyle,
  labelStyle,
  textareaStyle,
} from './courseEditorStyles';

interface LessonFormProps {
  lesson?: Lesson;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function LessonForm({
  lesson,
  saving,
  onSave,
  onCancel,
}: LessonFormProps) {
  const [title, setTitle] = useState(lesson?.title ?? '');
  const [description, setDescription] = useState(lesson?.description ?? '');
  const [icon, setIcon] = useState(lesson?.icon ?? '');
  const [xpReward, setXpReward] = useState(lesson?.xpReward ?? 10);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <form style={formSectionStyle} onSubmit={handleSubmit}>
      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>
        {lesson ? 'Edit Lesson' : 'Add New Lesson'}
      </h3>

      <div style={formFieldStyle}>
        <label style={labelStyle}>Title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Free Body Diagrams"
        />
      </div>

      <div style={formFieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={textareaStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lesson description..."
        />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ ...formFieldStyle, flex: '1 1 120px' }}>
          <label style={labelStyle}>Icon (emoji)</label>
          <input
            style={inputStyle}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g., &#x1F4D0;"
          />
        </div>

        <div style={{ ...formFieldStyle, flex: '1 1 120px' }}>
          <label style={labelStyle}>XP Reward</label>
          <input
            style={inputStyle}
            type="number"
            min={0}
            value={xpReward}
            onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div style={formActions}>
        <button type="submit" style={btnPrimary} disabled={saving}>
          {saving ? 'Saving...' : lesson ? 'Update Lesson' : 'Create Lesson'}
        </button>
        <button
          type="button"
          style={btnSecondary}
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
