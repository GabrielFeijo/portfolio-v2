import { useSectionHash } from '@/hooks/use-section-hash';
import { useSpaceStore } from '@/store/space-store';
import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

function Harness() {
  useSectionHash();
  return null;
}

describe('useSectionHash', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    useSpaceStore.setState({ activePanel: null, activePlanet: null });
  });

  it('hydrates a valid deep link', () => {
    window.history.replaceState(null, '', '/#projects');
    render(<Harness />);

    expect(useSpaceStore.getState().activePanel).toBe('projects');
  });

  it('reacts to browser hash navigation and ignores unknown sections', () => {
    render(<Harness />);

    act(() => {
      window.history.replaceState(null, '', '/#contact');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(useSpaceStore.getState().activePanel).toBe('contact');

    act(() => {
      window.history.replaceState(null, '', '/#unknown');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(useSpaceStore.getState().activePanel).toBeNull();
  });
});
