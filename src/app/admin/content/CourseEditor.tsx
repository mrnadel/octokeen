'use client';

import { useEffect, useState, useCallback } from 'react';
import { PROFESSION_ID } from '@/data/professions';
import type { Unit, Lesson, View } from './courseEditorTypes';
import { containerStyle, btnPrimary } from './courseEditorStyles';
import UnitsView from './UnitsView';
import LessonsView from './LessonsView';
import QuestionsView from './QuestionsView';

export default function CourseEditor({
  professionId = PROFESSION_ID.MECHANICAL_ENGINEERING,
  readOnly = false,
}: {
  professionId?: string;
  readOnly?: boolean;
}) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Navigation
  const [view, setView] = useState<View>('units');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // --------------- Data fetching ---------------

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/content/course?profession=${professionId}`);
      if (!res.ok) throw new Error('Failed to fetch course data');
      const data = await res.json();
      const fetchedUnits: Unit[] = data.course;
      setUnits(fetchedUnits);

      // Refresh selected items with latest data
      if (selectedUnit) {
        const updated = fetchedUnits.find((u: Unit) => u.id === selectedUnit.id);
        if (updated) {
          setSelectedUnit(updated);
          if (selectedLesson) {
            const updatedLesson = updated.lessons.find(
              (l: Lesson) => l.id === selectedLesson.id,
            );
            if (updatedLesson) setSelectedLesson(updatedLesson);
            else {
              setSelectedLesson(null);
              setView('lessons');
            }
          }
        } else {
          setSelectedUnit(null);
          setSelectedLesson(null);
          setView('units');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [selectedUnit, selectedLesson, professionId]);

  useEffect(() => {
    setView('units');
    setSelectedUnit(null);
    setSelectedLesson(null);
    setLoading(true);
    fetchData();
  }, [professionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // --------------- API helpers ---------------

  async function apiCall(
    url: string,
    method: string,
    body?: Record<string, unknown>,
  ) {
    setSaving(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }
      setEditingId(null);
      setIsAdding(false);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(
    type: 'units' | 'lessons' | 'course-questions',
    id: string,
    name: string,
  ) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    apiCall(`/api/admin/content/${type}/${id}`, 'DELETE');
  }

  // --------------- Navigation helpers ---------------

  function navigateToUnit(unit: Unit) {
    setSelectedUnit(unit);
    setSelectedLesson(null);
    setView('lessons');
    setEditingId(null);
    setIsAdding(false);
  }

  function navigateToLesson(lesson: Lesson) {
    setSelectedLesson(lesson);
    setView('questions');
    setEditingId(null);
    setIsAdding(false);
  }

  function navigateBack() {
    if (view === 'questions') {
      setSelectedLesson(null);
      setView('lessons');
    } else if (view === 'lessons') {
      setSelectedUnit(null);
      setView('units');
    }
    setEditingId(null);
    setIsAdding(false);
  }

  // --------------- Render ---------------

  if (loading) {
    return (
      <div style={containerStyle}>
        <p style={{ fontSize: 14, color: '#666' }}>Loading course data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#EF4444', fontSize: 14, marginBottom: 12 }}>
          {error}
        </p>
        <button
          style={btnPrimary}
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {view === 'units' && (
        <UnitsView
          units={units}
          editingId={readOnly ? null : editingId}
          isAdding={readOnly ? false : isAdding}
          saving={saving}
          readOnly={readOnly}
          onAdd={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          onEdit={(id) => {
            setEditingId(id);
            setIsAdding(false);
          }}
          onCancelEdit={() => {
            setEditingId(null);
            setIsAdding(false);
          }}
          onSave={(data, id) => {
            if (id) apiCall(`/api/admin/content/units/${id}`, 'PUT', data);
            else apiCall('/api/admin/content/units', 'POST', data);
          }}
          onDelete={(id, name) => handleDelete('units', id, name)}
          onSelect={navigateToUnit}
        />
      )}

      {view === 'lessons' && selectedUnit && (
        <LessonsView
          unit={selectedUnit}
          editingId={readOnly ? null : editingId}
          isAdding={readOnly ? false : isAdding}
          saving={saving}
          readOnly={readOnly}
          onBack={navigateBack}
          onAdd={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          onEdit={(id) => {
            setEditingId(id);
            setIsAdding(false);
          }}
          onCancelEdit={() => {
            setEditingId(null);
            setIsAdding(false);
          }}
          onSave={(data, id) => {
            if (id)
              apiCall(`/api/admin/content/lessons/${id}`, 'PUT', data);
            else
              apiCall('/api/admin/content/lessons', 'POST', {
                ...data,
                unitId: selectedUnit.id,
              });
          }}
          onDelete={(id, name) => handleDelete('lessons', id, name)}
          onSelect={navigateToLesson}
        />
      )}

      {view === 'questions' && selectedUnit && selectedLesson && (
        <QuestionsView
          unit={selectedUnit}
          lesson={selectedLesson}
          editingId={readOnly ? null : editingId}
          isAdding={readOnly ? false : isAdding}
          saving={saving}
          readOnly={readOnly}
          onBack={navigateBack}
          onBackToUnits={() => {
            setSelectedUnit(null);
            setSelectedLesson(null);
            setView('units');
            setEditingId(null);
            setIsAdding(false);
          }}
          onAdd={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          onEdit={(id) => {
            setEditingId(id);
            setIsAdding(false);
          }}
          onCancelEdit={() => {
            setEditingId(null);
            setIsAdding(false);
          }}
          onSave={(data, id) => {
            if (id)
              apiCall(
                `/api/admin/content/course-questions/${id}`,
                'PUT',
                data,
              );
            else
              apiCall('/api/admin/content/course-questions', 'POST', {
                ...data,
                lessonId: selectedLesson.id,
              });
          }}
          onDelete={(id, name) =>
            handleDelete('course-questions', id, name)
          }
        />
      )}
    </div>
  );
}
