import type { VATRows } from "@/types";
import { useState } from "react";

export default function useVATSettings(){
    const [rows,setRows] = useState<VATRows[]>([{description: "", rate : ""}])

    const updateRow = (index: number, key: string, value: any) => {
        setRows((prev) =>
        prev.map((row, i) =>
            i === index
            ? { ...row, [key]: value }
            : row
        )
        );
    };  

    const addRow = () => setRows((p)=>[...p, {description: "", rate : ""}])
    const removeRow = (index: number) => {
        if (index === 0) return;
        
        setRows((prev) => prev.filter((_, i) => i !== index));
    };
    return {
        rows,
        addRow,
        setRows,
        updateRow,
        removeRow
    }
}