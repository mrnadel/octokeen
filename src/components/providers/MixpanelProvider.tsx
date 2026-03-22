'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { initMixpanel, identifyUser, trackPageView, resetUser } from '@/lib/mixpanel';

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

  return <>{children}</>;
}
