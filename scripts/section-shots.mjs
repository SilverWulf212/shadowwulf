import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const vp = { width: 1440, height: 900 }

// 1. Cavern section
const p1 = await browser.newPage({ viewport: vp })
await p1.emulateMedia({ reducedMotion: 'no-preference' })
await p1.goto('https://shadowwulf.silverwulf.org/')
await p1.locator('.cavern').scrollIntoViewIfNeeded()
await p1.waitForTimeout(1200)
// scroll the section to mid-viewport the way a reader sees it
await p1.evaluate(() => {
  const el = document.querySelector('.cavern')
  el.scrollIntoView({ block: 'center' })
})
await p1.waitForTimeout(800)
await p1.locator('.cavern').screenshot({ path: 'shots/cavern-1440.png' })

// 2. Coronation band
await p1.evaluate(() => {
  const els = document.querySelectorAll('section')
  for (const el of els) {
    if (el.textContent.includes('All hail the king of the dark')) {
      el.scrollIntoView({ block: 'center' })
      break
    }
  }
})
await p1.waitForTimeout(1200)
await p1.screenshot({ path: 'shots/coronation-band-1440.png' })

// narrow viewport too (the crop changes completely)
const p2 = await browser.newPage({ viewport: { width: 390, height: 844 } })
await p2.emulateMedia({ reducedMotion: 'no-preference' })
await p2.goto('https://shadowwulf.silverwulf.org/')
await p2.evaluate(() => document.querySelector('.cavern')?.scrollIntoView({ block: 'center' }))
await p2.waitForTimeout(800)
await p2.locator('.cavern').screenshot({ path: 'shots/cavern-390.png' })
await p2.evaluate(() => {
  const els = document.querySelectorAll('section')
  for (const el of els) {
    if (el.textContent.includes('All hail the king of the dark')) {
      el.scrollIntoView({ block: 'center' })
      break
    }
  }
})
await p2.waitForTimeout(1200)
await p2.screenshot({ path: 'shots/coronation-band-390.png' })

await browser.close()
console.log('done')
