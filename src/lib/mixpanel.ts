const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
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
    type: 'achievement' | 'level_up' | 'streak' | 'onboarding_completed';
    name?: string;
    value?: number;
  }) {
    trackEvent('milestone', props);
  },

  // Fires on subscription changes
  subscription(props: {
    action: 'started' | 'cancelled' | 'upgraded' | 'downgraded';
    plan: string;
    interval?: string;
  }) {
    trackEvent('subscription', props);
  },

  // Fires when user engages with a specific feature
  feature(name: string, details?: Record<string, unknown>) {
    trackEvent('feature', { name, ...details });
  },
};
