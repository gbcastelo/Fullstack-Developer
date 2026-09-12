import { createConsumer } from "@rails/actioncable"

// Lazy singleton: createConsumer() reads `document` internally (to find the
// cable URL meta tag), which crashes SSR (no `document` in Node) if called
// eagerly at module scope. Every caller only ever uses this inside a
// useEffect (client-only), so a lazy getter keeps the import itself SSR-safe
// without changing client behavior.
let consumer

export default function getConsumer() {
  if (!consumer) consumer = createConsumer()
  return consumer
}
