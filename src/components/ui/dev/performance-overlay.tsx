import { useSpaceStore } from '@/store/space-store';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface PerfSample {
  fps: number;
  frameMs: number;
}

function usePerformanceSample(enabled: boolean) {
  const [sample, setSample] = useState<PerfSample>({ fps: 0, frameMs: 0 });
  const frameRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastFrameAtRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const loop = (time: number) => {
      if (startedAtRef.current === 0) {
        startedAtRef.current = time;
        lastFrameAtRef.current = time;
      }

      frameRef.current += 1;
      const frameMs = time - lastFrameAtRef.current;
      lastFrameAtRef.current = time;
      const elapsed = time - startedAtRef.current;

      if (elapsed >= 500) {
        setSample({
          fps: Math.round((frameRef.current * 1000) / elapsed),
          frameMs: Number(frameMs.toFixed(1)),
        });
        frameRef.current = 0;
        startedAtRef.current = time;
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      frameRef.current = 0;
      startedAtRef.current = 0;
      lastFrameAtRef.current = 0;
    };
  }, [enabled]);

  return sample;
}

interface PerformanceOverlayProps {
  enabled?: boolean;
}

export function PerformanceOverlay({ enabled = import.meta.env.DEV }: PerformanceOverlayProps) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    activePanel,
    activePlanet,
    graphicsMode,
    helpOpen,
    isLoaded,
    settings,
    settingsOpen,
    warpActive,
  } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      activePlanet: state.activePlanet,
      graphicsMode: state.graphicsMode,
      helpOpen: state.helpOpen,
      isLoaded: state.isLoaded,
      settings: state.experienceSettings,
      settingsOpen: state.settingsOpen,
      warpActive: state.warpActive,
    }))
  );

  const { fps, frameMs } = usePerformanceSample(enabled);

  const summary = useMemo(
    () => [
      ['mode', graphicsMode ?? 'unknown'],
      ['fps', String(fps)],
      ['frame', `${frameMs}ms`],
      ['loaded', isLoaded ? 'yes' : 'no'],
      ['panel', activePanel ?? '-'],
      ['planet', activePlanet ?? '-'],
      ['help', helpOpen ? 'open' : 'closed'],
      ['settings', settingsOpen ? 'open' : 'closed'],
      ['warp', warpActive ? 'on' : 'off'],
      ['dpr', String(settings?.dpr ?? '-')],
      ['aa', settings?.antialias ? 'on' : 'off'],
      ['shadows', settings?.shadows ? 'on' : 'off'],
      ['lite', settings?.liteEffects ? 'on' : 'off'],
      ['stars', String(settings?.starDensity ?? '-')],
      ['asteroids', String(settings?.asteroidDensity ?? '-')],
      ['nebula', settings?.nebula ? 'on' : 'off'],
      ['cursor', settings?.customCursor ? 'on' : 'off'],
    ],
    [
      activePanel,
      activePlanet,
      fps,
      frameMs,
      graphicsMode,
      helpOpen,
      isLoaded,
      settings,
      settingsOpen,
      warpActive,
    ]
  );

  if (!enabled) return null;

  return (
    <aside
      className="fixed right-3 bottom-3 z-1200 w-56 rounded-xl border border-(--border) bg-(--overlay-backdrop) px-3 py-2 font-mono text-label leading-5 text-(--text-primary) shadow-(--shadow-performance)"
      data-testid="performance-overlay"
      aria-label="Development performance overlay"
    >
      <div className="mb-1 flex items-center justify-between gap-2 text-caption font-semibold uppercase tracking-status text-(--accent-blue-bright)">
        <span>Dev Stats</span>
        <div className="flex items-center gap-2">
          <span>{(graphicsMode ?? 'unknown').toUpperCase()}</span>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-(--border) text-(--text-secondary) transition-colors hover:bg-(--surface-interactive-strong) hover:text-(--text-primary)"
            aria-label={collapsed ? 'Expand development stats' : 'Collapse development stats'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <dl className="grid grid-cols-(--layout-performance-columns) gap-x-2 gap-y-0.5">
          {summary.map(([label, value]) => (
            <Fragment key={label}>
              <dt className="text-(--text-muted) uppercase">{label}</dt>
              <dd className="truncate text-(--text-primary)">{value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
    </aside>
  );
}
