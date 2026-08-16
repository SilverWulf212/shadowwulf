import { useEffect, useRef } from 'react'

/**
 * Flickering torches down both walls. As the page scrolls they drift outward,
 * down and up in scale — the parallax of passing them — so the intro reads as
 * walking deeper into the corridor rather than watching a picture grow.
 *
 * Pure CSS light pools; no assets, no canvas. Flicker periods are deliberately
 * coprime so the wall never pulses in unison.
 */

interface Torch {
  side: 'left' | 'right'
  /** vertical position, % of container */
  top: number
  /** relative size */
  scale: number
  /** flicker cycle, seconds — kept mutually irregular */
  period: number
  delay: number
}

const TORCHES: Torch[] = [
  { side: 'left', top: 18, scale: 1.0, period: 2.3, delay: 0 },
  { side: 'left', top: 47, scale: 1.25, period: 3.1, delay: -0.7 },
  { side: 'left', top: 76, scale: 0.85, period: 2.7, delay: -1.4 },
  { side: 'right', top: 26, scale: 1.15, period: 2.9, delay: -0.35 },
  { side: 'right', top: 58, scale: 0.95, period: 3.3, delay: -1.1 },
  { side: 'right', top: 84, scale: 1.1, period: 2.5, delay: -1.9 },
]

export default function TorchWalls({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    const paint = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 while the intro fills the screen, 1 once it has scrolled away
      const p = Math.min(1, Math.max(0, -r.top / (r.height || vh)))
      el.style.setProperty('--pass', p.toFixed(4))
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className={`torch-walls ${className}`.trim()}>
      {TORCHES.map((t, i) => (
        <span
          key={i}
          className={`torch torch--${t.side}`}
          style={
            {
              top: `${t.top}%`,
              '--s': t.scale,
              '--period': `${t.period}s`,
              '--delay': `${t.delay}s`,
            } as React.CSSProperties
          }
        >
          <span className="torch__pool" />
          <span className="torch__flame" />
        </span>
      ))}
    </div>
  )
}
