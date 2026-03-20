// ============================================================
// Stripe Server-Side Client — MechPrep SaaS
// ============================================================

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience alias for existing imports
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeServer() as Record<string | symbol, unknown>)[prop];
  },
});
