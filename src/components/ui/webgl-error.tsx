import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCcw, ShieldCheck, Cpu, AppWindow } from 'lucide-react'

export function WebGLError() {
  useEffect(() => {
    document.body.classList.add('cursor-fallback-mode')
    return () => document.body.classList.remove('cursor-fallback-mode')
  }, [])

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#040611] p-5 text-[#F0F4FF] font-body-exo">
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,122,26,0.16),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(0,212,255,0.12),_transparent_32%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-[640px] overflow-hidden rounded-[32px] border px-6 py-7 sm:px-8 sm:py-8"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(255,122,26,0.14), transparent 28%), linear-gradient(180deg, rgba(10,12,24,0.94), rgba(5,8,18,0.92))',
          borderColor: 'rgba(255,122,26,0.32)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.45), 0 0 80px rgba(255,122,26,0.12)',
        }}
      >
        <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-[rgba(255,122,26,0.2)]" />
        <div className="pointer-events-none absolute -left-8 bottom-6 h-24 w-24 rounded-full border border-[rgba(0,212,255,0.18)]" />

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(255,122,26,0.22)] bg-[rgba(255,122,26,0.08)] px-4 py-2 font-mono-space text-[11px] uppercase tracking-[0.28em] text-[#FFC08A]">
            <AlertTriangle size={14} />
            Modo de compatibilidade
          </div>

          <div className="mb-6 flex items-start gap-4">
            <div
              className="flex h-15 w-15 shrink-0 items-center justify-center rounded-[22px] border border-[rgba(255,122,26,0.32)] bg-[rgba(255,122,26,0.1)] text-[#FF7A1A]"
              style={{ boxShadow: '0 0 30px rgba(255,122,26,0.14)' }}
            >
              <AlertTriangle size={28} />
            </div>

            <div>
              <h1 className="font-display text-[24px] font-extrabold uppercase tracking-[0.12em] text-[#FFF3E8] sm:text-[28px]">
                WebGL indisponivel
              </h1>
              <p className="mt-3 max-w-[46ch] text-sm leading-7 text-[rgba(240,244,255,0.72)] sm:text-[15px]">
                Este portfólio precisa de WebGL para renderizar a experiência 3D. No momento, o navegador ou o hardware
                não conseguiu disponibilizar esse recurso.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <FallbackTip
              icon={AppWindow}
              title="Atualize o navegador"
              description="Chrome, Edge, Firefox e Safari recentes costumam oferecer melhor suporte."
            />
            <FallbackTip
              icon={ShieldCheck}
              title="Ative a aceleração"
              description="Verifique se a aceleração de hardware está habilitada nas configurações."
            />
            <FallbackTip
              icon={Cpu}
              title="Revise o driver"
              description="Drivers gráficos desatualizados podem impedir a inicialização do WebGL."
            />
          </div>

          <div className="mt-6 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
            <div className="mb-2 font-mono-space text-[11px] uppercase tracking-[0.24em] text-[rgba(125,211,252,0.82)]">
              O que esta acontecendo
            </div>
            <p className="text-sm leading-7 text-[rgba(240,244,255,0.66)]">
              Quando isso acontece, o universo 3D não consegue ser carregado com segurança. Nesta tela o cursor padrão do sistema
              volta automaticamente, já que o cursor estilizado depende da interface principal ter sido iniciada.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-[#7DD3FC] px-6 py-3 font-mono-space text-[11px] tracking-[0.2em] text-[#7DD3FC] transition-all hover:bg-[rgba(125,211,252,0.1)]"
        >
          <RefreshCcw size={14} />
          TENTAR NOVAMENTE
        </motion.button>
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
    <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 text-left">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(255,122,26,0.1)] text-[#FF9A52]">
        <Icon size={20} />
      </div>
      <div className="text-sm font-semibold text-[#F8FBFF]">{title}</div>
      <p className="mt-2 text-xs leading-6 text-[rgba(240,244,255,0.6)]">{description}</p>
    </div>
  )
}
