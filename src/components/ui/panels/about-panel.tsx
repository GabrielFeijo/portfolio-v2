import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore, type CursorVariant } from '@/store/space-store'
import { Code, Briefcase, Mail, GraduationCap, Sparkles, MapPin, Radar } from 'lucide-react'
import {
  PanelBadge,
  PanelMetaChip,
  PanelSection,
  createCursorHandlers,
  panelFadeUp,
  panelStagger,
} from './panel-primitives'
import { PanelNotice } from './panel-content-primitives'

const STAT_TONES = [
  'var(--panel-accent-soft)',
  'color-mix(in srgb, var(--panel-glow) 18%, transparent)',
  'color-mix(in srgb, var(--panel-accent) 12%, transparent)',
]

export function AboutPanel() {
  const { setCursorVariant } = useSpaceStore()

  return (
    <motion.div variants={panelStagger} initial="hidden" animate="visible" className="flex flex-col gap-8 sm:gap-10">
      <motion.section variants={panelFadeUp} className="panel-card-strong p-6 sm:p-7">
        <div className="panel-orbit-grid" />
        <div className="panel-surface-dust" />
        <div className="panel-orbit-ring -right-14 -top-16 h-44 w-44" />
        <div className="panel-core-glow right-8 top-8 h-24 w-24" />

        <div className="relative flex gap-6 items-start flex-col sm:flex-row">
          <div className="relative shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border"
              style={{ borderColor: 'var(--panel-border)', borderStyle: 'dashed' }}
            />
            <img
              src={DEVELOPER.profileImage}
              alt={DEVELOPER.name}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-[28px] object-cover border shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              style={{ borderColor: 'var(--panel-border-strong)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <PanelBadge className="text-[11px] tracking-[0.2em] uppercase font-mono-space">
              <Radar size={12} />
              Perfil em foco
            </PanelBadge>

            <motion.h1 variants={panelFadeUp} className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-(--text-primary)">
              {DEVELOPER.name}
            </motion.h1>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <InfoPill icon={Sparkles} label={DEVELOPER.title} />
              <InfoPill icon={MapPin} label={`${DEVELOPER.location} • ${DEVELOPER.age} anos`} />
            </div>

            <p className="mt-5 text-sm sm:text-[15px] text-(--text-secondary) leading-7 max-w-2xl">
              {DEVELOPER.tagline}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.div variants={panelFadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEVELOPER.stats.map((stat, index) => (
          <div
            key={stat.label}
            className="panel-card relative overflow-hidden p-4 sm:p-5"
            style={{
              background: `linear-gradient(180deg, rgba(18,28,52,0.86), rgba(8,13,25,0.72)), radial-gradient(circle at top right, ${STAT_TONES[index] ?? STAT_TONES[0]}, transparent 45%)`,
            }}
          >
            <div className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{stat.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-(--text-muted)">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={panelFadeUp} className="flex gap-3 flex-wrap">
        <ContactButton href={DEVELOPER.github} label="GitHub" icon={Code} setCursorVariant={setCursorVariant} />
        <ContactButton href={DEVELOPER.linkedin} label="LinkedIn" icon={Briefcase} setCursorVariant={setCursorVariant} />
        <ContactButton href={`mailto:${DEVELOPER.email}`} label="Email" icon={Mail} setCursorVariant={setCursorVariant} />
      </motion.div>

      <PanelSection icon={Sparkles} eyebrow="Identidade" title="Sobre mim">
        {DEVELOPER.summary.map((paragraph) => (
          <p key={paragraph} className="text-sm text-(--text-secondary) leading-7 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </PanelSection>

      <PanelSection icon={GraduationCap} eyebrow="Base acadêmica" title="Formação">
        {DEVELOPER.education.map((entry) => (
          <div key={entry.title} className="panel-card rounded-[20px] p-5">
            <div className="text-base font-semibold text-(--text-primary)">{entry.title}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] panel-eyebrow">
              {entry.institution} • {entry.period}
            </div>
            <p className="text-sm text-(--text-secondary) leading-7 mt-4">{entry.description}</p>
          </div>
        ))}
      </PanelSection>

      <PanelSection icon={Code} eyebrow="Abordagem" title="Visão de trabalho">
        <p className="text-sm text-(--text-secondary) leading-7 mb-4">{DEVELOPER.bio}</p>
        <PanelNotice>{DEVELOPER.availability}</PanelNotice>
      </PanelSection>
    </motion.div>
  )
}

function ContactButton({
  href,
  label,
  icon: Icon,
  setCursorVariant,
}: {
  href: string
  label: string
  icon: typeof Code
  setCursorVariant: (variant: CursorVariant) => void
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      whileHover={{ y: -2, scale: 1.02 }}
      {...createCursorHandlers(setCursorVariant)}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl panel-card text-sm font-medium text-(--text-primary)
                 hover:opacity-95 transition-colors cursor-none"
    >
      <Icon size={16} />
      {label}
    </motion.a>
  )
}

function InfoPill({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <PanelMetaChip icon={Icon}>{label}</PanelMetaChip>
  )
}
