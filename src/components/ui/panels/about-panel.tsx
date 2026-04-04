import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, GraduationCap, Sparkles, MapPin, Radar } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

export function AboutPanel() {
  const { setCursorVariant } = useSpaceStore()

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-8 sm:gap-10">
      <motion.section variants={item} className="panel-card-strong p-6 sm:p-7">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full panel-planet-badge text-[11px] tracking-[0.2em] uppercase font-mono-space">
              <Radar size={12} />
              Perfil em foco
            </div>

            <motion.h1 variants={item} className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-(--text-primary)">
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

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEVELOPER.stats.map((stat, index) => (
          <div
            key={stat.label}
            className="panel-card relative overflow-hidden p-4 sm:p-5"
            style={{
              background: `linear-gradient(180deg, rgba(18,28,52,0.86), rgba(8,13,25,0.72)), radial-gradient(circle at top right, ${
                index === 0 ? 'var(--panel-accent-soft)' : index === 1 ? 'color-mix(in srgb, var(--panel-glow) 18%, transparent)' : 'color-mix(in srgb, var(--panel-accent) 12%, transparent)'
              }, transparent 45%)`,
            }}
          >
            <div className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{stat.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-(--text-muted)">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="flex gap-3 flex-wrap">
        <ContactButton href={DEVELOPER.github} label="GitHub" icon={Code} setCursorVariant={setCursorVariant} />
        <ContactButton href={DEVELOPER.linkedin} label="LinkedIn" icon={Briefcase} setCursorVariant={setCursorVariant} />
        <ContactButton href={`mailto:${DEVELOPER.email}`} label="Email" icon={Mail} setCursorVariant={setCursorVariant} />
      </motion.div>

      <PanelBlock icon={Sparkles} eyebrow="Identidade" title="Sobre mim">
        {DEVELOPER.summary.map((paragraph) => (
          <p key={paragraph} className="text-sm text-(--text-secondary) leading-7 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </PanelBlock>

      <PanelBlock icon={GraduationCap} eyebrow="Base acadêmica" title="Formação">
        {DEVELOPER.education.map((entry) => (
          <div key={entry.title} className="panel-card rounded-[20px] p-5">
            <div className="text-base font-semibold text-(--text-primary)">{entry.title}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] panel-eyebrow">
              {entry.institution} • {entry.period}
            </div>
            <p className="text-sm text-(--text-secondary) leading-7 mt-4">{entry.description}</p>
          </div>
        ))}
      </PanelBlock>

      <PanelBlock icon={Code} eyebrow="Abordagem" title="Visão de trabalho">
        <p className="text-sm text-(--text-secondary) leading-7 mb-4">{DEVELOPER.bio}</p>
        <div className="rounded-[18px] panel-planet-badge px-4 py-3 text-sm text-(--text-primary)">
          {DEVELOPER.availability}
        </div>
      </PanelBlock>
    </motion.div>
  )
}

function PanelBlock({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: typeof Sparkles
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.section variants={item} className="panel-shell p-6 sm:p-7">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">{eyebrow}</div>
          <h2 className="mt-1 text-xl font-semibold text-(--text-primary)">{title}</h2>
        </div>
      </div>
      {children}
    </motion.section>
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
  setCursorVariant: (variant: 'default' | 'planet' | 'link' | 'drag') => void
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      whileHover={{ y: -2, scale: 1.02 }}
      onMouseEnter={() => setCursorVariant('link')}
      onMouseLeave={() => setCursorVariant('default')}
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
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full panel-meta-chip">
      <Icon size={13} />
      <span>{label}</span>
    </div>
  )
}
