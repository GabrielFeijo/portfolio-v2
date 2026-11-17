import { useSpaceStore } from '@/store/space-store';
import { useCallback, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface MusicGraph {
  context: AudioContext;
  element: HTMLAudioElement;
  master: GainNode;
  playing: boolean;
}

const MUSIC_URL = '/audio/space-music.mp3';

function clearStopTimer(timerRef: { current: number | null }) {
  if (timerRef.current === null) return;
  window.clearTimeout(timerRef.current);
  timerRef.current = null;
}

function suspendGraph(graph: MusicGraph) {
  if (graph.context.state !== 'running') return;
  void graph.context.suspend?.();
  graph.element.pause();
}

function resumeGraphIfEnabled(graph: MusicGraph) {
  const isEnabled = useSpaceStore.getState().experienceSettings.musicEnabled;
  if (!isEnabled || graph.context.state !== 'suspended') return;
  void graph.context.resume?.();
  void graph.element.play();
}

function disposeMusicGraph(graphRef: { current: MusicGraph | null }) {
  const graph = graphRef.current;
  if (!graph) return;
  graph.element.pause();
  graph.element.removeAttribute('src');
  graph.element.load();
  void graph.context.close();
  graphRef.current = null;
}

export function SpaceMusic() {
  const { enabled, volume } = useSpaceStore(
    useShallow((state) => ({
      enabled: state.experienceSettings.musicEnabled,
      volume: state.experienceSettings.musicVolume,
    }))
  );

  const graphRef = useRef<MusicGraph | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  const initGraph = useCallback(() => {
    if (graphRef.current) return graphRef.current;

    const element = new Audio();
    element.preload = 'none';
    element.loop = true;
    element.src = MUSIC_URL;

    const context = new window.AudioContext();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);
    context.createMediaElementSource(element).connect(master);

    graphRef.current = { context, element, master, playing: false };
    return graphRef.current;
  }, []);

  const startPlayback = useCallback(async () => {
    clearStopTimer(stopTimerRef);

    try {
      const graph = initGraph();

      if (graph.context.state === 'suspended') {
        void graph.context.resume();
      }

      if (!graph.playing) {
        graph.playing = true;
        await graph.element.play();
      }

      graph.master.gain.cancelScheduledValues(graph.context.currentTime);
      graph.master.gain.linearRampToValueAtTime(volume, graph.context.currentTime + 2.5);
    } catch (error) {
      if (graphRef.current) graphRef.current.playing = false;
      console.error('SpaceMusic Error:', error);
    }
  }, [initGraph, volume]);

  const stopPlayback = useCallback(() => {
    const graph = graphRef.current;
    if (!graph || !graph.playing) return;

    graph.master.gain.cancelScheduledValues(graph.context.currentTime);
    graph.master.gain.linearRampToValueAtTime(0, graph.context.currentTime + 1.2);

    stopTimerRef.current = window.setTimeout(() => {
      stopTimerRef.current = null;
      const currentEnabled = useSpaceStore.getState().experienceSettings.musicEnabled;
      if (graphRef.current && !currentEnabled) {
        graph.element.pause();
        graph.playing = false;
      }
    }, 1300);
  }, []);

  useEffect(() => {
    if (enabled) {
      void startPlayback();
    } else {
      stopPlayback();
    }
  }, [enabled, startPlayback, stopPlayback]);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph && enabled) {
      graph.master.gain.cancelScheduledValues(graph.context.currentTime);
      graph.master.gain.setTargetAtTime(volume, graph.context.currentTime, 0.2);
    }
  }, [volume, enabled]);

  useEffect(() => {
    const handleVisibility = () => {
      const graph = graphRef.current;
      if (!graph) return;

      if (document.hidden) {
        suspendGraph(graph);
        return;
      }

      resumeGraphIfEnabled(graph);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearStopTimer(stopTimerRef);
      disposeMusicGraph(graphRef);
    };
  }, []);

  return null;
}
