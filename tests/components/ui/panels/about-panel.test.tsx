import { AboutPanel } from '@/components/ui/panels/about-panel';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

let mockReturnObjects: any[] | null = [];

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects) return mockReturnObjects;
      return key;
    },
  }),
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    const state = {
      setCursorVariant: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

describe('AboutPanel', () => {
  it('renders with i18n returnObjects correctly', () => {
    mockReturnObjects = ['Paragraph 1'];
    render(<AboutPanel />);
    expect(screen.getAllByText('Paragraph 1')[0]).toBeInTheDocument();
    expect(screen.getByText('planets.about.subtitle')).toBeInTheDocument();
  });

  it('omits localized collections when i18n does not return arrays', () => {
    mockReturnObjects = null;
    render(<AboutPanel />);

    expect(screen.getByText('Gabriel Feijó')).toBeInTheDocument();
    expect(screen.queryByText('Paragraph 1')).not.toBeInTheDocument();
  });
});
