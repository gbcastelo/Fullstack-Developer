import { useEffect, useState } from "react"
import consumer from "../channels/consumer"

export default function useDashboardChannel(initial) {
  const [data, setData] = useState(initial)

  useEffect(() => {
    const subscription = consumer.subscriptions.create("DashboardChannel", {
      received(payload) {
        setData(payload)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return data
}
