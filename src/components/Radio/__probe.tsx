// TEMPORARY verification harness — delete after checking. Not imported by the app.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import Radio from './Radio'
import { useRadio } from '../../audio/AudioProvider'

function Readout() {
  const { playing, currentTrack, tracks, onAir, analyser, audioEl } = useRadio()
  return (
    <pre
      id="readout"
      style={{ fontFamily: 'monospace', fontSize: 12, color: '#ddd', padding: 16 }}
    >
      {JSON.stringify(
        {
          playing,
          current: currentTrack?.title ?? null,
          tracks: tracks.map((t) => t.title),
          onAir,
          analyser: analyser ? `fft:${analyser.fftSize}/${analyser.smoothingTimeConstant}` : null,
          time: audioEl?.currentTime ?? null,
          duration: audioEl?.duration ?? null,
        },
        null,
        1,
      )}
    </pre>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Radio>
      <div style={{ minHeight: '150vh' }}>
        <Readout />
      </div>
    </Radio>
  </StrictMode>,
)
