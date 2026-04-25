import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Gauge, MonitorCog, Music, RotateCcw, Settings, SlidersHorizontal, Sparkles, Volume2, X, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useSpaceStore } from '@/store/space-store'
import type { ExperiencePreset, ExperienceSettings } from '@/types/store'
import { UIBadge, UIIconTile, UIInset, UISurface } from '../design-system'
import { createCursorHandlers } from '../panels/panel-primitives'

interface ToggleControlProps {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}

interface RangeControlProps {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step: number
  suffix?: string
  value: number
}

const PRESETS: Array<{ id: ExperiencePreset; label: string; description: string }> = [
  { id: 'cinematic', label: 'Cinematic', description: 'Tudo ligado no máximo.' },
  { id: 'balanced', label: 'Balanced', description: 'Visual cheio com custo menor.' },
  { id: 'performance', label: 'Performance', description: 'Mais leve para GPUs modestas.' },
  { id: 'minimal', label: 'Minimal', description: 'Foco em navegação fluida.' },
]

export function SettingsOverlay() {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const {
    applyExperiencePreset,
    closeSettings,
    resetExperienceSettings,
    setCursorVariant,
    setExperienceSetting,
    settings,
  } = useSpaceStore(useShallow((state) => ({
    applyExperiencePreset: state.applyExperiencePreset,
    closeSettings: state.closeSettings,
    resetExperienceSettings: state.resetExperienceSettings,
    setCursorVariant: state.setCursorVariant,
    setExperienceSetting: state.setExperienceSetting,
    settings: state.experienceSettings,
  })))
  const linkCursor = createCursorHandlers(setCursorVariant)
  useFocusTrap(dialogRef, true)

  const update = <Key extends keyof ExperienceSettings,>(key: Key, value: ExperienceSettings[Key]) => {
    setExperienceSetting(key, value)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-overlay-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-260 flex items-center justify-center p-4 sm:p-8"
    >
      <div
        className="absolute inset-0 bg-[rgba(2,4,12,0.72)] backdrop-blur-md pointer-events-auto cursor-none"
        onClick={closeSettings}
        onMouseEnter={() => setCursorVariant('default')}
      />

      <motion.div
        ref={dialogRef}
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-5xl pointer-events-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <UISurface strong className="max-h-[calc(100vh-2rem)] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(125,211,252,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.35) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <button
            type="button"
            onClick={closeSettings}
            {...linkCursor}
            aria-label="Fechar configurações"
            className="absolute right-5 top-5 z-10 cursor-none"
          >
            <UIIconTile icon={X} />
          </button>

          <div className="relative max-h-[calc(100vh-2rem)] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <UIBadge className="mb-5 font-mono-space text-[11px] uppercase tracking-[0.28em]">
                  <Settings size={14} />
                  Experience controls
                </UIBadge>
                <h2 id="settings-overlay-title" className="font-display text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
                  Configurações globais
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(240,244,255,0.72)] sm:text-[15px]">
                  Ajuste a intensidade visual da cena, das animações e dos efeitos para priorizar imersão ou performance.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {PRESETS.map((preset) => (
                <motion.button
                  key={preset.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyExperiencePreset(preset.id)}
                  {...linkCursor}
                  className="ds-inset cursor-none p-4 text-left transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <div className="font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
                    {preset.label}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[rgba(240,244,255,0.62)]">
                    {preset.description}
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
              <SettingsGroup icon={Zap} title="Animações">
                <ToggleControl checked={settings.transitionAnimations} label="Entrada e saída de planetas" onChange={(checked) => update('transitionAnimations', checked)} />
                <ToggleControl checked={settings.warpEffects} label="Efeito warp" onChange={(checked) => update('warpEffects', checked)} />
                <ToggleControl checked={settings.autoRotate} label="Rotação automática da câmera" onChange={(checked) => update('autoRotate', checked)} />
                <ToggleControl checked={settings.planetRotation} label="Rotação dos planetas" onChange={(checked) => update('planetRotation', checked)} />
              </SettingsGroup>

              <SettingsGroup icon={Sparkles} title="Elementos visuais">
                <ToggleControl checked={settings.nebula} label="Nebulosas" onChange={(checked) => update('nebula', checked)} />
                <ToggleControl checked={settings.shootingStars} label="Estrelas cadentes" onChange={(checked) => update('shootingStars', checked)} />
                <ToggleControl checked={settings.orbitalParticles} label="Partículas orbitais" onChange={(checked) => update('orbitalParticles', checked)} />
                <ToggleControl checked={settings.shadows} label="Sombras WebGL" onChange={(checked) => update('shadows', checked)} />
              </SettingsGroup>

              <SettingsGroup icon={Music} title="Trilha sonora">
                <ToggleControl checked={settings.musicEnabled} label="Música espacial ambiente" onChange={(checked) => update('musicEnabled', checked)} />
                <RangeControl label="Volume da música" min={0} max={0.8} step={0.01} value={settings.musicVolume} suffix="%" onChange={(value) => update('musicVolume', value)} />
                <UIInset className="p-4">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-mono-space uppercase tracking-[0.24em] text-[rgba(125,211,252,0.78)]">
                    <Volume2 size={14} />
                    Ambient orbital
                  </div>
                  <p className="text-xs leading-5 text-[rgba(240,244,255,0.66)]">
                    Uma trilha sonora atmosférica e imersiva, com pads etéreos e profundidade orbital para acompanhar sua jornada pelo cosmos.
                  </p>
                  <div className="mt-3 border-t border-[rgba(255,255,255,0.06)] pt-3 text-[10px] uppercase tracking-wider text-[rgba(240,244,255,0.45)]">
                    Música por <a href="https://pixabay.com/users/leberch-42823964/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=509783" target="_blank" rel="noopener noreferrer" className="text-[rgba(125,211,252,0.6)] underline-offset-4 hover:underline" {...linkCursor}>Nikita Kondrashev</a> via <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=509783" target="_blank" rel="noopener noreferrer" className="text-[rgba(125,211,252,0.6)] underline-offset-4 hover:underline" {...linkCursor}>Pixabay</a>
                  </div>
                </UIInset>
              </SettingsGroup>

              <SettingsGroup icon={SlidersHorizontal} title="Densidade da cena">
                <RangeControl label="Campo de estrelas" min={0.1} max={1} step={0.05} value={settings.starDensity} suffix="%" onChange={(value) => update('starDensity', value)} />
                <RangeControl label="Cinturão de asteroides" min={0} max={1} step={0.05} value={settings.asteroidDensity} suffix="%" onChange={(value) => update('asteroidDensity', value)} />
              </SettingsGroup>

              <SettingsGroup icon={MonitorCog} title="Renderização">
                <ToggleControl checked={settings.antialias} label="Antialias" onChange={(checked) => update('antialias', checked)} />
                <RangeControl label="DPR do canvas" min={1} max={1.8} step={0.05} value={settings.dpr} onChange={(value) => update('dpr', value)} />
                <UIInset className="p-4">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-mono-space uppercase tracking-[0.24em] text-[rgba(125,211,252,0.78)]">
                    <Gauge size={14} />
                    Estado atual
                  </div>
                  <p className="text-xs leading-5 text-[rgba(240,244,255,0.66)]">
                    Default máximo: todas as opções ligadas, densidade total e DPR em 1.8.
                  </p>
                </UIInset>
              </SettingsGroup>
            </div>
          </div>
        </UISurface>
      </motion.div>
    </motion.div>
  )
}

function SettingsGroup({ children, icon: Icon, title }: { children: ReactNode; icon: LucideIcon; title: string }) {
  return (
    <UIInset className="p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <UIIconTile icon={Icon} className="h-10 w-10" />
        <div className="font-display text-lg font-bold uppercase tracking-[0.08em] text-white">
          {title}
        </div>
      </div>
      <div className="grid gap-3">
        {children}
      </div>
    </UIInset>
  )
}

function ToggleControl({ checked, label, onChange }: ToggleControlProps) {
  return (
    <label className="flex min-h-12 cursor-none items-center justify-between gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] px-4 py-3">
      <span className="text-sm text-[rgba(240,244,255,0.78)]">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#7dd3fc]"
      />
    </label>
  )
}

function RangeControl({ label, max, min, onChange, step, suffix, value }: RangeControlProps) {
  const displayValue = suffix === '%' ? Math.round(value * 100) : value.toFixed(2)

  return (
    <label className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm text-[rgba(240,244,255,0.78)]">{label}</span>
        <span className="font-mono-space text-xs text-[rgba(125,211,252,0.8)]">
          {displayValue}{suffix ?? ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#7dd3fc]"
      />
    </label>
  )
}
