'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useIsTwa } from '@/lib/is-twa';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable Google AdSense ad slot.
 * Returns null for Pro users and inside the Android TWA (AdSense tags are licensed
 * for web pages, not apps — see src/lib/twa-constants.ts). Handles push() dedup.
 */
export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className,
  style,
}: AdUnitProps) {
  const { isProUser } = useSubscription();
  const isTwa = useIsTwa();
  const pushed = useRef(false);
  const hideAd = isProUser || isTwa;

  useEffect(() => {
    if (pushed.current || hideAd) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or blocked
    }
  }, [hideAd]);

  if (hideAd) return null;

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-3282358085183080"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
