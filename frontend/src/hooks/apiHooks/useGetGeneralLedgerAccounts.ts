import { api } from "@/api/axios";
import type { RefetchState, Response } from "@/interfaces";
import type { GeneralLedgerAccount } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {Store} from "@tanstack/store"
interface GLResponse extends Response { 
    results : GeneralLedgerAccount[]
}
export const GeneraLedgersRetch = new Store<RefetchState>({
    refetch : null
})

export function useGetGeneralLedgerAccounts(page:Number){
    const {data, isLoading, error, refetch} = useQuery<GLResponse>({
        queryKey : ["generalLedgerAccounts", page],
        queryFn : async() =>{
            const response = await api.get<GLResponse>(`/api/accounting/ledger-accounts/?page=${page}`);
            return response.data;
        }
    })
    GeneraLedgersRetch.setState({refetch})
    return {
        generalLedgers : data,
        generalLedgersLoading : isLoading,
        generalLedgersError:  error};
}