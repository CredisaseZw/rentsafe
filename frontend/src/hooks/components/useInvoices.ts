import { useState } from "react"

function useInvoices() {
    const [invoices, setInvoices] = useState([])
    
    return {
        invoices,
        setInvoices,
    }
}

export default useInvoices