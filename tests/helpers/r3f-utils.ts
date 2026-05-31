import { act } from '@react-three/test-renderer'
import type { create } from '@react-three/test-renderer'

type TestRenderer = Awaited<ReturnType<typeof create>>

export async function advanceR3F(
  renderer: TestRenderer,
  frames = 5,
  delta: number | number[] = 0.016
) {
  await act(async () => {
    await renderer.advanceFrames(frames, delta)
  })
}
