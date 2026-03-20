// ============================================================
// Paddle Client-Side (browser) — MechPrep SaaS
// ============================================================

import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) return paddleInstance;
  paddleInstance = await initializePaddle({
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  });
  return paddleInstance ?? null;
}
