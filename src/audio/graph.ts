/**
 * The one audio graph on the page.
 *
 *   <audio> -> MediaElementAudioSourceNode -> AnalyserNode -> destination
 *
 * Both the element and the graph are module singletons on purpose:
 * `createMediaElementSource` may be called exactly once per media element for
 * the lifetime of the document — call it twice and the second call throws and
 * the first graph is left holding the audio. Keeping them out of React means
 * StrictMode's double-mount, a remount, or a second provider can never trip it.
 */

export interface RadioGraph {
  ctx: AudioContext
  source: MediaElementAudioSourceNode
  analyser: AnalyserNode
}

type AudioContextCtor = typeof AudioContext

let element: HTMLAudioElement | null = null
let graph: RadioGraph | null = null

/** The single <audio> element. Safe to call as often as you like. */
export function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null
  if (!element) {
    element = new Audio()
    // Without this the analyser is silently zeroed if the mp3s are ever served
    // from another origin (R2, a CDN) — the graph would "work" and draw nothing.
    element.crossOrigin = 'anonymous'
    element.preload = 'none'
    element.loop = false
  }
  return element
}

/**
 * Build the graph if it does not exist, and resume the context.
 *
 * MUST be called synchronously inside a user-gesture handler: browsers create
 * an AudioContext in the `suspended` state unless a gesture is on the stack,
 * and a suspended context means the analyser reports silence forever.
 */
export function ensureGraph(): RadioGraph | null {
  const audio = getAudioElement()
  if (!audio) return null

  if (!graph) {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
    if (!Ctor) return null

    let ctx: AudioContext
    try {
      ctx = new Ctor()
    } catch {
      return null
    }

    let source: MediaElementAudioSourceNode
    try {
      source = ctx.createMediaElementSource(audio)
    } catch {
      // Already wired by something else, or blocked. Let the element play on
      // its own rather than leaving a dead context around.
      void ctx.close()
      return null
    }

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.75

    source.connect(analyser)
    analyser.connect(ctx.destination)

    graph = { ctx, source, analyser }
  }

  if (graph.ctx.state === 'suspended') void graph.ctx.resume()
  return graph
}

/** The graph if it has been built, without building or resuming it. */
export function peekGraph(): RadioGraph | null {
  return graph
}
