import { useEffect, useState } from 'react'

/** Raw window scrollY, rAF-throttled. Returns 0 when motion is reduced. */
export function useScrollY() {
  const [y, setY] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setY(window.scrollY)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return y
}

/**
 * Scroll measured from the top of one section, never from the top of the page.
 *
 * Every parallax on this site was originally written against `useScrollY()`
 * back when its section was at the top of the document. Anything inserted
 * above it then hands it a scroll value hundreds or thousands of pixels too
 * large before it has moved at all, and the effect has already run to
 * completion by the time you can see it — which is how the hero arrived empty
 * and how the coronation plate got dragged ~270px up out of its own frame,
 * leaving a black band under the moon.
 *
 * Returns 0 until the section reaches the top of the viewport, then counts up.
 * Measured, not assumed: the offset depends on viewport height and on props
 * of the sections above.
 */
export function useSectionScrollY(ref: React.RefObject<HTMLElement | null>) {
  const pageY = useScrollY()
  const [top, setTop] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setTop(el.getBoundingClientRect().top + window.scrollY)
    measure()
    window.addEventListener('resize', measure)
    // sections above size themselves off innerHeight, so they can move us
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [ref])

  return Math.max(0, pageY - top)
}

/** Adds data-lit="true" to every [data-rise] element as it enters view. */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-rise]'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Bail out entirely if we can't animate — the CSS then leaves everything
    // visible, which is the correct degraded state.
    if (reduce || typeof IntersectionObserver === 'undefined') return

    document.documentElement.classList.add('js-reveal')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-lit', 'true')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => {
      io.disconnect()
      document.documentElement.classList.remove('js-reveal')
    }
  }, [])
}
