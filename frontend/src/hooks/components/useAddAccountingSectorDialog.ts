import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import type { AccountSector, AddAccountingSectorPayload } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import useClient from "../general/useClient";

export default function useAddAccountingSectorDialog(initial?: AccountSector){
    const [open ,setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const queryClient = useClient()

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>,
        mutation: UseMutationResult<any, Error, AddAccountingSectorPayload, unknown>
    ) => {
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

        mutation.mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey : ["accountSectors", 1]})
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