import { motion } from 'framer-motion'
import { AlertTriangle, Monitor, RefreshCw } from 'lucide-react'

export function WebGLError() {
  return (
    <div className="w-screen h-screen bg-[#000008] flex flex-col items-center justify-center
                    p-5 text-center text-[#F0F4FF] font-body-exo"
      style={{ cursor: 'auto' }}
    >
      <style>{`* { cursor: auto !important; }`}</style>
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl max-w-[450px] px-8 py-10"
        style={{
          background: 'rgba(2,2,21,0.8)',
          border: '1px solid rgba(255,69,0,0.4)',
          boxShadow: '0 0 40px rgba(255,69,0,0.15)',
        }}
      >
        <div className="text-[52px] mb-5 text-[#FF4500]" style={{ filter: 'drop-shadow(0 0 12px #FF4500)' }}>
          <AlertTriangle size={64} />
        </div>

        <h1 className="font-display text-[22px] font-extrabold text-[#FF4500]
                       tracking-[0.2em] uppercase mb-4">
          Hardware Incompatible
        </h1>

        <p className="text-[14px] text-[rgba(240,244,255,0.7)] leading-relaxed mb-6">
          The mission requires <span className="text-[#00D4FF]">WebGL</span> to render the cosmic environment.
          Your current browser or hardware does not support this technology, or it is disabled.
        </p>

        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-left
                        font-mono-space text-[11px] text-[rgba(240,244,255,0.5)]">
          <div className="text-[#FF4500] mb-2">◈ SYSTEM REQUIREMENTS</div>
          <div>• Updated browser (Chrome, Firefox, Edge, Safari)</div>
          <div>• Hardware acceleration enabled</div>
          <div>• WebGL-compatible graphics driver</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-7 bg-transparent border border-[#00D4FF] text-[#00D4FF] rounded
                     font-mono-space text-[11px] tracking-[0.2em] px-6 py-3
                     transition-all hover:bg-[rgba(0,212,255,0.1)]"
          style={{ cursor: 'pointer' }}
        >
          TENTAR RECONECTAR
        </motion.button>
      </motion.div>
    </div>
  )
}
