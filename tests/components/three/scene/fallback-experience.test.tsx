import { FallbackExperience } from '@/components/three/scene/fallback-experience';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const navigateToPanel = vi.fn();

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('zustand/react/shallow', () => ({ useShallow: (selector: unknown) => selector }));
vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: (state: { navigateToPanel: typeof navigateToPanel }) => unknown) =>
    selector({ navigateToPanel }),
}));

describe('FallbackExperience', () => {
  it('renders the 2D fallback and routes the user to key portfolio sections', async () => {
    const user = userEvent.setup();
    render(<FallbackExperience />);

    expect(screen.getByTestId('scene-2d-fallback')).toHaveAccessibleName('fallback_2d.aria');
    expect(screen.getByText('fallback_2d.title')).toBeInTheDocument();
    expect(screen.getByText('fallback_2d.core_label')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fallback_2d.primary_cta/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /planets.contact.name/i }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByRole('button', { name: /planets.projects.name/i }).length
    ).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /fallback_2d.primary_cta/i }));
    await user.click(screen.getByRole('button', { name: /fallback_2d.secondary_cta/i }));
    await user.click(screen.getAllByRole('button', { name: /planets.contact.name/i })[0]);
    await user.click(screen.getAllByRole('button', { name: /planets.skills.name/i })[0]);

    expect(navigateToPanel).toHaveBeenCalledWith('projects');
    expect(navigateToPanel).toHaveBeenCalledWith('about');
    expect(navigateToPanel).toHaveBeenCalledWith('contact');
    expect(navigateToPanel).toHaveBeenCalledWith('skills');
  });
});
