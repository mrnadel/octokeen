'use client';

import { useState, useEffect } from 'react';
import {
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
  BASE_XP,
  INCORRECT_ANSWER_XP_RATE,
  SPEED_BONUS,
  CONFIDENCE_BONUS,
  STAR_THRESHOLDS,
  SESSION_SIZE,
  MASTERY_VOLUME_CAP,
  ADAPTIVE_ROLLING_WINDOW,
  ADAPTIVE_STRUGGLING_THRESHOLD,
  ADAPTIVE_CRUISING_THRESHOLD,
  ADAPTIVE_CRUISING_XP_BONUS,
  ADAPTIVE_MIN_ANSWERS,
} from '@/lib/game-config';

// ── Types ──────────────────────────────────────────────────────

interface ConfigRow {
  id: string;
  category: string;
  key: string;
  value: unknown;
  description: string | null;
  minValue: number | null;
  maxValue: number | null;
  isLocked: boolean;
  lastModifiedBy: string | null;
  lastModifiedAt: string | null;
}

// ── Default seed data from game-config.ts ──────────────────────

const DEFAULT_CONFIGS: Omit<ConfigRow, 'id' | 'lastModifiedBy' | 'lastModifiedAt'>[] = [
  // Hearts
  { category: 'hearts', key: 'MAX_HEARTS', value: MAX_HEARTS, description: 'Maximum hearts a user can hold', minValue: 1, maxValue: 20, isLocked: false },
  { category: 'hearts', key: 'HEART_REGEN_INTERVAL_MS', value: HEART_REGEN_INTERVAL_MS, description: 'Milliseconds between each heart regen (4h = 14400000)', minValue: 60000, maxValue: null, isLocked: false },

  // XP
  { category: 'xp', key: 'BASE_XP_BEGINNER', value: BASE_XP.beginner, description: 'Base XP for beginner questions', minValue: 1, maxValue: 200, isLocked: false },
  { category: 'xp', key: 'BASE_XP_INTERMEDIATE', value: BASE_XP.intermediate, description: 'Base XP for intermediate questions', minValue: 1, maxValue: 200, isLocked: false },
  { category: 'xp', key: 'BASE_XP_ADVANCED', value: BASE_XP.advanced, description: 'Base XP for advanced questions', minValue: 1, maxValue: 200, isLocked: false },
  { category: 'xp', key: 'INCORRECT_ANSWER_XP_RATE', value: INCORRECT_ANSWER_XP_RATE, description: 'Fraction of base XP for wrong answers (0.0-1.0)', minValue: 0, maxValue: 1, isLocked: false },
  { category: 'xp', key: 'SPEED_BONUS_FAST_THRESHOLD_S', value: SPEED_BONUS.FAST_THRESHOLD_S, description: 'Seconds threshold for fast speed bonus', minValue: 1, maxValue: 120, isLocked: false },
  { category: 'xp', key: 'SPEED_BONUS_FAST_MULTIPLIER', value: SPEED_BONUS.FAST_MULTIPLIER, description: 'XP multiplier for fast answers', minValue: 1, maxValue: 5, isLocked: false },
  { category: 'xp', key: 'SPEED_BONUS_MEDIUM_THRESHOLD_S', value: SPEED_BONUS.MEDIUM_THRESHOLD_S, description: 'Seconds threshold for medium speed bonus', minValue: 1, maxValue: 120, isLocked: false },
  { category: 'xp', key: 'SPEED_BONUS_MEDIUM_MULTIPLIER', value: SPEED_BONUS.MEDIUM_MULTIPLIER, description: 'XP multiplier for medium-speed answers', minValue: 1, maxValue: 5, isLocked: false },
  { category: 'xp', key: 'CONFIDENCE_BONUS_CORRECT_CONFIDENT', value: CONFIDENCE_BONUS.CORRECT_CONFIDENT, description: 'XP multiplier when confident and correct', minValue: 1, maxValue: 5, isLocked: false },
  { category: 'xp', key: 'CONFIDENCE_BONUS_CORRECT_SURPRISED', value: CONFIDENCE_BONUS.CORRECT_SURPRISED, description: 'XP multiplier when surprised and correct', minValue: 1, maxValue: 5, isLocked: false },

  // Sessions
  { category: 'sessions', key: 'SESSION_SIZE', value: SESSION_SIZE, description: 'Number of questions per session', minValue: 1, maxValue: 50, isLocked: false },
  { category: 'sessions', key: 'STAR_THRESHOLDS_THREE_STARS', value: STAR_THRESHOLDS.THREE_STARS, description: 'Accuracy % required for 3 stars', minValue: 50, maxValue: 100, isLocked: false },
  { category: 'sessions', key: 'STAR_THRESHOLDS_TWO_STARS', value: STAR_THRESHOLDS.TWO_STARS, description: 'Accuracy % required for 2 stars', minValue: 1, maxValue: 99, isLocked: false },

  // Adaptive difficulty
  { category: 'adaptive', key: 'ADAPTIVE_ROLLING_WINDOW', value: ADAPTIVE_ROLLING_WINDOW, description: 'Recent answers considered for rolling accuracy', minValue: 1, maxValue: 20, isLocked: false },
  { category: 'adaptive', key: 'ADAPTIVE_STRUGGLING_THRESHOLD', value: ADAPTIVE_STRUGGLING_THRESHOLD, description: 'Rolling accuracy at or below this triggers struggling mode', minValue: 0, maxValue: 1, isLocked: false },
  { category: 'adaptive', key: 'ADAPTIVE_CRUISING_THRESHOLD', value: ADAPTIVE_CRUISING_THRESHOLD, description: 'Rolling accuracy at or above this triggers cruising mode', minValue: 0, maxValue: 1, isLocked: false },
  { category: 'adaptive', key: 'ADAPTIVE_CRUISING_XP_BONUS', value: ADAPTIVE_CRUISING_XP_BONUS, description: 'XP multiplier bonus per correct answer in cruising mode', minValue: 1, maxValue: 5, isLocked: false },
  { category: 'adaptive', key: 'ADAPTIVE_MIN_ANSWERS', value: ADAPTIVE_MIN_ANSWERS, description: 'Minimum answers before adaptive mode kicks in', minValue: 1, maxValue: 20, isLocked: false },
  { category: 'adaptive', key: 'MASTERY_VOLUME_CAP', value: MASTERY_VOLUME_CAP, description: 'Volume of attempts that caps the mastery formula', minValue: 5, maxValue: 100, isLocked: false },
];

