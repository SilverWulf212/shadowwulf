import { useScrollY } from './useScroll'
import triumph from '../assets/magic/moon-triumph.webp'

/**
 * The coronation band. Full-bleed, arms wide, the moon behind him — the image
 * the title track is actually about. It sits between the statement and the
 * tracklist so the record's claim gets a picture before it gets a list.
 *
 * The plate drifts slower than the page, so scrolling past feels like the moon
 * holding still while you move.
 */
export default function Coronation() {
  const y = useScrollY()

  return (
    <section className="relative isolate overflow-hidden border-t border-edge">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={triumph}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top will-change-transform"
          style={{ transform: `translate3d(0, ${y * -0.06}px, 0) scale(1.12)` }}
        />
        {/* let the type sit on something, without flattening the moon */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, oklch(11% 0.006 300 / 0.55) 0%, oklch(11% 0.006 300 / 0.2) 38%, oklch(11% 0.006 300 / 0.85) 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[78svh] max-w-4xl flex-col items-center justify-end px-5 pt-40 pb-16 text-center sm:px-8 sm:pb-24">
        <p
          className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-spirithot uppercase"
          style={{ textShadow: '0 2px 14px oklch(11% 0.006 300 / 0.95)' }}
        >
          Torches high
        </p>
        <p
          className="mt-4 mb-0 font-display font-bold text-balance"
          style={{
            fontSize: 'clamp(1.7rem, 1rem + 3vw, 3.6rem)',
            letterSpacing: '0',
            lineHeight: 1.06,
            textShadow: '0 3px 24px oklch(11% 0.006 300 / 0.9)',
          }}
        >
          All hail the king of the dark
        </p>
      </div>
    </section>
  )
}
