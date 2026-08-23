import { describe, it, expect } from 'vitest';

import {
  evaluatePage,
  getIndexDecision,
  isIndexable,
  listIndexableLessons,
  listIndexableUnits,
  manifestMeta,
  robotsFor,
  MAX_WARNINGS,
  MIN_PAGE_WORDS,
  MIN_TEACHING_CARDS,
  type PageQuality,
} from '@/lib/seo/indexable';

/** A page sitting exactly on every threshold. 20 questions buys exactly 1 warning. */
function borderlinePage(overrides: Partial<PageQuality> = {}): PageQuality {
  return {
    courseId: 'test-course',
    sectionIndex: 1,
    unitId: 'test-unit',
    questions: 20,
    pageWords: MIN_PAGE_WORDS,
    teachingCards: MIN_TEACHING_CARDS,
    errors: 0,
    warnings: 1,
    ...overrides,
  };
}

describe('evaluatePage boundaries', () => {
  it('passes a page sitting exactly on every threshold', () => {
    expect(evaluatePage(borderlinePage())).toEqual({ indexable: true, blockers: [] });
  });

  it('fails one word under the prose floor', () => {
    const decision = evaluatePage(borderlinePage({ pageWords: MIN_PAGE_WORDS - 1 }));
    expect(decision.indexable).toBe(false);
    expect(decision.blockers).toEqual(['thin-prose']);
  });

  it('fails one teaching card under the floor', () => {
    const decision = evaluatePage(borderlinePage({ teachingCards: MIN_TEACHING_CARDS - 1 }));
    expect(decision.blockers).toEqual(['too-few-teaching-cards']);
  });

  it('fails one warning over the per-question allowance', () => {
    const decision = evaluatePage(borderlinePage({ questions: 20, warnings: 2 }));
    expect(decision.blockers).toEqual(['qa-warnings']);
  });

  it('lets a larger page carry proportionally more warnings, up to the cap', () => {
    expect(evaluatePage(borderlinePage({ questions: 200, warnings: MAX_WARNINGS })).indexable).toBe(true);
    expect(evaluatePage(borderlinePage({ questions: 200, warnings: MAX_WARNINGS + 1 })).blockers).toEqual(['qa-warnings']);
  });

  it('fails on a single error-severity violation however clean the rest is', () => {
    const decision = evaluatePage(borderlinePage({ errors: 1, warnings: 0 }));
    expect(decision.blockers).toEqual(['qa-errors']);
  });

  it('reports every blocker at once', () => {
    const decision = evaluatePage(borderlinePage({ errors: 2, warnings: 40, pageWords: 10, teachingCards: 0 }));
    expect(decision.blockers).toEqual(['qa-errors', 'qa-warnings', 'thin-prose', 'too-few-teaching-cards']);
  });
});

describe('fail closed on unknown content', () => {
  it('denies a page with no quality record', () => {
    expect(evaluatePage(undefined)).toEqual({ indexable: false, blockers: ['unknown-content'] });
  });

  it('denies unknown courses, sections, units and lessons', () => {
    expect(getIndexDecision({ kind: 'course', courseId: 'not-a-course' }).blockers).toEqual(['unknown-content']);
    expect(getIndexDecision({ kind: 'section', courseId: 'personal-finance', sectionIndex: 999 }).blockers).toEqual(['unknown-content']);
    expect(getIndexDecision({ kind: 'unit', courseId: 'personal-finance', unitId: 'fin-sec1-u999' }).blockers).toEqual(['unknown-content']);
    expect(getIndexDecision({ kind: 'lesson', courseId: 'personal-finance', lessonId: 'fin-sec1-u1-L1' }).blockers).toEqual(['unknown-content']);
  });

  it('denies a unit asked for under the wrong course', () => {
    expect(isIndexable({ kind: 'unit', courseId: 'psychology', unitId: 'fin-sec1-u1' })).toBe(false);
  });
});

describe('the checked-in manifest', () => {
  it('has been generated', () => {
    expect(manifestMeta().contentHash).not.toBe('uninitialised');
    expect(manifestMeta().version).toBe(1);
  });

  it('indexes an audited unit and refuses an unaudited one', () => {
    expect(isIndexable({ kind: 'unit', courseId: 'personal-finance', unitId: 'fin-sec1-u1' })).toBe(true);
    expect(isIndexable({ kind: 'unit', courseId: 'psychology', unitId: 'psy-sec1-u1' })).toBe(false);
  });

  it('refuses an audited but thin unit', () => {
    const decision = getIndexDecision({ kind: 'unit', courseId: 'personal-finance', unitId: 'fin-sec2-u4' });
    expect(decision.indexable).toBe(false);
    expect(decision.blockers).toContain('thin-prose');
  });

  it('indexes a section whose units mostly pass and refuses one where none do', () => {
    expect(isIndexable({ kind: 'section', courseId: 'personal-finance', sectionIndex: 1 })).toBe(true);
    expect(getIndexDecision({ kind: 'section', courseId: 'personal-finance', sectionIndex: 3 }).blockers)
      .toEqual(['no-indexable-children']);
  });

  it('indexes a course with a publishable section and refuses one without', () => {
    expect(isIndexable({ kind: 'course', courseId: 'personal-finance' })).toBe(true);
    expect(getIndexDecision({ kind: 'course', courseId: 'space-astronomy' }).blockers).toEqual(['no-indexable-children']);
  });

  it('refuses a course carrying a course-wide violation', () => {
    expect(getIndexDecision({ kind: 'course', courseId: 'mechanical-engineering' }).blockers)
      .toEqual(['course-wide-violations']);
  });
});

describe('listings and robots', () => {
  it('lists only units that pass their own evaluation', () => {
    const units = listIndexableUnits();
    expect(units.length).toBeGreaterThan(0);
    expect(units.every((u) => evaluatePage(u).indexable)).toBe(true);
    expect(units.map((u) => u.unitId)).toContain('fin-sec1-u1');
  });

  it('lists no lessons: CHECK 3 caps a lesson at 3 teaching cards and the gate needs 6', () => {
    expect(listIndexableLessons()).toEqual([]);
  });

  it('keeps blocked pages crawlable so link equity reaches the pages that passed', () => {
    expect(robotsFor({ kind: 'unit', courseId: 'personal-finance', unitId: 'fin-sec1-u1' })).toEqual({ index: true, follow: true });
    expect(robotsFor({ kind: 'unit', courseId: 'nope', unitId: 'nope' })).toEqual({ index: false, follow: true });
  });
});
