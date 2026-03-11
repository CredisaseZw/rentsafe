import type { PropertyExpense, TrustGLAccount } from "@/interfaces";
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import type { Payload } from "@/types";
import type { UseMutateFunction } from "@tanstack/react-query";
import React, { useMemo, useState } from "react"
import { toast } from "sonner";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";

function useAddPropertyExpenseDialogue(propertyExpense?: PropertyExpense) {
    const [open, setOpen ] = useState(false);
    const [loading, setLoading] = useState(false)
    const {updateCache} = useOptimisticCacheUpdate()
    const [expenseAcc, setExpenseAcc] = useState<number |  undefined>(propertyExpense?.expense_account);
    const defaultValue = useMemo(()=> propertyExpense?.expense_account_name, []) 
    const onSelectAccount = (acc : TrustGLAccount) =>{
        setExpenseAcc(acc.id)
    }

    const onSubmit = (
        e: React.FormEvent<HTMLFormElement>,
        mutate :  UseMutateFunction<PropertyExpense, Error, Payload, unknown>
    )=>{
        const mode = propertyExpense ? "update" : "create";
        const data = getFormDataObject(e)
        if (!data.expense_name || !expenseAcc)
            return toast.error(
                !data.expense_name
                ? "Expense name required."
                : "Expense Account Name Required."
            );
        
        let payloadData = {
            expense : data.expense_name,
            expense_account : expenseAcc
        }

        if (mode === "update"){
            const initialData = {
                expense: propertyExpense?.expense,
                expense_account: Number(propertyExpense?.expense_account)
            }

            const changes = handleTrackChangedFields(initialData, payloadData);
            if(!changes) return;
            payloadData = changes
        }

        const PAYLOAD = {
            ...(
                mode === "update" &&
                {id : propertyExpense?.id}
            ),
            data: payloadData,
            mode
        }
        setLoading(true);
        mutate(PAYLOAD, {
            onError : (error) => handleAxiosError("Error occurred adding property expense.", error),
            onSuccess : async(response)=>{
                updateCache({
                    key : ["property-expenses"],
                    response,
                    mode
                })
                toast.success(`${mode === "create" && "New "} Expense successfully ${mode}d`)
                setOpen(false);
            },
            onSettled : ()=> setLoading(false)
        })
    }

      



    return {
        open,
        loading,
        expenseAcc,
        defaultValue,
        setOpen,
        onSubmit,
        onSelectAccount
    }
}

export default useAddPropertyExpenseDialogue