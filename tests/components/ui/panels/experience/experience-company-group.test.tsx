import { ExperienceCompanyGroup } from '@/components/ui/panels/experience/experience-company-group';
import type { ExperienceGroup } from '@/components/ui/panels/experience/group-experiences';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockGroup: ExperienceGroup = {
  id: 'cit_ai',
  company: 'CI&T',
  type: 'full_time',
  color: '#00d4ff',
  items: [
    {
      id: 'cit_ai',
      company: 'CI&T',
      type: 'full_time',
      tech: ['Agentic SDLC'],
      color: '#00d4ff',
    },
    {
      id: 'cit',
      company: 'CI&T',
      type: 'full_time',
      tech: ['React'],
      color: '#38bdf8',
    },
  ],
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects) return ['Delivery'];
      if (key === 'experience_items.cit_ai.period') return '10/2026 — Present';
      if (key === 'experience_items.cit.period') return '12/2025 — 10/2026';
      return key;
    },
  }),
}));

describe('ExperienceCompanyGroup', () => {
  it('renders a single company header with all inner roles collapsed', () => {
    render(
      <ExperienceCompanyGroup
        group={mockGroup}
        expandedId={null}
        onToggle={vi.fn()}
        transition={{ delay: 0 }}
      />
    );

    expect(screen.getAllByText('CI&T')).toHaveLength(1);
    expect(screen.getByText('12/2025 — Present')).toBeInTheDocument();
    expect(screen.getByText('experience_items.cit_ai.role')).toBeInTheDocument();
    expect(screen.getByText('experience_items.cit.role')).toBeInTheDocument();
    expect(screen.queryByText('experience_items.cit_ai.description')).not.toBeInTheDocument();
    expect(screen.queryByText('experience_items.cit.description')).not.toBeInTheDocument();
  });

  it('expands the selected role and calls onToggle with its id', () => {
    const onToggle = vi.fn();
    render(
      <ExperienceCompanyGroup
        group={mockGroup}
        expandedId="cit_ai"
        onToggle={onToggle}
        transition={{ delay: 0 }}
      />
    );

    expect(screen.getByText('experience_items.cit_ai.description')).toBeInTheDocument();
    expect(screen.queryByText('experience_items.cit.description')).not.toBeInTheDocument();

    const secondRoleButton = screen.getByRole('button', {
      name: /experience_items\.cit\.role/,
    });
    act(() => {
      secondRoleButton.click();
    });

    expect(onToggle).toHaveBeenCalledWith('cit');
  });
});
