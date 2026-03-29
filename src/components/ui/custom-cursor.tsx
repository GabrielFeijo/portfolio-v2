import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'

export function CustomCursor() {
  const { cursorVariant } = useSpaceStore()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 }
  const trailSpring = { damping: 35, stiffness: 200, mass: 1 }

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)
  const trailSpringX = useSpring(trailX, trailSpring)
  const trailSpringY = useSpring(trailY, trailSpring)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8)
      cursorY.set(e.clientY - 8)
      trailX.set(e.clientX - 20)
      trailY.set(e.clientY - 20)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY, trailX, trailY])

  const variants = {
    default: { width: 16, height: 16, borderWidth: 1.5, opacity: 0.9 },
    planet: { width: 32, height: 32, borderWidth: 2, opacity: 1 },
    link: { width: 24, height: 24, borderWidth: 1.5, opacity: 0.8 },
    drag: { width: 40, height: 40, borderWidth: 1, opacity: 0.7 },
  }

  const current = variants[cursorVariant] || variants.default

  const colors = {
    default: '#00D4FF',
    planet: '#FFB800',
    link: '#00FF88',
    drag: '#FF1493',
  }

  const color = colors[cursorVariant] || colors.default

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          zIndex: 9999,
          pointerEvents: 'none',
          borderRadius: '50%',
          width: current.width,
          height: current.height,
          border: `${current.borderWidth}px solid ${color}`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}40`,
          mixBlendMode: 'screen',
        }}
        animate={{
          width: current.width,
          height: current.height,
          borderColor: color,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      <motion.div
        style={{
          position: 'fixed',
          left: trailSpringX,
          top: trailSpringY,
          zIndex: 9998,
          pointerEvents: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          border: `1px solid ${color}`,
          opacity: 0.3,
          mixBlendMode: 'screen',
        }}
      />

      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          zIndex: 9999,
          pointerEvents: 'none',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: (current.width - 4) / 2,
          marginTop: (current.height - 4) / 2,
          boxShadow: `0 0 6px ${color}`,
          mixBlendMode: 'screen',
        }}
      />

      {cursorVariant === 'planet' && (
        <motion.div
          style={{
            position: 'fixed',
            left: trailSpringX,
            top: trailSpringY,
            zIndex: 9997,
            pointerEvents: 'none',
            borderRadius: '50%',
            width: 64,
            height: 64,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `1px dashed ${color}40`,
          }} />
        </motion.div>
      )}
    </>
  )
}