const SECTIONS: { category: string; label: string; color: string }[] = [
  { category: 'hearts', label: 'Hearts', color: 'text-red-600' },
  { category: 'xp', label: 'XP System', color: 'text-amber-600' },
  { category: 'sessions', label: 'Sessions & Stars', color: 'text-blue-600' },
  { category: 'adaptive', label: 'Adaptive Difficulty', color: 'text-emerald-600' },
];

// ── Helpers ────────────────────────────────────────────────────

function mergeWithDefaults(dbRows: ConfigRow[]): ConfigRow[] {
  const dbMap = new Map<string, ConfigRow>();
  for (const row of dbRows) {
    dbMap.set(`${row.category}:${row.key}`, row);
  }

  return DEFAULT_CONFIGS.map((def) => {
    const existing = dbMap.get(`${def.category}:${def.key}`);
    if (existing) return existing;
    return {
      id: `default:${def.category}:${def.key}`,
      lastModifiedBy: null,
      lastModifiedAt: null,
      ...def,
    };
  });
}

function formatValue(v: unknown): string {
  if (typeof v === 'object' && v !== null) return JSON.stringify(v);
  return String(v);
}

// ── Main component ─────────────────────────────────────────────

export default function GameBalanceClient() {
  const [configs, setConfigs] = useState<ConfigRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/game-config')
      .then((r) => r.json())
      .then(({ configs: rows }) => {
        setConfigs(mergeWithDefaults(rows ?? []));
        setLoading(false);
      })
      .catch(() => {
        setConfigs(mergeWithDefaults([]));
        setLoading(false);
      });
  }, []);

  const startEdit = (row: ConfigRow) => {
    setEditingKey(`${row.category}:${row.key}`);
    setEditValue(formatValue(row.value));
    setError(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
    setError(null);
  };

  const saveEdit = async (row: ConfigRow) => {
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(editValue);
    } catch {
      // Treat as plain string if not valid JSON
      const asNum = Number(editValue);
      parsedValue = editValue.trim() !== '' && !isNaN(asNum) ? asNum : editValue;
    }

    setSaving(true);
    setError(null);

    const isDefault = row.id.startsWith('default:');

    try {
      const res = isDefault
        ? await fetch('/api/admin/game-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: row.category,
              key: row.key,
              value: parsedValue,
              description: row.description,
              minValue: row.minValue,
              maxValue: row.maxValue,
              isLocked: row.isLocked,
            }),
          })
        : await fetch(`/api/admin/game-config/${encodeURIComponent(row.key)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: row.category, value: parsedValue }),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? 'Save failed');
        setSaving(false);
        return;
      }

      setConfigs((prev) =>
        prev.map((c) =>
          c.category === row.category && c.key === row.key
            ? { ...c, id: c.id.startsWith('default:') ? `db:${c.category}:${c.key}` : c.id, value: parsedValue, lastModifiedAt: new Date().toISOString() }
            : c
        )
      );
      setEditingKey(null);
      setEditValue('');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Game Balance</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View and override game balance parameters. Defaults are sourced from{' '}
          <code className="text-xs bg-gray-100 px-1 rounded">game-config.ts</code>.
          Saved values are stored in the DB and will override the code defaults once implemented.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map(({ category, label, color }) => {
          const rows = configs.filter((c) => c.category === category);
          return (
            <GameBalanceSection
              key={category}
              label={label}
              color={color}
              rows={rows}
              editingKey={editingKey}
              editValue={editValue}
              saving={saving}
              error={error}
              onStartEdit={startEdit}
              onCancelEdit={cancelEdit}
              onSaveEdit={saveEdit}
              onEditValueChange={setEditValue}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Section component ─────────────────────────────────────────

function GameBalanceSection({
  label,
  color,
  rows,
  editingKey,
  editValue,
  saving,
  error,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange,
}: {
  label: string;
  color: string;
  rows: ConfigRow[];
  editingKey: string | null;
  editValue: string;
  saving: boolean;
  error: string | null;
  onStartEdit: (row: ConfigRow) => void;
  onCancelEdit: () => void;
  onSaveEdit: (row: ConfigRow) => void;
  onEditValueChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${color}`}>{label}</h2>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
              <th className="px-4 py-2 text-left">Key</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left hidden sm:table-cell">Description</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">Range</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowKey = `${row.category}:${row.key}`;
              const isEditing = editingKey === rowKey;
              const isDefault = row.id.startsWith('default:');

              return (
                <tr key={rowKey} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <code className="text-xs font-semibold text-gray-800">{row.key}</code>
                    {isDefault && (
                      <span className="ml-1.5 text-[10px] text-gray-400 italic">default</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top min-w-[120px]">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => onEditValueChange(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-400"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onSaveEdit(row);
                            if (e.key === 'Escape') onCancelEdit();
                          }}
                        />
                        {error && editingKey === rowKey && (
                          <p className="text-xs text-red-500">{error}</p>
                        )}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-gray-700">{formatValue(row.value)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-500 hidden sm:table-cell">
                    {row.description ?? ''}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-400 hidden md:table-cell">
                    {row.minValue != null || row.maxValue != null
                      ? `${row.minValue ?? '...'} – ${row.maxValue ?? '...'}`
                      : ''}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    {row.isLocked ? (
                      <span className="text-xs text-gray-400 italic">locked</span>
                    ) : isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={onCancelEdit}
                          disabled={saving}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => onSaveEdit(row)}
                          disabled={saving}
                          className="text-xs font-semibold text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartEdit(row)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
