import { useEffect, useState } from 'react'

/**
 * THE SPIRIT WOLF.
 *
 * Type the word — w-u-l-f, anywhere, slowly, it is patient — and the spirit
 * wolf crosses the bottom of the page once, the way he crosses the record:
 * fast, gold-edged, and gone before you can point at him.
 *
 * Silent on purpose. A howl synthesized from oscillators is a sound effect
 * from a cartoon; a wolf you can almost hear is a rumor.
 */
export default function WolfEgg() {
  const [runs, setRuns] = useState(0)

  useEffect(() => {
    let buf = ''
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (
        el &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      ) {
        return
      }
      if (e.key.length !== 1) return
      buf = (buf + e.key.toLowerCase()).slice(-4)
      if (buf === 'wulf') {
        buf = ''
        setRuns((r) => r + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // the crossing un-mounts itself; a second summon while one is running
  // restarts it via the key
  useEffect(() => {
    if (!runs) return
    const t = setTimeout(() => setRuns(0), 3200)
    return () => clearTimeout(t)
  }, [runs])

  if (!runs) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  return (
    <div key={runs} className="wolf-run" aria-hidden="true">
      <svg className="wolf-run__wolf" viewBox="0 0 300 130" focusable="false">
        {/* far pair of legs, dimmer — the far side of the stride */}
        <path
          className="wolf-run__far"
          d="M96 74 L74 96 L70 112 L79 111 L92 94 L106 82 Z
             M186 76 L206 92 L224 106 L230 98 L208 82 L194 72 Z"
        />
        {/* body, head, ears, near legs, streaming tail — one path, one breath */}
        <path
          className="wolf-run__body"
          d="M258 52
             L242 38
             L234 24 L227 37
             L218 27 L214 42
             C198 38 176 42 156 52
             C138 60 118 58 102 54
             L84 42 L58 40 L36 46 L20 44
             L38 56 L30 60 L52 62
             L74 66
             L58 84 L50 104 L60 103 L74 84 L86 70
             C110 78 142 82 164 78
             L184 68
             L204 82 L226 100 L234 92 L212 74 L196 62
             L210 58 L226 60 L244 60 Z"
        />
        {/* the eye — one gold spark, the only lit thing on him */}
        <path className="wolf-run__eye" d="M240 44 L245 48 L240 52 L235 48 Z" />
      </svg>
    </div>
  )
}
