import Link from 'next/link';

import { ABOUT_PATH, PUBLISHER_NAME } from '@/lib/seo/structured-data';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * `YYYY-MM-DD` to "Month YYYY", read straight off the string.
 *
 * Not `new Date(iso)`: that parses an ISO date as UTC midnight, which renders
 * as the previous month for any date on the 1st when the reader sits west of
 * UTC. The date here is a publishing fact, not an instant, so no timezone
 * should ever touch it.
 */
function formatUpdated(isoDate: string): string {
  const [year, month] = isoDate.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

interface GuideBylineProps {
  readingMinutes: number;
  /** ISO date from the guide's `updated` field. */
  updated: string;
}

const SEPARATOR = <span className="mx-1.5" aria-hidden="true">&middot;</span>;

/**
 * Who published this page and when it last changed.
 *
 * One line, because it is a trust signal rather than a byline block. The
 * publisher is the organization, which is what `/about` names as responsible
 * for the material. No personal byline: no individual has consented to being
 * named on the site, and the page must never invent one. The link carries a
 * reader who wants the detail straight to it.
 */
export function GuideByline({ readingMinutes, updated }: GuideBylineProps) {
  return (
    <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-surface-400">
      {readingMinutes} min read
      {SEPARATOR}
      Published by {PUBLISHER_NAME}
      {SEPARATOR}
      Updated <time dateTime={updated}>{formatUpdated(updated)}</time>
      {SEPARATOR}
      <Link href={ABOUT_PATH} className="underline underline-offset-2 hover:text-primary-600">
        How this is made
      </Link>
    </p>
  );
}
