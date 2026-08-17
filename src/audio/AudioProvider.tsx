import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import { getAudioElement } from './graph'
import {
  getStationSnapshot,
  next,
  pause,
  play,
  playTrack,
  subscribeStation,
  toggle,
} from './station'
import type { RadioTrack } from './tracks'

export type { RadioTrack } from './tracks'

export interface RadioApi {
  /** Is sound coming out right now? */
  playing: boolean
  /** The track on air, or null before the first tune-in. */
  currentTrack: RadioTrack | null
  play: () => void
  pause: () => void
  toggle: () => void
  /** Skip to the next track in the shuffled rotation. */
  next: () => void
  /** Play one specific track from the top; press again to pause it. */
  playTrack: (id: string) => void
  /** fftSize 512, smoothing 0.75. Null until the first user gesture builds the graph. */
  analyser: AnalyserNode | null
  audioEl: HTMLAudioElement | null

  // ── extras, for anyone drawing UI off the station ──
  /** Tracks whose mp3s actually exist right now. */
  tracks: RadioTrack[]
  /** False when nothing has finished rendering yet — the "off air" state. */
  onAir: boolean
  /** True until the first availability probe answers. */
  probing: boolean
  /** Has anyone pressed play yet this session? */
  tunedIn: boolean
}

const RadioContext = createContext<RadioApi | null>(null)

/**
 * The station as a React value. Subscribing is cheap and idempotent — the
 * audio element, AudioContext and analyser live in module scope, so this hook
 * only reads them.
 */
function useStation(): RadioApi {
  const state = useSyncExternalStore(subscribeStation, getStationSnapshot, getStationSnapshot)
  const audioEl = useMemo(() => getAudioElement(), [])

  return useMemo<RadioApi>(
    () => ({
      playing: state.playing,
      currentTrack: state.currentTrack,
      play,
      pause,
      toggle,
      next,
      playTrack,
      analyser: state.analyser,
      audioEl,
      tracks: state.tracks,
      onAir: state.tracks.length > 0,
      probing: state.probing,
      tunedIn: state.tunedIn,
    }),
    [state, audioEl],
  )
}

/**
 * Owns the page's single audio graph:
 *
 *   <audio crossOrigin="anonymous"> -> MediaElementAudioSourceNode
 *     -> AnalyserNode (fftSize 512, smoothing 0.75) -> destination
 *
 * The nodes themselves are module singletons (see `graph.ts`), because
 * `createMediaElementSource` may only ever be called once per element and the
 * context must be created inside a user gesture — neither of which survives a
 * component lifecycle honestly. Wrap the app in this once; unmounting it stops
 * nothing mid-play.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const api = useStation()
  return <RadioContext.Provider value={api}>{children}</RadioContext.Provider>
}

/**
 * Everything a consumer needs: transport, what's on air, and the analyser for
 * a visualiser. Works inside <AudioProvider>; also works outside it, reading
 * the same station directly, so a component can't be broken by where it is
 * mounted in the tree.
 */
// The hook ships alongside its provider on purpose; splitting it would only
// move the import around.
// oxlint-disable-next-line react/only-export-components
export function useRadio(): RadioApi {
  const fromContext = useContext(RadioContext)
  const direct = useStation()
  return fromContext ?? direct
}
