import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// GhostCursor pulls in three.js (~500 kB). Loading that on first paint for a
// section most visitors never scroll to is a bad trade, so the chunk is
// fetched only once the cavern is actually in view.
const GhostCursor = lazy(() => import('./GhostCursor/GhostCursor.jsx'))

import armsCrossed from '../assets/magic/arms-crossed.webp'

/**
 * The cavern. A dark room where the cursor drags a trail of light behind it,
 * like carrying a torch through somewhere with no other light source.
 *
 * GhostCursor pulls in three.js and runs a render loop, so it is mounted only
 * while the section is actually on screen, skipped entirely on touch (there is
 * no cursor to ghost) and under reduced-motion.
 */
export default function Cavern() {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (reduce || !hasPointer) return

    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="cavern border-t border-edge py-28 sm:py-36 lg:py-48">
      <img
        src={armsCrossed}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        style={{ maskImage: 'radial-gradient(70% 80% at 50% 45%, #000 20%, transparent 78%)', WebkitMaskImage: 'radial-gradient(70% 80% at 50% 45%, #000 20%, transparent 78%)' }}
      />
      {live && (
        <Suspense fallback={null}>
          <GhostCursor
          color="#e8a33d"
          trailLength={60}
          inertia={0.55}
          bloomStrength={0.35}
          bloomRadius={1.2}
          brightness={1.15}
          grainIntensity={0.06}
          mixBlendMode="screen"
            zIndex={2}
          />
        </Suspense>
      )}

      <div className="relative z-[3] mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
          Down where the torchlight ends
        </p>
        <h2
          className="mt-3 mb-6 font-display font-bold text-balance uppercase"
          style={{
            fontSize: 'clamp(1.9rem, 1.2rem + 2.6vw, 3.1rem)',
            letterSpacing: '0.06em',
            lineHeight: 1.08,
          }}
        >
          Bring your own light
        </h2>
        <p className="mx-auto max-w-[52ch] text-bonedim">
          Nobody walks in alone. Move your cursor — the dark gives back exactly as
          much as you carry into it.
        </p>
      </div>
    </section>
  )
}
