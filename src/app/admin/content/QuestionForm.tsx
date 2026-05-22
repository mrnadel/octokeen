'use client';

import { useState } from 'react';
import type { CourseQuestion } from './courseEditorTypes';
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  formActions,
  formFieldStyle,
  formSectionStyle,
  inputStyle,
  labelStyle,
  textareaStyle,
} from './courseEditorStyles';

interface QuestionFormProps {
  question?: CourseQuestion;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function QuestionForm({
  question,
  saving,
  onSave,
  onCancel,
}: QuestionFormProps) {
  const [type, setType] = useState<CourseQuestion['type']>(
    question?.type ?? 'multiple-choice',
  );
  const [questionText, setQuestionText] = useState(
    question?.question ?? '',
  );
  const [explanation, setExplanation] = useState(
    question?.explanation ?? '',
  );
  const [hint, setHint] = useState(question?.hint ?? '');

  // Multiple choice
  const [options, setOptions] = useState<string[]>(
    question?.options ?? ['', ''],
  );
  const [correctIndex, setCorrectIndex] = useState<number>(
    question?.correctIndex ?? 0,
  );

  // True/false
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(
    question?.correctAnswer ?? true,
  );

  // Fill blank
  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>(
    question?.acceptedAnswers ?? [''],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!questionText.trim()) {
      alert('Question text is required');
      return;
    }
    if (!explanation.trim()) {
      alert('Explanation is required');
      return;
    }

    const data: Record<string, unknown> = {
      type,
      question: questionText.trim(),
      explanation: explanation.trim(),
    };

    if (hint.trim()) data.hint = hint.trim();

    if (type === 'multiple-choice') {
      const trimmed = options.map((o) => o.trim()).filter(Boolean);
      if (trimmed.length < 2) {
        alert('At least 2 options are required');
        return;
      }
      if (correctIndex >= trimmed.length) {
        alert('Please select a valid correct option');
        return;
      }
      data.options = trimmed;
      data.correctIndex = correctIndex;
    } else if (type === 'true-false') {
      data.correctAnswer = correctAnswer;
    } else if (type === 'fill-blank') {
      const trimmed = acceptedAnswers
        .map((a) => a.trim())
        .filter(Boolean);
      if (trimmed.length === 0) {
        alert('At least one accepted answer is required');
        return;
      }
      data.acceptedAnswers = trimmed;
    }

    onSave(data);
  }

  function addOption() {
    setOptions([...options, '']);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== index);
    setOptions(next);
    if (correctIndex >= next.length) setCorrectIndex(next.length - 1);
  }

  function updateOption(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  }

  function addAcceptedAnswer() {
    setAcceptedAnswers([...acceptedAnswers, '']);
  }

  function removeAcceptedAnswer(index: number) {
    if (acceptedAnswers.length <= 1) return;
    setAcceptedAnswers(acceptedAnswers.filter((_, i) => i !== index));
  }

  function updateAcceptedAnswer(index: number, value: string) {
    const next = [...acceptedAnswers];
    next[index] = value;
    setAcceptedAnswers(next);
  }

  return (
    <form style={formSectionStyle} onSubmit={handleSubmit}>
      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>
        {question ? 'Edit Question' : 'Add New Question'}
      </h3>

      {/* Type selector */}
      <div style={formFieldStyle}>
        <label style={labelStyle}>Question Type</label>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={type}
          onChange={(e) =>
            setType(e.target.value as CourseQuestion['type'])
          }
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True / False</option>
          <option value="fill-blank">Fill in the Blank</option>
          <option value="teaching">Teaching</option>
          <option value="sort-buckets">Sort Buckets</option>
          <option value="match-pairs">Match Pairs</option>
          <option value="order-steps">Order Steps</option>
          <option value="multi-select">Multi Select</option>
          <option value="slider-estimate">Slider Estimate</option>
          <option value="scenario">Scenario</option>
          <option value="category-swipe">Category Swipe</option>
          <option value="rank-order">Rank Order</option>
          <option value="pick-the-best">Pick the Best</option>
          <option value="image-tap">Image Tap</option>
        </select>
      </div>

      {/* Question text */}
      <div style={formFieldStyle}>
        <label style={labelStyle}>Question</label>
        <textarea
          style={textareaStyle}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter the question text..."
        />
      </div>

      {/* Type-specific fields */}
      {type === 'multiple-choice' && (
        <div style={formFieldStyle}>
          <label style={labelStyle}>Options</label>
          {options.map((opt, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: '#666',
                    fontWeight: 600,
                  }}
                >
                  Correct
                </span>
              </label>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  style={{
                    ...btnDanger,
                    padding: '6px 10px',
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                  onClick={() => removeOption(i)}
                  title="Remove option"
                >
                  &#215;
                </button>
              )}
            </div>
          ))}
          <button type="button" style={btnSecondary} onClick={addOption}>
            + Add Option
          </button>
        </div>
      )}

      {type === 'true-false' && (
        <div style={formFieldStyle}>
          <label style={labelStyle}>Correct Answer</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={{
                ...btnSecondary,
                padding: '10px 24px',
                fontSize: 14,
                background: correctAnswer ? '#3B82F6' : 'white',
                color: correctAnswer ? 'white' : '#374151',
                borderColor: correctAnswer ? '#3B82F6' : '#D1D5DB',
              }}
              onClick={() => setCorrectAnswer(true)}
            >
              True
            </button>
            <button
              type="button"
              style={{
                ...btnSecondary,
                padding: '10px 24px',
                fontSize: 14,
                background: !correctAnswer ? '#3B82F6' : 'white',
                color: !correctAnswer ? 'white' : '#374151',
                borderColor: !correctAnswer ? '#3B82F6' : '#D1D5DB',
              }}
              onClick={() => setCorrectAnswer(false)}
            >
              False
            </button>
          </div>
        </div>
      )}

      {type === 'fill-blank' && (
        <div style={formFieldStyle}>
          <label style={labelStyle}>Accepted Answers</label>
          {acceptedAnswers.map((ans, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={ans}
                onChange={(e) => updateAcceptedAnswer(i, e.target.value)}
                placeholder={`Accepted answer ${i + 1}`}
              />
              {acceptedAnswers.length > 1 && (
                <button
                  type="button"
                  style={{
                    ...btnDanger,
                    padding: '6px 10px',
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                  onClick={() => removeAcceptedAnswer(i)}
                  title="Remove answer"
                >
                  &#215;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            style={btnSecondary}
            onClick={addAcceptedAnswer}
          >
            + Add Answer
          </button>
        </div>
      )}

      {/* Explanation */}
      <div style={formFieldStyle}>
        <label style={labelStyle}>Explanation</label>
        <textarea
          style={textareaStyle}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain the correct answer..."
        />
      </div>

      {/* Hint (optional) */}
      <div style={formFieldStyle}>
        <label style={labelStyle}>Hint (optional)</label>
        <input
          style={inputStyle}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Optional hint for the student..."
        />
      </div>

      <div style={formActions}>
        <button type="submit" style={btnPrimary} disabled={saving}>
          {saving
            ? 'Saving...'
            : question
              ? 'Update Question'
              : 'Create Question'}
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
