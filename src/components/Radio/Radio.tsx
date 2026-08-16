import { AudioProvider } from '../../audio/AudioProvider'
import RadioBar from './RadioBar'

/**
 * Convenience mount: the provider plus the device, one tag.
 *
 *   <Radio />                       // drop it anywhere in App
 *   <Radio>{everything}</Radio>     // or wrap the app, if you prefer the
 *                                   // context to sit above other consumers
 *
 * Either shape works: `useRadio()` reads the same module-level station whether
 * or not a provider is above it, so a visualiser mounted elsewhere in the tree
 * still gets the same analyser.
 */
export default function Radio({ children }: { children?: React.ReactNode }) {
  return (
    <AudioProvider>
      {children}
      <RadioBar />
    </AudioProvider>
  )
}
