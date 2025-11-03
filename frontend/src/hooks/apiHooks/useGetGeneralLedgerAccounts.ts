import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { GeneralLedgerAccount } from "@/types";
import { useQuery } from "@tanstack/react-query";
interface GLResponse extends Response { 
    results : GeneralLedgerAccount[]
}

export function useGetGeneralLedgerAccounts(page:Number){
    const {data, isLoading, error} = useQuery<GLResponse>({
        queryKey : ["generalLedgerAccounts", page],
        queryFn : async() =>{
            const response = await api.get<GLResponse>(`/api/accounting/ledger-accounts/?page=${page}`);
            return response.data;
        }
    })
  
    return {
        generalLedgers : data,
        generalLedgersLoading : isLoading,
        generalLedgersError:  error};
}