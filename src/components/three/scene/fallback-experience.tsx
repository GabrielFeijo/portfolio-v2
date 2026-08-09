import { PLANETS } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { FallbackHeader } from './fallback-experience/fallback-header';
import { FallbackHero } from './fallback-experience/fallback-hero';
import { FallbackNavigationMap } from './fallback-experience/fallback-navigation-map';

export function FallbackExperience() {
  const { t } = useTranslation();
  const { navigateToPanel } = useSpaceStore(
    useShallow((state) => ({
      navigateToPanel: state.navigateToPanel,
    }))
  );

  const featuredPlanets = useMemo(() => PLANETS.slice(0, 6), []);

  return (
    <section
      className="fallback-experience absolute inset-0 overflow-y-auto overflow-x-hidden bg-(--canvas-fallback) text-(--fallback-text)"
      data-testid="scene-2d-fallback"
      aria-label={t('fallback_2d.aria')}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,var(--accent-surface-hover),transparent_18%),radial-gradient(circle_at_82%_20%,var(--accent-surface),transparent_20%),radial-gradient(circle_at_50%_76%,var(--accent-surface-subtle),transparent_24%)]" />
        <div className="absolute inset-0 bg-(image:--background-fallback-grid) bg-size-(--layout-fallback-grid-size) opacity-25" />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pt-5 pb-26 sm:px-6 sm:pt-6 sm:pb-28 lg:px-8 lg:py-8">
        <FallbackHeader />

        <main className="grid gap-8 pt-8 lg:grid-cols-(--layout-fallback-columns) lg:items-start lg:gap-10 lg:pt-10">
          <FallbackHero
            onAbout={() => navigateToPanel('about')}
            onProjects={() => navigateToPanel('projects')}
          />
          <FallbackNavigationMap planets={featuredPlanets} onOpen={navigateToPanel} />
        </main>
      </div>
    </section>
  );
}
