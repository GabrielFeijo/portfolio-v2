import { motion } from 'framer-motion'
import { BookOpen, Compass, MousePointerClick, Sparkles, X } from 'lucide-react'
import { useSpaceStore } from '@/store/space-store'

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
  const { closeHelp, setCursorVariant } = useSpaceStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-8"
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
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-hidden rounded-[32px] border border-[rgba(255,184,0,0.22)]
                   bg-[linear-gradient(145deg,rgba(10,12,24,0.92),rgba(4,6,16,0.88))]
                   shadow-[0_24px_120px_rgba(0,0,0,0.5),0_0_80px_rgba(255,122,26,0.12)] pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,184,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.35) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <button
          type="button"
          onClick={closeHelp}
          onMouseEnter={() => setCursorVariant('link')}
          onMouseLeave={() => setCursorVariant('default')}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-none items-center justify-center rounded-full
                     border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] text-white transition-colors
                     hover:bg-[rgba(255,255,255,0.12)]"
        >
          <X size={18} />
        </button>

        <div className="relative grid max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto lg:grid-cols-[1.15fr_0.85fr]">
          <section className="border-b border-[rgba(255,255,255,0.08)] px-5 py-6 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:border-r-[rgba(255,255,255,0.08)]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,184,0,0.2)] bg-[rgba(255,184,0,0.08)] px-4 py-2 text-[11px] tracking-[0.28em] text-[#FFD67A] uppercase">
              <Sparkles size={14} />
              Guia de bordo
            </div>

            <h2 className="max-w-2xl font-display text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
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

            <div className="mt-8 rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
              <div className="mb-4 text-[11px] font-mono-space uppercase tracking-[0.3em] text-[rgba(255,214,122,0.72)]">
                Como navegar
              </div>
              <div className="space-y-3">
                {quickSteps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(6,8,20,0.55)] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,184,0,0.12)] text-sm font-semibold text-[#FFD67A]">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-[rgba(240,244,255,0.75)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-4 text-[11px] font-mono-space uppercase tracking-[0.3em] text-[rgba(255,214,122,0.72)]">
              O que cada planeta mostra
            </div>

            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-3xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
                >
                  <div className="font-display text-lg font-bold uppercase tracking-[0.08em] text-white">
                    {section.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgba(240,244,255,0.68)]">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-[rgba(255,184,0,0.12)] bg-[rgba(255,184,0,0.06)] p-5">
              <div className="text-[11px] font-mono-space uppercase tracking-[0.28em] text-[#FFD67A]">
                Resumo do projeto
              </div>
              <p className="mt-3 text-sm leading-6 text-[rgba(240,244,255,0.75)]">
                Aqui você encontra minha trajetória, competências, projetos, experiências e formas de contato em uma
                navegação espacial imersiva, pensada para transformar leitura em exploração.
              </p>
            </div>
          </aside>
        </div>
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
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(255,184,0,0.12)] text-[#FFD67A]">
        <Icon size={20} />
      </div>
      <div className="font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-[rgba(240,244,255,0.68)]">
        {description}
      </p>
    </div>
  )
}
