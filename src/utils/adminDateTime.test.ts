import { describe, expect, it } from 'vitest';
import { formatKstDate, formatKstDateTime } from './adminDateTime';

describe('adminDateTime', () => {
  it('formats UTC date-time values in KST regardless of browser time zone', () => {
    expect(formatKstDateTime('2026-05-28T22:26:14Z')).toBe('2026-05-29 07:26:14 KST');
  });

  it('formats date values in KST', () => {
    expect(formatKstDate('2026-05-28T22:26:14Z')).toBe('2026-05-29');
  });

  it('returns fallback for empty or invalid values', () => {
    expect(formatKstDateTime()).toBe('-');
    expect(formatKstDate('not-a-date')).toBe('-');
  });
});
