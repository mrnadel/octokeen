'use client';

import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    // Check initial state
    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-surface-800 dark:bg-surface-700 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4">
      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
      You&apos;re offline. Changes will sync when you reconnect.
    </div>
  );
}
