import { useSpaceStore } from '@/store/space-store'
import { useCallback, useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'

interface MusicGraph {
  context: AudioContext
  master: GainNode
  source: AudioBufferSourceNode | null
}

const MUSIC_URL = '/audio/space-music.mp3'

export function SpaceMusic() {
  const { enabled, volume } = useSpaceStore(
    useShallow((state) => ({
      enabled: state.experienceSettings.musicEnabled,
      volume: state.experienceSettings.musicVolume,
    }))
  )

  const graphRef = useRef<MusicGraph | null>(null)

  const initGraph = useCallback(async () => {
    if (graphRef.current) return graphRef.current

    const AudioCtx = window.AudioContext
    const context = new AudioCtx()
    const master = context.createGain()
    master.gain.value = 0
    master.connect(context.destination)

    graphRef.current = { context, master, source: null }
    return graphRef.current
  }, [])

  const startPlayback = useCallback(async () => {
    const graph = await initGraph()
    if (graph.source) return

    try {
      const response = await fetch(MUSIC_URL)
      if (!response.ok) throw new Error('Failed to fetch audio file')

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await graph.context.decodeAudioData(arrayBuffer)

      const source = graph.context.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true
      source.connect(graph.master)

      if (graph.context.state === 'suspended') {
        void graph.context.resume()
      }

      source.start(0)
      graph.source = source

      graph.master.gain.cancelScheduledValues(graph.context.currentTime)
      graph.master.gain.linearRampToValueAtTime(volume, graph.context.currentTime + 2.5)
    } catch (error) {
      console.error('SpaceMusic Error:', error)
    }
  }, [initGraph, volume])

  const stopPlayback = useCallback(() => {
    const graph = graphRef.current
    if (!graph || !graph.source) return

    graph.master.gain.cancelScheduledValues(graph.context.currentTime)
    graph.master.gain.linearRampToValueAtTime(0, graph.context.currentTime + 1.2)

    window.setTimeout(() => {
      const currentEnabled = useSpaceStore.getState().experienceSettings.musicEnabled
      if (graphRef.current && !currentEnabled) {
        graph.source?.stop()
        graph.source?.disconnect()
        graph.source = null
      }
    }, 1300)
  }, [])

  useEffect(() => {
    if (enabled) {
      void startPlayback()
    } else {
      stopPlayback()
    }
  }, [enabled, startPlayback, stopPlayback])

  useEffect(() => {
    const graph = graphRef.current
    if (graph && enabled) {
      graph.master.gain.cancelScheduledValues(graph.context.currentTime)
      graph.master.gain.setTargetAtTime(volume, graph.context.currentTime, 0.2)
    }
  }, [volume, enabled])

  useEffect(() => {
    return () => {
      const graph = graphRef.current
      if (graph) {
        if (graph.source) {
          graph.source.stop()
          graph.source.disconnect()
        }
        void graph.context.close()
        graphRef.current = null
      }
    }
  }, [])

  return null
}
