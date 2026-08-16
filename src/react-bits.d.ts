/**
 * react-bits ships these as untyped JSX. With `allowJs` on, TypeScript infers
 * their props from the destructuring — and any prop destructured without a
 * default is inferred REQUIRED, so every call site is forced to pass props it
 * has no reason to care about (`style`, `className`, `targetPixels`…).
 *
 * Declaring the modules here instead gives them a permissive prop bag, which
 * is honest: these are third-party components whose real contract lives in
 * their own source, not in inference artefacts. `allowJs` is off in
 * tsconfig.app.json so these declarations win.
 */

declare module '*.jsx' {
  import type { ComponentType, ReactNode } from 'react'
  const Component: ComponentType<{ children?: ReactNode; [prop: string]: unknown }>
  export default Component
}
