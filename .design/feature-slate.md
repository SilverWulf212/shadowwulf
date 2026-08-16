# ShadowWulf — Feature Slate (3 tribunals × 5 proposals)

Self-ratings are the proposer's own: Taste / Fun / Functionality / **Noise Risk (10 = noisy, BAD)**.

## TRIBUNAL A — audio-reactive & the moment music plays

**A1. THE COMMON FIRE** — 9/7/8/3 · Cost S–M
One audio bus writes `--aud-low/mid/air` CSS vars from an AnalyserNode; every flame already on the site (torch walls, embers, wordmark bloom, magic core) multiplies against them. Nothing new appears; existing decoration starts breathing with the music. Proposer calls it "the spine, not spectacle" and notes it makes 3 other features reactive for free.

**A2. THE FUSE** — 8/8/10/2 · Cost M
Playback lives inside the tracklist rows, not a separate widget. Clicking a released row replaces its blurb with the song's waveform drawn as a burning fuse: gold behind the playhead, cold ash ahead, draggable ember at the burn point. Peaks precomputed at build time (~1KB JSON/track) so nothing decodes client-side. Real `<input type=range>` under the canvas for keyboard/SR scrubbing.

**A3. THE FLAMING SPECTROGRAPH** — 7/10/6/6 · Cost M
Frequency spectrum drawn as torch flames, not bars: fast attack, slow decay, licking sideways, spawning embers on spikes using the same Spark struct as the existing ember field. Two placements: small band above the playing row, and full-bleed behind the Coronation headline when track 3 plays. Explicit perf warning: never `ctx.filter='blur()'` per frame; use gradient falloff + `globalCompositeOperation='lighter'`.

**A4. THE KINDLING** — 9/6/9/1 · Cost S
A ceremony for the instant a track lands. localStorage remembers what you've seen; a newly-finished track *ignites* once on your next visit (gold rule burns across, status flips, embers kick), then settles. Rendering track gets a live progress readout instead of dead grey text. Works today with zero audio.

**A5. THE BOLTS ANSWER** — 6/9/3/8 · Cost M–L · **proposer cut this one**
Spectral-flux onset detection fires the WebGL lightning on the kick drum. Cut for: geography (photos are far from the tracklist), A1 gets 80% of it in three CSS lines, and it's the one real perf cliff on a school laptop.

## TRIBUNAL B — the keepsake

**B1. THE LYRIC SHEET** — 9/7/10/2 · Cost M
Every track row opens to reveal full lyrics, set like a fold-out insert. Called "the single largest hole in the site": the page claims every word is intelligible, then shows no words. Better *before* audio exists — for six queued tracks the lyric sheet IS the track. Native `<details>`. Integration bug flagged: opening a row changes height with no scroll event, so `useCascade`'s `--fade` goes stale — needs a ResizeObserver.

**B2. THE BACK COVER** — 9/7/7/3 · Cost M
The square cover flips to a real back sleeve: mono tracklist with right-aligned runtimes, computed total (20:20), catalog number **SW-001**, ℗/© line, vertical spine, barcode. CSS 3D, no library. Deliberate call: don't fabricate a scannable UPC — draw bars from a hash, print the render date + catalog number as the human-readable digits. "SW-001 says there will be an SW-002."

**B3. DEAD WAX** — 8/3/4/4 · Cost S
A hairline runout-groove arc below the footer with one line etched in it, the way a mastering engineer scratches a message into a lacquer. Proposed as the only correct home for the dad's sentence — small, off the edge, not addressed to anyone. Proposer is blunt: 90% sentiment, and it only works if the line stays in engineer's register (`NO ONE FALLS ALONE · CUT BY HAND · MMXXVI`), never anything with "son" in it.

**B4. THE FORGE LOG** — 8/8/9/3 · Cost M
A provenance ledger: per track, render start, hours burned, GPU, model, seed, attempts. Live elapsed for the in-flight track. "The receipt" for the site's most impressive unevidenced claim. Warning: worthless if any number is invented — capture as tracks finish.

**B5. THE FIRST PRESSING** — 7/2/5/5 · Cost S–M · **proposer cut this one**
Print layout so it comes out of a printer as a real insert. Cut because its user is the parent, not the kid, and a visible Print button is a dad move in torch gold. Also found a hard constraint: in the artifact sandbox `<a download>` and `window.print()` are inert, so the button would silently do nothing. Salvage: keep the `@media print` block, drop all visible UI.

## TRIBUNAL C — play, status, showing friends

**C1. THE SEALED TRACK** — 9/9/8/3 · Cost M
An eighth row visible from first scroll: `08 — SEALED`. Three sigils hidden in existing artwork (hero stonework, Coronation moon, past the torchlight in the Cavern). Find all three, the seal breaks, a real hidden track unmasks. "A locked door you can see but not open is the most native grammar in Ancient Dungeon."

**C2. THE FORGE** *(overlaps B4)* — 9/7/9/2 · Cost S
Live build readout: which track is on the card, elapsed clock, ETA counting down, `4/7 FORGED` meter. Makes the site worth reopening. Suspends its interval on `document.hidden`.

**C3. TORCH MODE** — 8/9/7/5 · Cost M
Press `T`: the whole site drops to near-black except a torchlight circle following the cursor. The site's own Cavern line ("bring your own light") escalated to the whole building. Pure CSS mask, no WebGL — the Chromebook-safe counterpart to the three.js cavern. Off by default, one keystroke to exit.

**C4. THE SEVENTH TORCH** — 5/8/6/7 · Cost L · **proposer cut this one**
An empty seventh squad tile; type your name, get a hash-assigned role line, save a guild card PNG. Cut as "a personality quiz wearing a helmet" — the only feature that generates something about the visitor, largest build, least reliable path on a school Chromebook.

**C5. THE LEDGER** — 8/6/7/3 · Cost S
One mono footer line keeping score for this device: `RUNS 14 · FIRST DESCENT 2026·08·15 · SEALS 3/3 · TRACKS FORGED 4/7`. A save file. Hidden on first visit. Explicitly the place C1 and C2 report to — "if #1 and #2 don't ship, this shouldn't either."
