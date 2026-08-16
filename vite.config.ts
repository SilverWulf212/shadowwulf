import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // the parallax plates are large; keep them as real files, not inlined base64
    assetsInlineLimit: 4096,
    // The artifact build has to be one self-contained file, so dynamic imports
    // get folded back in. The real site keeps them split, so three.js only
    // downloads when someone actually reaches the cavern.
    rolldownOptions: process.env.SINGLE_FILE
      ? { output: { inlineDynamicImports: true } }
      : undefined,
  },
})
