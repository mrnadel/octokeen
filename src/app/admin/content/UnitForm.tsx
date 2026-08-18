'use client';

import { useState } from 'react';
import type { Unit } from './courseEditorTypes';
import AdminFormShell from './AdminFormShell';
import AdminFormField from './AdminFormField';
import { colorSwatchStyle, inputStyle, textareaStyle } from './courseEditorStyles';

const DEFAULT_COLOR = '#3B82F6';
const FIELD_ROW: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap' };

interface UnitFormProps {
  unit?: Unit;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function UnitForm({ unit, saving, onSave, onCancel }: UnitFormProps) {
  const [title, setTitle] = useState(unit?.title ?? '');
  const [description, setDescription] = useState(unit?.description ?? '');
  const [color, setColor] = useState(unit?.color ?? DEFAULT_COLOR);
  const [icon, setIcon] = useState(unit?.icon ?? '');

  function handleSave() {
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
    <AdminFormShell
      heading={unit ? 'Edit Unit' : 'Add New Unit'}
      submitLabel={unit ? 'Update Unit' : 'Create Unit'}
      saving={saving}
      onSubmit={handleSave}
      onCancel={onCancel}
    >
      <AdminFormField label="Title">
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Fundamentals of Statics"
        />
      </AdminFormField>

      <AdminFormField label="Description">
        <textarea
          style={textareaStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Unit description..."
        />
      </AdminFormField>

      <div style={FIELD_ROW}>
        <AdminFormField label="Color (hex)" style={{ flex: '1 1 180px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder={DEFAULT_COLOR}
            />
            <div style={colorSwatchStyle(color)} />
          </div>
        </AdminFormField>

        <AdminFormField label="Icon (emoji)" style={{ flex: '1 1 120px' }}>
          <input
            style={inputStyle}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g., &#x2699;&#xFE0F;"
          />
        </AdminFormField>
      </div>
    </AdminFormShell>
  );
}
