import i18n from '@/lib/i18n';
import { describe, expect, it } from 'vitest';

describe('i18n', () => {
  it('initializes with fallback language', () => {
    expect(i18n.options.fallbackLng).toEqual(['pt']);
    expect(i18n.isInitialized).toBe(true);
  });

  it('has portuguese and english resources', () => {
    expect(i18n.hasResourceBundle('pt', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
  });
});
