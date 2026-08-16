import Intro from './components/Intro'
import Hero from './components/Hero'
import Tracklist from './components/Tracklist'
import MagicMoment from './components/MagicMoment'
import Coronation from './components/Coronation'
import Merch from './components/Merch'
import Cavern from './components/Cavern'
import Radio from './components/Radio'
import { useRadio } from './audio/AudioProvider'
import { useReveal, useScrollY } from './components/useScroll'
import { ALBUM, SQUAD } from './data/album'
import cover from './assets/cover.webp'
import portrait from './assets/magic/helm-portrait.webp'

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string
  eyebrow?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="border-t border-edge py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* eyebrow stacks above the heading, never beside it */}
        <div className="mb-10 flex flex-col gap-2 sm:mb-14">
          {eyebrow && (
            <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="sect-title m-0">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function Page() {
  useReveal()
  const y = useScrollY()
  // the station is module-level, so this reads the same analyser the bar drives
  const { analyser, currentTrack, playing } = useRadio()

  return (
    <>
      <Intro />
      <Hero />

      <main>
        {/* ── statement ─────────────────────────────────────────── */}
        <section className="py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p
              data-rise
              className="rise m-0 font-display text-balance"
              style={{
                fontSize: 'clamp(1.5rem, 1rem + 2.4vw, 3rem)',
                lineHeight: 1.25,
                letterSpacing: '0.01em',
              }}
            >
              Down where the torchlight ends, he walks in slow and calm. Down here
              they know his name.{' '}
              <span className="text-torch">They call him ShadowWulf.</span>
            </p>
            <p
              data-rise
              className="rise mt-8 max-w-[62ch] text-bonedim"
              style={{ fontSize: '1.05rem' }}
            >
              {ALBUM.blurb} Every word is sung clean — no screams, no growls —
              because the point of a coronation is that you can hear it.
            </p>
          </div>
        </section>

        <Coronation />

        {/* ── tracklist ─────────────────────────────────────────── */}
        <Section id="tracks" eyebrow={`${ALBUM.artist} · ${ALBUM.year}`} title={ALBUM.title}>
          <Tracklist
            playingNo={playing ? currentTrack?.no : undefined}
            analyser={analyser}
          />
        </Section>

        <MagicMoment />

        {/* ── cover ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-edge py-20 sm:py-28 lg:py-36">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div data-rise className="rise relative">
              <img
                src={cover}
                alt={`Album cover for ${ALBUM.title}: an armored figure raising a torch at a great iron door`}
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full border border-edge"
                style={{ transform: `translate3d(0,${y * -0.015}px,0)` }}
              />
            </div>
            <div data-rise className="rise">
              <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
                The door
              </p>
              <h2 className="sect-title mt-2 mb-6">
                He steps in front of us all
              </h2>
              <p className="max-w-[56ch] text-bonedim">
                The record is built like a raid: the presence in the dark, the six
                of them at the door, the coronation, the giant, the rescue, and the
                morning. It ends the way every run ends — with him walking out last,
                counting everyone through ahead of him.
              </p>
              <p className="mt-4 max-w-[56ch] text-bonedim">
                He gives the gold away. He keeps the lesser blade. Nobody asked him
                to.
              </p>
            </div>
          </div>
        </section>

        <Merch />

        <Cavern />

        {/* ── squad ─────────────────────────────────────────────── */}
        <Section eyebrow="Six went in" title="The Squad">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
            <figure data-rise className="rise m-0">
              <img
                src={portrait}
                alt="Ronin in a wolf-crested helm, the moon behind him"
                loading="lazy"
                className="w-full border border-edge"
              />
              <figcaption className="mt-3 font-mono text-[0.66rem] tracking-[0.16em] text-steel uppercase">
                Ronin — ShadowWulf
              </figcaption>
            </figure>

            <ul className="m-0 grid list-none gap-px self-start bg-edge p-0 sm:grid-cols-2">
              {SQUAD.map((m) => (
                <li key={m.name} data-rise className="rise bg-crypt p-6">
                  <h3
                    className="m-0 font-body font-semibold"
                    style={{ fontSize: '1.15rem', letterSpacing: '0.09em' }}
                  >
                    {m.name}
                  </h3>
                  <p className="mt-2 mb-0 text-[0.95rem] text-bonedim">{m.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>

      <footer className="border-t border-edge py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 font-mono text-[0.68rem] tracking-[0.16em] text-steel uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>
            {ALBUM.artist} — {ALBUM.title}
          </span>
          <span>Rendered locally · {ALBUM.year}</span>
          <span>Music generated with AI · MiniMax-Music3</span>
        </div>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <Radio>
      <Page />
    </Radio>
  )
}
