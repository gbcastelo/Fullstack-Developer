import { useEffect, useState } from "react"
import getConsumer from "../channels/consumer"

export default function useImportChannel() {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    const subscription = getConsumer().subscriptions.create("ImportChannel", {
      received(payload) {
        setProgress(payload)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return progress
}
