import type { Header } from "@/types"
import { useState } from "react"

export default function useSubscriptionsSheets(){
    const [open, setOpen] = useState(false)
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
        setOpen,
        useState,
        headers
    }
}