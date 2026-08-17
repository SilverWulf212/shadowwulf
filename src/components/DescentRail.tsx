import { useEffect, useRef } from 'react'

/**
 * A fuse burning down the left edge of the page.
 *
 * The record is a descent — the presence, the door, the coronation, the giant,
 * the morning — so the progress indicator is a torch burning down rather than a
 * bar filling up. The lit length is scroll position; the tip is the flame and
 * carries the only motion. Written straight to the DOM as a custom property so
 * scrolling never re-renders React.
 *
 * Hidden below 34rem: on a phone the left gutter is the swipe-back zone and the
 * rail has nowhere to live that isn't in the way.
 */
export default function DescentRail() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced motion still gets the position, it just doesn't get the flicker.
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.setProperty(
        '--burn',
        max > 40 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : '0',
      )
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        paint()
        ticking = false
      })
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Lyric panels and lazy images change document height without a scroll
    // event, which would leave the fuse reading against a stale total.
    const ro = new ResizeObserver(onScroll)
    ro.observe(document.body)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className="rail" aria-hidden="true">
      <span className="rail__burn" />
      <span className="rail__tip" />
    </div>
  )
}
