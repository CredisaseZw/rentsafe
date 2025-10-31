import type { AccountSector, GeneralLedgerAccount } from "@/types";
import React, { useEffect, useState } from "react"
import useGetAccountSectors from "./useGetAccountSectors";
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import type { CreateGeneralLedgerPayload, PaginationData } from "@/interfaces";
import type { UseMutationResult } from "@tanstack/react-query";
import useClient from "../general/useClient";
import { toast } from "sonner";

function useAddGeneralLedgerAccountDialogue(initial: GeneralLedgerAccount | undefined) {
    const [open, setOpen] = useState(false);
    const [sectorsPage,setSectorsPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
    const [loading,setLoading] = useState(false);
    const [sectors, setSectors] = useState<AccountSector[]>([]);
    const {data, isLoading, error } = useGetAccountSectors(sectorsPage, null);
    const queryClient = useClient();

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch accounting sectors", error)) return;
        if(data){
            const {results, ...paginationMeta} = data
            setSectors(data.results)
            setPagination(paginationMeta as PaginationData)
        }
    }, [data, error, sectorsPage])
        
    const handleLoadMoreSectors =()=>{
        if(pagination?.next){
            const nextPage = new URL(pagination.next).searchParams.get("page")
            setSectorsPage(Number(nextPage))
        }        
        return;
    }

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>,
        mutation : UseMutationResult<any, Error, CreateGeneralLedgerPayload, unknown>
    )=>{
        e.preventDefault();
        let changedData;
        const mode = initial ? "update" : "create";
        const data = getFormDataObject(e);
        const payloadData = {
            account_name: data.accountName,
            account_number: data.accountNumber,
            is_secondary_currency: data.currency === "secondary_currency" ? 1 : 0,
            account_sector_id: Number(data.accountSector)  
        }

        if(mode === "update"){
            const initialPayload = {
                account_name: initial?.account_name,
                account_number: initial?.account_number,
                is_secondary_currency: initial?.is_secondary_currency,
                account_sector_id: initial?.id // change when id is place for sectors
               
            }
            changedData = handleTrackChangedFields(initialPayload, payloadData)
            if (!changedData) return;
        }

        const payload:CreateGeneralLedgerPayload = {
            ...(mode === "create"
                ? {data : payloadData}
                : {data : changedData,
                    id : initial?.id
                }
            ),
            mode
        }
        
        setLoading(true);
        mutation.mutate(payload, {
            onSuccess : ()=>{
                toast.success(`Account successfully ${mode}.`);
                queryClient.invalidateQueries({queryKey : ["generalLedgerAccounts", 1]});
                setOpen(false);
            },
            onError : (error) => handleAxiosError("Failed to create general account", error) ,
            onSettled : ()=>setLoading(false)
        })
    }

    return {
        pagination,
        sectors,
        isLoading,
        loading,
        open,
        setOpen,
        handleSubmit,
        handleLoadMoreSectors,
    }
}

export default useAddGeneralLedgerAccountDialogue