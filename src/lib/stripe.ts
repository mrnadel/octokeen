// ============================================================
// Stripe Server-Side Client — MechPrep SaaS
// ============================================================

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripeServer(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy proxy so the Stripe SDK is not instantiated at module load time
// (which would crash during `next build` when env vars are absent).
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const instance = getStripeServer();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
