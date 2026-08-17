import { TRACKS, type Track } from '../data/album'

/**
 * The radio's own view of a track. Derived from `TRACKS` — album.ts stays the
 * single source of truth for titles and order; nothing here writes back to it.
 */
export interface RadioTrack {
  id: string
  no: number
  title: string
  runtime: string
  /** URL under /audio. Present whether or not the file has landed yet. */
  src: string
  /**
   * True when album.ts (the authored record) says this track is released.
   * The authored word is the FLOOR: these tracks are playable even if the
   * runtime probe never answers — a browser extension or privacy setting
   * that breaks HEAD fetches must not be able to un-release a song.
   */
  released: boolean
}

/** `King of the Dark` -> `king-of-the-dark` */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')

/**
 * album.ts may or may not carry an explicit `audio` filename for a track.
 * Falling back to the slug means a render can land as `public/audio/<slug>.mp3`
 * and start playing on the next page load with no code change at all.
 */
function fileFor(t: Track): string {
  return t.audio ?? `${slugify(t.title)}.mp3`
}

export const RADIO_TRACKS: RadioTrack[] = TRACKS.map((t) => ({
  id: slugify(t.title),
  no: t.no,
  title: t.title,
  runtime: t.runtime,
  src: `${BASE}/audio/${fileFor(t)}`,
  released: t.status === 'released',
}))

/** The tracks the record itself says are out. Always playable, probe or no probe. */
export const RELEASED_TRACKS: RadioTrack[] = RADIO_TRACKS.filter((t) => t.released)

/**
 * Does this file actually exist right now? A HEAD is enough and costs nothing.
 * Static hosts that fall back to index.html for unknown paths would answer 200
 * with HTML, so the content type is checked as well.
 */
export async function probeTrack(url: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store', signal })
    if (!res.ok) return false
    const type = res.headers.get('content-type') ?? ''
    return !type.startsWith('text/html')
  } catch {
    return false
  }
}
