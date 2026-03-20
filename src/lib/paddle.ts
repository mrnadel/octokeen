// ============================================================
// Paddle Server-Side Client — MechReady SaaS
// ============================================================

import { Environment, Paddle } from '@paddle/paddle-node-sdk';

let _paddle: Paddle | null = null;

function getPaddleServer(): Paddle {
  if (!_paddle) {
    _paddle = new Paddle(process.env.PADDLE_API_KEY!, {
      environment:
        process.env.NODE_ENV === 'production'
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return _paddle;
}

// Lazy proxy so the Paddle SDK is not instantiated at module load time
// (which would crash during `next build` when env vars are absent).
const paddle: Paddle = new Proxy({} as Paddle, {
  get(_target, prop, receiver) {
    const instance = getPaddleServer();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export default paddle;
