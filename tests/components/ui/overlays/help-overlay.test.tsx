import { HelpOverlay } from '@/components/ui/overlays/help-overlay';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const closeHelp = vi.fn();
const setCursorVariant = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'help.quick_steps' && options?.returnObjects) return ['Step 1', 'Step 2'];
      if (key === 'help.sections' && options?.returnObjects)
        return [{ title: 'About', description: 'Desc' }];
      return key;
    },
  }),
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: () => ({
    closeHelp,
    setCursorVariant,
  }),
}));

describe('HelpOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and handles close', () => {
    render(<HelpOverlay />);
    expect(screen.getByText('help.title')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('help.close_aria');
    fireEvent.click(closeBtn);
    expect(closeHelp).toHaveBeenCalled();
  });

  it('handles backdrop interactions', () => {
    render(<HelpOverlay />);
    const backdrop = screen.getByRole('dialog').firstChild!;

    fireEvent.click(backdrop);
    expect(closeHelp).toHaveBeenCalled();

    fireEvent.mouseEnter(backdrop);
    expect(setCursorVariant).toHaveBeenCalledWith('default');
  });
});
