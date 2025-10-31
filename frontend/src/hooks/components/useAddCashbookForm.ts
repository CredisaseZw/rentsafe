import { useCurrency } from '@/contexts/CurrencyContext'
import type { CreateCashbookPayload, PaginationData } from '@/interfaces';
import type { Cashbook, GeneralLedgerAccount } from '@/types'
import { useEffect, useState } from 'react'
import useGetGeneralLedgerAccounts from '../apiHooks/useGetGeneralLedgerAccounts';
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from '@/lib/utils';
import type { UseMutationResult } from '@tanstack/react-query';
import useClient from '../general/useClient';
import { toast } from 'sonner';

function useAddCashbookForm(initial: Cashbook | undefined, successCallback:  (()=>void) | undefined) {
    const [page, setPage]= useState(1);
    const queryClient = useClient();
    const {currencies, currencyLoading, currency} = useCurrency()
    const {generalLedgers, generalLedgersLoading, generalLedgersError} = useGetGeneralLedgerAccounts(page);
    const [generalLedgerAccounts, setGeneralLedgerAccounts] = useState<GeneralLedgerAccount[]>([]);
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined)
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch general ledger accounts", generalLedgersError)) return;
        if(generalLedgers){
            setGeneralLedgerAccounts((p)=>
                page === 1
            ? generalLedgers.results
            : [...p, ...generalLedgers.results]
            )
            setPagination({
                count : generalLedgers.count,
                next : generalLedgers.next
            })
        }

    },[generalLedgers, generalLedgersError])

    const handleLoadMoreGLS = () => {
        if(pagination?.next){
            const nextPage = new URL(pagination.next).searchParams.get("page")
            setPage(Number(nextPage))
            }        
            return;
            
    }
    
    const handleSubmit = (
        e:React.FormEvent<HTMLFormElement>, 
        mutation: UseMutationResult<any, Error, CreateCashbookPayload, unknown>) => {
        e.preventDefault();
        let changedData;
        const mode:"update" | "create" = initial ? "update" : "create";
        const data = getFormDataObject(e);
        const payloadData = {
            cashbook_name: data.cashbookName,
            currency_id: Number(data.currency),
            requisition_status: data.activeRequisition === "true",
            account_type: data.accountType,
            bank_account_number: data.bankAccountNumber,
            branch_name: data.branch,
            general_ledger_account_id: Number(data.generalLedgerAccount),
        }

        if(mode === "update"){
            const initialPayload = {
                cashbook_name: initial?.cashbook_name,
                currency_id: Number(initial?.currency.id),
                requisition_status: initial?.requisition_status,
                account_type: initial?.account_type,
                bank_account_number: initial?.bank_account_number,
                branch_name: initial?.branch_name,
                general_ledger_account_id: Number(initial?.general_ledger_account.id),
            }
            changedData = handleTrackChangedFields(initialPayload, payloadData);
            if(!changedData) return;
        }
        
        const payload:CreateCashbookPayload = {
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
                toast.success("Cashbook created successfully.")
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
        pagination,
        loading,
        handleSubmit,
        handleLoadMoreGLS
    }

}

export default useAddCashbookForm