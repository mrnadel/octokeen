'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { initMixpanel, identifyUser, trackPageView, resetUser, analytics } from '@/lib/mixpanel';
import { useStore } from '@/store/useStore';

const CONSENT_KEY = 'mechready-cookie-consent';

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Initialize Mixpanel when consent is given
  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      initMixpanel();
    }

    function handleConsent(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === 'accepted') {
        initMixpanel();
      }
    }

    window.addEventListener('cookie-consent', handleConsent);
    return () => window.removeEventListener('cookie-consent', handleConsent);
  }, []);

  // Identify user when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      identifyUser(session.user.id ?? session.user.email ?? 'unknown', {
        $email: session.user.email,
        $name: session.user.name,
      });
    } else if (status === 'unauthenticated') {
      resetUser();
    }
  }, [session, status]);

  // Track page views on route change
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Track session_started via Zustand subscribe (avoids modifying every call site)
  useEffect(() => {
    return useStore.subscribe(
      (state) => state.session,
      (current, previous) => {
        if (current && !previous) {
          analytics.sessionStarted(current.type, current.topicId);
        }
      },
    );
  }, []);

  return <>{children}</>;
}
