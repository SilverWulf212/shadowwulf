import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test, expect, request } from '@playwright/test'

/**
 * The living record, end to end.
 *
 * Availability is PROBED, never hard-coded — five songs exist today, the
 * other two land when the GPU finishes. Tests derive expectations from what
 * the server actually serves, so they stay true as the record completes.
 */

const TRACKS = [
  { no: 1, slug: 'the-presence', title: 'The Presence', runtime: '1:23' },
  { no: 2, slug: 'torchlight', title: 'Torchlight', runtime: '2:57' },
  { no: 3, slug: 'king-of-the-dark', title: 'King of the Dark', runtime: '3:00' },
  { no: 4, slug: 'six-went-in', title: 'Six Went In', runtime: '2:07' },
  { no: 5, slug: 'the-giant', title: 'The Giant', runtime: '3:30' },
  { no: 6, slug: 'no-one-falls-alone', title: 'No One Falls Alone', runtime: '3:20' },
  { no: 7, slug: 'comes-home-last', title: 'Comes Home Last', runtime: '2:33' },
] as const

/** Which songs the server actually has right now. */
async function probeAvailable(): Promise<Set<number>> {
  const ctx = await request.newContext({ baseURL: 'https://shadowwulf.silverwulf.org' })
  const available = new Set<number>()
  for (const t of TRACKS) {
    const res = await ctx.get(`/audio/${t.slug}-metal.mp3`, { maxRedirects: 0 })
    const type = res.headers()['content-type'] ?? ''
    if (res.ok() && !type.startsWith('text/html')) available.add(t.no)
  }
  await ctx.dispose()
  return available
}

test.beforeEach(async ({ page }) => {
  // Expected noise: HEAD probes for songs still on the forge, and the
  // Cloudflare beacon. Chromium puts the failing URL in msg.location(),
  // NOT in the message text. Anything else fails the run.
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    const url = msg.location()?.url ?? ''
    if (text.includes('404') && (url.includes('/audio/') || url === '')) return
    // only possible when a test aborts the audio routes itself (THE FLOOR)
    if (text.includes('net::ERR_FAILED') && url.includes('/audio/')) return
    if (url.includes('cloudflareinsights') || text.includes('cloudflareinsights')) return
    throw new Error(`console.error on live page: ${text} ${url}`)
  })
})

test('the site opens on his name and the record is all there', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/ShadowWulf/)
  await expect(page.locator('h1 img[alt=""] + * , h1')).toBeVisible()
  await expect(page.getByText('The night begins to shine.')).toBeVisible()
  await expect(page.locator('[data-track]')).toHaveCount(7)
})

test('play buttons match reality, and every row prints its true runtime', async ({ page }) => {
  const available = await probeAvailable()
  test.skip(available.size === 0, 'nothing rendered yet — impossible state')

  await page.goto('/')
  const buttons = page.locator('button.track-play')
  await expect
    .poll(async () => buttons.count(), { message: 'probe should settle the rows' })
    .toBe(available.size)

  for (const t of TRACKS) {
    const row = page.locator(`[data-track]:has(h3:text-is("${t.title}"))`)
    await expect(row).toContainText(t.runtime)
    if (!available.has(t.no)) {
      await expect(row).toContainText(/coming soon|on the forge/i)
    }
  }
})

test('a row plays, the station lights, and one control pauses it', async ({ page }) => {
  const available = await probeAvailable()
  const first = TRACKS.find((t) => available.has(t.no))!
  test.skip(!available.has(3) && !first, 'nothing to play')

  const target = available.has(3)
    ? TRACKS[2]
    : first
  await page.goto('/#tracks')

  const row = page.locator(`[data-track]:has(h3:text-is("${target.title}"))`)
  const btn = row.locator('button.track-play')
  await btn.waitFor({ state: 'visible' })

  // the cue is ALWAYS visible now — no hover required to know it plays
  await expect(row.locator('.track-play__cue')).toBeVisible()

  // and the whole row is the control: clicking the title plays it
  await row.locator('h3').click()
  await expect(btn).toHaveAttribute('data-playing', 'true', { timeout: 15_000 })
  await expect(page.locator('.rdo')).toHaveAttribute('data-playing', 'true')
  const sr = page.locator('.rdo__sr')
  await expect(sr).toContainText(target.title)

  await btn.click()
  await expect(page.locator('.rdo')).toHaveAttribute('data-playing', 'false')
})

