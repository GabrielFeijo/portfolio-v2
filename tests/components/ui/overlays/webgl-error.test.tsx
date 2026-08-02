import { WebGLError } from '@/components/ui/overlays/webgl-error';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('WebGLError', () => {
  it('renders unavailable variant correctly', () => {
    render(<WebGLError variant="unavailable" />);
    expect(screen.getByText('webgl.unavailable.title')).toBeInTheDocument();
    expect(screen.getByText('webgl.unavailable.badge')).toBeInTheDocument();
  });

  it('renders context_lost variant correctly', () => {
    render(<WebGLError variant="context_lost" />);
    expect(screen.getByText('webgl.context_lost.title')).toBeInTheDocument();
    expect(screen.getByText('webgl.context_lost.badge')).toBeInTheDocument();
    expect(screen.getByText('webgl.context_lost.required_action')).toBeInTheDocument();
  });

  it('offers a usable 2D continuation when provided', () => {
    const onContinue = vi.fn();
    render(<WebGLError onContinue={onContinue} />);

    screen.getByText('webgl.actions.continue_without_3d').click();
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('handles try again button click', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(<WebGLError />);
    const btn = screen.getByText('webgl.actions.try_again');
    act(() => {
      btn.click();
    });
    expect(reloadMock).toHaveBeenCalled();
  });
});
