import type { Header, LeaseSubscription } from "@/types"
import { useState } from "react"

export default function useSubscriptionsSheets(){
    const [open, setOpen] = useState(false)
    const [subscription, setSubscription] = useState<LeaseSubscription | null>(null)
    const headers:Header[] = [
      {
          name: "No",
          
      },
      {
          name: "Open Slots",
          
      },
      {
          name: "Period (Months)",
          
      },
      {
          name: "Start Date",
          
      },
      {
          name: "End Date",
          
      },
    ]
    return {
        open,
        headers,
        subscription,
        setSubscription,
        useState,
        setOpen,
    }
}