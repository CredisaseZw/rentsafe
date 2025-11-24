import { useCurrency } from '@/contexts/CurrencyContext'
import type { Cashbook, GeneralLedgerAccount, Payload } from '@/types'
import { useEffect, useState } from 'react'
import {useGetGeneralLedgerAccounts} from '../apiHooks/useGetGeneralLedgerAccounts';
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from '@/lib/utils';
import type { UseMutationResult } from '@tanstack/react-query';
import useClient from '../general/useClient';
import { toast } from 'sonner';

function useAddCashbookForm(initial: Cashbook | undefined, successCallback:  (()=>void) | undefined) {
    const [page, setPage]= useState(1);
    const queryClient = useClient();
    const {currencies, currencyLoading, currency} = useCurrency()
    const [accountType, setAccountType] = useState(initial?.account_type ?? "Bank Account");
    const {generalLedgers, generalLedgersLoading, generalLedgersError} = useGetGeneralLedgerAccounts(page);
    const [generalLedgerAccounts, setGeneralLedgerAccounts] = useState<GeneralLedgerAccount[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        if(handleAxiosError("Failed to fetch general ledger accounts", generalLedgersError)) return;
        if(!generalLedgers) return;
        
        setGeneralLedgerAccounts((p)=>
            page === 1
            ? generalLedgers.results
            : [...p, ...generalLedgers.results]
        )
        
        if(generalLedgers.next){
            const page_ = new URL(generalLedgers.next).searchParams.get("page");
            setPage(Number(page_))
        }
        

    },[generalLedgers, generalLedgersError, page])

    const handleSubmit = (
        e:React.FormEvent<HTMLFormElement>, 
        mutation: UseMutationResult<any, Error, Payload, unknown>) => {
        e.preventDefault();
        let changedData;
        const mode:"update" | "create" = initial ? "update" : "create";
        const data = getFormDataObject(e);
        const payloadData = {
            cashbook_name: data.cashbookName,
            currency_id: Number(data.currency),
            requisition_status: data.activeRequisition === "true",
            account_type: data.accountType,
            ...( accountType === "Bank Account" && 
                { bank_account_number: data.bankAccountNumber } ),
            ...( data.branch &&
                { branch_name: data.branch } ),
            general_ledger_account_id: Number(data.generalLedgerAccount),
        }

        if(mode === "update"){
            const initialPayload = {
                cashbook_name: initial?.cashbook_name,
                currency_id: Number(initial?.currency.id),
                requisition_status: initial?.requisition_status,
                account_type: initial?.account_type,
                ...( initial?.bank_account_number && 
                    {bank_account_number: initial?.bank_account_number}),
                ...( initial?.branch_name && 
                    {branch_name: initial?.branch_name} ),
                general_ledger_account_id: Number(initial?.general_ledger_account.id),
            }
            changedData = handleTrackChangedFields(initialPayload, payloadData);
            if(!changedData) return;
        }
        
        const payload:Payload = {
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
                queryClient.invalidateQueries({queryKey : ["cashBooks", 1]})
                toast.success(`Cashbook ${mode}d successfully.`)
                successCallback?.();
            },
            onError : (error) => handleAxiosError("Failed to create a new cash book", error),
            onSettled: ()=> setLoading(false)
        })

        }

    return {
        currencies,
        currency,
        currencyLoading,
        generalLedgerAccounts,
        generalLedgersLoading,
        loading,
        accountType,
        setAccountType,
        handleSubmit,
    }

}

export default useAddCashbookForm