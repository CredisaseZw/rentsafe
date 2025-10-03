import type { VATRows } from "@/types";
import { useState } from "react";

export default function useVATSettings(){
    const [rows,setRows] = useState<VATRows[]>([{description: "", rate : ""}])

    return {
        rows,
        setRows
    }
}