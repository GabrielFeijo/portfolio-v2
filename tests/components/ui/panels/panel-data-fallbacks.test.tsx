import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects) return null;
      return key;
    },
  }),
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: () => ({
    setCursorVariant: vi.fn(),
  }),
}));

describe('panel data fallback branches', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/data/portfolio');
  });

  it('uses the default stat tone when there are more stats than tones', async () => {
    vi.doMock('@/data/portfolio', () => ({
      DEVELOPER: {
        name: 'Dev',
        profileImage: '/profile.png',
        github: '#github',
        linkedin: '#linkedin',
        email: 'dev@example.com',
        age: 24,
        stats: [
          { label: 'A', value: '1' },
          { label: 'B', value: '2' },
          { label: 'C', value: '3' },
          { label: 'D', value: '4' },
        ],
        summary: ['Fallback summary'],
        education: [{ title: 'Course', institution: 'School', period: 'Now', description: 'Desc' }],
      },
    }));

    const { AboutPanel } = await import('@/components/ui/panels/about-panel');
    render(<AboutPanel />);

    expect(screen.getByText('Dev')).toBeInTheDocument();
  });

  it('renders projects panel with empty project data', async () => {
    vi.doMock('@/data/portfolio', () => ({
      PROJECTS: [],
    }));

    const { ProjectsPanel } = await import('@/components/ui/panels/projects-panel');
    render(<ProjectsPanel />);

    expect(screen.getByText('projects.filters.all')).toBeInTheDocument();
  });

  it('uses the general skill group key when group index is out of range', async () => {
    vi.doMock('@/data/portfolio', () => ({
      SKILLS: {
        frontend: [],
        backend: [],
        devops: [],
      },
      SKILL_GROUPS: [
        { title: 'One', items: ['A'] },
        { title: 'Two', items: ['B'] },
        { title: 'Three', items: ['C'] },
        { title: 'Four', items: ['D'] },
        { title: 'Five', items: ['E'] },
      ],
    }));

    const { SkillsPanel } = await import('@/components/ui/panels/skills-panel');
    render(<SkillsPanel />);

    expect(screen.getByText('E')).toBeInTheDocument();
  });
});
