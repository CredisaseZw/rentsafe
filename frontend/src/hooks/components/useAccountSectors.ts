import type { AccountSector } from "@/types";
import { useEffect, useState } from "react";
import type { PaginationData } from "@/interfaces";
import { handleAxiosError } from "@/lib/utils";
import type { Response } from "@/interfaces";
import useQueryResults from "../apiHooks/useQueryResults";
import {  BASE_ACCOUNT_SECTORS } from "@/constants/base-links";
interface TrustAccountSectorsResponse extends Response {
  results : AccountSector[]
}
export default function useAccountSectors(){
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
    const [sectors, setSectors] = useState<AccountSector[]>([])
   
    const {data, isLoading, error,refetch } = useQueryResults<TrustAccountSectorsResponse>({
        link: BASE_ACCOUNT_SECTORS.link,
        keyStoreValue :BASE_ACCOUNT_SECTORS.keyStoreValue,
    });

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch accounting sectors", error)) return;
        if(data){
            const {results, ...paginationMeta} = data
            setSectors(results)
            setPagination(paginationMeta)
        }
    }, [data, error,])
    
    return {
        sectors,
        isLoading,
        error,
        pagination,
        refetch,
    }
}