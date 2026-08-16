import { useEffect, useRef } from 'react'
import { TRACKS, ALBUM, type TrackStatus } from '../data/album'
import TrackFire from './TrackFire'

const STATUS_LABEL: Record<TrackStatus, string> = {
  released: 'Out now',
  rendering: 'On the forge',
  queued: 'Queued',
}

/** How far into the viewport a row is fully lit, as a fraction of viewport height. */
const TOP_BAND = 0.28
const BOTTOM_BAND = 0.92
const FLOOR = 0.12

/**
 * Rows cascade in on first sight, then stay tied to the scroll: each one
 * burns brightest crossing the middle of the screen and falls away toward
 * the top and bottom edges. Written straight to the DOM as custom properties
 * so scrolling never re-renders React.
 */
function useCascade(root: React.RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el) return

    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-track]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((r) => r.style.setProperty('--fade', '1'))
      return
    }

    // cascade: each row lights a beat after the one above it
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = rows.indexOf(e.target as HTMLElement)
          ;(e.target as HTMLElement).style.transitionDelay = `${Math.max(0, i % 7) * 70}ms`
          e.target.setAttribute('data-seen', 'true')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.1 },
    )
    rows.forEach((r) => io.observe(r))

    // scroll-linked fade
    let ticking = false
    const paint = () => {
      const vh = window.innerHeight
      for (const r of rows) {
        const { top, height } = r.getBoundingClientRect()
        const mid = (top + height / 2) / vh // 0 = viewport top, 1 = bottom
        let v: number
        if (mid < TOP_BAND) {
          v = mid / TOP_BAND // sliding off the top
        } else if (mid > BOTTOM_BAND) {
          v = (1.15 - mid) / (1.15 - BOTTOM_BAND) // still rising in
        } else {
          v = 1
        }
        r.style.setProperty('--fade', String(Math.min(1, Math.max(FLOOR, v)).toFixed(3)))
      }
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
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [root])
}

interface Props {
  /** track number currently playing, if any */
  playingNo?: number
  analyser?: AnalyserNode | null
}

export default function Tracklist({ playingNo, analyser }: Props = {}) {
  const ref = useRef<HTMLOListElement>(null)
  useCascade(ref)

  return (
    <>
      <ol ref={ref} className="m-0 list-none border-t border-edge p-0">
        {TRACKS.map((t) => (
          <li
            key={t.no}
            data-track
            className="track grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-edge py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-6"
          >
            {/* Every row gets a static bed in its own fire colour -- no canvas,
                no loop. Only the row actually playing gets the live spectrograph,
                because only one row can ever be playing. Seven canvases to draw
                six still frames was the wrong trade. */}
            <span
              className="track-bed"
              aria-hidden="true"
              style={{ ['--hue' as string]: t.fireHue }}
            />
            {playingNo === t.no && <TrackFire hue={t.fireHue} analyser={analyser} playing />}

            <span className="font-mono text-[0.75rem] tabular-nums text-steel">
              {String(t.no).padStart(2, '0')}
            </span>

            <div className="min-w-0">
              <h3
                className="m-0 font-body font-semibold"
                style={{
                  fontSize: 'clamp(1.15rem, 1rem + 0.9vw, 1.75rem)',
                  letterSpacing: '0',
                  lineHeight: 1.15,
                  overflowWrap: 'anywhere',
                }}
              >
                {t.title}
              </h3>
              <p className="mt-1 mb-0 max-w-[52ch] text-[0.95rem] text-bonedim">
                {t.blurb}
              </p>
            </div>

            <div className="col-start-2 flex items-center gap-4 sm:col-start-3 sm:justify-end">
              <span
                className={[
                  'font-mono text-[0.6rem] tracking-[0.18em] whitespace-nowrap uppercase',
                  t.status === 'queued' ? 'text-steel' : 'text-torch',
                ].join(' ')}
              >
                {t.status === 'rendering' && (
                  <span aria-hidden="true" className="mr-2 inline-block text-torch">
                    ●
                  </span>
                )}
                {STATUS_LABEL[t.status]}
              </span>
              <span className="font-mono text-[0.75rem] tabular-nums text-steel">
                {t.runtime}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-[60ch] font-mono text-[0.7rem] leading-relaxed tracking-[0.08em] text-steel uppercase">
        Every track is generated locally on one graphics card. Three minutes of music
        takes roughly four hours to render, so {ALBUM.title} arrives one track at a
        time.
      </p>
    </>
  )
}
