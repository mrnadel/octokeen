/**
 * Shared constants and helpers for the db-sync domain modules.
 */

/** Debounce delay (ms) for practice-progress sync. */
export const PROGRESS_DEBOUNCE_MS = 800;

/** Debounce delay (ms) for course-progress sync. */
export const COURSE_DEBOUNCE_MS = 800;

/** Debounce delay (ms) for engagement sync. */
export const ENGAGEMENT_DEBOUNCE_MS = 1500;

/** Timeout (ms) before the hydration fetch is aborted. */
export const HYDRATE_TIMEOUT_MS = 15000;

/** Headers every client→server call carries so the server can resolve "today". */
export function timezoneHeaders(): Record<string, string> {
  return { 'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone };
}

/** Headers for a JSON POST body, including the timezone header. */
export function jsonPostHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json', ...timezoneHeaders() };
}

/** Returns fetch options that inject the current timezone header. */
export function makeFetchOpts(signal?: AbortSignal): RequestInit {
  return { signal, headers: timezoneHeaders() };
}

/** Returns POST fetch options with JSON body and timezone header. */
export function makePostOpts(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: jsonPostHeaders(),
    body: JSON.stringify(body),
  };
}
