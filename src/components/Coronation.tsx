import { useRef } from 'react'
import { useSectionScrollY } from './useScroll'
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
  const ref = useRef<HTMLElement>(null)
  // relative to this band, not to the document -- see useSectionScrollY
  const y = useSectionScrollY(ref)

  // A scaled plate only overhangs its own box by height * (SCALE - 1) / 2 on
  // each edge. Drift further than that and you are no longer parallaxing, you
  // are dragging the picture out of frame -- which is exactly what happened:
  // scale(1.12) on a 455px band leaves 27px of overscan and the transform was
  // moving 91px, so the moon and his raised arms were pushed off the top.
  //
  // Expressing the drift as a PERCENTAGE of the band's own height makes the
  // budget checkable without measuring anything: the cap is simply
  // (SCALE - 1) / 2, and MAX_DRIFT stays under it.
  const SCALE = 1.24
  const MAX_DRIFT = 9 // %, against an available (1.24 - 1) / 2 = 12%
  const drift = Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, y * -0.012)).toFixed(2)

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-edge">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={triumph}
          alt=""
          aria-hidden="true"
          width={1400}
          height={1400}
          className="h-full w-full object-cover object-top will-change-transform"
          style={{ transform: `translate3d(0, ${drift}%, 0) scale(${SCALE})` }}
        />
        {/* let the type sit on something, without flattening the moon */}
        <div
          className="absolute inset-0"
          style={{
            // Two jobs, and they pull against each other: give the type
            // something to sit on, and do not bury the moon. The scrim stays
            // light through the top two thirds -- that is where the moon and
            // his arms are, and it is the picture the title track is about --
            // then ramps hard only in the last sixth, landing on full ink so
            // the band ends by going dark instead of being cut off mid-chest.
            background:
              'linear-gradient(to bottom, oklch(11% 0.006 300 / 0.5) 0%, oklch(11% 0.006 300 / 0.12) 34%, oklch(11% 0.006 300 / 0.3) 62%, oklch(11% 0.006 300 / 0.78) 86%, oklch(11% 0.006 300) 100%)',
          }}
        />
      </div>

      {/* Taller than it was: with the plate no longer being dragged out of its
          own box, the moon and his arms fill the frame, and at 78svh the type
          landed across his face. The extra height is headroom for the picture,
          not for the words. */}
      <div className="relative mx-auto flex min-h-[92svh] max-w-4xl flex-col items-center justify-end px-5 pt-40 pb-16 text-center sm:px-8 sm:pb-24">
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
