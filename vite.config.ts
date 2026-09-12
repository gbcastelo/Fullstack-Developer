import react from '@vitejs/plugin-react'
import inertia from '@inertiajs/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    RubyPlugin(),
    inertia({ ssr: { entry: 'ssr/ssr.jsx' } }),
    react(),
  ],
  ssr: {
    // Bundle all dependencies into the *production build* of the SSR bundle so
    // the output file (public/vite-ssr/ssr.js) can run standalone with just a
    // `node` binary, no node_modules install required at runtime. Must stay
    // unset for `vite dev`, whose SSR module runner needs deps externalized to
    // load them the normal way.
    ...(command === 'build' ? { noExternal: true } : {}),
  },
}))
