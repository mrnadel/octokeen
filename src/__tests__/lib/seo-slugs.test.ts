import { describe, expect, it } from 'vitest';

import { fallbackSlug, resolveUniqueSlugs, slugify } from '@/lib/seo/slugs';

describe('slugify', () => {
  it('lowercases and kebab-cases a plain title', () => {
    expect(slugify('How Money Works')).toBe('how-money-works');
  });

  it('expands ampersands into "and"', () => {
    expect(slugify('Psychology & Human Behavior')).toBe('psychology-and-human-behavior');
  });

  it('drops apostrophes instead of splitting the word', () => {
    expect(slugify("Newton's Laws")).toBe('newtons-laws');
    expect(slugify('Newton’s Laws')).toBe('newtons-laws');
  });

  it('strips diacritics', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume');
  });

  it('collapses punctuation and trims separators', () => {
    expect(slugify('  Review: Money Basics!  ')).toBe('review-money-basics');
    expect(slugify('Gross Pay vs. Net Pay')).toBe('gross-pay-vs-net-pay');
  });

  it('normalizes every dash variant to a single hyphen', () => {
    expect(slugify('Risk—Reward')).toBe('risk-reward');
    expect(slugify('Risk–Reward')).toBe('risk-reward');
    expect(slugify('Risk--Reward')).toBe('risk-reward');
  });

  it('expands a plus sign', () => {
    expect(slugify('Stocks + Bonds')).toBe('stocks-plus-bonds');
  });

  it('returns an empty string when nothing is slug-able', () => {
    expect(slugify('✨✨')).toBe('');
  });

  it('is idempotent', () => {
    const once = slugify('Cash, Cards, and Digital Money');
    expect(slugify(once)).toBe(once);
  });
});

describe('fallbackSlug', () => {
  it('derives a slug from the id', () => {
    expect(fallbackSlug('fin-sec1-u2')).toBe('fin-sec1-u2');
  });

  it('never returns an empty string', () => {
    expect(fallbackSlug('***')).toBe('item');
  });
});

describe('resolveUniqueSlugs', () => {
  it('leaves unique titles untouched', () => {
    const slugs = resolveUniqueSlugs([
      { id: 'a', title: 'Budgeting Basics' },
      { id: 'b', title: 'Investing Basics' },
    ]);
    expect(slugs.get('a')).toBe('budgeting-basics');
    expect(slugs.get('b')).toBe('investing-basics');
  });

  it('disambiguates every member of a colliding group, not just one', () => {
    const slugs = resolveUniqueSlugs([
      { id: 'fin-sec3-u1', title: 'Economic Cycles' },
      { id: 'fin-sec18-u4', title: 'Economic Cycles' },
    ]);
    expect(slugs.get('fin-sec3-u1')).toBe('economic-cycles-fin-sec3-u1');
    expect(slugs.get('fin-sec18-u4')).toBe('economic-cycles-fin-sec18-u4');
  });

  it('produces the same slug regardless of input order', () => {
    const items = [
      { id: 'a', title: 'Economic Cycles' },
      { id: 'b', title: 'Economic Cycles' },
      { id: 'c', title: 'Inflation' },
    ];
    const forward = resolveUniqueSlugs(items);
    const reversed = resolveUniqueSlugs([...items].reverse());
    for (const item of items) {
      expect(forward.get(item.id)).toBe(reversed.get(item.id));
    }
  });

  it('falls back to the id when the title has no slug-able characters', () => {
    const slugs = resolveUniqueSlugs([{ id: 'u7-space', title: '🚀' }]);
    expect(slugs.get('u7-space')).toBe('u7-space');
  });

  it('never emits a duplicate slug', () => {
    const slugs = resolveUniqueSlugs([
      { id: 'a', title: 'Same' },
      { id: 'b', title: 'Same' },
      { id: 'c', title: 'Same a' },
    ]);
    const values = [...slugs.values()];
    expect(new Set(values).size).toBe(values.length);
  });
});
