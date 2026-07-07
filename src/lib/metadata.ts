// ============================================================
// Metadata Factories — Octokeen
// Helpers for generating consistent Next.js Metadata objects.
// ============================================================

import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

/**
 * Create metadata for a public app page with OpenGraph and Twitter cards.
 *
 * @param title - Page title (will be appended with " | Octokeen")
 * @param description - Page description for SEO and social cards
 * @param path - URL path (e.g. '/glossary')
 */
export function createAppMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const fullTitle = `${title} | ${APP_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}

/**
 * Create metadata for a private/admin page that should not be indexed.
 *
 * @param title - Page title (will be appended with " | Octokeen")
 */
export function createPrivateMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}

/**
 * Create metadata for a legal page (privacy, terms, etc.) with a canonical URL.
 *
 * @param title - Page title (will be appended with " | Octokeen")
 * @param description - Page description for SEO and social cards
 * @param path - Canonical URL path (e.g. '/privacy')
 */
export function createLegalMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const fullTitle = `${title} | ${APP_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}
