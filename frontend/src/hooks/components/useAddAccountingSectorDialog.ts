import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import type { AccountSector, AddAccountingSectorPayload } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";
import { BASE_ACCOUNT_SECTORS } from "@/constants/base-links";
import useCreateAccountSectors from "../apiHooks/useCreateAccountSectors";

export default function useAddAccountingSectorDialog(initial?: AccountSector){
    const [open ,setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const {updateCache} = useOptimisticCacheUpdate()
    const { mutate } = useCreateAccountSectors()
    
    const handleSubmit = ( e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let changedData;        
        const mode = initial ? "update" : "create"
        const DATA = getFormDataObject(e);
        const payloadData = {
            code: String(DATA.code),
            name: String(DATA.name)
        }

        if(mode === "update") {
            changedData = handleTrackChangedFields(initial, payloadData)
            if(!changedData) return;
        }

        setLoading(true);
        const payload:AddAccountingSectorPayload = {
            ...(mode === "update"
            ? { id: Number(initial?.id), data: changedData }
            : { data: payloadData }),
            mode,
        }

        mutate(payload, {
            onSuccess: (response:AccountSector) => {
                updateCache({
                    mode,
                    key: [BASE_ACCOUNT_SECTORS.keyStoreValue],
                    response
                })
                toast.success(
                    mode === "update"
                    ? "Sector updated successfully."
                    : "New sector added successfully."
                )
                setOpen(false)
            },
            onError: (error) => handleAxiosError(`Failed to ${mode} an accounting sector.`, error),
            onSettled : ()=> setLoading(false)
        })
}

    return {
        loading,
        open,
        setOpen,
        handleSubmit
    }
}