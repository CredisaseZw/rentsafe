import type { PaginationData } from "@/interfaces"
import type { GeneralLedgerAccount } from "@/types"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import {useGetGeneralLedgerAccounts} from "../apiHooks/useGetGeneralLedgerAccounts"
import { handleAxiosError } from "@/lib/utils"

function useGeneralLedgersAccountsLists() {
    const [accounts, setAccounts] = useState<GeneralLedgerAccount[]>([])
    const [pagination , setPagination] = useState<PaginationData | undefined>(undefined);
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
    const {generalLedgers, generalLedgersLoading, generalLedgersError} = useGetGeneralLedgerAccounts(page);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch general accounts", generalLedgersError)) return;
        if(generalLedgers){
            const {results, ...PaginationMeta} = generalLedgers;
            setPagination(PaginationMeta)
            setAccounts(generalLedgers.results)
        }
    }, [generalLedgers, generalLedgersError])


    return{
        accounts,
        pagination,
        generalLedgersLoading,
        generalLedgersError
    }
}

export default useGeneralLedgersAccountsLists