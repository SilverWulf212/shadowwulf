import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'

const BASE = 'https://shadowwulf.silverwulf.org'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.emulateMedia({ reducedMotion: 'no-preference' })

// 1. the wolf, mid-crossing
await page.goto(`${BASE}/#tracks`)
await page.waitForTimeout(1500)
await page.keyboard.type('wulf', { delay: 50 })
await page.waitForTimeout(1400) // caught mid-dash
await page.screenshot({ path: 'shots/wolf-mid.png' })

// 2. the coronation overlay
await page.evaluate(() => {
  localStorage.setItem(
    'sw:heard',
    JSON.stringify([
      'the-presence',
      'torchlight',
      'king-of-the-dark',
      'six-went-in',
      'comes-home-last',
    ]),
  )
  localStorage.setItem('sw:crowned', 'stale')
})
await page.goto(`${BASE}/`)
await page.locator('.crown').waitFor({ timeout: 20000 })
await page.waitForTimeout(2600) // let the entrance land
await page.screenshot({ path: 'shots/coronation.png' })

// 3. the certificate itself
const [dl] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: /coronation scroll/i }).click(),
])
const p = `shots/${dl.suggestedFilename()}`
await dl.saveAs(p)
console.log('certificate saved:', p, (await (await import('node:fs')).statSync(p)).size, 'bytes')

await browser.close()
