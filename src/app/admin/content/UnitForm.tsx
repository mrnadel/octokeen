'use client';

import { useState } from 'react';
import type { Unit } from './courseEditorTypes';
import {
  btnPrimary,
  btnSecondary,
  colorSwatchStyle,
  formActions,
  formFieldStyle,
  formSectionStyle,
  inputStyle,
  labelStyle,
  textareaStyle,
} from './courseEditorStyles';

interface UnitFormProps {
  unit?: Unit;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function UnitForm({
  unit,
  saving,
  onSave,
  onCancel,
}: UnitFormProps) {
  const [title, setTitle] = useState(unit?.title ?? '');
  const [description, setDescription] = useState(unit?.description ?? '');
  const [color, setColor] = useState(unit?.color ?? '#3B82F6');
  const [icon, setIcon] = useState(unit?.icon ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      color: color.trim(),
      icon: icon.trim(),
    });
  }

  return (
    <form style={formSectionStyle} onSubmit={handleSubmit}>
      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>
        {unit ? 'Edit Unit' : 'Add New Unit'}
      </h3>

      <div style={formFieldStyle}>
        <label style={labelStyle}>Title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Fundamentals of Statics"
        />
      </div>

      <div style={formFieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={textareaStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Unit description..."
        />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ ...formFieldStyle, flex: '1 1 180px' }}>
          <label style={labelStyle}>Color (hex)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#3B82F6"
            />
            <div style={colorSwatchStyle(color)} />
          </div>
        </div>

        <div style={{ ...formFieldStyle, flex: '1 1 120px' }}>
          <label style={labelStyle}>Icon (emoji)</label>
          <input
            style={inputStyle}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g., &#x2699;&#xFE0F;"
          />
        </div>
      </div>

      <div style={formActions}>
        <button type="submit" style={btnPrimary} disabled={saving}>
          {saving ? 'Saving...' : unit ? 'Update Unit' : 'Create Unit'}
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
