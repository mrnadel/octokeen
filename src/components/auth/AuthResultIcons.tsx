'use client';

const ICON_CLASS = 'w-7 h-7';

/** Green tick shown on successful verification / password reset. */
export function AuthSuccessIcon() {
  return (
    <svg className={`${ICON_CLASS} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/** Red cross shown when verification fails. */
export function AuthFailureIcon() {
  return (
    <svg className={`${ICON_CLASS} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/** Envelope shown after a reset link has been emailed. */
export function AuthMailIcon() {
  return (
    <svg className={`${ICON_CLASS} text-primary-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
