import { useEffect, useRef } from 'react'

interface Spark {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  a: number
  drift: number
}

/**
 * Ambient torch-ember field. Rises out of the dark and dims as it climbs.
 * Pauses itself when scrolled out of view so it doesn't burn cycles.
 */
export default function Embers({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = cv.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let sparks: Spark[] = []
    let raf = 0
    let running = true

    const size = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spark = (seeded: boolean): Spark => ({
      x: Math.random() * w,
      y: seeded ? Math.random() * h : h + Math.random() * 40,
      r: 0.5 + Math.random() * 1.7,
      vy: 0.16 + Math.random() * 0.52,
      vx: (Math.random() - 0.5) * 0.22,
      a: 0.15 + Math.random() * 0.55,
      drift: Math.random() * Math.PI * 2,
    })

    const build = () => {
      const n = Math.round(Math.min(90, Math.max(28, w / 14)))
      sparks = Array.from({ length: n }, () => spark(true))
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i]
        s.drift += 0.011
        s.y -= s.vy
        s.x += s.vx + Math.sin(s.drift) * 0.24
        if (s.y < -12) sparks[i] = spark(false)

        const alpha = s.a * Math.max(0, s.y / h) * 0.9
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5)
        g.addColorStop(0, `oklch(86% 0.115 78 / ${alpha})`)
        g.addColorStop(0.4, `oklch(76% 0.145 68 / ${alpha * 0.4})`)
        g.addColorStop(1, 'oklch(50% 0.135 35 / 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    size()
    build()
    frame()

    let t: number | undefined
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        size()
        build()
      }, 160)
    }
    window.addEventListener('resize', onResize)

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true
          raf = requestAnimationFrame(frame)
        } else if (!e.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(cv)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
