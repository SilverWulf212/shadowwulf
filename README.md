# ShadowWulf — *King of the Dark*

The album launch site for **ShadowWulf**, and the record behind it.

> *The night begins to shine.*

Seven tracks of symphonic metalcore, written for an eleven-year-old named Ronin
and generated locally on a single RTX 4060 — roughly four hours of wall clock
per three minutes of music. It is a birthday present.

## The record

| # | Track | Length | Fire |
|---|-------|--------|------|
| 1 | The Presence | 1:30 | cold violet |
| 2 | Torchlight | 3:00 | torch gold |
| 3 | King of the Dark | 3:00 | white gold |
| 4 | Six Went In | 3:15 | green |
| 5 | The Giant | 3:30 | ember red |
| 6 | No One Falls Alone | 3:20 | arcane blue |
| 7 | Comes Home Last | 2:45 | dawn gold |

Every track burns a different colour — the spectrum behind each row in the
tracklist is lit from that one hue and nothing else.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind v4** (`@tailwindcss/vite`), tokens declared in `@theme`
- **three.js**, code-split — only downloads when you reach the Cavern
- Self-hosted fonts: **Grenze Gotisch** (display) + **Grenze** (body) + **IBM Plex Mono**, all SIL OFL. No external font requests; the site makes zero third-party network calls.

## Notable pieces

| Path | What it is |
|---|---|
| `src/components/Intro.tsx` | Scroll-expanding corridor with flickering torch walls |
| `src/components/Hero.tsx` | Layered parallax; each element exits at a different rate |
| `src/components/TrackFire.tsx` | The flaming spectrograph behind each track row |
| `src/components/MagicMoment.tsx` | WebGL lightning aimed at his hands in real photos |
| `src/components/Merch.tsx` | The merch line, edition of one |
| `src/components/Radio/` | ShadowWulf Radio — tune in mid-song, then shuffle |
| `src/audio/` | Shared AudioContext + AnalyserNode driving the fire |

## Build

```bash
npm install
npm run dev
npm run build              # code-split; three.js in its own chunk
SINGLE_FILE=1 npm run build && node scripts/inline.mjs out.html   # one self-contained file
```

## Colour

Near-black ground `oklch(11% 0.006 300)`, torch gold `oklch(76% 0.145 68)`,
arcane blue `oklch(72% 0.14 235)`, ember `oklch(50% 0.135 35)`. The blue came
from his photographs and became the counterweight to the gold.

## Credits

Music generated with **MiniMax-Music3** (MiniMax-Music3 Community License —
AI generation is disclosed in the site footer, as the licence requires).
Artwork and photography generated via Higgsfield. Wordmark by Ronin.
