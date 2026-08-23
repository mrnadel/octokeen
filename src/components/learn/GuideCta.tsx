'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCallback } from 'react';

import { analytics } from '@/lib/mixpanel';

export interface GuideCtaProps {
  guideSlug: string;
  professionId: string;
  /** Course hub path, e.g. `/learn/psychology`. */
  coursePath: string;
  courseName: string;
}

/**
 * The conversion step at the foot of every guide.
 *
 * `/try` runs a whole lesson with no signup, so it is the primary target: the
 * reader has already had the answer, and the offer is practice rather than a
 * gate. Both links report into the same anonymous funnel `/try` itself uses.
 */
export function GuideCta({ guideSlug, professionId, coursePath, courseName }: GuideCtaProps) {
  const reportTry = useCallback(() => {
    analytics.funnel({ step: 'guide_cta_clicked', guideSlug, professionId, ctaTarget: 'try' });
  }, [guideSlug, professionId]);

  const reportCourse = useCallback(() => {
    analytics.funnel({ step: 'guide_cta_clicked', guideSlug, professionId, ctaTarget: 'course' });
  }, [guideSlug, professionId]);

  return (
    <div className="mt-5 flex flex-col gap-3">
      <Link
        href="/try"
        onClick={reportTry}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 text-sm font-extrabold text-white shadow-[0_6px_0_var(--color-primary-800)] transition-transform active:translate-y-1.5 active:shadow-none"
      >
        Try a free lesson
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link
        href={coursePath}
        onClick={reportCourse}
        className="text-center text-sm font-bold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
      >
        See what else the {courseName} course covers
      </Link>
    </div>
  );
}
