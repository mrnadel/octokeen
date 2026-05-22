'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function describeElement(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const classes = el.className && typeof el.className === 'string'
    ? '.' + el.className.split(/\s+/).filter(Boolean).slice(0, 3).join('.')
    : '';
  const text = el.textContent?.trim().slice(0, 50) || '';
  const role = el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : '';
  const ariaLabel = el.getAttribute('aria-label') ? `[aria-label="${el.getAttribute('aria-label')}"]` : '';
  return `${tag}${id}${classes}${role}${ariaLabel}${text ? ` "${text}"` : ''}`;
}

function getSelector(el: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current !== document.body && parts.length < 4) {
    const tag = current.tagName.toLowerCase();
    if (current.id) { parts.unshift(`${tag}#${current.id}`); break; }
    const cls = current.className && typeof current.className === 'string'
      ? current.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.')
      : '';
    parts.unshift(cls ? `${tag}.${cls}` : tag);
    current = current.parentElement;
  }
  return parts.join(' > ');
}

const STYLES = {
  click:      'color:#3B82F6;font-weight:bold',
  navigate:   'color:#8B5CF6;font-weight:bold',
  input:      'color:#F59E0B;font-weight:bold',
  scroll:     'color:#6B7280;font-weight:bold',
  keydown:    'color:#10B981;font-weight:bold',
  focus:      'color:#06B6D4;font-weight:bold',
  submit:     'color:#EF4444;font-weight:bold',
  resize:     'color:#6B7280;font-weight:bold',
  visibility: 'color:#9CA3AF;font-weight:bold',
} as const;

function log(type: keyof typeof STYLES, selector: string, detail: string) {
  console.log(
    `%c[FLOW] %c${type.toUpperCase().padEnd(10)} %c${selector} %c${detail}`,
    'color:#374151;font-weight:bold',
    STYLES[type],
    'color:#9CA3AF',
    'color:#D1D5DB',
  );
}

export function FlowLogger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams?.toString() ? `${pathname}?${searchParams}` : pathname;
    log('navigate', 'router', url);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    console.log('%c[FLOW] FlowLogger active — logging all interactions to console', 'color:#8B5CF6;font-weight:bold;font-size:12px');

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;
      log('click', getSelector(el), describeElement(el));
    };

    const onKeydown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      const mods = [e.ctrlKey && 'Ctrl', e.altKey && 'Alt', e.shiftKey && 'Shift', e.metaKey && 'Meta'].filter(Boolean).join('+');
      const key = mods ? `${mods}+${e.key}` : e.key;
      log('keydown', getSelector(el), `key="${key}" on ${describeElement(el)}`);
    };

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(el.tagName)) {
        log('focus', getSelector(el), describeElement(el));
      }
    };

    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!el) return;
      const val = el.type === 'password' ? '***' : (el.value?.slice(0, 50) || '');
      log('input', getSelector(el), `${describeElement(el)} → "${val}"`);
    };

    const onSubmit = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!el) return;
      log('submit', getSelector(el), describeElement(el));
    };

    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const pct = document.documentElement.scrollHeight > window.innerHeight
          ? Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
          : 0;
        log('scroll', 'window', `y=${Math.round(window.scrollY)} (${pct}%)`);
      }, 300);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        log('resize', 'window', `${window.innerWidth}x${window.innerHeight}`);
      }, 300);
    };

    const onVisibility = () => {
      log('visibility', 'document', document.visibilityState);
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeydown, true);
    document.addEventListener('focusin', onFocusIn, true);
    document.addEventListener('input', onInput, true);
    document.addEventListener('submit', onSubmit, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKeydown, true);
      document.removeEventListener('focusin', onFocusIn, true);
      document.removeEventListener('input', onInput, true);
      document.removeEventListener('submit', onSubmit, true);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return null;
}
