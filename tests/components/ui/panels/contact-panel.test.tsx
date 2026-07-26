import { ContactPanel } from '@/components/ui/panels/contact-panel';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: () => ({
    setCursorVariant: vi.fn(),
  }),
}));

describe('ContactPanel', () => {
  it('renders correctly', () => {
    render(<ContactPanel />);
    expect(screen.getByText('planets.contact.subtitle')).toBeInTheDocument();
    expect(screen.getByText('contact.links.github')).toBeInTheDocument();
  });
});
