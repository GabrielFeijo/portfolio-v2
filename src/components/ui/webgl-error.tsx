import { motion } from 'framer-motion'

export function WebGLError() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000008',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      textAlign: 'center',
      color: '#F0F4FF',
      fontFamily: 'Exo 2, sans-serif'
    }}>
      <style>{`
        * { cursor: auto !important; }
      `}</style>
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(2,2,21,0.8)',
          border: '1px solid #FF450060',
          borderRadius: 16,
          padding: '40px 30px',
          maxWidth: 450,
          position: 'relative',
          boxShadow: '0 0 40px rgba(255, 69, 0, 0.15)'
        }}
      >
        <div style={{
          fontSize: 48,
          marginBottom: 20,
          filter: 'drop-shadow(0 0 10px #FF4500)'
        }}>
          ⚠️
        </div>

        <h1 style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 24,
          fontWeight: 800,
          color: '#FF4500',
          letterSpacing: '0.2em',
          marginBottom: 16,
          textTransform: 'uppercase'
        }}>
          Hardware Incompatible
        </h1>

        <p style={{
          fontSize: 15,
          color: 'rgba(240,244,255,0.7)',
          lineHeight: 1.7,
          marginBottom: 24
        }}>
          The mission requires <span style={{ color: '#00D4FF' }}>WebGL</span> to render the cosmic environment.
          Your current engine (browser/hardware) does not support this technology or it is disabled.
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 8,
          padding: '16px',
          textAlign: 'left',
          fontSize: 12,
          fontFamily: 'Space Mono, monospace',
          color: 'rgba(240,244,255,0.5)',
        }}>
          <div style={{ marginBottom: 6, color: '#FF4500' }}>◈ REQUISITOS DO SISTEMA</div>
          <div>• Navegador atualizado (Chrome, Firefox, Edge, Safari)</div>
          <div>• Aceleração de hardware habilitada</div>
          <div>• Driver de vídeo compatível com WebGL</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          style={{
            marginTop: 30,
            background: 'transparent',
            border: '1px solid #00D4FF',
            color: '#00D4FF',
            padding: '12px 24px',
            borderRadius: 6,
            fontFamily: 'Space Mono, monospace',
            fontSize: 12,
            letterSpacing: '0.2em',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          TENTAR RECONECTAR
        </motion.button>
      </motion.div>
    </div>
  )
}
