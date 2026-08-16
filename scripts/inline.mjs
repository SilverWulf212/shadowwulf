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
  `<div id="root"></div>`,
  `<script type="module">\n${js}\n</script>`,
].join('\n')

writeFileSync(OUT, body)
console.log(`wrote ${OUT} — ${(Buffer.byteLength(body) / 1024 / 1024).toFixed(2)} MB`)
console.log(`inlined ${assets.size} assets`)
