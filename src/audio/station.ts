import { ensureGraph, getAudioElement, peekGraph } from './graph'
import { RADIO_TRACKS, probeTrack, type RadioTrack } from './tracks'

/**
 * ShadowWulf Radio — the station itself.
 *
 * Deliberately a plain module store rather than React state: the audio element
 * and its graph outlive any component tree, so the thing that drives them
 * should too. React subscribes to it; unmounting a subscriber never touches
 * playback or the shared AudioContext.
 *
 * The conceit: it presents itself as a 24/7 broadcast. The first time anyone
 * presses play it drops them into the middle of a song already in progress.
 * After that it behaves like an honest player.
 */

export interface StationState {
  playing: boolean
  currentTrack: RadioTrack | null
  /** Tracks whose files actually exist right now. Empty === off air. */
  tracks: RadioTrack[]
  analyser: AnalyserNode | null
  /** True until the first availability probe comes back. */
  probing: boolean
  /** Has anyone tuned in yet this session? Gates the mid-song drop-in. */
  tunedIn: boolean
}

const OFF_AIR: StationState = {
  playing: false,
  currentTrack: null,
  tracks: [],
  analyser: null,
  probing: true,
  tunedIn: false,
}

let state: StationState = OFF_AIR
const listeners = new Set<() => void>()

function emit(patch: Partial<StationState>) {
  const nextState = { ...state, ...patch }
  // cheap identity guard so useSyncExternalStore doesn't churn on every poll
  let changed = false
  for (const k of Object.keys(patch) as (keyof StationState)[]) {
    if (state[k] !== nextState[k]) changed = true
  }
  if (!changed) return
  state = nextState
  for (const l of listeners) l()
}

export function getStationSnapshot(): StationState {
  return state
}

// ── the queue ────────────────────────────────────────────────────────────────

/** Upcoming tracks for this rotation. Refilled, reshuffled, forever. */
let queue: RadioTrack[] = []
/** Consecutive load failures; stops a vanished-file loop from spinning. */
let failures = 0
/** Fraction of the way in to drop the needle once metadata arrives. */
let pendingSeek: number | null = null

function shuffle<T>(input: T[]): T[] {
  const a = input.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Next track in the rotation. When the shuffled queue runs dry it reshuffles
 * and keeps going — the station never ends, it only wraps.
 */
function takeNext(): RadioTrack | null {
  const pool = state.tracks
  if (pool.length === 0) return null

  if (queue.length === 0) {
    const fresh = shuffle(pool)
    // don't immediately repeat the track that just finished, if there's a choice
    if (fresh.length > 1 && state.currentTrack && fresh[0].id === state.currentTrack.id) {
      ;[fresh[0], fresh[1]] = [fresh[1], fresh[0]]
    }
    queue = fresh
  }

  return queue.shift() ?? null
}

function startTrack(track: RadioTrack, dropInAt: number | null) {
  const audio = getAudioElement()
  if (!audio) return
  pendingSeek = dropInAt
  emit({ currentTrack: track, tunedIn: true })
  audio.src = track.src
  audio.load()
  void audio.play().catch(() => {
    // autoplay refusal or a bad file; the error/pause handlers settle the state
    emit({ playing: false })
  })
}

/** A file we thought was there isn't. Drop it and roll on. */
function dropTrack(id: string) {
  queue = queue.filter((t) => t.id !== id)
  emit({ tracks: state.tracks.filter((t) => t.id !== id) })
}

// ── wiring ───────────────────────────────────────────────────────────────────

let started = false
let pollTimer: number | undefined
let abort: AbortController | null = null

function sameTracks(a: RadioTrack[], b: RadioTrack[]) {
  return a.length === b.length && a.every((t, i) => t.id === b[i].id)
}

/**
 * Ask the server which mp3s exist. Re-runs on a slow poll and whenever the tab
 * comes back to the foreground, so a track that finishes rendering mid-session
 * lights up on its own — no rebuild, no code change.
 */
async function probeAvailability() {
  if (pollTimer !== undefined) {
    clearTimeout(pollTimer)
    pollTimer = undefined
  }
  abort?.abort()
  abort = new AbortController()
  const signal = abort.signal

  const results = await Promise.all(RADIO_TRACKS.map((t) => probeTrack(t.src, signal)))
  if (signal.aborted) return

  const found = RADIO_TRACKS.filter((_, i) => results[i])
  if (!sameTracks(state.tracks, found)) emit({ tracks: found })
  emit({ probing: false })

  // keep listening for the rest of the record while anyone is watching
  if (listeners.size > 0 && found.length < RADIO_TRACKS.length) {
    pollTimer = window.setTimeout(
      () => void probeAvailability(),
      found.length === 0 ? 60_000 : 300_000,
    )
  }
}

function attach() {
  const audio = getAudioElement()
  if (!audio) return

  audio.addEventListener('playing', () => {
    failures = 0
    emit({ playing: true })
  })
  audio.addEventListener('pause', () => emit({ playing: false }))

  audio.addEventListener('loadedmetadata', () => {
    const at = pendingSeek
    pendingSeek = null
    if (at === null) return
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return
    try {
      // you tuned in mid-broadcast: the song was already running
      audio.currentTime = audio.duration * at
    } catch {
      /* seeking not allowed on this stream; start from the top */
    }
  })

  audio.addEventListener('ended', () => {
    const next = takeNext()
    if (next) startTrack(next, null)
    else emit({ playing: false })
  })

  audio.addEventListener('error', () => {
    const bad = state.currentTrack
    if (bad) dropTrack(bad.id)
    failures += 1
    if (failures > RADIO_TRACKS.length) {
      emit({ playing: false, currentTrack: null })
      return
    }
    const next = takeNext()
    if (next) startTrack(next, null)
    else emit({ playing: false, currentTrack: null })
  })
}

function start() {
  if (started) return
  started = true
  attach()
  void probeAvailability()

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && listeners.size > 0) {
      if (state.tracks.length < RADIO_TRACKS.length) void probeAvailability()
    }
  })
}