test('the lyric sheet opens and catches fire as the song runs', async ({ page }) => {
  const available = await probeAvailable()
  test.skip(available.size < 1, 'nothing to play')

  const target = available.has(3) ? TRACKS[2] : TRACKS.find((t) => available.has(t.no))!
  await page.goto('/#tracks')

  const row = page.locator(`[data-track]:has(h3:text-is("${target.title}"))`)
  await row.locator('.lyrics summary').click()
  const sheet = row.locator('.lyrics')
  await expect(sheet).toBeVisible()
  await expect(sheet.locator('.lyrics__line, .lyrics__shout, .lyrics__vocable').first()).toBeVisible()

  await row.locator('button.track-play').click()
  await expect(row.locator('button.track-play')).toHaveAttribute('data-playing', 'true', {
    timeout: 15_000,
  })
  // ignition follows the clock — give it a few seconds of song
  await expect
    .poll(() => sheet.locator('[data-lit]').count(), { timeout: 20_000 })
    .toBeGreaterThan(0)
})

test('the spirit wolf answers his name', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('load')
  // keystrokes need a receiver: land focus on the document first
  await page.locator('body').click({ position: { x: 20, y: 300 } })
  await page.keyboard.type('wulf', { delay: 60 })
  await expect(page.locator('.wolf-run')).toBeVisible({ timeout: 8_000 })
  // one crossing, then gone
  await expect(page.locator('.wolf-run')).toBeHidden({ timeout: 8_000 })
})

test('the coronation: every song heard earns the crown and the scroll', async ({ page }) => {
  const available = await probeAvailable()
  test.skip(available.size < 2, 'crowning needs a record worth hearing')

  const heard = TRACKS.filter((t) => available.has(t.no)).map((t) => t.slug)
  await page.addInitScript(
    ({ heard }) => {
      localStorage.setItem('sw:heard', JSON.stringify(heard))
      localStorage.setItem('sw:crowned', 'something-stale')
    },
    { heard },
  )
  await page.goto('/')

  const crown = page.locator('.crown')
  await expect(crown).toBeVisible({ timeout: 15_000 })
  await expect(crown).toContainText('All hail the King of the Dark')
  await expect(crown).toContainText('Ronin')

  // the scroll is a real, printable PNG
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    crown.getByRole('button', { name: /coronation scroll/i }).click(),
  ])
  const out = join(tmpdir(), `sw-scroll-${Date.now()}.png`)
  await download.saveAs(out)
  const bytes = readFileSync(out)
  expect(bytes.length).toBeGreaterThan(50_000)
  // PNG magic: the file is what it claims to be
  expect(bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true)

  // the dark takes him back, and remembers the crown
  await page.keyboard.press('Escape')
  await expect(crown).toBeHidden()
  expect(await page.evaluate(() => localStorage.getItem('sw:crowned'))).not.toBe('something-stale')
})

test('the page keeps its secrets clean — no unexpected console errors', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2500)
})

test('THE FLOOR: play buttons render even when the probe is completely blocked', async ({
  page,
}) => {
  // Reproduces a real visitor whose browser (privacy extension / tracking
  // protection / proxy) breaks every HEAD fetch the station sends. The
  // authored record is the floor: released songs must still be playable.
  await page.route('**/audio/*.mp3', (route) => route.abort())
  await page.goto('/')

  const buttons = page.locator('button.track-play')
  await expect(buttons.first()).toBeVisible({ timeout: 10_000 })
  // five released tracks = five buttons (01, 02, 03, 04, 07)
  await expect(buttons).toHaveCount(5)

  // and clicking one actually plays — the audio element loads over the
  // aborted route's head (route only blocks this test's HEAD probes via
  // fetch; unroute first so the real file can stream)
  await page.unroute('**/audio/*.mp3')
  const row = page.locator('[data-track]:has(h3:text-is("King of the Dark"))')
  await row.locator('button.track-play').click()
  await expect(row.locator('button.track-play')).toHaveAttribute('data-playing', 'true', {
    timeout: 15_000,
  })
})
