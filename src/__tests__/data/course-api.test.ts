import { describe, it, expect } from 'vitest';
import { getCourseData } from '@/data/course/api';

describe('getCourseData', () => {
  it('returns units array for a profession', async () => {
    const units = await getCourseData('mechanical-engineering');
    expect(Array.isArray(units)).toBe(true);
    expect(units.length).toBeGreaterThan(0);
  });
});
