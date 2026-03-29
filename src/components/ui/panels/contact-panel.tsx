import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'

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

  const contactLinks = [
    { icon: '⬡', label: 'GITHUB', href: DEVELOPER.github, color: '#F0F4FF', desc: 'View my code' },
    { icon: '◈', label: 'LINKEDIN', href: DEVELOPER.linkedin, color: '#0A66C2', desc: 'Professional network' },
    { icon: '✉', label: 'EMAIL', href: `mailto:${DEVELOPER.email}`, color: '#00FF88', desc: DEVELOPER.email },
    { icon: '⊙', label: 'WEBSITE', href: DEVELOPER.website, color: '#00D4FF', desc: 'gabrielfeijo.com.br' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
    >
      <div>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: '#FF69B4',
          letterSpacing: '0.3em', marginBottom: 8,
        }}>
          ◈ BEACON SIGNAL — OPEN TRANSMISSION
        </div>

        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF88' }} />
          <span style={{
            fontFamily: 'Exo 2, sans-serif',
            fontSize: 14, color: '#00FF88',
          }}>
            Available for new missions and collaborations
          </span>
        </motion.div>

        <p style={{
          fontFamily: 'Exo 2, sans-serif',
          fontSize: 13, color: 'rgba(240,244,255,0.55)',
          lineHeight: 1.7,
        }}>
          Intercepting signals from all quadrants of the galaxy.
          Whether you have a project in mind, want to collaborate,
          or just want to connect — transmission accepted.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
      }}>
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
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: `rgba(${hexRgb(link.color)}, 0.06)`,
              border: `1px solid ${link.color}25`,
              borderRadius: 10, padding: '14px 18px',
              textDecoration: 'none', cursor: 'none',
            }}
          >
            <div style={{
              width: 36, height: 36,
              background: `rgba(${hexRgb(link.color)}, 0.12)`,
              border: `1px solid ${link.color}30`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: link.color, fontSize: 16,
              flexShrink: 0,
            }}>
              {link.icon}
            </div>
            <div>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 10, fontWeight: 700,
                color: link.color, letterSpacing: '0.2em',
              }}>
                {link.label}
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 8, color: 'rgba(240,244,255,0.4)',
                letterSpacing: '0.05em', marginTop: 3,
              }}>
                {link.desc}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div style={{
        background: 'rgba(2,2,21,0.7)',
        border: '1px solid rgba(255,105,180,0.2)',
        borderRadius: 12, padding: 24,
        position: 'relative',
      }}>
        <div style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 11, color: '#FF69B4',
          letterSpacing: '0.3em', marginBottom: 20,
        }}>
          ◈ DIRECT TRANSMISSION
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center', padding: '40px 20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 16,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: 48 }}
              >
                📡
              </motion.div>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 14, color: '#00FF88',
                letterSpacing: '0.2em',
              }}>
                SIGNAL TRANSMITTED!
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 11, color: 'rgba(240,244,255,0.5)',
                letterSpacing: '0.1em',
              }}>
                I'll respond within 24 Earth hours.
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {[
                { key: 'name', label: 'YOUR NAME', placeholder: 'Commander Doe', type: 'text' },
                { key: 'email', label: 'COMM FREQUENCY', placeholder: 'commander@galaxy.com', type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 9, color: 'rgba(240,244,255,0.4)',
                    letterSpacing: '0.25em', marginBottom: 8,
                  }}>
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
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,8,0.6)',
                      border: `1px solid ${focused === field.key ? '#FF69B4' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 6, padding: '12px 16px',
                      color: '#F0F4FF',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 12, letterSpacing: '0.05em',
                      outline: 'none',
                      boxShadow: focused === field.key ? '0 0 12px rgba(255,105,180,0.2)' : 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      cursor: 'none',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 9, color: 'rgba(240,244,255,0.4)',
                  letterSpacing: '0.25em', marginBottom: 8,
                }}>
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
                  style={{
                    width: '100%', resize: 'vertical',
                    background: 'rgba(0,0,8,0.6)',
                    border: `1px solid ${focused === 'message' ? '#FF69B4' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 6, padding: '12px 16px',
                    color: '#F0F4FF',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 12, letterSpacing: '0.05em',
                    outline: 'none',
                    boxShadow: focused === 'message' ? '0 0 12px rgba(255,105,180,0.2)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    cursor: 'none',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setCursorVariant('link')}
                onMouseLeave={() => setCursorVariant('default')}
                style={{
                  background: 'linear-gradient(135deg, #FF1493, #FF69B4)',
                  border: 'none', borderRadius: 8,
                  color: '#F0F4FF',
                  fontFamily: 'Orbitron, monospace',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.3em',
                  padding: '14px 28px', cursor: 'none',
                  boxShadow: '0 0 24px rgba(255,20,147,0.4)',
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

function hexRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
