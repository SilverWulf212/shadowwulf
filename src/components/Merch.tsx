import { ALBUM } from '../data/album'
import vinylSleeve from '../assets/merch/vinyl-sleeve.webp'
import vinylRecord from '../assets/merch/vinyl-record.webp'
import cdCase from '../assets/merch/cd-case.webp'
import tee from '../assets/merch/tee.webp'
import poster from '../assets/merch/poster.webp'
import cassette from '../assets/merch/cassette.webp'
import pinPatch from '../assets/merch/pin-patch.webp'

/**
 * The merch line, set like a real store — except nothing is for sale, and the
 * page says so out loud. "Edition of one" is both the literal truth and the
 * best line available to this record: nobody else has any of it.
 *
 * Every item is a photograph of a physical object carrying his own logo, so
 * the section reads as a pressing that exists rather than a mockup.
 */

interface Item {
  src: string
  name: string
  detail: string
  format: string
  wide?: boolean
  /** intrinsic size, so the card reserves its box before the bytes arrive */
  w: number
  h: number
}

const ITEMS: Item[] = [
  {
    src: vinylSleeve,
    name: 'King of the Dark',
    detail: '12" heavyweight vinyl, printed sleeve',
    format: 'LP',
    wide: true,
    w: 1000,
    h: 1000,
  },
  { src: vinylRecord, name: 'The Pressing', detail: 'Gold-label black vinyl', format: 'LP', w: 1000, h: 1000 },
  { src: cdCase, name: 'Compact Disc', detail: 'Jewel case, printed insert', format: 'CD', w: 1000, h: 1000 },
  { src: cassette, name: 'Cassette', detail: 'Gold shell, clear case', format: 'TAPE', w: 900, h: 900 },
  { src: tee, name: 'Wordmark Tee', detail: 'Black heavyweight cotton', format: 'SHIRT', w: 900, h: 900 },
  { src: poster, name: 'Tour Poster', detail: 'Matte litho print', format: 'PRINT', w: 900, h: 1342 },
  { src: pinPatch, name: 'Wolf Pin & Patch', detail: 'Cast enamel, woven twill', format: 'SET', w: 900, h: 900 },
]

export default function Merch() {
  return (
    <section id="merch" className="border-t border-edge py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-2 sm:mb-14">
          <p className="m-0 font-mono text-[0.68rem] tracking-[0.24em] text-steel uppercase">
            {ALBUM.artist} &middot; SW-001
          </p>
          <h2 className="sect-title m-0">The Night Begins to Shine</h2>
          <p className="mt-4 max-w-[54ch] text-bonedim">
            The full line, photographed as real objects. Every piece is an edition of
            one, and none of it is for sale — there is exactly one of each, and he
            already owns them.
          </p>
        </div>

        {/* items-start: the sleeve spans two columns and is therefore twice as
            tall as the card beside it. Stretched to the row, that card's black
            panel ran on for ~370px under its caption and read as a broken
            image. Let each card end where its content ends. */}
        <ul className="m-0 grid list-none grid-cols-1 items-start gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it) => (
            <li
              key={it.name}
              data-rise
              className={`rise group relative overflow-hidden border border-edge bg-crypt ${
                it.wide ? 'sm:col-span-2' : ''
              }`}
            >
              <img
                src={it.src}
                alt={`${it.name} — ${it.detail}`}
                width={it.w}
                height={it.h}
                loading="lazy"
                className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              <div className="flex items-baseline justify-between gap-4 border-t border-edge p-4 sm:p-5">
                <div className="min-w-0">
                  <h3
                    className="m-0 font-body font-semibold"
                    style={{ fontSize: '1.05rem', lineHeight: 1.2 }}
                  >
                    {it.name}
                  </h3>
                  <p className="mt-1 mb-0 text-[0.9rem] text-bonedim">{it.detail}</p>
                </div>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] whitespace-nowrap text-steel uppercase">
                  {it.format}
                </span>
              </div>

              {/* the honest price tag */}
              <span className="pointer-events-none absolute top-4 right-4 border border-torch/50 bg-ink/80 px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.2em] text-torch uppercase backdrop-blur-sm">
                Edition of one
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