/** React (or anything else) subscribes here. */
export function subscribeStation(listener: () => void): () => void {
  listeners.add(listener)
  start()
  return () => {
    listeners.delete(listener)
    // Nobody is watching: stop polling. Playback, the AudioContext and the
    // source node are deliberately left alone — tearing them down mid-play
    // would kill the sound and can never be rebuilt for this element.
    if (listeners.size === 0 && pollTimer !== undefined) {
      clearTimeout(pollTimer)
      pollTimer = undefined
    }
  }
}

// ── transport ────────────────────────────────────────────────────────────────

/**
 * Every entry point below is called straight from a click handler, so the
 * AudioContext is created and resumed with a user gesture on the stack.
 */
function wakeGraph() {
  const graph = ensureGraph()
  if (graph && state.analyser !== graph.analyser) emit({ analyser: graph.analyser })
}

export function play() {
  const audio = getAudioElement()
  if (!audio) return
  wakeGraph()
  if (state.tracks.length === 0) return

  // already have something cued: this is a plain resume, no drop-in
  if (state.currentTrack && audio.src) {
    void audio.play().catch(() => emit({ playing: false }))
    return
  }

  const first = takeNext()
  if (!first) return
  // first tune-in only: land 30–60% into a song that was "already playing"
  const dropIn = state.tunedIn ? null : 0.3 + Math.random() * 0.3
  startTrack(first, dropIn)
}

export function pause() {
  getAudioElement()?.pause()
}

export function toggle() {
  if (state.playing) pause()
  else play()
}

/**
 * Play one specific track, by id — what the play button on a tracklist row
 * calls. Distinct from `play()`, which is the radio: no mid-song drop-in, no
 * shuffle, it starts the song you asked for at the top. Pressing it again on
 * the song already on air pauses, so one control does both.
 *
 * Called straight from a click handler, so the graph is built under a gesture.
 */
export function playTrack(id: string) {
  const audio = getAudioElement()
  if (!audio) return
  wakeGraph()

  const track = state.tracks.find((t) => t.id === id)
  if (!track) return

  if (state.currentTrack?.id === id && audio.src) {
    if (state.playing) {
      audio.pause()
    } else {
      void audio.play().catch(() => emit({ playing: false }))
    }
    return
  }

  // don't let the rotation serve this one up again a moment later
  queue = queue.filter((t) => t.id !== id)
  startTrack(track, null)
}

export function next() {
  const audio = getAudioElement()
  if (!audio) return
  wakeGraph()
  const track = takeNext()
  if (!track) return
  startTrack(track, null)
}

/** The analyser, if the graph has been built. Handy outside React. */
export function getAnalyser(): AnalyserNode | null {
  return peekGraph()?.analyser ?? null
}
