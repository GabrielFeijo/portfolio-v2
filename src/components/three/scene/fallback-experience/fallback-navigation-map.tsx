import { DEVELOPER } from '@/data/portfolio';
import type { Planet } from '@/types/portfolio';
import { Route } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OrbitCard } from './orbit-card';

export function FallbackNavigationMap({
  planets,
  onOpen,
}: {
  planets: Planet[];
  onOpen: (panel: Planet['id']) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-(--panel-border) bg-(--surface-fallback) p-4 shadow-(--shadow-overlay-strong) backdrop-blur-sm sm:p-5 lg:p-6">
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-(--accent-border-subtle) bg-(--accent-surface-faint) px-4 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-(--accent-border) bg-(--accent-surface) text-(--fallback-accent) shadow-(--shadow-fallback-icon)">
          <Route size={18} />
        </div>
        <div>
          <p className="font-mono-space text-caption uppercase tracking-caps-xl text-(--fallback-accent-muted)">
            {t('fallback_2d.core_label')}
          </p>
          <strong className="mt-1 block text-base font-semibold text-(--fallback-text-strong)">
            {DEVELOPER.name}
          </strong>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {planets.map((planet, index) => (
          <OrbitCard key={planet.id} index={index} planet={planet} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
