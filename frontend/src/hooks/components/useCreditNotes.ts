import { type CreditNote, type PaginationData } from "@/interfaces";
import { useEffect, useState } from "react";
import { useGetCreditNotes } from "../apiHooks/useGetCreditNotes";
import { handleAxiosError } from "@/lib/utils";

export default function useCreditNotes(){
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
    const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
    const {data,isLoading, error} = useGetCreditNotes()
    
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch credit notes",error)) return ;
        if(!data) return;

        setCreditNotes(data.results);
        setPagination({
            next : data.next,
            previous : data.previous,
            count : data.count
        });
    },[data, error])

    return {
        creditNotes,
        isLoading,
        error,
        pagination
    }
}