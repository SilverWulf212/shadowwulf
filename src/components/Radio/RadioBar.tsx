import { useEffect, useRef } from 'react'
import { useRadio } from '../../audio/AudioProvider'
import './Radio.css'

/** Gothic reliquary grille: horns, a gem, bars, fangs. Pure ornament. */
function Crest() {
  return (
    <svg
      className="rdo__crest"
      viewBox="0 0 44 46"
      width="30"
      height="31"
      aria-hidden="true"
      focusable="false"
    >
      {/* horns */}
      <path d="M10 22 C5 17 2 10 4 3 C9 7 12 14 12 20 Z" fill="currentColor" />
      <path d="M34 22 C39 17 42 10 40 3 C35 7 32 14 32 20 Z" fill="currentColor" />
      {/* arch */}
      <path
        d="M9 42 V24 C9 13 15 7 22 7 C29 7 35 13 35 24 V42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      {/* the eye */}
      <path d="M22 12 L25.5 17 L22 22 L18.5 17 Z" fill="currentColor" />
      {/* grille bars */}
      <path
        d="M15 42 V27 M22 42 V22 M29 42 V27"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      {/* lintel + fangs */}
      <path d="M6 42 H38" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 42 L14 46 L16 42 Z M20 42 L22 46 L24 42 Z M28 42 L30 46 L32 42 Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* Glyphs are cut, not rounded — flat angles to sit with the blackletter face. */
const GLYPH = { viewBox: '0 0 18 17', width: 13, height: 12 } as const

function PlayGlyph() {
  return (
    <svg {...GLYPH} aria-hidden="true" focusable="false">
      <path d="M3 1 L16 8.5 L3 16 Z" fill="currentColor" />
    </svg>
  )
}

function PauseGlyph() {
  return (
    <svg {...GLYPH} aria-hidden="true" focusable="false">
      <path d="M3 1 L7.5 1 L6 16 L1.5 16 Z M11.5 1 L16 1 L14.5 16 L10 16 Z" fill="currentColor" />
    </svg>
  )
}

function NextGlyph() {
  return (
    <svg {...GLYPH} aria-hidden="true" focusable="false">
      <path d="M1 1 L9 8.5 L1 16 Z M8 1 L16 8.5 L8 16 Z" fill="currentColor" />
    </svg>
  )
}

/** The plain sentence a screen reader hears. */
function statusLine(
  onAir: boolean,
  probing: boolean,
  playing: boolean,
  title: string | null,
): string {
  if (!onAir) return probing ? 'Tuning in…' : 'Off air — the first track is still on the forge.'
  if (!title) return 'Tune in to ShadowWulf Radio.'
  return `${playing ? 'Now playing' : 'Paused'} — ${title}.`
}

/** The broadcast crawl. Decorative, and duplicated, so it is aria-hidden. */
function crawlLine(
  onAir: boolean,
  probing: boolean,
  playing: boolean,
  title: string | null,
): string {
  const parts = ['SHADOWWULF RADIO']
  if (!onAir) {
    parts.push(probing ? 'TUNING IN' : 'OFF AIR', 'THE FIRST TRACK IS STILL ON THE FORGE')
  } else if (!title) {
    parts.push('STREAMING 24/7', 'TUNE IN')
  } else {
    parts.push(`${playing ? 'NOW PLAYING' : 'PAUSED'}: ${title.toUpperCase()}`, 'STREAMING 24/7')
  }
  return `${parts.join(' — ')} — `
}

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function RadioBar() {
  const { playing, currentTrack, toggle, next, onAir, probing, audioEl } = useRadio()
  const rootRef = useRef<HTMLElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)

  // Progress goes straight to the DOM. The device never re-renders for it,
  // which matters because a visualiser is sharing this audio element.
  useEffect(() => {
    const el = rootRef.current
    if (!audioEl || !el) return
    const paint = () => {
      const d = audioEl.duration
      const known = Number.isFinite(d) && d > 0
      el.style.setProperty('--rdo-progress', (known ? audioEl.currentTime / d : 0).toFixed(4))
      if (timeRef.current) {
        timeRef.current.textContent = known
          ? `${clock(audioEl.currentTime)} / ${clock(d)}`
          : ''
      }
    }
    paint()
    const events = ['timeupdate', 'loadedmetadata', 'seeked', 'emptied', 'ended'] as const
    for (const e of events) audioEl.addEventListener(e, paint)
    return () => {
      for (const e of events) audioEl.removeEventListener(e, paint)
    }
  }, [audioEl])

  const title = currentTrack?.title ?? null
  const status = statusLine(onAir, probing, playing, title)
  const crawl = crawlLine(onAir, probing, playing, title)
  // constant reading speed regardless of how long the line is
  const crawlDuration = `${Math.max(20, Math.round(crawl.length * 0.5))}s`

  return (
    <section
      ref={rootRef}
      className="rdo"
      aria-label="ShadowWulf Radio"
      data-on-air={onAir ? 'true' : 'false'}
      data-playing={playing ? 'true' : 'false'}
    >
      <div className="rdo__frame">
        <div className="rdo__plate">
          <span className="rdo__sigil" aria-hidden="true">
            <Crest />
          </span>

          {/* The station name is in the crawl, constantly — the label is the
              broadcast lamp, and stays short enough never to truncate. */}
          <p className="rdo__label">
            <span className="rdo__lamp" aria-hidden="true" />
            <span>{onAir ? 'On Air' : probing ? 'Tuning' : 'Off Air'}</span>
            {/* elapsed / total, written straight to the DOM by the effect above */}
            <span className="rdo__time" ref={timeRef} aria-hidden="true" />
          </p>

          {/* the crawl: two identical copies, translated by exactly half a
              track width, so the loop has no seam. left -> right. */}
          <div className="rdo__ticker" aria-hidden="true">
            <div className="rdo__crawl" style={{ animationDuration: crawlDuration }}>
              <span>{crawl}</span>
              <span>{crawl}</span>
            </div>
          </div>

          {/* what the crawl says, said once, for assistive tech */}
          <p className="rdo__sr" aria-live="polite">
            {status}
          </p>

          <div className="rdo__ctrl">
            <button
              type="button"
              className="rdo__btn"
              onClick={toggle}
              disabled={!onAir}
              aria-pressed={playing}
              aria-label={playing ? 'Pause ShadowWulf Radio' : 'Play ShadowWulf Radio'}
            >
              {playing ? <PauseGlyph /> : <PlayGlyph />}
            </button>
            <button
              type="button"
              className="rdo__btn"
              onClick={next}
              disabled={!onAir}
              aria-label="Next track"
            >
              <NextGlyph />
            </button>
          </div>

          <div className="rdo__rail" aria-hidden="true">
            <span className="rdo__burn" />
          </div>
        </div>
      </div>
    </section>
  )
}
