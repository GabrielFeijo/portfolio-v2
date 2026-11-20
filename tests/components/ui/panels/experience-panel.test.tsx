import { ExperiencePanel } from '@/components/ui/panels/experience-panel';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects) return [];
      return key;
    },
  }),
}));

describe('ExperiencePanel', () => {
  it('groups same-company roles under one header and toggles items', () => {
    render(<ExperiencePanel />);

    expect(screen.getByText('planets.experience.subtitle')).toBeInTheDocument();
    expect(screen.getAllByText('CI&T')).toHaveLength(1);
    expect(screen.getByText('experience_items.cit_ai.description')).toBeInTheDocument();
    expect(screen.queryByText('experience_items.cit.description')).not.toBeInTheDocument();

    const citAiRole = screen.getByText('experience_items.cit_ai.role');
    act(() => {
      citAiRole.click();
    });
    expect(screen.queryByText('experience_items.cit_ai.description')).not.toBeInTheDocument();

    const citSweRole = screen.getByText('experience_items.cit.role');
    act(() => {
      citSweRole.click();
    });
    expect(screen.getByText('experience_items.cit.description')).toBeInTheDocument();

    const loopertRole = screen.getByText('experience_items.loopert.role');
    act(() => {
      loopertRole.click();
    });
    expect(screen.getByText('experience_items.loopert.description')).toBeInTheDocument();
  });
});
