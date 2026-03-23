import { useEffect, useState } from "react"
import { useGetGeneralLedgerAccounts } from "../apiHooks/useGetGeneralLedgerAccounts";
import { handleAxiosError } from "@/lib/utils";
import type { GeneralLedgerAccount } from "@/types";

function useAddPropertyExpense() {
    const [open, setOpen ] = useState(false);
    const [page,setPage] = useState(1);
    const [generalLedgerAccounts, setGeneralLedgerAccounts] = useState<GeneralLedgerAccount[]>([])
    const {
        generalLedgers,
        generalLedgersLoading,
        generalLedgersError
    } = useGetGeneralLedgerAccounts(page);
    
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch operational general ledger accounts", generalLedgersError)) return;
        if(generalLedgers){
            setGeneralLedgerAccounts((p)=>(
                page === 1 
                ? generalLedgers.results
                : [...p, ...generalLedgers.results]
            ))

            if(generalLedgers.next){
                const page_ = new URL(generalLedgers.next).searchParams.get("page");
                setPage(Number(page_));
            }
        }
    }, [generalLedgers, generalLedgersError, generalLedgersLoading, page]);

    return {
        open,
        setOpen,
        generalLedgerAccounts
    }
}

export default useAddPropertyExpense