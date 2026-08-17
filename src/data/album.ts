export type TrackStatus = 'released' | 'rendering' | 'queued'

export interface Track {
  no: number
  title: string
  blurb: string
  runtime: string
  status: TrackStatus
  /** filename in /audio once the render lands */
  audio?: string
  /**
   * Hue for this track's fire, in OKLCH degrees. Every song burns a different
   * colour — the spectrum behind each row is lit from this and nothing else,
   * so changing one number re-colours a whole track.
   */
  fireHue: number
}

export const ALBUM = {
  artist: 'SHADOWWULF',
  title: 'King of the Dark',
  tagline: 'The night begins to shine.',
  subTagline: 'Now hear his intro music.',
  blurb:
    'Seven tracks of orchestra and metal, written as entrance music for a dungeon that already knows his name.',
  year: 2026,
} as const

export const TRACKS: Track[] = [
  {
    no: 1,
    fireHue: 265, // cold violet — something in the dark that has not lit yet
    title: 'The Presence',
    audio: 'the-presence-metal.mp3',
    blurb: 'Something in the dark takes a breath before the torches are even lit.',
    // the render came in at 1:23 against a 1:30 target — the row prints
    // what the file is, not what it was asked for
    runtime: '1:23',
    status: 'released',
  },
  {
    no: 2,
    fireHue: 68, // torch gold — the flame they carry in
    title: 'Torchlight',
    audio: 'torchlight-metal.mp3',
    blurb: 'Six at a door that has killed them before, lighting one flame together.',
    runtime: '2:57',
    status: 'released',
  },
  {
    no: 3,
    fireHue: 85, // white gold — the coronation, the brightest on the record
    title: 'King of the Dark',
    blurb: 'The coronation. Torches high, and a whole room screaming one name back.',
    runtime: '3:00',
    status: 'released',
    audio: 'king-of-the-dark-metal.mp3',
  },
  {
    no: 4,
    fireHue: 140, // green fire — the squad, the only one that is not gold or blue
    title: 'Six Went In',
    audio: 'six-went-in-metal.mp3',
    blurb: 'The one they scream in the car: same six in, same six out.',
    // came up short of its 3:15 target; 2:07 of it exists and 2:07 is the truth
    runtime: '2:07',
    status: 'released',
  },
  {
    no: 5,
    fireHue: 32, // deep ember red — the giant
    title: 'The Giant',
    audio: 'the-giant-metal.mp3',
    blurb: 'Something the size of a cathedral opens its eyes and knows exactly who came in.',
    runtime: '3:30',
    status: 'queued',
  },
  {
    no: 6,
    fireHue: 235, // arcane blue — his own magic, the rescue
    title: 'No One Falls Alone',
    audio: 'no-one-falls-alone-metal.mp3',
    blurb: 'Someone is on the floor in the smoke, and the boots are coming back.',
    runtime: '3:20',
    status: 'queued',
  },
  {
    no: 7,
    fireHue: 55, // pale dawn gold — morning, the doors opening
    title: 'Comes Home Last',
    blurb: 'The doors open, the morning takes the torches, and everyone walks out.',
    // the target was 2:45; the render that landed is 2:33, and the row
    // promised what the file does not contain
    runtime: '2:33',
    status: 'released',
    audio: 'comes-home-last-metal.mp3',
  },
]

export const SQUAD = [
  { name: 'Ronin', role: 'Calls the turn. Walks the front. Comes home last.' },
  { name: 'Slade', role: 'Hits first. Holds the front line.' },
  // Christy is deliberately NOT one of the six. The record's spine is "six went
  // in, six walk out", and her whole role in the lyrics is that she holds the
  // count rather than belongs to it: "she is not in the count, she is what the
  // count is for". Her line here has to say that, or the page contradicts the
  // song it is built around.
  { name: 'Miss Christy', role: 'Sets the board. Sees the room before you do. Never in the count, always what the count is for.' },
  { name: 'Graham', role: 'Takes the stairs like the stairs are his.' },
  { name: 'Dad', role: 'Back wall. Nothing gets through.' },
  { name: 'Mom', role: 'Brings you back when the lights go out.' },
  { name: 'Claire', role: 'Calls the trap before it opens.' },
]
