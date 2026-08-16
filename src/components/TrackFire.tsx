import { useEffect, useRef } from 'react'

/**
 * The flaming spectrograph that sits BEHIND a track row.
 *
 * Fire spikes outward from a centre line in both directions — up and down —
 * so the row's text rides the seam. Each track burns its own colour, taken
 * from `fireHue` in album.ts, so the whole list reads as seven different
 * fires rather than one effect repeated seven times.
 *
 * Performance is the whole design constraint here. Seven of these on one page
 * would be seven animation loops, so:
 *   - only the PLAYING row runs a loop; every other row paints one static
 *     silhouette and then stops entirely
 *   - a row that scrolls out of view stops even if it is playing
 *   - no per-frame `ctx.filter` (that is the classic 60fps → 12fps mistake);
 *     the bloom comes from gradient falloff plus 'lighter' compositing
 */

interface Props {
  hue: number
  /** live analyser while this track is the one playing */
  analyser?: AnalyserNode | null
  playing?: boolean
  className?: string
}

const BANDS = 56

export default function TrackFire({ hue, analyser, playing = false, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const heights = useRef<number[]>(new Array(BANDS).fill(0))

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let running = false
    const bins = analyser ? new Uint8Array(analyser.frequencyBinCount) : null

    const size = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = Math.max(1, Math.round(w * dpr))
      cv.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /** one flame, mirrored above and below the centre seam */
    const flame = (x: number, bw: number, mag: number, mid: number) => {
      const reach = mag * (h / 2)
      if (reach < 0.6) return
      for (const dir of [-1, 1]) {
        const g = ctx.createLinearGradient(0, mid, 0, mid + reach * dir)
        g.addColorStop(0, `oklch(96% 0.06 ${hue} / 0.85)`)
        g.addColorStop(0.28, `oklch(84% 0.15 ${hue} / 0.55)`)
        g.addColorStop(0.7, `oklch(62% 0.17 ${hue} / 0.22)`)
        g.addColorStop(1, `oklch(45% 0.13 ${hue} / 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(x, mid)
        ctx.quadraticCurveTo(x + bw * 0.5, mid + reach * dir * 0.55, x + bw * 0.5, mid + reach * dir)
        ctx.quadraticCurveTo(x + bw * 0.5, mid + reach * dir * 0.55, x + bw, mid)
        ctx.closePath()
        ctx.fill()
      }
    }

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      const mid = h / 2
      const bw = w / BANDS

      if (analyser && bins && playing) {
        analyser.getByteFrequencyData(bins)
        // log-ish mapping: low frequencies get more of the width
        for (let i = 0; i < BANDS; i++) {
          const lo = Math.floor((i / BANDS) ** 1.7 * bins.length)
          const hi = Math.max(lo + 1, Math.floor(((i + 1) / BANDS) ** 1.7 * bins.length))
          let sum = 0
          for (let j = lo; j < hi; j++) sum += bins[j]
          const target = sum / (hi - lo) / 255
          // fast attack, slow decay — fire, not a VU meter
          const prev = heights.current[i]
          heights.current[i] = target > prev ? target : prev * 0.86 + target * 0.14
        }
      } else {
        // no audio yet: a low, slow idle burn so the row still reads as alive
        for (let i = 0; i < BANDS; i++) {
          const n =
            Math.sin(i * 0.5 + t / 900) * 0.5 +
            Math.sin(i * 1.3 - t / 1400) * 0.3 +
            Math.sin(i * 2.7 + t / 600) * 0.2
          heights.current[i] = Math.max(0, (n + 1) / 2) * 0.17
        }
      }

      for (let i = 0; i < BANDS; i++) flame(i * bw, bw, heights.current[i], mid)
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (t: number) => {
      paint(t)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    size()

    // static rows (and reduced-motion) get exactly one frame, then nothing
    const shouldAnimate = () => !reduce && visible && playing

    if (shouldAnimate()) start()
    else paint(0)

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (shouldAnimate()) start()
        else stop()
      },
      { rootMargin: '80px' },
    )
    io.observe(cv)

    let rt: number | undefined
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => {
        size()
        if (!shouldAnimate()) paint(0)
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.clearTimeout(rt)
    }
  }, [hue, analyser, playing])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`track-fire ${playing ? 'is-live' : ''} ${className}`.trim()}
    />
  )
}
