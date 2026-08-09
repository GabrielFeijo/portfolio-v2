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
    <div className="rounded-xl border border-[rgba(223,181,59,0.14)] bg-[rgba(9,12,20,0.9)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-5 lg:p-6">
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-[rgba(223,181,59,0.12)] bg-[rgba(223,181,59,0.03)] px-4 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(223,181,59,0.18)] bg-[rgba(223,181,59,0.08)] text-[#FFD67A] shadow-[0_0_24px_rgba(223,181,59,0.08)]">
          <Route size={18} />
        </div>
        <div>
          <p className="font-mono-space text-[10px] uppercase tracking-[0.2em] text-[rgba(255,214,122,0.46)]">
            {t('fallback_2d.core_label')}
          </p>
          <strong className="mt-1 block text-base font-semibold text-[#FFF7E6]">
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
