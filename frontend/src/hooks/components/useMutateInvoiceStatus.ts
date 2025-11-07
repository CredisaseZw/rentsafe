import { useState } from "react"

export default function useMutateInvoiceStatus(id: number){
    const [open, setOpen] = useState(false);
    console.log(id)

    return {
        open,
        setOpen
    }
}