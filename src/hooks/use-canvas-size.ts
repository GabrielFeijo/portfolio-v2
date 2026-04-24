import { useThree } from '@react-three/fiber'

export function useCanvasSize() {
  return useThree((state) => state.size)
}
