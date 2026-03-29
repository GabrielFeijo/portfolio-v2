import { motion } from 'framer-motion'
import { ACCOMPLISHMENTS, CERTIFICATES } from '@/data/portfolio'

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export function AccomplishmentsPanel() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-7">
      <div>
        <div className="font-mono-space text-[11px] text-[#A855F7] tracking-[0.3em] mb-2">
          ◈ AETHER ARCHIVES — HONORS & MILESTONES
        </div>
        <p className="font-body-exo text-[13px] text-[rgba(240,244,255,0.5)] leading-snug">
          A constellation of achievements earned across the development universe.
        </p>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {ACCOMPLISHMENTS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative overflow-hidden rounded-xl text-center cursor-none"
            style={{
              background: `rgba(${hexRgb(item.color)}, 0.06)`,
              border: `1px solid ${item.color}22`,
              padding: '20px 16px',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }}
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}09, transparent 70%)` }}
            />

            <div className="absolute top-2.5 right-2.5 font-mono-space text-[6px] tracking-[0.15em]
                            px-1.5 py-0.5 rounded-sm"
              style={{ color: item.color, border: `1px solid ${item.color}40` }}>
              {item.category.toUpperCase()}
            </div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[38px] mb-3.5"
            >
              {item.icon}
            </motion.div>

            <div className="font-display text-[11px] font-bold text-[#F0F4FF] tracking-[0.1em] mb-2 leading-snug">
              {item.title}
            </div>
            <p className="font-body-exo text-[11px] leading-snug text-[rgba(240,244,255,0.5)]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="font-display text-[11px] text-[#A855F7] tracking-[0.3em]">◈ CERTIFICATIONS</div>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #A855F730, transparent)' }} />
        </div>

        <div className="flex flex-col gap-2.5">
          {CERTIFICATES.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.4 }}
              whileHover={{ x: 6 }}
              className="flex items-center justify-between rounded-r-xl p-4 cursor-none
                         bg-[rgba(2,2,21,0.7)] border border-[rgba(255,255,255,0.07)]"
              style={{ borderLeft: `3px solid ${cert.color}` }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cert.color, boxShadow: `0 0 8px ${cert.color}` }} />
                <div>
                  <div className="font-body-exo text-[13px] font-semibold text-[#F0F4FF]">{cert.name}</div>
                  <div className="font-mono-space text-[9px] text-[rgba(240,244,255,0.4)] tracking-[0.1em] mt-0.5">
                    {cert.issuer}
                  </div>
                </div>
              </div>
              <div className="font-display text-[12px] font-bold tracking-[0.1em]" style={{ color: cert.color }}>
                {cert.year}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
