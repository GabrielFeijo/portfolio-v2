import { ProjectCard } from '@/components/ui/panels/projects/project-card';
import type { Project } from '@/data/portfolio';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let returnTranslatedHighlights = true;

const mockProject: Project = {
  id: 'proj-1',
  tech: ['React'],
  category: 'frontend',
  year: 2023,
  color: '#000000',
  live: 'https://live.com',
  github: 'https://github.com',
  featured: true,
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key.includes('highlights') && options?.returnObjects)
        return returnTranslatedHighlights ? ['H1'] : undefined;
      return key;
    },
  }),
}));

describe('ProjectCard', () => {
  beforeEach(() => {
    returnTranslatedHighlights = true;
  });
  it('renders correctly', () => {
    render(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onToggle={vi.fn()}
        setCursorVariant={vi.fn()}
        transition={{ delay: 0 }}
      />
    );
    expect(screen.getByText('projects_items.proj-1.name')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('common.highlights')).not.toBeInTheDocument();
  });

  it('renders expanded details when isSelected', () => {
    render(
      <ProjectCard
        project={mockProject}
        isSelected={true}
        onToggle={vi.fn()}
        setCursorVariant={vi.fn()}
        transition={{ delay: 0 }}
      />
    );
    expect(screen.getByText('common.highlights')).toBeInTheDocument();
    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('common.open_project')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onToggle={onToggle}
        setCursorVariant={vi.fn()}
        transition={{ delay: 0 }}
      />
    );
    act(() => {
      screen.getByRole('article').click();
    });
    expect(onToggle).toHaveBeenCalled();
  });

  it('omits highlights when the translation resource is unavailable', () => {
    returnTranslatedHighlights = false;

    render(
      <ProjectCard
        project={mockProject}
        isSelected={true}
        onToggle={vi.fn()}
        setCursorVariant={vi.fn()}
        transition={{ delay: 0 }}
      />
    );

    expect(screen.queryByText('common.highlights')).not.toBeInTheDocument();
  });
});
