import type { VATRow } from "@/types";
import { useEffect, useState } from "react";
import useGetVATSettings from "../apiHooks/useGetVATSettings";
import { handleAxiosError } from "@/lib/utils";
import type { PaginationData } from "@/interfaces";
import { useSearchParams } from "react-router";

export default function useVATSettings(){
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
    const [rows,setRows] = useState<VATRow[]>([{description: "", rate : ""}])
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined)
    const {data, isLoading, error} = useGetVATSettings(page)

    useEffect(()=>{
       if(handleAxiosError("Error fetching V.A.T Settings",error)) return;
        if (data) {
            setRows(data.results);
            const { results, ...paginationMeta } = data;
            setPagination(paginationMeta as PaginationData);
        }

    }, [data, error, page])

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
        error,
        isLoading,
        pagination,
        updateRow,
        removeRow,
        setRows,
        addRow,
    }
}