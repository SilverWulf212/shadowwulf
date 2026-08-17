import { ALBUM } from '../data/album'

/**
 * The run-out groove.
 *
 * On a real pressing the dead wax is the blank ring between the last track and
 * the label, and whoever cut the lacquer scratches a message into it by hand —
 * the one part of a record that isn't manufactured. It's the last thing you see
 * as the record stops, so it's where the dedication goes: not in a headline
 * where it would be a marketing line, but scratched in the run-out where you
 * only find it if you went all the way to the end.
 *
 * Drawn as an arc of the label's outer edge, so the bottom of the page reads as
 * the top of a spinning disc rather than a border.
 */
export default function DeadWax() {
  return (
    <div className="wax" aria-hidden="true">
      <div className="wax__disc">
        <span className="wax__groove" />
        <span className="wax__groove" />
        <span className="wax__groove" />
      </div>
      <p className="wax__etch">
        {ALBUM.artist} · {ALBUM.title} · A-SIDE · CUT AT HOME ON ONE GRAPHICS CARD
        · FOR RONIN, WHO COMES HOME LAST
      </p>
    </div>
  )
}
