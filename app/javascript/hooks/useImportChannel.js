import { useEffect, useState } from "react"
import consumer from "../channels/consumer"

export default function useImportChannel() {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    const subscription = consumer.subscriptions.create("ImportChannel", {
      received(payload) {
        setProgress(payload)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return progress
}
