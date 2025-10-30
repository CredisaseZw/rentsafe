import { useCurrency } from '@/contexts/CurrencyContext'
import type { PaginationData } from '@/interfaces';
import type { Cashbook, GeneralLedgerAccount } from '@/types'
import { useEffect, useState } from 'react'
import useGetGeneralLedgerAccounts from '../apiHooks/useGetGeneralLedgerAccounts';
import { handleAxiosError } from '@/lib/utils';

function useAddCashbookForm(initial: Cashbook | undefined) {
    const [page, setPage]= useState(1);
    const {currencies, currencyLoading, currency} = useCurrency()
    const {generalLedgers, generalLedgersLoading, generalLedgersError} = useGetGeneralLedgerAccounts(page);
    const [generalLedgerAccounts, setGeneralLedgerAccounts] = useState<GeneralLedgerAccount[]>([]);
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined)

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
    
    const handleSubmit = () => {console.log(initial)}

    return {
        currencies,
        currency,
        currencyLoading,
        generalLedgerAccounts,
        generalLedgersLoading,
        pagination,
        handleSubmit,
        handleLoadMoreGLS
    }

}

export default useAddCashbookForm