import { useEffect, useState } from 'react'
import Embers from './Embers'
import { useScrollY } from './useScroll'
import { ALBUM } from '../data/album'
import far from '../assets/layer-far.webp'
import mid from '../assets/layer-mid.webp'
import near from '../assets/layer-near.webp'
import crest from '../assets/crest.webp'
import wordmark from '../assets/wordmark.webp'

/**
 * Three generated plates moving at different rates against the scroll.
 * Far barely drifts, near runs almost with the page — that difference
 * is the whole effect.
 */
export default function Hero() {
  const y = useScrollY()
  const [ready, setReady] = useState(false)

  // one orchestrated arrival: the vault lights, the crest settles, the
  // wordmark blooms. Staggered in CSS off this single flag.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  const plate = (depth: number) => ({
    transform: `translate3d(0, ${y * depth}px, 0) scale(${1 + depth * 0.12})`,
  })

  // Foreground leaves faster than background: that rate difference IS the
  // depth. The wordmark is nearest, so it exits first and fades as it goes.
  const lift = (rate: number) => `translate3d(0, ${-y * rate}px, 0)`
  const fade = (start: number, end: number) =>
    Math.max(0, Math.min(1, 1 - (y - start) / (end - start)))

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden">
      {/* depth plates */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={far}
          alt=""
          aria-hidden="true"
          className="plate absolute inset-0 h-full w-full object-cover opacity-45 will-change-transform"
          style={plate(0.12)}
        />
        <img
          src={mid}
          alt=""
          aria-hidden="true"
          className="plate absolute inset-0 h-full w-full object-cover opacity-60 will-change-transform"
          style={plate(0.28)}
        />
        <Embers className="absolute inset-0 h-full w-full" />
        <img
          src={near}
          alt=""
          aria-hidden="true"
          className="plate absolute inset-0 h-full w-full object-cover opacity-80 will-change-transform"
          style={plate(0.5)}
        />
        {/* scrim — pulls the stone back down so the wordmark carries */}
        <div className="absolute inset-0 bg-ink/55" />
        {/* vault glow + floor falloff */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 78% at 50% 0%, oklch(76% 0.145 68 / 0.16) 0%, oklch(76% 0.145 68 / 0.04) 34%, transparent 66%), radial-gradient(90% 60% at 50% 108%, oklch(50% 0.135 35 / 0.18) 0%, transparent 62%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div
        className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8"
        data-ready={ready}
      >
        <img
          src={crest}
          alt=""
          aria-hidden="true"
          width={640}
          height={640}
          className="hero-crest plate w-20 sm:w-24 lg:w-28"
          style={{ transform: lift(0.22), opacity: fade(0, 900) }}
        />

        {/* His own logo. The accessible name stays "ShadowWulf" so screen
            readers and search get the artist's real name, while the visual
            is the artwork he chose. */}
        <h1
          className="hero-mark m-0 mt-6 w-full leading-none"
          style={{ transform: lift(0.5), opacity: fade(0, 760) }}
        >
          <span className="sr-only">{ALBUM.artist}</span>
          <img
            src={wordmark}
            alt=""
            aria-hidden="true"
            width={1500}
            height={588}
            className="mx-auto block w-full max-w-[min(86vw,54rem)]"
          />
        </h1>

        <p
          className="hero-tag mt-7 max-w-2xl font-body text-balance text-bone"
          style={{
            fontSize: 'clamp(1.05rem, 0.85rem + 1vw, 1.6rem)',
            transform: lift(0.34),
            opacity: fade(0, 620),
          }}
        >
          {ALBUM.tagline}
        </p>

        <p
          className="hero-tag mt-3 max-w-2xl font-body text-balance text-bonedim"
          style={{ fontSize: 'clamp(0.95rem, 0.9rem + 0.3vw, 1.1rem)', transform: lift(0.3), opacity: fade(0, 600) }}
        >
          {ALBUM.subTagline}
        </p>

        <ul
          className="hero-spec mt-9 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2 p-0 font-mono text-[0.68rem] tracking-[0.2em] text-steel uppercase"
          style={{ transform: lift(0.26), opacity: fade(0, 560) }}
        >
          <li>The debut record</li>
          <li aria-hidden="true" className="h-3 w-px bg-edge" />
          <li>Seven tracks</li>
          <li aria-hidden="true" className="h-3 w-px bg-edge" />
          <li>Orchestra &amp; metal</li>
        </ul>

        <a
          href="#tracks"
          style={{ transform: lift(0.2), opacity: fade(0, 520) }}
          className="hero-cta mt-11 inline-block border border-torch px-7 py-3 font-mono text-[0.7rem] tracking-[0.24em] whitespace-nowrap text-torch uppercase transition-colors duration-200 hover:bg-torch hover:text-ink focus-visible:bg-torch focus-visible:text-ink"
        >
          Enter the record
        </a>
      </div>
    </header>
  )
}
