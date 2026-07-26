import { SkillsPanel } from '@/components/ui/panels/skills-panel';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

let mockReturnObjects: any[] | null = [];

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects && mockReturnObjects) return mockReturnObjects;
      if (options?.returnObjects && !mockReturnObjects) return null;
      return key;
    },
  }),
}));

describe('SkillsPanel', () => {
  it('renders correctly with mocked items', () => {
    mockReturnObjects = ['Mocked Skill'];
    render(<SkillsPanel />);
    expect(screen.getByText('planets.skills.subtitle')).toBeInTheDocument();
    expect(screen.getAllByText('Mocked Skill')[0]).toBeInTheDocument();
  });

  it('renders correctly with fallback items', () => {
    mockReturnObjects = null;
    render(<SkillsPanel />);
    expect(screen.getByText('Trabalho em equipe')).toBeInTheDocument();
  });
});
