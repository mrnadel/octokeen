// Mixpanel project token. Not a secret: it is an ingest-only key that ships in
// the client bundle to every visitor the moment analytics are enabled, and it
// cannot read data back. Baked in because it went unset on Vercel and every
// analytics call in the app silently no-opped in production as a result;
// initMixpanel returns early without a token, so the failure is invisible.
// NEXT_PUBLIC_MIXPANEL_TOKEN still overrides for a separate project.
const FALLBACK_MIXPANEL_TOKEN = '07f376be3a2435fb54e7ac7391bf4607';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || FALLBACK_MIXPANEL_TOKEN;
const IS_PROD = process.env.NODE_ENV === 'production';

let initialized = false;
let mixpanelLib: typeof import('mixpanel-browser').default | null = null;

async function getMixpanel() {
  if (!mixpanelLib) {
    const mod = await import('mixpanel-browser');
    mixpanelLib = mod.default;
  }
  return mixpanelLib;
}

export async function initMixpanel() {
  if (initialized || !MIXPANEL_TOKEN) return;

  const mixpanel = await getMixpanel();
  mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: false,
    persistence: 'localStorage',
    ignore_dnt: false,
    debug: !IS_PROD,
    api_host: '/api/mp', // proxy through our own API to bypass ad blockers
    api_transport: 'XHR', // required for custom api_host
  });

  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!initialized || !mixpanelLib) return;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dev/')) return;
  mixpanelLib.track(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!initialized || !mixpanelLib) return;
  mixpanelLib.identify(userId);
  if (traits) {
    mixpanelLib.people.set(traits);
  }
}

export function resetUser() {
  if (!initialized || !mixpanelLib) return;
  mixpanelLib.reset();
}

export function setSuperProperties(props: Record<string, unknown>) {
  if (!initialized || !mixpanelLib) return;
  mixpanelLib.register(props);
}

// Lean event model — few events, rich properties
export const analytics = {
  // Fires once when a practice session ends (completed or abandoned)
  session(props: {
    status: 'completed' | 'abandoned';
    mode: string;
    questionsAttempted: number;
    questionsCorrect: number;
    accuracy: number;
    xpEarned: number;
    durationSeconds: number;
    topicId?: string;
    grade?: string;
  }) {
    trackEvent('session', props);
  },

  // Fires on meaningful milestones
  milestone(props: {
    type: 'achievement' | 'level_up' | 'streak' | 'onboarding_completed' | 'course_intro_completed';
    name?: string;
    value?: number;
  }) {
    trackEvent('milestone', props);
  },

  // Fires on subscription changes (client-side: checkout initiated, page viewed)
  subscription(props: {
    action: 'checkout_initiated' | 'checkout_success' | 'manage_clicked';
    plan: string;
    interval?: string;
    source?: string;
  }) {
    trackEvent('subscription', props);
  },

  // Fires on auth events
  auth(props: {
    action: 'signup' | 'login' | 'logout';
    method: 'credentials' | 'google';
  }) {
    trackEvent('auth', props);
  },

  // Fires at each step of the anonymous acquisition funnel, before signup.
  // These are the only events an unauthenticated visitor produces, so they are
  // what tells us whether traffic converts: landing -> try -> finish -> signup.
  // The `guide_*` steps are the same funnel entered from organic search
  // instead of the landing page: guide -> try -> finish -> signup.
  funnel(props: {
    step:
      | 'landing_viewed'
      | 'try_opened'
      | 'try_course_picked'
      | 'try_lesson_completed'
      | 'try_signup_clicked'
      | 'guide_viewed'
      | 'guide_quiz_completed'
      | 'guide_cta_clicked';
    professionId?: string;
    questionsAnswered?: number;
    accuracy?: number;
    /** `/learn` guide slug, on the `guide_*` steps only. */
    guideSlug?: string;
    /** Which call to action was taken, on `guide_cta_clicked` only. */
    ctaTarget?: 'try' | 'course';
  }) {
    trackEvent('funnel', props);
  },

  // Fires when user engages with a specific feature
  feature(name: string, details?: Record<string, unknown>) {
    trackEvent('feature', { name, ...details });
  },

  // Fires on errors that impact user experience
  error(props: {
    action: string;
    message: string;
    source?: string;
  }) {
    trackEvent('error', props);
  },
};
