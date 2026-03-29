import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

const contactLinks = [
  { icon: '⬡', label: 'GITHUB',   href: DEVELOPER.github,              color: '#F0F4FF', desc: 'View my code' },
  { icon: '◈', label: 'LINKEDIN', href: DEVELOPER.linkedin,             color: '#0A66C2', desc: 'Professional network' },
  { icon: '✉', label: 'EMAIL',    href: `mailto:${DEVELOPER.email}`,    color: '#00FF88', desc: DEVELOPER.email },
  { icon: '⊙', label: 'WEBSITE',  href: DEVELOPER.website,              color: '#00D4FF', desc: 'gabrielfeijo.com.br' },
]

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-7">
      <div>
        <div className="font-mono-space text-[11px] text-[#FF69B4] tracking-[0.3em] mb-3">
          ◈ BEACON SIGNAL — OPEN TRANSMISSION
        </div>
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
          <span className="font-body-exo text-[14px] text-[#00FF88]">
            Available for new missions and collaborations
          </span>
        </motion.div>
        <p className="font-body-exo text-[13px] text-[rgba(240,244,255,0.55)] leading-relaxed">
          Intercepting signals from all quadrants of the galaxy.
          Whether you have a project in mind or just want to connect — transmission accepted.
        </p>
      </div>

      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {contactLinks.map(link => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="flex items-center gap-3.5 rounded-xl p-4 no-underline cursor-none transition-all duration-200"
            style={{
              background: `rgba(${hexRgb(link.color)}, 0.06)`,
              border: `1px solid ${link.color}25`,
            }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 text-base"
              style={{
                background: `rgba(${hexRgb(link.color)}, 0.12)`,
                border: `1px solid ${link.color}30`,
                color: link.color,
              }}
            >
              {link.icon}
            </div>
            <div>
              <div className="font-display text-[10px] font-bold tracking-[0.2em]" style={{ color: link.color }}>
                {link.label}
              </div>
              <div className="font-mono-space text-[8px] text-[rgba(240,244,255,0.4)] tracking-[0.05em] mt-0.5">
                {link.desc}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div
        className="bg-[rgba(2,2,21,0.7)] rounded-xl p-6 relative"
        style={{ border: '1px solid rgba(255,105,180,0.2)' }}
      >
        <div className="font-display text-[11px] text-[#FF69B4] tracking-[0.3em] mb-5">◈ DIRECT TRANSMISSION</div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 0.5 }}
                className="text-[52px]"
              >📡</motion.div>
              <div className="font-display text-[14px] text-[#00FF88] tracking-[0.2em]">
                SIGNAL TRANSMITTED!
              </div>
              <div className="font-mono-space text-[11px] text-[rgba(240,244,255,0.5)] tracking-[0.1em]">
                I'll respond within 24 Earth hours.
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {[
                { key: 'name',  label: 'YOUR NAME',       placeholder: 'Commander Doe',            type: 'text' },
                { key: 'email', label: 'COMM FREQUENCY',  placeholder: 'commander@galaxy.com',     type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block font-mono-space text-[9px] text-[rgba(240,244,255,0.4)] tracking-[0.25em] mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    onFocus={() => setFocused(field.key)}
                    onBlur={() => setFocused(null)}
                    placeholder={field.placeholder}
                    className="w-full rounded font-mono-space text-[12px] text-[#F0F4FF]
                               bg-[rgba(0,0,8,0.6)] outline-none px-4 py-3 cursor-none
                               placeholder:text-[rgba(240,244,255,0.2)] transition-all duration-200"
                    style={{
                      border: `1px solid ${focused === field.key ? '#FF69B4' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: focused === field.key ? '0 0 14px rgba(255,105,180,0.2)' : 'none',
                    }}
                  />
                </div>
              ))}

              <div>
                <label className="block font-mono-space text-[9px] text-[rgba(240,244,255,0.4)] tracking-[0.25em] mb-2">
                  TRANSMISSION MESSAGE
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder="Describe your mission..."
                  className="w-full resize-y rounded font-mono-space text-[12px] text-[#F0F4FF]
                             bg-[rgba(0,0,8,0.6)] outline-none px-4 py-3 cursor-none
                             placeholder:text-[rgba(240,244,255,0.2)] transition-all duration-200"
                  style={{
                    border: `1px solid ${focused === 'message' ? '#FF69B4' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: focused === 'message' ? '0 0 14px rgba(255,105,180,0.2)' : 'none',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setCursorVariant('link')}
                onMouseLeave={() => setCursorVariant('default')}
                className="font-display text-[11px] font-bold tracking-[0.3em] text-[#F0F4FF]
                           rounded-lg px-7 py-3.5 cursor-none border-0 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FF1493, #FF69B4)',
                  boxShadow: '0 0 28px rgba(255,20,147,0.4)',
                }}
              >
                ◈ TRANSMIT SIGNAL
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
