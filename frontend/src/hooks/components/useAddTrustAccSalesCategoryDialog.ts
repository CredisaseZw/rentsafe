import type { Category, Payload } from "@/types"
import useMutateResults from "../apiHooks/useMutateResults"
import { useState } from "react"
import { toast } from "sonner";
import { handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import { BASE_TRUST_ACC_SALES_CATEGORIES } from "@/constants/base-links";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";

function useAddTrustAccSalesCategoryDialog(category?: Category) {
    const {mutate} = useMutateResults()
    const {updateCache} = useOptimisticCacheUpdate();
    const [open, setOpen ] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setFormData] = useState({
        name : category?.name ?? "",
        code: category?.code ?? ""
    })

    const onHandleFormChange = (key: string, value: string) => {
        setFormData((p)=>({
            ...p,
            [key] : value
        }))
    }
    
    const onSubmit =() => {
        if (!form.name?.trim() || !form.code?.trim()) {
            toast.error(
                !form.name?.trim()
                ? "Please enter a valid name."
                : "Please enter a valid code."
            );
            return;
        }
        const mode = category ? "update" : "create";
        let payloadData = form;

        if(mode === "update"){
            const initialData = {
                name : category?.name,
                code :category?.code
            }
            const changes = handleTrackChangedFields(initialData, form);
            if (!changes) return
            
            payloadData = changes 
        }

        setLoading(true)
        const PAYLOAD:Payload = {
            mode,
            data: payloadData,
            link : BASE_TRUST_ACC_SALES_CATEGORIES.link,
            ...(mode === "update" && {id : category?.id})
        }

        mutate(PAYLOAD, {
            onSuccess : async(response: Category) =>{
                toast.success("Category successfully "+ mode + "d.");
                updateCache({
                    key : [BASE_TRUST_ACC_SALES_CATEGORIES.keyStoreValue],
                    response : response,
                    mode 
                })
                setOpen(false)
            },
            onError : (error)=> handleAxiosError("Failed to " + mode + " invoice.", error),
            onSettled : ()=>setLoading(false)
        })

    }
    return {
        form,
        open,
        loading,
        onHandleFormChange,
        onSubmit,
        setOpen

    }
}

export default useAddTrustAccSalesCategoryDialog