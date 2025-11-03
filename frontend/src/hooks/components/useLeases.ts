import type { PaginationData } from "@/interfaces"
import type { Lease, LeaseReceiptPayload } from "@/types"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import {useGetLeases} from "../apiHooks/useGetActiveLeases"
import { getCurrentDate, handleAxiosError } from "@/lib/utils"

export default function useLeases(defaultStatus: string) {
    const [total, setTotal] = useState(0)
    const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
    const [leases, setLeases] = useState<Lease[] | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(
    searchParams.get(
        defaultStatus === "ACTIVE"
        ? "active_page"
        : defaultStatus === "RENEW"
        ? "renew_page"
        : "terminated_page"
    ) || "1"
    );

    const status = searchParams.get("status")?.toUpperCase() || defaultStatus
    const search = searchParams.get("search") || null
    const {data, isLoading, error, refetch} = useGetLeases(page, status, search);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch active leases", error)) return;
        if(data){
            let results = data.results;
            switch(defaultStatus){
                case "active_page": 
                    const t = results.reduce((total_, lease)=> total_ + lease.owing, 0)
                    setTotal(t);
                    break;
                case "renew_page":
                    results = data.results
                    .filter((lease: Lease) => new Date(lease.end_date) < new Date(getCurrentDate()))
                    break;       
            }
        
            setLeases(results ?? [])
            setPaginationData(data as PaginationData)
        }
    }, [page, search, status, data, error])



    const onSuccessCallback = (payload: LeaseReceiptPayload[] | undefined) => {
        if (!payload )return null;
        setLeases((prevLeases) => {
            if (!prevLeases) return null;
            return prevLeases.map((lease) => {
                const update = payload.find((u) => u.lease_id === lease.lease_id);
                if (!update) return lease;
                return {
                ...lease,
                owing: parseFloat(update.current_balance),
                ...(update.lease_status && { risk_level_class: update.lease_status }),
                };
        }) as Lease[];
    });
    };

    return {
        page, 
        total,
        error,
        status,
        search,
        leases,
        isLoading,
        paginationData, 
        onSuccessCallback,
        setPaginationData,
        setSearchParams,
        setLeases,
        setTotal,
        refetch
    }
}
