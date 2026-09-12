import { createInertiaApp } from '@inertiajs/react'

// Server-side rendering entrypoint. @inertiajs/vite transforms this
// `createInertiaApp` call at SSR build/dev time into a server render
// function (see the "react" framework template in @inertiajs/vite), so this
// file stays a plain client-style setup call.
//
// The `pages` resolver is kept identical to
// app/javascript/entrypoints/inertia.jsx so the server resolves the same
// components, from the same directory, as the client.
createInertiaApp({
  pages: "../pages",
})
