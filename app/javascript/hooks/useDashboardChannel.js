import { useEffect, useState } from "react"
import getConsumer from "../channels/consumer"

export default function useDashboardChannel(initial) {
  const [data, setData] = useState(initial)

  useEffect(() => {
    const subscription = getConsumer().subscriptions.create("DashboardChannel", {
      received(payload) {
        setData(payload)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return data
}
