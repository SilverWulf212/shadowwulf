import ScrollExpand from './ScrollExpand/ScrollExpand.jsx'
import TorchWalls from './TorchWalls'
import peak from '../assets/magic/peak.webp'
import wordmark from '../assets/wordmark.webp'

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
        title={
          <img
            src={wordmark}
            alt="ShadowWulf"
            width={1600}
            height={556}
            className="intro-mark mx-auto block w-full max-w-[min(72vw,40rem)]"
          />
        }
        scrollHint="Descend"
        useWindowScroll
        startWidth={44}
        startHeight={52}
        startRadius={22}
        endRadius={0}
        mediaZoom={1.12}
        // The expansion itself earns its 1.35. The hold did not: measured, the
        // clip-path is done by scrollY 1125 and the old 0.4 held a finished,
        // full-bleed frame static for a further 450px. 0.12 leaves a beat to
        // read the line under it without stalling the page.
        scrollDistance={1.35}
        holdDistance={0.12}
        overlayScrim={0.52}
      >
        <p
          className="mx-auto mt-4 mb-0 max-w-[46ch] text-balance text-bone"
          style={{ fontSize: 'clamp(1rem, 0.9rem + 0.6vw, 1.35rem)' }}
        >
          You felt the presence in VR.
        </p>
      </ScrollExpand>

      <TorchWalls />
    </section>
  )
}
