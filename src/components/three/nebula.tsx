import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Nebula() {
  const ref1 = useRef<THREE.Mesh>(null)
  const ref2 = useRef<THREE.Mesh>(null)
  const ref3 = useRef<THREE.Mesh>(null)

  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    ctx.fillStyle = 'transparent'
    ctx.clearRect(0, 0, 512, 512)
    
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const r = 50 + Math.random() * 150
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(107, 33, 232, ${0.1 + Math.random() * 0.1})`)
      gradient.addColorStop(0.5, `rgba(30, 64, 175, ${0.05 + Math.random() * 0.05})`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  const nebulaTexture2 = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 512, 512)
    
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const r = 80 + Math.random() * 120
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(0, 212, 255, ${0.08 + Math.random() * 0.08})`)
      gradient.addColorStop(0.5, `rgba(0, 50, 100, ${0.04})`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  const nebulaTexture3 = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 512, 512)
    
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const r = 100 + Math.random() * 150
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(255, 20, 147, ${0.06 + Math.random() * 0.06})`)
      gradient.addColorStop(0.6, `rgba(100, 0, 50, ${0.03})`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.02
    if (ref1.current) { ref1.current.rotation.z = t * 0.5; ref1.current.rotation.x = t * 0.2 }
    if (ref2.current) { ref2.current.rotation.z = -t * 0.3; ref2.current.rotation.y = t * 0.1 }
    if (ref3.current) { ref3.current.rotation.y = t * 0.4; ref3.current.rotation.z = t * 0.15 }
  })

  return (
    <group>
      <mesh ref={ref1} position={[-80, 20, -200]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[400, 300]} />
        <meshBasicMaterial
          map={nebulaTexture}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ref2} position={[120, -30, -250]} rotation={[-0.3, 0.5, 0]}>
        <planeGeometry args={[350, 280]} />
        <meshBasicMaterial
          map={nebulaTexture2}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ref3} position={[0, 60, -300]} rotation={[0.2, 0.2, 0.4]}>
        <planeGeometry args={[500, 400]} />
        <meshBasicMaterial
          map={nebulaTexture3}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
