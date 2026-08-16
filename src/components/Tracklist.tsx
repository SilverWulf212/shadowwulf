import { useEffect, useRef } from 'react'
import { TRACKS, ALBUM, type TrackStatus } from '../data/album'
import TrackFire from './TrackFire'
import { LYRICS, type LyricSection } from '../data/lyrics'

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

    // Opening a lyric panel reflows every row below it WITHOUT firing a scroll
    // event, so their --fade values go stale and they sit at the wrong opacity
    // until you happen to scroll. Watch the list's own size instead.
    const ro = new ResizeObserver(onScroll)
    ro.observe(el)

    return () => {
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [root])
}


/**
 * A lyric sheet is not a generation prompt. Repeated sections get numbered the
 * way a printed insert numbers them (Verse 1 / Verse 2), and a section that
 * only ever appears once stays unnumbered.
 */
function labelSections(sections: LyricSection[]) {
  const total = new Map<string, number>()
  for (const s of sections) total.set(s.tag, (total.get(s.tag) ?? 0) + 1)

  const seen = new Map<string, number>()
  return sections.map((s) => {
    const n = (seen.get(s.tag) ?? 0) + 1
    seen.set(s.tag, n)
    const name = s.tag.replace('-', ' ')
    return { ...s, label: total.get(s.tag)! > 1 ? `${name} ${n}` : name }
  })
}

/**
 * Three registers on this record, and they should not look alike on the page:
 * a sung line, a group shout (written in caps because that is how the model
 * was told to shout), and a vocable — a held vowel that carries the melody but
 * isn't a word.
 */
const VOCABLE = /^(oh|ah|ay)[\s,oh ah ay]*$/i

function registerOf(line: string) {
  if (VOCABLE.test(line.trim())) return 'lyrics__vocable'
  if (line === line.toUpperCase() && /[A-Z]/.test(line)) return 'lyrics__shout'
  return 'lyrics__line'
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
            className="track border-b border-edge"
          >
            {/* The fire lives in here, so it stays locked to the collapsed row
                height and never stretches when the lyric panel opens. */}
            <div className="track-row grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-6">
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
            </div>

            {LYRICS[t.no] && (
              <details className="lyrics" style={{ ['--hue' as string]: t.fireHue }}>
                <summary>
                  <span className="lyrics__cue" aria-hidden="true" />
                  Lyrics
                </summary>
                <div className="lyrics__sheet">
                  {labelSections(LYRICS[t.no]).map((sec, i) => (
                    <div key={i} className="lyrics__part">
                      <p className="lyrics__tag">{sec.label}</p>
                      {sec.lines.map((line, j) => (
                        <p key={j} className={registerOf(line)}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </details>
            )}
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
