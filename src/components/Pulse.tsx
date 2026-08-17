import { useEffect } from 'react'
import { useRadio } from '../audio/AudioProvider'

/**
 * The heartbeat. Reads the station's analyser and writes `--pulse` (0..1) on
 * the root element — a fast-attack, slow-decay envelope over the kick-drum
 * region of the spectrum. Everything visual that should breathe with the
 * record reads that one variable in CSS; nothing here draws anything.
 *
 * The analyser already exists (the spectrograph and the room light use it), so
 * this costs one getByteFrequencyData per frame and a custom-property write —
 * no second graph, no second loop through the frequency data beyond these few
 * bins.
 *
 * On phones, strong peaks also get a 14ms buzz through navigator.vibrate —
 * short enough to read as the kick landing rather than a notification. It is
 * throttled hard (one per ~2s) and off entirely under reduced motion.
 */
export default function Pulse() {
  const { playing, analyser } = useRadio()

  useEffect(() => {
    if (!playing || !analyser) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const root = document.documentElement
    let raf = 0
    let level = 0
    let lastBuzz = 0

    const frame = (t: number) => {
      analyser.getByteFrequencyData(bins)
      // fftSize 512 over 48kHz: each bin ≈ 94Hz. Bins 1..9 ≈ 94–850Hz —
      // the kick and the low tom live there and nowhere else.
      let sum = 0
      for (let i = 1; i <= 9; i++) sum += bins[i]
      const energy = sum / 9 / 255
      // fast attack, slow decay — a heartbeat, not a VU meter
      level = Math.max(Math.min(1, energy * 1.35), level * 0.9)
      root.style.setProperty('--pulse', level.toFixed(3))

      if (level > 0.82 && t - lastBuzz > 2100) {
        lastBuzz = t
        try {
          navigator.vibrate?.(14)
        } catch {
          /* vibration unavailable or refused — purely decorative anyway */
        }
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      root.style.setProperty('--pulse', '0')
    }
  }, [playing, analyser])

  return null
}
