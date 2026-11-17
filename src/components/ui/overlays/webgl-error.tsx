import { m } from 'framer-motion';
import { AlertTriangle, AppWindow, Cpu, ExternalLink, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UIBadge, UIIconTile, UIInset, UISurface } from '../design-system';

export function WebGLError({
  variant = 'unavailable',
  onContinue,
}: {
  variant?: 'unavailable' | 'context_lost';
  onContinue?: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    document.body.classList.add('cursor-fallback-mode');

    return () => {
      document.body.classList.remove('cursor-fallback-mode');
    };
  }, []);

  const isContextLost = variant === 'context_lost';

  return (
    <div className="fixed inset-0 z-2000 flex h-screen w-screen items-center justify-center overflow-hidden bg-(--canvas-fallback) p-5 text-(--fallback-text) font-body-exo">
      <div className="vignette" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--accent-gold)_18%,transparent),transparent_28%),radial-gradient(circle_at_bottom,var(--accent-surface-hover),transparent_32%)]" />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <UISurface
          strong
          className="flex max-h-(--layout-webgl-max-height) w-full max-w-160 flex-col overflow-hidden"
        >
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-(--accent-border)" />
          <div className="pointer-events-none absolute -left-8 bottom-6 h-24 w-24 rounded-full border border-(--accent-surface-strong)" />

          <div className="relative overflow-y-auto px-6 py-7 sm:px-8 sm:py-8">
            <UIBadge
              tone="warm"
              className="mb-5 font-mono-space text-label uppercase tracking-caps-3xl"
            >
              <AlertTriangle size={14} />
              {isContextLost ? t('webgl.context_lost.badge') : t('webgl.unavailable.badge')}
            </UIBadge>

            <div className="mb-6 flex items-start gap-4">
              <UIIconTile
                icon={AlertTriangle}
                tone="warm"
                className="h-15 w-15 shrink-0 rounded-xl"
              />

              <div>
                <h1 className="font-display text-2xl font-extrabold uppercase tracking-caps-sm text-(--fallback-text-strong) sm:text-display-sm">
                  {isContextLost ? t('webgl.context_lost.title') : t('webgl.unavailable.title')}
                </h1>
                <p className="mt-3 max-w-(--layout-reading-measure) text-sm leading-7 text-(--fallback-text-secondary) sm:text-body-md">
                  {isContextLost
                    ? t('webgl.context_lost.description')
                    : t('webgl.unavailable.description')}
                </p>
              </div>
            </div>

            {isContextLost ? (
              <UIInset className="mt-6 mb-6 border-(--status-error-border) bg-(--status-error-surface) p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 font-mono-space text-label-lg font-semibold uppercase tracking-caps-2xl text-(--status-error-bright)">
                  <ShieldCheck size={14} />
                  {t('webgl.context_lost.required_action')}
                </div>
                <p className="text-sm font-medium leading-6 text-(--status-error-text)">
                  {t('webgl.context_lost.required_action_text')}{' '}
                  <strong>{t('webgl.context_lost.required_action_strong')}</strong>.{' '}
                  {t('webgl.context_lost.required_action_suffix')}
                </p>
              </UIInset>
            ) : (
              <UIInset className="mt-6 mb-6 p-4 sm:p-5">
                <div className="mb-2 font-mono-space text-label uppercase tracking-caps-2xl text-(--accent-blue)">
                  {t('webgl.unavailable.whats_happening_title')}
                </div>
                <p className="text-sm leading-7 text-(--fallback-text-muted)">
                  {t('webgl.unavailable.whats_happening_description')}
                </p>
              </UIInset>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              <FallbackTip
                icon={AppWindow}
                title={
                  isContextLost
                    ? t('webgl.context_lost.tips.memory.title')
                    : t('webgl.unavailable.tips.browser.title')
                }
                description={
                  isContextLost
                    ? t('webgl.context_lost.tips.memory.description')
                    : t('webgl.unavailable.tips.browser.description')
                }
              />
              <FallbackTip
                icon={ShieldCheck}
                title={
                  isContextLost
                    ? t('webgl.context_lost.tips.protection.title')
                    : t('webgl.unavailable.tips.acceleration.title')
                }
                description={
                  isContextLost
                    ? t('webgl.context_lost.tips.protection.description')
                    : t('webgl.unavailable.tips.acceleration.description')
                }
              />
              <FallbackTip
                icon={Cpu}
                title={
                  isContextLost
                    ? t('webgl.context_lost.tips.load.title')
                    : t('webgl.unavailable.tips.driver.title')
                }
                description={
                  isContextLost
                    ? t('webgl.context_lost.tips.load.description')
                    : t('webgl.unavailable.tips.driver.description')
                }
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {onContinue && (
                <m.button
                  className="ds-button-primary"
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onContinue}
                >
                  {t('webgl.actions.continue_without_3d')}
                </m.button>
              )}
              <m.button
                className={onContinue ? 'ds-button-secondary' : 'ds-button-primary'}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={14} />
                {t('webgl.actions.try_again')}
              </m.button>

              <m.a
                className="ds-button-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://gabrielfeijo.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                {t('webgl.actions.open_portfolio_v1')}
              </m.a>
            </div>
          </div>
        </UISurface>
      </m.div>
    </div>
  );
}

function FallbackTip({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}) {
  return (
    <UIInset className="p-4 text-left">
      <UIIconTile icon={Icon} tone="warm" className="mb-3" />
      <div className="text-sm font-semibold text-(--fallback-text)">{title}</div>
      <p className="mt-2 text-xs leading-6 text-(--fallback-text-muted)">{description}</p>
    </UIInset>
  );
}
