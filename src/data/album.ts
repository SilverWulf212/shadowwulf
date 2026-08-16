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
  subTagline: 'You felt the presence in VR. Now hear his intro music.',
  blurb:
    'Seven tracks of orchestra and metal, written as entrance music for a dungeon that already knows his name.',
  year: 2026,
} as const

export const TRACKS: Track[] = [
  {
    no: 1,
    fireHue: 265, // cold violet — something in the dark that has not lit yet
    title: 'The Presence',
    blurb: 'Something in the dark takes a breath before the torches are even lit.',
    runtime: '1:30',
    status: 'queued',
  },
  {
    no: 2,
    fireHue: 68, // torch gold — the flame they carry in
    title: 'Torchlight',
    blurb: 'Six at a door that has killed them before, lighting one flame together.',
    runtime: '3:00',
    status: 'queued',
  },
  {
    no: 3,
    fireHue: 85, // white gold — the coronation, the brightest on the record
    title: 'King of the Dark',
    blurb: 'The coronation. Torches high, and a whole room screaming one name back.',
    runtime: '3:00',
    status: 'rendering',
    audio: 'king-of-the-dark.mp3',
  },
  {
    no: 4,
    fireHue: 140, // green fire — the squad, the only one that is not gold or blue
    title: 'Six Went In',
    blurb: 'The one they scream in the car: same six in, same six out.',
    runtime: '3:15',
    status: 'queued',
  },
  {
    no: 5,
    fireHue: 32, // deep ember red — the giant
    title: 'The Giant',
    blurb: 'Something the size of a cathedral opens its eyes and knows exactly who came in.',
    runtime: '3:30',
    status: 'queued',
  },
  {
    no: 6,
    fireHue: 235, // arcane blue — his own magic, the rescue
    title: 'No One Falls Alone',
    blurb: 'Someone is on the floor in the smoke, and the boots are coming back.',
    runtime: '3:20',
    status: 'queued',
  },
  {
    no: 7,
    fireHue: 55, // pale dawn gold — morning, the doors opening
    title: 'Comes Home Last',
    blurb: 'The doors open, the morning takes the torches, and everyone walks out.',
    runtime: '2:45',
    status: 'queued',
  },
]

export const SQUAD = [
  { name: 'Ronin', role: 'Calls the turn. Walks the front. Comes home last.' },
  { name: 'Slade', role: 'Hits first. Holds the front line.' },
  { name: 'Claire', role: 'Calls the trap before it opens.' },
  { name: 'Dad', role: 'Back wall. Nothing gets through.' },
  { name: 'Mom', role: 'Brings you back when the lights go out.' },
  { name: 'Graham', role: 'Takes the stairs like the stairs are his.' },
]
