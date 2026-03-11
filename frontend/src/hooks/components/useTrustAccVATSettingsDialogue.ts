import type { Payload, VATRow } from "@/types";
import React, { useState } from "react"
import useAddTrustAccVATSettings from "../apiHooks/useAddTrustAccVATSettings";
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";
import { toast } from "sonner";

function useTrustAccVATSettingsDialogue(vatSetting?: VATRow) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {mutate} = useAddTrustAccVATSettings()
    const {updateCache} = useOptimisticCacheUpdate()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const mode = vatSetting ? "update" : "create";
        const data = getFormDataObject(e);

        let payloadData =  {
            name: String(data.vat_name),
            code: String(data.vat_code),
            rate: Number(data.vat_rate),
            description : String(data.description)
        }
        if(mode === "update"){
            const initialData =  {
                name: vatSetting?.name,
                code: vatSetting?.code,
                rate: Number(vatSetting?.rate),
                description : vatSetting?.description
            }
            const changed = handleTrackChangedFields(initialData, payloadData);
            if(!changed) return;
            payloadData = changed
        }
        setLoading(true);
        const payload:Payload = {
            mode,
            data: mode === "create" ? [payloadData] : payloadData,
            ...(
                mode === "update" &&
                {id : vatSetting?.id }
            )
        }

        mutate(payload, {
            onSuccess : (response: VATRow[])=>{
                toast.success(`${mode === "create" && "New "}Vat Setting successfully ${mode}d`);
                const newData = Array.isArray(response) ? response[0] : response
                updateCache({
                    key : ["trust-acc-vat-settings"],
                    response : newData,
                    mode : mode
                });
                setOpen(false)
                return
            },
            onError : (error) => handleAxiosError("Failed to add vat setting", error),
            onSettled : ()=> setLoading(false)  
        })
    }
    return {
        open,
        loading,
        onSubmit,
        setOpen
  }
}

export default useTrustAccVATSettingsDialogue