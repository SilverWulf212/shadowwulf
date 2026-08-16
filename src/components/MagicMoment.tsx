import { useEffect, useRef, useState } from 'react'
import Lightning from './Lightning/Lightning.jsx'
import { MAGIC_PHOTOS, type Photo } from '../data/photos'

/**
 * Where his magic comes in.
 *
 * Lightning renders as a full-bleed WebGL field, so to make it read as coming
 * OUT OF HIS HANDS two things have to line up: the bolt is aimed at the hand
 * with the shader's own aspect-corrected maths, and the canvas is masked down
 * to a cone anchored on that same point. Miss either and it is just weather.
 *
 * The canvas mounts only while its frame is on screen — a WebGL context
 * spinning off-screen is pure waste on a laptop.
 */
function MagicFrame({ photo, flip }: { photo: Photo; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [aspect, setAspect] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: '150px',
    })
    io.observe(el)

    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      if (height > 0) setAspect(width / height)
    })
    ro.observe(el)

    return () => {
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  // The shader draws the bolt where (2*fx - 1) * aspect + uXOffset === 0.
  // Solving for the hand gives this — note it is the NEGATIVE of the naive
  // guess, which is exactly why an unchecked version lands on the wrong side.
  const xOffset = ((50 - photo.handX) / 50) * aspect
  const spread = photo.spread ?? 50

  return (
    <figure className="m-0">
      <div
        ref={ref}
        className="magic relative overflow-hidden border border-edge"
        style={
          {
            '--hx': `${photo.handX}%`,
            '--hy': `${photo.handY}%`,
            '--spread': `${spread}%`,
          } as React.CSSProperties
        }
      >
        <img src={photo.src} alt={photo.alt} loading="lazy" className="block w-full" />

        {live && (
          <div className="magic__bolts" aria-hidden="true">
            <Lightning hue={212} xOffset={xOffset} speed={1.2} intensity={1.3} size={2.1} />
          </div>
        )}

        <span className="magic__core" aria-hidden="true" />
        <span className="magic__grade" aria-hidden="true" />
      </div>
      <figcaption
        className={`mt-3 font-mono text-[0.66rem] tracking-[0.16em] text-steel uppercase ${
          flip ? 'sm:text-right' : ''
        }`}
      >
        {photo.caption}
      </figcaption>
    </figure>
  )
}

export default function MagicMoment() {
  return (
    <section className="border-t border-edge py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-2 sm:mb-14">
          <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
            In the dungeon
          </p>
          <h2 className="sect-title m-0">It comes out of his hands</h2>
          <p className="mt-4 max-w-[54ch] text-bonedim">
            The torches are ours. The blue is his — it answers to nobody else down
            there, and it always arrives a half second before he does.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {MAGIC_PHOTOS.map((p, i) => (
            <MagicFrame key={p.src} photo={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
