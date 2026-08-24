import type { Metadata } from 'next';

import { APP_NAME } from '@/lib/constants';

import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_OG_LOCALE,
  SEO_DESCRIPTION_MAX_LENGTH,
  SEO_TITLE_MAX_LENGTH,
} from './constants';
import { findSeoLengthIssue, normalizeSeoText, reportSeoLengthIssues, truncateAtWordBoundary } from './text';
import type { SeoLengthIssue } from './text';
import { absoluteUrl } from './urls';

/** Separator between a page title and the brand suffix. */
export const SEO_TITLE_SEPARATOR = ' | ';

export interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface BuildMetadataInput {
  /** Page title without the brand suffix. */
  title: string;
  description: string;
  /** Route path, e.g. `/learn/psychology`. Becomes the canonical URL. */
  path: string;
  /** Append " | Octokeen" to the title. Defaults to true. */
  brandSuffix?: boolean;
  image?: SeoImage;
  type?: 'website' | 'article';
  keywords?: string[];
  /** Set for thin or duplicate pages that should stay out of the index. */
  noIndex?: boolean;
}

const DEFAULT_IMAGE: SeoImage = {
  url: DEFAULT_OG_IMAGE_PATH,
  width: DEFAULT_OG_IMAGE_WIDTH,
  height: DEFAULT_OG_IMAGE_HEIGHT,
  alt: `${APP_NAME} social card`,
};

/**
 * Builds the final `<title>`: brand suffix first, then whatever budget is left
 * goes to the page title. The suffix is dropped rather than the page title
 * when the budget cannot fit both.
 */
export function buildPageTitle(title: string, brandSuffix: boolean): string {
  const clean = normalizeSeoText(title);
  if (!brandSuffix) return truncateAtWordBoundary(clean, SEO_TITLE_MAX_LENGTH);

  const suffix = `${SEO_TITLE_SEPARATOR}${APP_NAME}`;
  const budget = SEO_TITLE_MAX_LENGTH - suffix.length;
  if (budget < 10) return truncateAtWordBoundary(clean, SEO_TITLE_MAX_LENGTH);

  return `${truncateAtWordBoundary(clean, budget)}${suffix}`;
}

/** Every over-length field in the input, for tests and authoring tools. */
export function findMetadataLengthIssues(input: BuildMetadataInput): SeoLengthIssue[] {
  const brandSuffix = input.brandSuffix ?? true;
  const titleBudget = brandSuffix
    ? SEO_TITLE_MAX_LENGTH - `${SEO_TITLE_SEPARATOR}${APP_NAME}`.length
    : SEO_TITLE_MAX_LENGTH;

  return [
    findSeoLengthIssue('title', input.title, titleBudget),
    findSeoLengthIssue('description', input.description, SEO_DESCRIPTION_MAX_LENGTH),
  ].filter((issue): issue is SeoLengthIssue => issue !== null);
}

function toOgImage(image: SeoImage): NonNullable<Metadata['openGraph']>['images'] {
  return [{ url: absoluteUrl(image.url), width: image.width, height: image.height, alt: image.alt }];
}

/**
 * Produces a Next.js `Metadata` object with a canonical URL, OpenGraph and a
 * summary_large_image Twitter card. Over-length copy is reported through
 * `reportSeoLengthIssues` and then shortened at a word boundary, so it never
 * ships a half word.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const { path, keywords, noIndex = false, type = 'website' } = input;
  const brandSuffix = input.brandSuffix ?? true;
  const image = input.image ?? DEFAULT_IMAGE;

  reportSeoLengthIssues(findMetadataLengthIssues(input), path);

  const title = buildPageTitle(input.title, brandSuffix);
  const description = truncateAtWordBoundary(input.description, SEO_DESCRIPTION_MAX_LENGTH);
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      type,
      locale: DEFAULT_OG_LOCALE,
      images: toOgImage(image),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(image.url)],
    },
  };
}

export interface PrivateMetadataInput {
  /** Page title without the brand suffix. */
  title: string;
  /** Route path, e.g. `/settings`. Becomes the canonical URL. */
  path: string;
  /** Optional; a noindex page still shows a description in a browser preview. */
  description?: string;
}

/**
 * Metadata for a signed-in or admin page. It still needs a self-referencing
 * canonical: without one the root layout's site-wide `canonical: APP_URL` is
 * inherited and the page canonicalizes to the homepage. No social card, since
 * these pages are never shared.
 */
export function buildPrivateMetadata(input: PrivateMetadataInput): Metadata {
  return {
    title: { absolute: buildPageTitle(input.title, true) },
    description: input.description,
    alternates: { canonical: absoluteUrl(input.path) },
    robots: { index: false, follow: false },
  };
}
