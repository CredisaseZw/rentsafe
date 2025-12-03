import { useState } from "react"

interface Count  {
    phoneType : string
}

export default function useMultiIndividualContact(){
    
    const [counts, setCounts] = useState<Count[]>([{phoneType : "mobile"}])
    const handleRemove = (index: number) => {
        setCounts((prev) => prev.filter((_, i) => i !== index))
    }

    const updateType = (val: string, index: number) => {
        setCounts((p) =>
            p.map((prev, idx) =>
                idx === index
                    ? { ...prev, phoneType: val }
                    : prev
            )
        )
    }

    return {
        handleRemove,
        counts,
        setCounts,
        updateType
    }
}