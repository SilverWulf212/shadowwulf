/**
 * Flatten the Vite build into a single self-contained HTML body.
 *
 * The artifact host blocks every external request, so CSS, JS, fonts and images
 * all have to travel inside the file. Emits page content only — no doctype,
 * html, head or body tags, since the host supplies that shell.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname
const PUB = new URL('../public/', import.meta.url).pathname
const OUT = process.argv[2]
if (!OUT) throw new Error('usage: node inline.mjs <out.html>')

const MIME = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

const dataUri = (path) => {
  const ext = extname(path)
  const mime = MIME[ext]
  if (!mime) throw new Error(`no mime for ${path}`)
  return `data:${mime};base64,${readFileSync(path).toString('base64')}`
}

// every hashed asset Vite emitted, keyed by its runtime URL
const assets = new Map()
for (const f of readdirSync(join(DIST, 'assets'))) {
  if (['.css', '.js'].includes(extname(f))) continue
  assets.set(`/assets/${f}`, dataUri(join(DIST, 'assets', f)))
}
// Self-hosted fonts live under public/ and keep their literal paths. The
// directory also carries the OFL license texts (the licence requires they
// ship alongside the fonts) — those are not assets to inline.
for (const f of readdirSync(join(PUB, 'fonts'))) {
  if (extname(f) !== '.woff2') continue
  assets.set(`/fonts/${f}`, dataUri(join(PUB, 'fonts', f)))
}

const swap = (text) => {
  let out = text
  for (const [url, uri] of assets) out = out.split(url).join(uri)
  return out
}

/**
 * The songs.
 *
 * base64 costs 4/3, and the whole record is ~18 MB against a 16 MB artifact
 * ceiling, so the whole record cannot travel. Take tracks in priority order
 * until the budget is spent and let the rest genuinely be absent — the station
 * probes for what exists and simply will not list a track it cannot find, so a
 * partial record degrades honestly rather than listing songs that never play.
 *
 * The deployed site is the complete one. This is the shareable copy.
 */
const AUDIO_BUDGET = 11.5 * 1024 * 1024 // base64 bytes, leaving room for the page
const PRIORITY = ['king-of-the-dark', 'the-presence', 'six-went-in', 'torchlight']

const audio = new Map()
let spent = 0
for (const slug of PRIORITY) {
  const path = join(PUB, 'audio', `${slug}.mp3`)
  let bytes
  try {
    bytes = readFileSync(path)
  } catch {
    continue // not rendered yet
  }
  const cost = Math.ceil(bytes.length * 4 / 3)
  if (spent + cost > AUDIO_BUDGET) continue
  spent += cost
  audio.set(`/audio/${slug}.mp3`, `data:audio/mpeg;base64,${bytes.toString('base64')}`)
}

/**
 * The app builds its audio URLs at runtime, so they cannot be string-swapped
 * the way the hashed assets are. Two interceptions, installed before the
 * bundle runs, are enough:
 *
 *   - the station HEAD-probes each track to decide what is on air. Answer from
 *     the table: 200 audio/mpeg for what we carry, 404 for what we do not.
 *   - the single <audio> element gets a real URL assigned to `.src`. Map it to
 *     the data URI on the way through.
 *
 * A data: URI is same-origin, so `crossOrigin = "anonymous"` stays satisfied
 * and `createMediaElementSource` still yields a CORS-clean node — without
 * which the radio would play and the spectrograph would draw a flat line.
 */
const audioShim = audio.size
  ? `<script>
(function () {
  var TRACKS = ${JSON.stringify(Object.fromEntries(audio))};
  var pathOf = function (u) {
    try { return new URL(String(u), location.href).pathname } catch (e) { return String(u) }
  };
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var p = pathOf(url);
    if (/^\\/audio\\/.+\\.mp3$/.test(p)) {
      var ok = Object.prototype.hasOwnProperty.call(TRACKS, p);
      return Promise.resolve(new Response(null, {
        status: ok ? 200 : 404,
        headers: ok ? { 'content-type': 'audio/mpeg' } : {}
      }));
    }
    return realFetch ? realFetch(input, init) : Promise.reject(new Error('no fetch'));
  };
  var proto = window.HTMLMediaElement && HTMLMediaElement.prototype;
  var d = proto && Object.getOwnPropertyDescriptor(proto, 'src');
  if (d && d.set) {
    Object.defineProperty(proto, 'src', {
      configurable: true,
      enumerable: d.enumerable,
      get: d.get,
      set: function (v) { d.set.call(this, TRACKS[pathOf(v)] || v) }
    });
  }
})();
</script>`
  : ''

const html = readFileSync(join(DIST, 'index.html'), 'utf8')

const cssName = html.match(/href="\/assets\/([^"]+\.css)"/)?.[1]
const jsName = html.match(/src="\/assets\/([^"]+\.js)"/)?.[1]
if (!cssName || !jsName) throw new Error('could not find built css/js in index.html')

const css = swap(readFileSync(join(DIST, 'assets', cssName), 'utf8'))
const js = swap(readFileSync(join(DIST, 'assets', jsName), 'utf8'))

const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'ShadowWulf'

const body = [
  `<title>${title}</title>`,
  `<style>\n${css}\n</style>`,
  audioShim,
  `<div id="root"></div>`,
  `<script type="module">\n${js}\n</script>`,
].join('\n')

writeFileSync(OUT, body)
console.log(`wrote ${OUT} — ${(Buffer.byteLength(body) / 1024 / 1024).toFixed(2)} MB`)
console.log(`inlined ${assets.size} assets`)
console.log(
  `inlined ${audio.size} track(s): ${[...audio.keys()].map((k) => k.split('/').pop()).join(', ') || 'none'}`,
)
