'use client';

import type { Unit } from './courseEditorTypes';
import UnitForm from './UnitForm';
import {
  actionRow,
  badgeStyle,
  btnDanger,
  btnPrimary,
  btnSecondary,
  colorSwatchStyle,
  editorCardStyle,
  headerRow,
} from './courseEditorStyles';

interface UnitsViewProps {
  units: Unit[];
  editingId: string | null;
  isAdding: boolean;
  saving: boolean;
  readOnly?: boolean;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (data: Record<string, unknown>, id?: string) => void;
  onDelete: (id: string, name: string) => void;
  onSelect: (unit: Unit) => void;
}

export default function UnitsView({
  units,
  editingId,
  isAdding,
  saving,
  readOnly,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onSelect,
}: UnitsViewProps) {
  return (
    <>
      <div style={headerRow}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
            Course Units
          </h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>
            {units.length} units
          </p>
        </div>
        {!isAdding && !readOnly && (
          <button style={btnPrimary} onClick={onAdd}>
            + Add Unit
          </button>
        )}
      </div>

      {isAdding && (
        <UnitForm
          saving={saving}
          onSave={(data) => onSave(data)}
          onCancel={onCancelEdit}
        />
      )}

      {units.map((unit) => (
        <div key={unit.id}>
          {editingId === unit.id ? (
            <UnitForm
              unit={unit}
              saving={saving}
              onSave={(data) => onSave(data, unit.id)}
              onCancel={onCancelEdit}
            />
          ) : (
            <div style={editorCardStyle} onClick={() => onSelect(unit)}>
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
                    <span style={{ fontSize: 20 }}>{unit.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>
                      {unit.title}
                    </span>
                    <div style={colorSwatchStyle(unit.color)} />
                    <span style={badgeStyle('#F0F0F0', '#555')}>
                      {unit.lessons.length} lesson
                      {unit.lessons.length !== 1 ? 's' : ''}
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
                    {unit.description}
                  </p>
                </div>
                {!readOnly && (
                  <div
                    style={actionRow}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      style={btnSecondary}
                      onClick={() => onEdit(unit.id)}
                    >
                      Edit
                    </button>
                    <button
                      style={btnDanger}
                      onClick={() => onDelete(unit.id, unit.title)}
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

      {units.length === 0 && !isAdding && (
        <p
          style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            padding: 40,
          }}
        >
          No units yet. Click &quot;+ Add Unit&quot; to create one.
        </p>
      )}
    </>
  );
}
