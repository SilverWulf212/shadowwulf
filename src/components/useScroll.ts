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
