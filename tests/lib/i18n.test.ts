import i18n from '@/lib/i18n';
import { describe, expect, it } from 'vitest';

function getResourceShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(getResourceShape);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, getResourceShape(child)])
    );
  }

  return typeof value;
}

describe('i18n', () => {
  it('initializes with fallback language', () => {
    expect(i18n.options.fallbackLng).toEqual(['pt']);
    expect(i18n.isInitialized).toBe(true);
  });

  it('has portuguese and english resources', () => {
    expect(i18n.hasResourceBundle('pt', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
  });

  it('keeps portuguese and english resources structurally equivalent', () => {
    const pt = i18n.getResourceBundle('pt', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');

    expect(getResourceShape(en)).toEqual(getResourceShape(pt));
  });
});
