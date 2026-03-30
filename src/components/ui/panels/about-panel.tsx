import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, ExternalLink } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

export function AboutPanel() {
  const { setCursorVariant } = useSpaceStore()

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-12">

      {/* Header with Avatar */}
      <motion.div variants={item} className="flex gap-8 items-start">
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-12px] rounded-full border border-[rgba(31,111,235,0.15)]"
          />
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-[#1F6FEB] to-[#58A6FF]
                       border border-[rgba(31,111,235,0.2)]"
          >
            <span className="text-5xl font-bold text-white">GF</span>
          </div>
        </div>

        <div className="flex-1 pt-2">
          <motion.h1
            variants={item}
            className="text-4xl font-bold tracking-tight mb-2
                       text-[var(--text-primary)]"
          >
            {DEVELOPER.name}
          </motion.h1>
          <motion.div variants={item} className="flex flex-col gap-3 mb-6">
            <div>
              <div className="text-sm font-medium text-[var(--accent-blue-bright)]">{DEVELOPER.title}</div>
              <div className="text-sm text-[var(--text-secondary)]">{DEVELOPER.location}</div>
            </div>
          </motion.div>
          <motion.p variants={item} className="text-[var(--text-secondary)] leading-relaxed text-sm max-w-md">
            {DEVELOPER.bio}
          </motion.p>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={item} className="flex gap-4 flex-wrap">
        <motion.a
          href={DEVELOPER.github}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setCursorVariant('link')}
          onMouseLeave={() => setCursorVariant('default')}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg glass text-sm font-medium text-[var(--text-primary)]
                     border border-[var(--border)] hover:border-[var(--accent-blue-bright)]
                     transition-colors cursor-none"
        >
          <Code size={16} />
          GitHub
        </motion.a>
        <motion.a
          href={DEVELOPER.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setCursorVariant('link')}
          onMouseLeave={() => setCursorVariant('default')}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg glass text-sm font-medium text-[var(--text-primary)]
                     border border-[var(--border)] hover:border-[var(--accent-blue-bright)]
                     transition-colors cursor-none"
        >
          <Briefcase size={16} />
          LinkedIn
        </motion.a>
        <motion.a
          href={`mailto:${DEVELOPER.email}`}
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setCursorVariant('link')}
          onMouseLeave={() => setCursorVariant('default')}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg glass text-sm font-medium text-[var(--text-primary)]
                     border border-[var(--border)] hover:border-[var(--accent-blue-bright)]
                     transition-colors cursor-none"
        >
          <Mail size={16} />
          Email
        </motion.a>
      </motion.div>

      {/* About Section */}
      <motion.div
        variants={item}
        className="p-6 rounded-lg glass border border-[var(--border)]"
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          About
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          I'm a full stack engineer with 4+ years building web applications at scale.
          My expertise spans React, TypeScript, Node.js, and cloud infrastructure.
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          I'm passionate about clean code, scalable architecture, and creating digital experiences that matter.
          Currently working with CI&T on innovative technologies, and always exploring new ways to solve complex problems.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[var(--surface-light)] border border-[var(--border)]">
          <div className="text-2xl font-bold text-[var(--accent-blue-bright)] mb-1">4+</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">Years</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--surface-light)] border border-[var(--border)]">
          <div className="text-2xl font-bold text-[var(--accent-blue-bright)] mb-1">10+</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">Companies</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--surface-light)] border border-[var(--border)]">
          <div className="text-2xl font-bold text-[var(--accent-blue-bright)] mb-1">50+</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">Projects</div>
        </div>
      </motion.div>

    </motion.div>
  )
}
