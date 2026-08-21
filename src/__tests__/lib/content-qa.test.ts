import { describe, it, expect } from 'vitest';

import { runContentQA, type CourseInput } from '@/lib/content-qa';
import type { Unit, CourseQuestion } from '@/data/course/types';

// ─── Fixtures ───────────────────────────────────────────────

function buildCourse(questions: CourseQuestion[]): CourseInput[] {
  const unit: Unit = {
    id: 'u1',
    title: 'Unit One',
    description: 'Fixture unit',
    color: '#000000',
    icon: 'x',
    lessons: [
      {
        id: 'u1-L1',
        title: 'Lesson One',
        description: 'Fixture lesson',
        icon: 'x',
        xpReward: 15,
        questions,
      },
    ],
  } as Unit;

  return [{ id: 'fixture', name: 'Fixture Course', units: [unit] }];
}

function multipleChoice(id: string, options: string[], correctIndex: number): CourseQuestion {
  return {
    id,
    type: 'multiple-choice',
    question: 'Which option is right?',
    options,
    correctIndex,
    explanation: 'Because it is.',
  } as CourseQuestion;
}

function trueFalse(id: string, correctAnswer: boolean): CourseQuestion {
  return {
    id,
    type: 'true-false',
    question: 'A clear statement.',
    correctAnswer,
    explanation: 'Because it is.',
  } as CourseQuestion;
}

const check = (violations: ReturnType<typeof runContentQA>, name: string) =>
  violations.filter(v => v.check === name);

// ─── CHECK 2: correct option length ─────────────────────────

describe('CHECK 2 — correct option noticeably longer than distractors', () => {
  it('flags a correct option that leads its longest distractor by more than 4 words', () => {
    const violations = runContentQA(buildCourse([
      multipleChoice(
        'q1',
        [
          'Gold backing',
          'Paper value',
          'The government backs it and people broadly agree to accept it as payment',
          'Metal content',
        ],
        2,
      ),
    ]));

    expect(check(violations, 'CHECK 2')).toHaveLength(1);
    expect(check(violations, 'CHECK 2')[0].questionId).toBe('q1');
  });

  it('passes options of roughly equal length', () => {
    const violations = runContentQA(buildCourse([
      multipleChoice('q1', ['Gold backing', 'Paper value', 'Government backing', 'Metal content'], 2),
    ]));

    expect(check(violations, 'CHECK 2')).toHaveLength(0);
  });

  it('allows a lead of exactly the permitted margin', () => {
    // correct = 6 words, longest distractor = 2 words → lead of 4, at the limit
    const violations = runContentQA(buildCourse([
      multipleChoice('q1', ['Gold backing', 'Paper value', 'People agree to accept it here', 'Metal content'], 2),
    ]));

    expect(check(violations, 'CHECK 2')).toHaveLength(0);
  });

  it('does not depend on which index holds the correct answer', () => {
    const long = 'The government backs it and people broadly agree to accept it as payment';
    const atZero = runContentQA(buildCourse([
      multipleChoice('q1', [long, 'Paper value', 'Gold backing', 'Metal content'], 0),
    ]));
    const atThree = runContentQA(buildCourse([
      multipleChoice('q1', ['Paper value', 'Gold backing', 'Metal content', long], 3),
    ]));

    expect(check(atZero, 'CHECK 2')).toHaveLength(1);
    expect(check(atThree, 'CHECK 2')).toHaveLength(1);
  });
});

// ─── CHECK 15: true/false skew ──────────────────────────────

