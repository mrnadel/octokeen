'use client';

import { useState, lazy, Suspense } from 'react';
import { PROFESSIONS } from '@/data/professions';
import { ChevronRight } from 'lucide-react';

const CourseEditor = lazy(() => import('./CourseEditor'));
const PracticeEditor = lazy(() => import('./PracticeEditor'));

export default function ContentPage() {
  const [tab, setTab] = useState<'courses' | 'practice'>('courses');
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">Content Management</h1>
      <p className="text-sm text-gray-500 mb-4">
        {tab === 'courses'
          ? selectedProfession
            ? PROFESSIONS.find(p => p.id === selectedProfession)?.name
            : `${PROFESSIONS.length} courses`
          : 'Practice question bank'}
      </p>

      {/* Tab toggle */}
      <div className="flex gap-0 mb-5">
        <button
          onClick={() => { setTab('courses'); setSelectedProfession(null); }}
          className={`flex-1 py-3 text-sm font-bold border-2 border-gray-200 rounded-l-xl transition-colors ${
            tab === 'courses' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setTab('practice')}
          className={`flex-1 py-3 text-sm font-bold border-2 border-gray-200 border-l-0 rounded-r-xl transition-colors ${
            tab === 'practice' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          Practice Questions
        </button>
      </div>

      {tab === 'practice' && (
        <Suspense fallback={<div className="py-8 text-center text-gray-400 text-sm">Loading editor...</div>}>
          <PracticeEditor />
        </Suspense>
      )}

      {tab === 'courses' && !selectedProfession && (
        <div className="space-y-2">
          {PROFESSIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfession(p.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-colors text-left"
            >
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                <div className="text-xs text-gray-400">
                  {p.unitCount} units, {p.questionCount.toLocaleString()} questions
                  {p.id !== 'mechanical-engineering' && ' (static)'}
                </div>
              </div>
              <div
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: p.color }}
              />
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {tab === 'courses' && selectedProfession && (
        <>
          <button
            onClick={() => setSelectedProfession(null)}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center gap-1"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            All Courses
          </button>
          <Suspense fallback={<div className="py-8 text-center text-gray-400 text-sm">Loading editor...</div>}>
            <CourseEditor
              professionId={selectedProfession}
              readOnly={selectedProfession !== 'mechanical-engineering'}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
