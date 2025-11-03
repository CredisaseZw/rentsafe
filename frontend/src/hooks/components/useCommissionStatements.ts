import { useState } from "react"

export default function useCommissionStatements(){
    const [selectedPeriod, setSelectedPeriod] = useState<"month" | "date">("month")

    return {
        selectedPeriod,
        setSelectedPeriod
    }
}