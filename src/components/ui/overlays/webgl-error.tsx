import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCcw, ShieldCheck, Cpu, AppWindow, ExternalLink } from 'lucide-react'
import { UIBadge, UIIconTile, UIInset, UISurface } from '../design-system'

export function WebGLError({ variant = 'unavailable' }: { variant?: 'unavailable' | 'context_lost' }) {
  useEffect(() => {
    document.body.classList.add('cursor-fallback-mode')

    return () => {
      document.body.classList.remove('cursor-fallback-mode')
    }
  }, [])

  const isContextLost = variant === 'context_lost'

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#040611] p-5 text-[#F0F4FF] font-body-exo">
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,122,26,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(0,212,255,0.12),transparent_32%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <UISurface strong className="flex max-h-[calc(100vh-2.5rem)] w-full max-w-160 flex-col overflow-hidden">
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-[rgba(255,122,26,0.2)]" />
          <div className="pointer-events-none absolute -left-8 bottom-6 h-24 w-24 rounded-full border border-[rgba(0,212,255,0.18)]" />

          <div className="relative overflow-y-auto px-6 py-7 sm:px-8 sm:py-8">
            <UIBadge tone="warm" className="mb-5 font-mono-space text-[11px] uppercase tracking-[0.28em]">
              <AlertTriangle size={14} />
              {isContextLost ? 'Conexão Gráfica Perdida' : 'Modo de compatibilidade'}
            </UIBadge>

            <div className="mb-6 flex items-start gap-4">
              <UIIconTile icon={AlertTriangle} tone="warm" className="h-15 w-15 shrink-0 rounded-[22px]" />

              <div>
                <h1 className="font-display text-[24px] font-extrabold uppercase tracking-[0.12em] text-[#FFF3E8] sm:text-[28px]">
                  {isContextLost ? 'Falha Crítica do WebGL' : 'WebGL Indisponível'}
                </h1>
                <p className="mt-3 max-w-[46ch] text-sm leading-7 text-[rgba(240,244,255,0.72)] sm:text-[15px]">
                  {isContextLost 
                    ? 'O universo 3D perdeu o acesso à sua placa de vídeo (Context Lost). O WebGL pode ter sido desativado pelo navegador por medidas de segurança.'
                    : 'Este portfólio precisa de WebGL para renderizar a experiência 3D. No momento, o navegador ou o hardware não conseguiu disponibilizar esse recurso.'}
                </p>
              </div>
            </div>

            {isContextLost ? (
              <UIInset className="mt-6 mb-6 border-[rgba(255,122,26,0.3)] bg-[rgba(255,60,0,0.08)] p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 font-mono-space text-[11.5px] font-semibold uppercase tracking-[0.24em] text-[#FF9066]">
                  <ShieldCheck size={14} />
                  Ação Necessária
                </div>
                <p className="text-sm font-medium leading-6 text-[#FFE4D6]">
                  Para ver o portfólio de forma interativa, <strong>será necessário fechar o seu navegador por completo e abri-lo novamente</strong>. Apenas recarregar a página não será suficiente se houve um bloqueio de hardware.
                </p>
              </UIInset>
            ) : (
              <UIInset className="mt-6 mb-6 p-4 sm:p-5">
                <div className="mb-2 font-mono-space text-[11px] uppercase tracking-[0.24em] text-[rgba(125,211,252,0.82)]">
                  O que está acontecendo
                </div>
                <p className="text-sm leading-7 text-[rgba(240,244,255,0.66)]">
                  Quando isso acontece, o universo 3D não consegue ser carregado com segurança. Nesta tela o cursor padrão do sistema
                  volta automaticamente, já que o cursor estilizado depende da interface principal ter sido iniciada.
                </p>
              </UIInset>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              <FallbackTip
                icon={AppWindow}
                title={isContextLost ? "Memória Esgotada" : "Atualize o navegador"}
                description={isContextLost ? "Muitas abas abertas simultaneamente podem estourar a memória de vídeo (VRAM)." : "Chrome, Edge, Firefox e Safari recentes costumam oferecer melhor suporte."}
              />
              <FallbackTip
                icon={ShieldCheck}
                title={isContextLost ? "Bloqueio por Proteção" : "Ative a aceleração"}
                description={isContextLost ? "Após um travamento, navegadores bloqueiam o uso do WebGL na aba atual por segurança." : "Verifique se a aceleração de hardware está habilitada nas configurações."}
              />
              <FallbackTip
                icon={Cpu}
                title={isContextLost ? "Sobrecarga Gráfica" : "Revise o driver"}
                description={isContextLost ? "Drivers e placas antigas podem forçar a interrupção após uso intenso do processador." : "Drivers gráficos desatualizados podem impedir a inicialização do WebGL."}
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <motion.button
                className="ds-button-primary"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={14} />
                TENTAR NOVAMENTE
              </motion.button>

              <motion.a
                className="ds-button-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href='https://gabrielfeijo.com.br'
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                ABRIR PORTFOLIO V1
              </motion.a>
            </div>
          </div>
        </UISurface>
      </motion.div>
    </div>
  )
}

function FallbackTip({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertTriangle
  title: string
  description: string
}) {
  return (
    <UIInset className="p-4 text-left">
      <UIIconTile icon={Icon} tone="warm" className="mb-3" />
      <div className="text-sm font-semibold text-[#F8FBFF]">{title}</div>
      <p className="mt-2 text-xs leading-6 text-[rgba(240,244,255,0.6)]">{description}</p>
    </UIInset>
  )
}
