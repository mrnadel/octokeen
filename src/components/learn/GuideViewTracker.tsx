'use client';

import { useEffect } from 'react';

import { analytics } from '@/lib/mixpanel';

export interface GuideViewTrackerProps {
  guideSlug: string;
  professionId: string;
}

/**
 * Reports a guide impression into the acquisition funnel. Renders nothing, so
 * the prose around it stays server-rendered; this is the entry point that
 * `guide_cta_clicked` and the `try_*` steps are measured against.
 */
export function GuideViewTracker({ guideSlug, professionId }: GuideViewTrackerProps) {
  useEffect(() => {
    analytics.funnel({ step: 'guide_viewed', guideSlug, professionId });
  }, [guideSlug, professionId]);

  return null;
}
