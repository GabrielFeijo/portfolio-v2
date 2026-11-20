import {
  formatCompanyPeriod,
  groupExperiencesByCompany,
} from '@/components/ui/panels/experience/group-experiences';
import type { Experience } from '@/data/portfolio';
import { describe, expect, it } from 'vitest';

const makeExp = (id: string, company: string): Experience => ({
  id,
  company,
  type: 'full_time',
  tech: ['TypeScript'],
  color: '#00d4ff',
});

describe('groupExperiencesByCompany', () => {
  it('returns an empty array for empty input', () => {
    expect(groupExperiencesByCompany([])).toEqual([]);
  });

  it('groups consecutive experiences at the same company while preserving order', () => {
    const grouped = groupExperiencesByCompany([
      makeExp('cit_ai', 'CI&T'),
      makeExp('cit', 'CI&T'),
      makeExp('loopert', 'Loopert'),
      makeExp('cit_old', 'CI&T'),
    ]);

    expect(grouped).toHaveLength(3);
    expect(grouped[0].company).toBe('CI&T');
    expect(grouped[0].items.map((item) => item.id)).toEqual(['cit_ai', 'cit']);
    expect(grouped[1].company).toBe('Loopert');
    expect(grouped[1].items.map((item) => item.id)).toEqual(['loopert']);
    expect(grouped[2].company).toBe('CI&T');
    expect(grouped[2].items.map((item) => item.id)).toEqual(['cit_old']);
  });
});

describe('formatCompanyPeriod', () => {
  it('returns empty string for empty periods', () => {
    expect(formatCompanyPeriod([])).toBe('');
  });

  it('returns the single period directly when there is one role', () => {
    expect(formatCompanyPeriod(['12/2025 — Atual'])).toBe('12/2025 — Atual');
  });

  it('combines earliest start and latest end across consecutive roles', () => {
    expect(formatCompanyPeriod(['10/2026 — Atual', '12/2025 — 10/2026'])).toBe('12/2025 — Atual');
  });

  it('falls back to latest period when expected separator is absent', () => {
    expect(
      formatCompanyPeriod(['experience_items.cit_ai.period', 'experience_items.cit.period'])
    ).toBe('experience_items.cit_ai.period');
  });
});
