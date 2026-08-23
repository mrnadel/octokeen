'use client';

import { useEffect } from 'react';

import { analytics } from '@/lib/mixpanel';

/** Fires the landing funnel step. Rendering nothing keeps the page server-side. */
export function LandingAnalytics() {
  useEffect(() => {
    analytics.funnel({ step: 'landing_viewed' });
  }, []);

  return null;
}
