import { getFormDataObject, handleAxiosError } from "@/lib/utils";
import type { VATPayload, VATRow } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import useClient from "../general/useClient";
import { toast } from "sonner";

export default function useAddVATSetting(vatSetting: VATRow | undefined){
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const queryClient = useClient();

    const handleSubmit = (
        e:React.FormEvent<HTMLFormElement>,
        mutation : UseMutationResult<any, Error, VATPayload, unknown>
    ) => {
        e.preventDefault()
        setLoading(true)
        const MODE = !!vatSetting ? "update" : "create";
        const formData= getFormDataObject(e);
        let vatData:VATRow = {
            rate: Number(formData.rate),
            description : String(formData.description),
            ...(
                MODE === "update" &&
                {
                    vat_applicable : !!formData.vatApplicable
                }
            )
        }

        if (MODE === "update") {
            const changes: Record<string, any> = {};

            if (Number(vatData.rate) !== Number(vatSetting?.rate)) changes.rate = vatData.rate;
            if (vatData.description !== vatSetting?.description) changes.description = vatData.description;
            if (vatData.vat_applicable !== vatSetting?.vat_applicable) changes.vat_applicable = vatData.vat_applicable;
            if (Object.keys(changes).length === 0) {
                toast.info("No changes made.");
                setLoading(false);
                return;
            }
            vatData = changes;
        }

        const payload:VATPayload = {
            data: vatData,  
            mode : MODE,
            ...(MODE === "update" && {id: Number(vatSetting?.id)})
        }

        mutation.mutate(payload, {
            onSuccess : ()=>{
                queryClient.invalidateQueries({queryKey : ["VATSettings"]})
                toast.success(`VAT setting ${MODE === "create" ? "created" : "updated"} successfully`);
                setOpen(false)
            },
            onError : (error)=> handleAxiosError("An error occurred adding VAT", error),
            onSettled : ()=> setLoading(false)
        })
    }

    return { 
        open,
        loading,
        setOpen,
        handleSubmit
    }
}