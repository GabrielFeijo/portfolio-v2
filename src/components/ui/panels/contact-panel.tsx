import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, Globe, Send, MapPin } from 'lucide-react'

const contactLinks = [
  { icon: Code, label: 'GitHub', href: DEVELOPER.github, desc: 'Follow my work' },
  { icon: Briefcase, label: 'LinkedIn', href: DEVELOPER.linkedin, desc: 'Professional profile' },
  { icon: Mail, label: 'Email', href: `mailto:${DEVELOPER.email}`, desc: DEVELOPER.email },
  { icon: Globe, label: 'Website', href: DEVELOPER.website, desc: 'My portfolio' },
]

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3500)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">

      <div>
        <h2 className="text-lg font-semibold text-(--text-primary) mb-2">
          Get In Touch
        </h2>
        <p className="text-sm text-(--text-secondary) leading-relaxed mb-4">
          Feel free to reach out for opportunities, collaborations, or just to have a conversation about technology and engineering.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-(--accent-blue-bright)" />
          <span className="text-(--text-secondary)">{DEVELOPER.location}</span>
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {contactLinks.map(link => {
          const Icon = link.icon
          return (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={!link.href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="flex items-start gap-3 p-4 rounded-lg glass border border-(--border)
                        no-underline cursor-none transition-all hover:border-(--accent-blue)"
            >
              <Icon size={18} className="text-(--accent-blue-bright) shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-(--text-primary)">
                  {link.label}
                </div>
                <div className="text-xs text-(--text-muted) mt-0.5 truncate">
                  {link.desc}
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>

      <div className="glass rounded-lg p-6 border border-(--border)">
        <h3 className="text-sm font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
          <Send size={16} />
          Send a Message
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            required
            className="px-3.5 py-2.5 rounded-lg bg-(--surface) border border-(--border)
                     text-(--text-primary) text-sm placeholder-(--text-muted)
                     transition-colors focus:outline-none focus:border-(--accent-blue)
                     cursor-none"
          />

          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            required
            className="px-3.5 py-2.5 rounded-lg bg-(--surface) border border-(--border)
                     text-(--text-primary) text-sm placeholder-(--text-muted)
                     transition-colors focus:outline-none focus:border-(--accent-blue)
                     cursor-none"
          />

          <textarea
            placeholder="Your message..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            rows={4}
            required
            className="px-3.5 py-2.5 rounded-lg bg-(--surface) border border-(--border)
                     text-(--text-primary) text-sm placeholder-(--text-muted) resize-none
                     transition-colors focus:outline-none focus:border-(--accent-blue)
                     cursor-none"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="px-4 py-2.5 rounded-lg bg-(--accent-blue) text-white font-medium text-sm
                     cursor-none transition-colors hover:bg-[#0969DA]"
          >
            {sent ? '✓ Message sent!' : 'Send Message'}
          </motion.button>
        </form>
      </div>

    </motion.div>
  )
}
