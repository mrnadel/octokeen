import { useState, useEffect, useRef } from 'react';
import { useBackgroundParallax } from '@/components/lesson/useBackgroundParallax';

export interface UseLessonBackgroundReturn {
  backgroundHtml: string | null;
  bgTheme: 'dark' | 'light' | null;
  bgRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Loads an animated background for a lesson (HTML + CSS injection),
 * persists animation timing across transitions, and drives parallax
 * via --bg-step on the container element.
 *
 * @param bgKey      - The background key from the lesson data (e.g. 'space-stars'), or undefined
 * @param stepIndex  - Current question index / answered count for parallax
 * @param paused     - Whether to pause animations (e.g. when an overlay is open)
 */
export function useLessonBackground(
  bgKey: string | undefined,
  stepIndex: number,
): UseLessonBackgroundReturn {
  const [backgroundHtml, setBackgroundHtml] = useState<string | null>(null);
  const [backgroundCss, setBackgroundCss] = useState<string | null>(null);
  const [bgTheme, setBgTheme] = useState<'dark' | 'light' | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Load background HTML + CSS from dynamic import
  useEffect(() => {
    if (!bgKey) {
      setBackgroundHtml(null);
      setBackgroundCss(null);
      setBgTheme(null);
      return;
    }
    const loaders: Record<string, () => Promise<{ background: { html: string; css?: string; theme?: 'dark' | 'light' } }>> = {
      'space-stars': () => import('@/data/course/backgrounds/space-stars'),
    };
    const loader = loaders[bgKey];
    if (!loader) {
      console.warn('[useLessonBackground] Unknown background:', bgKey);
      setBackgroundHtml(null); setBackgroundCss(null); setBgTheme(null);
      return;
    }
    let cancelled = false;
    loader().then((mod) => {
      if (!cancelled) {
        setBackgroundHtml(mod.background.html);
        setBackgroundCss(mod.background.css ?? null);
        setBgTheme(mod.background.theme ?? 'dark');
      }
    }).catch((err) => {
      console.warn('[useLessonBackground] Failed to load background:', bgKey, err);
      if (!cancelled) { setBackgroundHtml(null); setBackgroundCss(null); setBgTheme(null); }
    });
    return () => { cancelled = true; };
  }, [bgKey]);

  // Inject background CSS into document.head (bypasses Tailwind purging)
  useEffect(() => {
    if (!backgroundCss) return;
    const style = document.createElement('style');
    style.setAttribute('data-lesson-bg', 'true');
    style.textContent = backgroundCss;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [backgroundCss]);

  // Persist background animation timing across lesson transitions
  useEffect(() => {
    if (!bgKey || !bgRef.current) return;
    const storageKey = `lb-bg-start-${bgKey}`;
    const now = performance.now();
    const stored = sessionStorage.getItem(storageKey);
    const startTime = stored ? parseFloat(stored) : now;
    if (!stored) sessionStorage.setItem(storageKey, String(now));
    const elapsed = now - startTime;
    // Advance all animations to the elapsed time so they continue seamlessly
    const el = bgRef.current;
    requestAnimationFrame(() => {
      el.getAnimations({ subtree: true }).forEach((a) => {
        if (a instanceof CSSAnimation) {
          a.currentTime = elapsed;
        }
      });
    });
  }, [bgKey, backgroundHtml]);

  // Parallax: smoothly animate --bg-step on the container
  useBackgroundParallax(bgRef, stepIndex);

  return { backgroundHtml, bgTheme, bgRef };
}
