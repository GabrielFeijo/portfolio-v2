import { PANEL_IDS, type PanelId } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { useEffect } from 'react';

function getPanelFromHash(): PanelId | null {
  const candidate = window.location.hash.slice(1);
  return PANEL_IDS.includes(candidate as PanelId) ? (candidate as PanelId) : null;
}

export function useSectionHash() {
  useEffect(() => {
    const syncFromLocation = () => {
      useSpaceStore.getState().setPanelFromLocation(getPanelFromHash());
    };

    syncFromLocation();
    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('popstate', syncFromLocation);

    return () => {
      window.removeEventListener('hashchange', syncFromLocation);
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);
}
