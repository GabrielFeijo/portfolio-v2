import { FallbackExperience } from '@/components/three/scene/fallback-experience';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('FallbackExperience', () => {
  it('presents engineering value and direct portfolio actions without WebGL', () => {
    render(<FallbackExperience />);

    expect(screen.getByTestId('scene-2d-fallback')).toHaveAccessibleName('fallback_2d.aria');
    expect(screen.getByText('fallback_2d.title')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fallback_2d.projects/ })).toHaveAttribute(
      'href',
      '#projects'
    );
    expect(screen.getByRole('link', { name: 'fallback_2d.contact' })).toHaveAttribute(
      'href',
      '#contact'
    );
  });
});
