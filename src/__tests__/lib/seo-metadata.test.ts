import { describe, expect, it } from 'vitest';

import { APP_NAME, APP_URL } from '@/lib/constants';
import {
  SEO_DESCRIPTION_MAX_LENGTH,
  SEO_ELLIPSIS,
  SEO_TITLE_MAX_LENGTH,
} from '@/lib/seo/constants';
import {
  buildMetadata,
  buildPageTitle,
  findMetadataLengthIssues,
  SEO_TITLE_SEPARATOR,
} from '@/lib/seo/metadata';
import { truncateAtWordBoundary } from '@/lib/seo/text';
import { absoluteUrl, joinPath, normalizePath } from '@/lib/seo/urls';

const BASE = {
  title: 'Budgeting Basics',
  description: 'Learn where your money goes each month and how to plan the next one.',
  path: '/learn/personal-finance/what-is-money',
};

function titleOf(path: string, title: string): string {
  const metadata = buildMetadata({ ...BASE, title, path });
  const resolved = metadata.title;
  if (!resolved || typeof resolved !== 'object' || !('absolute' in resolved)) {
    throw new Error('expected an absolute title');
  }
  return resolved.absolute ?? '';
}

describe('normalizePath', () => {
  it('keeps the root path', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('adds a leading slash and removes the trailing one', () => {
    expect(normalizePath('pricing/')).toBe('/pricing');
  });

  it('collapses duplicate separators', () => {
    expect(joinPath('learn', '/psychology/', 'biases')).toBe('/learn/psychology/biases');
  });
});

describe('absoluteUrl', () => {
  it('returns the bare origin for the root path', () => {
    expect(absoluteUrl('/')).toBe(APP_URL);
  });

  it('never emits a trailing slash', () => {
    expect(absoluteUrl('/pricing/')).toBe(`${APP_URL}/pricing`);
  });
});

describe('truncateAtWordBoundary', () => {
  it('leaves text that already fits', () => {
    expect(truncateAtWordBoundary('Short title', 60)).toBe('Short title');
  });

  it('cuts at a word boundary, never mid-word', () => {
    const result = truncateAtWordBoundary('Compound interest explained simply', 20);
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result.endsWith(SEO_ELLIPSIS)).toBe(true);
    expect(result).toBe(`Compound interest${SEO_ELLIPSIS}`);
  });

  it('drops trailing punctuation before the ellipsis', () => {
    expect(truncateAtWordBoundary('Budgeting, investing, taxes', 15)).toBe(`Budgeting${SEO_ELLIPSIS}`);
  });

  it('hard-cuts a single word longer than the budget', () => {
    const result = truncateAtWordBoundary('Supercalifragilisticexpialidocious', 12);
    expect(result.length).toBe(12);
  });

  it('collapses whitespace before measuring', () => {
    expect(truncateAtWordBoundary('  a   b  ', 60)).toBe('a b');
  });
});

describe('buildPageTitle', () => {
  it('appends the brand suffix', () => {
    expect(buildPageTitle('Budgeting Basics', true)).toBe(`Budgeting Basics${SEO_TITLE_SEPARATOR}${APP_NAME}`);
  });

  it('keeps the whole rendered title inside the limit', () => {
    const long = 'Everything you ever wanted to know about compound interest and inflation';
    const result = buildPageTitle(long, true);
    expect(result.length).toBeLessThanOrEqual(SEO_TITLE_MAX_LENGTH);
    expect(result.endsWith(`${SEO_TITLE_SEPARATOR}${APP_NAME}`)).toBe(true);
  });

  it('omits the suffix when asked', () => {
    expect(buildPageTitle('Budgeting Basics', false)).toBe('Budgeting Basics');
  });
});

describe('findMetadataLengthIssues', () => {
  it('reports nothing when everything fits', () => {
    expect(findMetadataLengthIssues(BASE)).toEqual([]);
  });

  it('accounts for the brand suffix in the title budget', () => {
    const title = 'A'.repeat(SEO_TITLE_MAX_LENGTH - 5);
    const issues = findMetadataLengthIssues({ ...BASE, title });
    expect(issues.map(issue => issue.field)).toEqual(['title']);
  });

  it('reports an over-length description', () => {
    const issues = findMetadataLengthIssues({ ...BASE, description: 'word '.repeat(60) });
    expect(issues.map(issue => issue.field)).toEqual(['description']);
    expect(issues[0].max).toBe(SEO_DESCRIPTION_MAX_LENGTH);
  });
});

describe('buildMetadata', () => {
  it('sets an absolute canonical URL', () => {
    const metadata = buildMetadata(BASE);
    expect(metadata.alternates?.canonical).toBe(`${APP_URL}${BASE.path}`);
  });

  it('uses an absolute title so the root template does not double up the brand', () => {
    expect(titleOf(BASE.path, 'Budgeting Basics')).toBe(`Budgeting Basics${SEO_TITLE_SEPARATOR}${APP_NAME}`);
  });

  it('shortens an over-length description at a word boundary', () => {
    const description = 'Compound interest is the reason small deposits grow. '.repeat(6);
    const metadata = buildMetadata({ ...BASE, description });
    expect(metadata.description!.length).toBeLessThanOrEqual(SEO_DESCRIPTION_MAX_LENGTH);
    expect(metadata.description!.endsWith(SEO_ELLIPSIS)).toBe(true);

    // The kept text must end on a whole word: the original continues with a
    // space right where the ellipsis starts.
    const body = metadata.description!.slice(0, -SEO_ELLIPSIS.length);
    expect(description.trim().startsWith(`${body} `)).toBe(true);
  });

  it('mirrors title and description into OpenGraph and Twitter', () => {
    const metadata = buildMetadata(BASE);
    expect(metadata.openGraph?.title).toBe(titleOf(BASE.path, BASE.title));
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.twitter?.description).toBe(metadata.description);
    expect(JSON.stringify(metadata.twitter)).toContain('"card":"summary_large_image"');
  });

  it('resolves the OpenGraph image to an absolute URL', () => {
    const metadata = buildMetadata(BASE);
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(`${APP_URL}/og-image.png`);
  });

  it('leaves robots undefined unless noIndex is set', () => {
    expect(buildMetadata(BASE).robots).toBeUndefined();
    expect(buildMetadata({ ...BASE, noIndex: true }).robots).toEqual({ index: false, follow: true });
  });
});
