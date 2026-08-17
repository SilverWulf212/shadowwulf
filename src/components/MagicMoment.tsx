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
 *
 * The two photos are deliberately NOT side by side. Sitting in one grid they
 * competed: two blue glows at the same size, half a screen apart, and neither
 * one landed. Split across the page they read as a setup and a payoff — the
 * first is an aside on the way down, the second is the last thing before the
 * squad, at a size nothing else on the page gets.
 */
function MagicFrame({
  photo,
  align = 'left',
  feature = false,
}: {
  photo: Photo
  align?: 'left' | 'right'
  feature?: boolean
}) {
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
        className={`magic relative overflow-hidden border border-edge ${
          feature ? 'magic--feature' : ''
        }`}
        style={
          {
            '--hx': `${photo.handX}%`,
            '--hy': `${photo.handY}%`,
            '--spread': `${spread}%`,
            ...(photo.cutStart !== undefined && { '--cut-start': `${photo.cutStart}%` }),
            ...(photo.cutEnd !== undefined && { '--cut-end': `${photo.cutEnd}%` }),
          } as React.CSSProperties
        }
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={1400}
          height={1400}
          loading="lazy"
          className="block w-full"
        />

        {live && (
          <div className="magic__bolts" aria-hidden="true">
            <Lightning
              hue={212}
              xOffset={xOffset}
              speed={1.2}
              intensity={feature ? 1.45 : 1.3}
              size={2.1}
            />
          </div>
        )}

        <span className="magic__core" aria-hidden="true" />
        <span className="magic__grade" aria-hidden="true" />
      </div>
      <figcaption
        className={[
          'mt-3 font-mono tracking-[0.16em] text-steel uppercase',
          feature ? 'text-[0.72rem]' : 'text-[0.66rem]',
          align === 'right' ? 'sm:text-right' : '',
        ].join(' ')}
      >
        {photo.caption}
      </figcaption>
    </figure>
  )
}

const [FIRST, FEATURE] = MAGIC_PHOTOS

/**
 * First sighting — an aside partway down the record, image beside the text.
 * Deliberately restrained: it is a promise, and the payoff is further down.
 */
export function MagicAside() {
  if (!FIRST) return null
  return (
    <section className="border-t border-edge py-20 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-16">
        {/* Stacked on a phone both frames would be the same full-column width
            and the payoff would stop reading as the bigger one. Holding the
            aside in from the edge keeps the size difference on small screens
            too, where it is the only thing carrying the hierarchy. */}
        <div data-rise className="rise mx-auto w-[78%] max-w-sm lg:w-full lg:max-w-none">
          <MagicFrame photo={FIRST} align="left" />
        </div>

        <div data-rise className="rise">
          <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
            In the dungeon
          </p>
          <h2 className="sect-title mt-2 mb-6">The blue is his</h2>
          <p className="max-w-[52ch] text-bonedim">
            The torches are ours — we carry them, we ration them, we lose them in
            the water. What he brings is not a torch, and it answers to nobody
            else down there.
          </p>
          <p className="mt-4 max-w-[52ch] text-bonedim">
            He levels faster than anyone has a right to. Spells the rest of us are
            still reading about, he already has — and he throws them the half
            second before a run goes bad, not after.
          </p>
          <p className="mt-4 max-w-[52ch] text-bonedim">
            Most nights we walk out of there, it is because he had one more left
            than the room expected. He never announces it. The floor just gets
            brighter, and everyone already knows who is standing at the front.
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * The payoff. Full measure, centred, nothing else competing for the row —
 * the largest single image on the page, immediately before the squad.
 */
export function MagicFeature() {
  if (!FEATURE) return null
  return (
    <section className="magic-feature relative border-t border-edge py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-rise className="rise mb-10 flex flex-col gap-2 text-center sm:mb-14">
          <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
            And the wolf comes with it
          </p>
          <h2 className="sect-title m-0 mx-auto max-w-[18ch]">
            Nobody down here calls it luck
          </h2>
        </div>

        <div
          data-rise
          className="rise mx-auto w-full"
          style={{ maxWidth: 'min(92vw, 46rem)' }}
        >
          <MagicFrame photo={FEATURE} align="left" feature />
        </div>

        <p
          data-rise
          className="rise mx-auto mt-10 max-w-[56ch] text-center text-bonedim"
        >
          Six went in. The blue goes out ahead of them every time, and it has never
          once been aimed at anything but the thing between his squad and the door.
        </p>
      </div>
    </section>
  )
}

/** Back-compat: the old single section, both photos. Not used on the page. */
export default function MagicMoment() {
  return (
    <>
      <MagicAside />
      <MagicFeature />
    </>
  )
}
