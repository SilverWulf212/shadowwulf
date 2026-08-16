import ScrollExpand from './ScrollExpand/ScrollExpand.jsx'
import TorchWalls from './TorchWalls'
import peak from '../assets/magic/peak.webp'

/**
 * The way in. A torchlit corridor that opens as you scroll — the frame widens,
 * the torches drift past on both walls, and it hands the stage over to the
 * record. Sits above the hero so the site starts as a walk, not a page.
 */
export default function Intro() {
  return (
    <section className="intro relative">
      <ScrollExpand
        src={peak}
        alt="Ronin standing on a storm-lit peak, his wolf beside him"
        title="Shadowwulf"
        scrollHint="Descend"
        useWindowScroll
        startWidth={38}
        startHeight={56}
        startRadius={22}
        endRadius={0}
        mediaZoom={1.45}
        scrollDistance={1.35}
        holdDistance={0.4}
        overlayScrim={0.52}
      >
        <h2
          className="m-0 font-display font-bold text-balance"
          style={{
            fontSize: 'clamp(1.6rem, 1rem + 2.6vw, 3.4rem)',
            letterSpacing: '0',
            lineHeight: 1.08,
          }}
        >
          You felt the presence in VR
        </h2>
        <p
          className="mx-auto mt-4 mb-0 max-w-[46ch] text-balance text-bone"
          style={{ fontSize: 'clamp(1rem, 0.9rem + 0.6vw, 1.35rem)' }}
        >
          Now hear his intro music.
        </p>
      </ScrollExpand>

      <TorchWalls />
    </section>
  )
}
