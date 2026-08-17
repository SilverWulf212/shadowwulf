import orbHands from '../assets/magic/orb-hands.webp'
import handCast from '../assets/magic/hand-cast.webp'

/**
 * Ronin's photos.
 *
 * `handX` / `handY` are where the magic comes FROM, as a percentage of the
 * image (0,0 = top-left). These were measured, not eyeballed: the arcane glow
 * is blue and bright, so the numbers below are the luminance-weighted centroid
 * of the hot blue core. For `hand-cast` the spirit wolf had to be excluded —
 * it is also blue and much larger, and it drags a naive centroid to the wrong
 * side of the frame entirely.
 *
 * TO ADD ONE: drop the file in src/assets/magic/, import it, add an entry.
 */

export interface Photo {
  src: string
  alt: string
  /** horizontal origin of the magic, % of image width */
  handX: number
  /** vertical origin of the magic, % of image height */
  handY: number
  /** how wide the effect spreads from that point, % */
  spread?: number
  /**
   * Ceiling for the bolts, % down the image. The shader's bolt is a full-height
   * vertical column, so when the hand sits below the face the column runs
   * straight through it. `cutEnd` is where the bolts are at full strength,
   * `cutStart` is where they have faded to nothing above it. Leave unset on a
   * photo where nothing is in the way.
   */
  cutStart?: number
  cutEnd?: number
  caption: string
}

export const MAGIC_PHOTOS: Photo[] = [
  {
    src: orbHands,
    alt: 'Ronin in wolf-crested armour, cupping a sphere of arcane light in both gauntlets',
    handX: 46.2,
    handY: 61.7,
    spread: 54,
    // his chin is at ~48% and the orb at ~62%; without this the bolt column
    // ran up through his cheek and eyebrow into his hairline
    cutStart: 44,
    cutEnd: 60,
    caption: 'Both hands. The whole arena watching.',
  },
  {
    src: handCast,
    alt: 'Ronin casting light from one open hand, a spirit wolf at his shoulder',
    handX: 19,
    handY: 68,
    spread: 46,
    caption: 'One hand out, and the wolf comes with it.',
  },
]
