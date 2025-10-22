import type { VATRow } from "@/types";
import { useEffect, useState } from "react";
import useGetVATSettings from "../apiHooks/useGetVATSettings";
import { handleAxiosError } from "@/lib/utils";

export default function useVATSettings(){
    const [rows,setRows] = useState<VATRow[]>([{description: "", rate : ""}])
    const {data, isLoading, error} = useGetVATSettings()

    useEffect(()=>{
       if(handleAxiosError("Error fetching V.A.T Settings",error)) return;
       if(data){setRows(data)}
    }, [data, error])

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
        isLoading,
        updateRow,
        removeRow,
        setRows,
        addRow,
    }
}