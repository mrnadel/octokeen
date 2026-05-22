import { vi } from 'vitest';

export function mockAuthUser(userId: string) {
  vi.mock('@/lib/auth-utils', () => ({
    getAuthUserId: vi.fn().mockResolvedValue(userId),
    requireAdmin: vi.fn().mockResolvedValue(userId),
  }));
}

export function mockNoAuth() {
  vi.mock('@/lib/auth-utils', () => ({
    getAuthUserId: vi.fn().mockResolvedValue(null),
    requireAdmin: vi.fn().mockResolvedValue(null),
  }));
}

export function createRequest(method: string, url: string, body?: unknown, headers?: Record<string, string>) {
  return new Request(`http://localhost${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
