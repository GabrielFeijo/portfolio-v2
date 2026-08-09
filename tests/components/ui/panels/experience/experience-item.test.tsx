import { ExperienceItem } from '@/components/ui/panels/experience/experience-item';
import type { Experience } from '@/data/portfolio';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let returnTranslatedAchievements = true;

const mockExperience: Experience = {
  id: 'exp-1',
  company: 'Company',
  tech: ['React'],
  type: 'full_time',
  color: 'red',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key.includes('achievements') && options?.returnObjects)
        return returnTranslatedAchievements ? ['A1'] : undefined;
      return key;
    },
  }),
}));

describe('ExperienceItem', () => {
  beforeEach(() => {
    returnTranslatedAchievements = true;
  });
  it('renders collapsed state', () => {
    render(
      <ExperienceItem
        experience={mockExperience}
        isOpen={false}
        onToggle={vi.fn()}
        transition={{ delay: 0 }}
      />
    );
    expect(screen.getByText('experience_items.exp-1.role')).toBeInTheDocument();
    expect(screen.queryByText('experience_items.exp-1.description')).not.toBeInTheDocument();
  });

  it('renders expanded state', () => {
    render(
      <ExperienceItem
        experience={mockExperience}
        isOpen={true}
        onToggle={vi.fn()}
        transition={{ delay: 0 }}
      />
    );
    expect(screen.getByText('experience_items.exp-1.description')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(
      <ExperienceItem
        experience={mockExperience}
        isOpen={false}
        onToggle={onToggle}
        transition={{ delay: 0 }}
      />
    );
    act(() => {
      screen.getByRole('article').click();
    });
    expect(onToggle).toHaveBeenCalled();
  });

  it('omits deliveries when the translation resource is unavailable', () => {
    returnTranslatedAchievements = false;

    render(
      <ExperienceItem
        experience={mockExperience}
        isOpen={true}
        onToggle={vi.fn()}
        transition={{ delay: 0 }}
      />
    );

    expect(screen.queryByText('common.key_deliveries')).not.toBeInTheDocument();
  });
});
