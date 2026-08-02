import { LoadingScreen } from '@/components/ui/hud/loading-screen';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('LoadingScreen', () => {
  it('renders a concise accessible loading state', () => {
    render(<LoadingScreen />);

    expect(screen.getByRole('status')).toHaveTextContent('Gabriel Feijó');
    expect(screen.getByRole('status')).toHaveTextContent('common.loading');
  });
});
