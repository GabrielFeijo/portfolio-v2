import { useRef } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Compass, MousePointerClick, Sparkles, X } from 'lucide-react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useSpaceStore } from '@/store/space-store'
import { UIBadge, UIIconTile, UIInset, UISurface } from '../design-system'
import { createCursorHandlers } from '../panels/panel-primitives'

const quickSteps = [
  'Clique em um planeta para abrir a seção correspondente do portfólio.',
  'Use os botões de próximo e anterior dentro dos painéis para navegar entre as áreas.',
  'Clique fora do painel para fechar e voltar à visão completa do universo.',
]

const sections = [
  { title: 'Sobre', description: 'Quem eu sou, trajetória, formação e visão profissional.' },
  { title: 'Habilidades', description: 'Stack principal, ferramentas e capacidades técnicas.' },
  { title: 'Projetos', description: 'Entregas em destaque, contexto e decisões de produto.' },
  { title: 'Experiência', description: 'Minha evolução profissional e principais responsabilidades.' },
  { title: 'Conquistas', description: 'Certificados, estudos, reconhecimentos e marcos relevantes.' },
  { title: 'Contato', description: 'Links e canais para conversarmos sobre oportunidades.' },
]

export function HelpOverlay() {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const { closeHelp, setCursorVariant } = useSpaceStore()
  const linkCursor = createCursorHandlers(setCursorVariant)
  useFocusTrap(dialogRef, true)

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-overlay-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-250 flex items-center justify-center p-4 sm:p-8"
    >
      <div
        className="absolute inset-0 bg-[rgba(2,4,12,0.72)] backdrop-blur-md pointer-events-auto cursor-none"
        onClick={closeHelp}
        onMouseEnter={() => setCursorVariant('default')}
      />

      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl pointer-events-auto"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <UISurface strong className="max-h-[calc(100vh-2rem)] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,184,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.35) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <button
            type="button"
            onClick={closeHelp}
            {...linkCursor}
            aria-label="Fechar ajuda"
            className="absolute right-5 top-5 z-10 cursor-none"
          >
            <UIIconTile icon={X} tone="warm" />
          </button>

          <div className="relative grid max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto lg:grid-cols-[1.15fr_0.85fr]">
            <section className="border-b border-[rgba(255,255,255,0.08)] px-5 py-6 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:border-r-[rgba(255,255,255,0.08)]">
              <UIBadge tone="warm" className="mb-6 font-mono-space text-[11px] uppercase tracking-[0.28em]">
                <Sparkles size={14} />
                Guia de bordo
              </UIBadge>

              <h2 id="help-overlay-title" className="max-w-2xl font-display text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
                O sol agora guia a sua navegação
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(240,244,255,0.72)] sm:text-[15px]">
                Este portfólio foi pensado como um universo interativo. O sol funciona como ponto central de ajuda:
                ao clicar nele, o visitante entende rapidamente o conceito do projeto, o que cada planeta representa e
                qual é a melhor forma de explorar tudo sem se perder.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <InfoCard
                  icon={MousePointerClick}
                  title="Interação principal"
                  description="Clique nos planetas para abrir cada parte do portfólio."
                />
                <InfoCard
                  icon={Compass}
                  title="Fluxo sugerido"
                  description="Comece por Sobre ou Projetos para entender rápido meu perfil."
                />
                <InfoCard
                  icon={BookOpen}
                  title="Leitura guiada"
                  description="Use os painéis laterais para aprofundar cada seção no seu ritmo."
                />
              </div>

              <UIInset className="mt-8 p-5 sm:p-6">
                <div className="mb-4 text-[11px] font-mono-space uppercase tracking-[0.3em] text-[rgba(255,214,122,0.72)]">
                  Como navegar
                </div>
                <div className="space-y-3">
                  {quickSteps.map((step, index) => (
                    <UIInset key={step} className="flex gap-4 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,184,0,0.12)] text-sm font-semibold text-[#FFD67A]">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-[rgba(240,244,255,0.75)]">{step}</p>
                    </UIInset>
                  ))}
                </div>
              </UIInset>
            </section>

            <aside className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="mb-4 text-[11px] font-mono-space uppercase tracking-[0.3em] text-[rgba(255,214,122,0.72)]">
                O que cada planeta mostra
              </div>

              <div className="space-y-3">
                {sections.map((section) => (
                  <UIInset key={section.title} className="px-4 py-4">
                    <div className="font-display text-lg font-bold uppercase tracking-[0.08em] text-white">
                      {section.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[rgba(240,244,255,0.68)]">
                      {section.description}
                    </p>
                  </UIInset>
                ))}
              </div>

              <UIInset className="mt-6 border-[rgba(255,184,0,0.12)] bg-[rgba(255,184,0,0.06)] p-5">
                <div className="text-[11px] font-mono-space uppercase tracking-[0.28em] text-[#FFD67A]">
                  Resumo do projeto
                </div>
                <p className="mt-3 text-sm leading-6 text-[rgba(240,244,255,0.75)]">
                  Aqui você encontra minha trajetória, competências, projetos, experiências e formas de contato em uma
                  navegação espacial imersiva, pensada para transformar leitura em exploração.
                </p>
              </UIInset>
            </aside>
          </div>
        </UISurface>
      </motion.div>
    </motion.div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Compass
  title: string
  description: string
}) {
  return (
    <UIInset className="p-5">
      <UIIconTile icon={Icon} tone="warm" className="mb-4" />
      <div className="font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-[rgba(240,244,255,0.68)]">
        {description}
      </p>
    </UIInset>
  )
}
