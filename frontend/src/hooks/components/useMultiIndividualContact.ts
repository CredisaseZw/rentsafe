import { useState } from "react"

export default function useMultiIndividualContact(){
    
    const [counts, setCounts] = useState<undefined[]>([undefined])
    const handleRemove = (index: number) => {
        setCounts((prev) => prev.filter((_, i) => i !== index))
    }
    return {
        handleRemove,
        counts,
        setCounts
    }
}