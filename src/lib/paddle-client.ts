// ============================================================
// Paddle Client-Side (browser) — MechReady SaaS
// ============================================================

import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) return paddleInstance;
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '';
  const isSandbox = token.startsWith('test_');
  console.log('[Paddle] Initializing with token:', token ? `${token.slice(0, 10)}...${token.slice(-4)} (${token.length} chars)` : 'MISSING');
  paddleInstance = await initializePaddle({
    environment: isSandbox ? 'sandbox' : 'production',
    token,
  });
  return paddleInstance ?? null;
}
