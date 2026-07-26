import { calculateAge } from '@/utils/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('calculateAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 3, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates age correctly before birthday in current year', () => {
    expect(calculateAge(new Date(2000, 5, 1))).toBe(25);
  });

  it('calculates age correctly after birthday in current year', () => {
    expect(calculateAge(new Date(2000, 2, 1))).toBe(26);
  });

  it('calculates age correctly when birthday is today', () => {
    expect(calculateAge(new Date(2000, 4, 3))).toBe(26);
  });

  it('calculates age correctly when month is same but birthday is tomorrow', () => {
    expect(calculateAge(new Date(2000, 4, 4))).toBe(25);
  });

  it('throws for invalid dates', () => {
    expect(() => calculateAge('not-a-date')).toThrow(
      'Invalid birth date provided to calculateAge.'
    );
  });

  it('throws for future dates', () => {
    expect(() => calculateAge('2100-01-01')).toThrow('Birth date cannot be in the future.');
  });
});
