import { useState } from "react"

function usePaymentTypes() {
    const [open, setOpen ] = useState(false)
    const [type, setType] = useState("")

    return{
        open,
        type,
        setType,
        setOpen
    }
}

export default usePaymentTypes