import { useCallback, useEffect, useRef, useState } from 'react'
import { useRadio } from '../audio/AudioProvider'
import { getStationSnapshot } from '../audio/station'
import { RADIO_TRACKS } from '../audio/tracks'
import { TRACKS } from '../data/album'
import crest from '../assets/crest.webp'

/**
 * THE CORONATION.
 *
 * The record tracks which songs have actually been heard — a song counts when
 * it plays to the end (or 90% of it, in case he closes the tab during the
 * outro). When every song that currently exists has been heard, the site does
 * the thing the title track has been promising the whole way down: it crowns
 * him. Full screen, gold rays, his name — and a coronation scroll he can
 * download and print, drawn on a canvas so it needs no extra asset.
 *
 * The crown is keyed to the set of songs that existed when it was earned, so
 * it fires again when the rest of the record finishes rendering and he hears
 * the new songs. The dark is not done with him yet.
 */

const HEARD_KEY = 'sw:heard'
const CROWNED_KEY = 'sw:crowned'

function loadHeard(): Set<string> {
  try {
    const raw = localStorage.getItem(HEARD_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === 'string')) : new Set()
  } catch {
    return new Set()
  }
}

function saveHeard(set: Set<string>) {
  try {
    localStorage.setItem(HEARD_KEY, JSON.stringify([...set]))
  } catch {
    /* private mode / storage full — the crown just won't persist */
  }
}

/** The identity of "the record as it exists right now". */
function keyFor(ids: string[]): string {
  return ids.slice().sort().join(',')
}

// ── the scroll ───────────────────────────────────────────────────────────────

/** Print-facing constants — the page's OKLCH tokens, flattened to hex. */
const CERT = {
  w: 1224,
  h: 1584,
  ink: '#100f13',
  torch: '#d9a44e',
  hot: '#eccd92',
  bone: '#e9e4db',
  dim: '#a49e94',
  steel: '#79818f',
  edge: '#393842',
  ember: '#9c4a26',
}

/** One diamond, used at the border corners and to split the rules. */
function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = fill
  ctx.fillRect(-r, -r, r * 2, r * 2)
  ctx.restore()
}

function rule(ctx: CanvasRenderingContext2D, y: number, w: number) {
  const x = (CERT.w - w) / 2
  ctx.strokeStyle = CERT.edge
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(CERT.w / 2 - 18, y)
  ctx.moveTo(CERT.w / 2 + 18, y)
  ctx.lineTo(x + w, y)
  ctx.stroke()
  diamond(ctx, CERT.w / 2, y, 4.5, CERT.torch)
}

function centered(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  font: string,
  color: string,
  spacing = '0px',
) {
  ctx.save()
  try {
    ctx.letterSpacing = spacing
  } catch {
    /* letterSpacing unsupported: the type just sits a little tighter */
  }
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, CERT.w / 2, y)
  ctx.restore()
}

