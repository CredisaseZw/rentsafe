import type { AccountSector } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useGetAccountSectors from "../apiHooks/useGetAccountSectors";
import type { PaginationData } from "@/interfaces";
import { handleAxiosError } from "@/lib/utils";

export default function useAccountSectors(){
    const [searchParams] = useSearchParams();
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
    const [sectors, setSectors] = useState<AccountSector[]>([])
    const page  = searchParams.get("page") || "1";
    const search = searchParams.get("search") || null;
    const {data, isLoading, error,refetch } = useGetAccountSectors(page, search);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch accounting sectors", error)) return;
        if(data){
            const {results, ...paginationMeta} = data
            setSectors(data.results)
            setPagination(paginationMeta as PaginationData)
        }
    }, [data, error, page, search])
    
    return {
        sectors,
        isLoading,
        error,
        pagination,
        refetch,
    }
}