describe('CHECK 15 — true/false answers skewed to one value', () => {
  it('flags a course where nearly every true/false answers true', () => {
    const questions = Array.from({ length: 10 }, (_, i) => trueFalse(`tf${i}`, i < 9));
    const violations = runContentQA(buildCourse(questions));

    expect(check(violations, 'CHECK 15')).toHaveLength(1);
    expect(check(violations, 'CHECK 15')[0].message).toContain('true');
  });

  it('flags skew toward false as well', () => {
    const questions = Array.from({ length: 10 }, (_, i) => trueFalse(`tf${i}`, i < 1));
    const violations = runContentQA(buildCourse(questions));

    expect(check(violations, 'CHECK 15')[0].message).toContain('false');
  });

  it('passes a balanced split', () => {
    const questions = Array.from({ length: 10 }, (_, i) => trueFalse(`tf${i}`, i % 2 === 0));
    const violations = runContentQA(buildCourse(questions));

    expect(check(violations, 'CHECK 15')).toHaveLength(0);
  });

  it('stays silent when a course has no true/false questions', () => {
    const violations = runContentQA(buildCourse([
      multipleChoice('q1', ['One', 'Two', 'Three', 'Four'], 1),
    ]));

    expect(check(violations, 'CHECK 15')).toHaveLength(0);
  });
});

function teaching(id: string, question: string, explanation: string, hint?: string): CourseQuestion {
  return { id, type: 'teaching', question, explanation, hint } as CourseQuestion;
}

// ─── CHECK 16: teaching card title and hint ─────────────────

describe('CHECK 16 — teaching card title and hint length', () => {
  it('flags a title of 8 words or more', () => {
    const violations = runContentQA(buildCourse([
      teaching('t1', 'Why crypto is optional and not required for anyone', 'Short. Enough.'),
    ]));

    expect(check(violations, 'CHECK 16')).toHaveLength(1);
  });

  it('flags a multi-sentence hint', () => {
    const violations = runContentQA(buildCourse([
      teaching('t1', 'Crypto is optional', 'Short. Enough.', 'Try this now. Then check your balance.'),
    ]));

    expect(check(violations, 'CHECK 16')[0].message).toContain('hint has 2 sentences');
  });

  it('passes a short title with a one-sentence hint', () => {
    const violations = runContentQA(buildCourse([
      teaching('t1', 'Crypto is optional', 'Short. Enough.', 'Try this now: check your balance.'),
    ]));

    expect(check(violations, 'CHECK 16')).toHaveLength(0);
  });
});

// ─── CHECK 17: distractor explanations ──────────────────────

describe('CHECK 17 — distractor explanations must be distinct and specific', () => {
  const withReasons = (reasons: Record<number, string>): CourseQuestion => ({
    ...multipleChoice('q1', ['One', 'Two', 'Three', 'Four'], 1),
    distractorExplanations: reasons,
  } as CourseQuestion);

  it('flags identical reasons across distractors', () => {
    const violations = runContentQA(buildCourse([
      withReasons({ 0: 'Depends on priorities.', 2: 'Depends on priorities.', 3: 'Depends on priorities.' }),
    ]));

    expect(check(violations, 'CHECK 17').some(v => v.message.includes('collapse to 1'))).toBe(true);
  });

  it('flags the quote-and-restate generator template', () => {
    const violations = runContentQA(buildCourse([
      withReasons({
        0: '"Earning more money at work" is wrong because you cannot improve what you do not measure.',
        2: 'A console is entertainment, so you can go without it.',
        3: 'Rent is due whether or not you budget for it.',
      }),
    ]));

    expect(check(violations, 'CHECK 17').some(v => v.message.includes('template'))).toBe(true);
  });

  it('flags the blind numeric template', () => {
    const violations = runContentQA(buildCourse([
      withReasons({
        0: 'This amount (80) is too low, the correct calculation gives 292.',
        2: 'That figure counts only the weekday trips.',
        3: 'That total double-counts the subscriptions.',
      }),
    ]));

    expect(check(violations, 'CHECK 17').some(v => v.message.includes('template'))).toBe(true);
  });

  it('passes distinct, specific reasons', () => {
    const violations = runContentQA(buildCourse([
      withReasons({
        0: 'A console is entertainment, so you can go without it.',
        2: 'Rent is due whether or not you budget for it.',
        3: 'Groceries are a need, but the imported cheese is not.',
      }),
    ]));

    expect(check(violations, 'CHECK 17')).toHaveLength(0);
  });
});
