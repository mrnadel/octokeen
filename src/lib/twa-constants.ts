/**
 * Trusted Web Activity (TWA) constants, shared by the pre-hydration head script and
 * the client-side detector in `is-twa.ts`.
 *
 * The Android app is a Bubblewrap TWA wrapping octokeen.com. Google Play requires
 * Play Billing for in-app digital goods, and AdSense tags are licensed for web pages
 * rather than apps — so the Android build ships without ads or checkout entry points.
 * See android/README.md.
 */

export const TWA_REFERRER_PREFIX = 'android-app://';
export const TWA_STORAGE_KEY = 'octokeen-twa';
export const TWA_ROOT_ATTRIBUTE = 'data-twa';

/**
 * Inline script for the document head. Chrome sets `document.referrer` to
 * `android-app://<package>` only on the launch navigation, so the result is cached in
 * sessionStorage. Runs before hydration so `data-twa` is on <html> in time for the
 * AdSense loader guard that follows it.
 */
export const TWA_DETECT_SCRIPT = `(function(){try{var k='${TWA_STORAGE_KEY}';var t=sessionStorage.getItem(k)==='1'||document.referrer.indexOf('${TWA_REFERRER_PREFIX}')===0;if(t){sessionStorage.setItem(k,'1');document.documentElement.setAttribute('${TWA_ROOT_ATTRIBUTE}','1')}}catch(e){}})()`;

/** True when the document is running inside the Android TWA shell. Browser only. */
export function isTwaDocument(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.hasAttribute(TWA_ROOT_ATTRIBUTE)) return true;

  try {
    if (window.sessionStorage.getItem(TWA_STORAGE_KEY) === '1') return true;
  } catch {
    // sessionStorage unavailable (private mode, blocked cookies) — fall through
  }

  return document.referrer.startsWith(TWA_REFERRER_PREFIX);
}