async function drawScroll(availableNos: ReadonlySet<number>): Promise<Blob | null> {
  const cv = document.createElement('canvas')
  cv.width = CERT.w
  cv.height = CERT.h
  const ctx = cv.getContext('2d')
  if (!ctx) return null

  // the blackletter face is self-hosted and loaded by now, but say so before
  // drawing with it or the canvas may commit to a fallback and stay there
  try {
    await document.fonts.ready
  } catch {
    /* fonts API unavailable — draw with whatever is there */
  }

  // ground
  ctx.fillStyle = CERT.ink
  ctx.fillRect(0, 0, CERT.w, CERT.h)

  // border: heavy torch rule, thin inner rule, corner diamonds
  ctx.strokeStyle = CERT.torch
  ctx.lineWidth = 3
  ctx.strokeRect(54, 54, CERT.w - 108, CERT.h - 108)
  ctx.strokeStyle = CERT.edge
  ctx.lineWidth = 1
  ctx.strokeRect(70, 70, CERT.w - 140, CERT.h - 140)
  for (const [x, y] of [
    [54, 54],
    [CERT.w - 54, 54],
    [54, CERT.h - 54],
    [CERT.w - 54, CERT.h - 54],
  ]) {
    diamond(ctx, x, y, 7, CERT.torch)
  }

  // crest
  try {
    const img = new Image()
    img.src = crest
    await img.decode()
    const s = 250
    ctx.drawImage(img, (CERT.w - s) / 2, 118, s, s)
  } catch {
    /* the crest is the page's own asset; if it cannot load the scroll
       still reads, just without the sigil */
  }

  centered(ctx, 'THE RECORD HAS SPOKEN', 452, '600 20px "Plex Mono", monospace', CERT.steel, '9px')
  centered(ctx, 'King of the Dark', 566, '600 92px "Grenze Gotisch", Georgia, serif', CERT.bone)
  rule(ctx, 608, 520)

  const body = '600 30px "Grenze", Georgia, serif'
  centered(ctx, 'Be it witnessed by the whole of the dark that', 672, body, CERT.dim)
  centered(ctx, 'RONIN', 790, '700 116px "Grenze Gotisch", Georgia, serif', CERT.torch)
  centered(ctx, 'called SHADOWWULF', 846, body, CERT.bone)
  centered(ctx, 'having heard every song the dark has released,', 916, body, CERT.dim)
  centered(ctx, 'is crowned by this record. He kept the count.', 956, body, CERT.dim)
  centered(ctx, 'He came home last.', 996, body, CERT.bone)

  // the manifest — every track, its fire, lit or waiting
  let y = 1082
  const no = '400 22px "Plex Mono", monospace'
  const titleFont = '600 29px "Grenze", Georgia, serif'
  const runFont = '400 22px "Plex Mono", monospace'
  for (const t of TRACKS) {
    const lit = availableNos.has(t.no)
    ctx.textBaseline = 'alphabetic'
    ctx.letterSpacing = '0px'
    ctx.font = no
    ctx.fillStyle = CERT.steel
    ctx.textAlign = 'right'
    ctx.fillText(String(t.no).padStart(2, '0'), 350, y)
    ctx.font = titleFont
    ctx.textAlign = 'left'
    ctx.fillStyle = lit ? CERT.bone : CERT.dim
    ctx.fillText(t.title, 386, y)
    // its fire, lit for what he has heard, a hollow ring for what waits
    ctx.beginPath()
    ctx.arc(918, y - 8, lit ? 6 : 5.5, 0, Math.PI * 2)
    if (lit) {
      try {
        ctx.fillStyle = `oklch(72% 0.15 ${t.fireHue})`
      } catch {
        ctx.fillStyle = CERT.torch
      }
      ctx.fill()
    } else {
      ctx.strokeStyle = CERT.edge
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    ctx.font = runFont
    ctx.textAlign = 'right'
    ctx.fillStyle = CERT.steel
    ctx.fillText(t.runtime, 874, y)
    y += 54
  }

  // the wax seal — the one element allowed to be red
  const sealY = 1470
  try {
    const g = ctx.createRadialGradient(CERT.w / 2 - 14, sealY - 16, 8, CERT.w / 2, sealY, 74)
    g.addColorStop(0, '#b85a2e')
    g.addColorStop(1, CERT.ember)
    ctx.fillStyle = g
  } catch {
    ctx.fillStyle = CERT.ember
  }
  ctx.beginPath()
  ctx.arc(CERT.w / 2, sealY, 66, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#6e3118'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(CERT.w / 2, sealY, 58, 0, Math.PI * 2)
  ctx.stroke()
  ctx.save()
  ctx.translate(CERT.w / 2, sealY)
  ctx.rotate(-0.05)
  ctx.font = '700 64px "Grenze Gotisch", Georgia, serif'
  ctx.fillStyle = CERT.bone
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('W', 0, 6)
  ctx.restore()

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  centered(
    ctx,
    `CROWNED ${date.toUpperCase()}  ·  SW-001  ·  THE NIGHT BEGINS TO SHINE`,
    1558,
    '600 16px "Plex Mono", monospace',
    CERT.steel,
    '5px',
  )

  return new Promise((resolve) => cv.toBlob(resolve, 'image/png'))
}

// ── the component ────────────────────────────────────────────────────────────

export default function CoronationMoment() {
  const { tracks, audioEl } = useRadio()
  const [heard, setHeard] = useState<Set<string>>(() => loadHeard())
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // ── record what has been heard ──────────────────────────────────────────
  // Reads the current track from the station snapshot rather than React
  // state, because `timeupdate` fires between renders. On `ended` the
  // station may already have rolled to the next song by the time this
  // listener runs — so the finished track is recovered from the element's
  // own `currentSrc`, which is the song that just played, not the next one.
  useEffect(() => {
    if (!audioEl) return

    const commit = (id: string) => {
      setHeard((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev)
        next.add(id)
        saveHeard(next)
        return next
      })
    }

    const idFromSrc = () => {
      const el = audioEl
      try {
        const abs = new URL(el.currentSrc || el.src, location.href).href
        return RADIO_TRACKS.find((t) => new URL(t.src, location.href).href === abs)?.id
      } catch {
        return undefined
      }
    }

    const onTime = () => {
      const cur = getStationSnapshot().currentTrack
      if (!cur) return
      const d = audioEl.duration
      if (Number.isFinite(d) && d > 0 && audioEl.currentTime / d >= 0.9) commit(cur.id)
    }
    const onEnded = () => {
      const id = idFromSrc() ?? getStationSnapshot().currentTrack?.id
      if (id) commit(id)
    }

    audioEl.addEventListener('timeupdate', onTime)
    audioEl.addEventListener('ended', onEnded)
    return () => {
      audioEl.removeEventListener('timeupdate', onTime)
      audioEl.removeEventListener('ended', onEnded)
    }
  }, [audioEl])

  // ── decide whether the moment has come ──────────────────────────────────
  const recordKey = keyFor(tracks.map((t) => t.id))
  const allHeard =
    tracks.length >= 2 && tracks.every((t) => heard.has(t.id))

  useEffect(() => {
    if (!allHeard) return
    let crownedFor = ''
    try {
      crownedFor = localStorage.getItem(CROWNED_KEY) ?? ''
    } catch {
      /* storage unreadable — better to crown twice than never */
    }
    if (crownedFor !== recordKey) setOpen(true)
    // recordKey changes when new songs land; allHeard when he finishes them
  }, [allHeard, recordKey])

  // ── the overlay, while it is open ───────────────────────────────────────
  const close = useCallback(() => {
    setOpen(false)
    try {
      localStorage.setItem(CROWNED_KEY, recordKey)
    } catch {
      /* then the dark crowns him again next visit — no harm */
    }
  }, [recordKey])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const takeScroll = useCallback(async () => {
    const availableNos = new Set(tracks.map((t) => t.no))
    const blob = await drawScroll(availableNos)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shadowwulf-coronation-scroll.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 8000)
  }, [tracks])

  if (!open) return null

  return (
    <div className="crown" role="dialog" aria-modal="true" aria-labelledby="crown-title">
      <div className="crown__rays" aria-hidden="true" />
      <div className="crown__stage">
        <img
          src={crest}
          alt=""
          aria-hidden="true"
          width={640}
          height={640}
          className="crown__crest plate"
        />
        <p className="crown__eyebrow">The record has spoken</p>
        <p className="crown__title" id="crown-title">
          All hail the King of the Dark
        </p>
        <p className="crown__name">Ronin — called ShadowWulf</p>
        <div className="crown__cta">
          <button type="button" className="crown__btn" onClick={takeScroll}>
            Take your coronation scroll
          </button>
          <button type="button" ref={closeRef} className="crown__ghost" onClick={close}>
            Return to the dark
          </button>
        </div>
        <p className="crown__hint">
          When the rest of the record comes off the forge, the torches light again.
        </p>
      </div>
    </div>
  )
}
