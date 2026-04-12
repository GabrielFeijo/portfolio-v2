import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'

export function WarpEffect() {
  const { warpActive } = useSpaceStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!warpActive) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const stars: { x: number; y: number; z: number; pz: number; color: string }[] = []
    const starColors = ['#FFFFFF', '#BAE6FD', '#0EA5E9', '#F0F9FF']

    for (let i = 0; i < 900; i++) {
      stars.push({
        x: Math.random() * canvas.width - cx,
        y: Math.random() * canvas.height - cy,
        z: Math.random() * canvas.width,
        pz: 0,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 8, 0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.pz = star.z
        star.z -= 18

        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - cx
          star.y = Math.random() * canvas.height - cy
          star.z = canvas.width
          star.pz = star.z
        }

        const sx = (star.x / star.z) * canvas.width + cx
        const sy = (star.y / star.z) * canvas.width + cy
        const px = (star.x / star.pz) * canvas.width + cx
        const py = (star.y / star.pz) * canvas.width + cy

        const size = Math.max(0.1, (1 - star.z / canvas.width) * 3.5)
        const brightness = 1 - star.z / canvas.width

        ctx.beginPath()
        ctx.strokeStyle = star.color
        ctx.globalAlpha = brightness * 0.8
        ctx.lineWidth = size
        ctx.moveTo(px, py)
        ctx.lineTo(sx, sy)
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [warpActive])

  return (
    <AnimatePresence>
      {warpActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-800 pointer-events-none"
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
