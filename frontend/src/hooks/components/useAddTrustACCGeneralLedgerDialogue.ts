import type { TrustGLAccount } from "@/interfaces";
import type { AccountSector, Payload } from "@/types";
import React, { useState } from "react"
import useAddTrustAccGeneralLedger, { type AddTrustAccGeneralLedgerData } from "../apiHooks/useAddTrustAccGeneralLedger";
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import { toast } from "sonner";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";
import useURLParamFilter from "./useURLParamFilter";


function useAddTrustACCGeneralLedgerDialogue(
    tsaGeneralLedger? : TrustGLAccount
) {
    const [accountType, setAccountType] = useState(tsaGeneralLedger?.account_type_id ?? undefined)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [isContra, setIsContra] = useState(true);
    const {getUrlParams} = useURLParamFilter()
    const { updateCache } = useOptimisticCacheUpdate()
    const onSelectAccount = (acc : AccountSector)=> {
        setAccountType(acc.id)
    }
    const {mutate} = useAddTrustAccGeneralLedger();
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const mode = tsaGeneralLedger ? "update" : "create"
        const data = getFormDataObject(e);
        
       if (!accountType || !data.account_name) {
            toast.error(
                !accountType
                ? "Account sector is required"
                : "Account name is required"
            );
            return;
        }

        let payloadData:AddTrustAccGeneralLedgerData = {
            account_name : data.account_name.toString().trim(),
            account_type_id : accountType,
            is_contra_account : isContra

        }
        if (mode=== "update"){
            const initialData = {
                account_name : tsaGeneralLedger?.account_name,
                account_type_id : tsaGeneralLedger?.account_type_id,
                is_contra_account :tsaGeneralLedger?.is_system_account
            }
            const changes = handleTrackChangedFields(initialData, payloadData)
            if(!changes) return;

            payloadData = changes
        }

        setLoading(true)
        const payload:Payload = {
            mode,
            data : payloadData,
            ...(
                mode === "update" &&
                {id : tsaGeneralLedger?.id}
            )
        }
        mutate(payload, {
            onSuccess : (response: TrustGLAccount) =>{
                toast.success(`${mode === "create" && "New "}General Ledger successfully ${mode}d`);
                const params = getUrlParams();
                updateCache({
                    key : ["trust-general-ledgers", params],
                    response :  response,
                    mode : mode
                });
                setOpen(false)
                return
            },
            onError : (error) => handleAxiosError("Failed to add general ledger", error),
            onSettled : ()=> setLoading(false)       
        })
    }

    return {
        onSelectAccount,
        setIsContra,
        onSubmit,
        setOpen,
        isContra,
        loading,
        open
  }
}

export default useAddTrustACCGeneralLedgerDialogue