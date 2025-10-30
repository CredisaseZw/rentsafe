import { handleAxiosError } from "@/lib/utils";
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
        
        const mode = initial ? "update" : "create"
        const FORM_DATA = new FormData(e.currentTarget)
        const DATA = Object.fromEntries(FORM_DATA.entries())

        const payloadData = {
            code: String(DATA.code),
            name: String(DATA.name)
        }

        // Track changed fields if editing
        let changedData: Partial<AccountSector> = payloadData
        if (mode === "update" && initial) {
        changedData = Object.fromEntries(
            Object.entries(payloadData).filter(([key, value]) => {
            const original = (initial as any)[key]
            if (typeof value === "string" && typeof original === "string") {
                return value.trim() !== original.trim()
            }
            return value !== original
            })
        ) as Partial<AccountSector>

        // No actual changes
        if (Object.keys(changedData).length === 0) {
            return toast.info("No changes made.")
        }
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