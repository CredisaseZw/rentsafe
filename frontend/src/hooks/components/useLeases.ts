import type { PaginationData } from "@/interfaces"
import type { Header, Lease, LeaseReceiptPayload } from "@/types"
import { useState } from "react"
import { useSearchParams } from "react-router"

export default function useLeases(defaultStatus: string) {
    const [total, setTotal] = useState(0)
    const commonHeaders:Header[] = [
        {
            name  :"Lease ID",
        },
        {
            name : "Tenant",
        },
        {
            name : "Landlord",
        }, 
        {
            name : "Property Type"
        },
        {
            name : "Address"
        },
    ]
    const activeHeaders:Header[] = [
        ...commonHeaders, 
        {
            name : "Rent owing"
        },
        {
            name : "Actions",
            colSpan : 3
        }
    ]
    const renewalHeaders:Header[] = [
        ...commonHeaders,
        {
            name : "Lease start Date"
        },
        {
            name : "Lease end Date"
        },
        {
            name : "Actions",
            colSpan : 2
        }
    ]

    const terminatedHeaders:Header[] = [
        ...commonHeaders,
        {
            name : "Rent owing"
        },
        {
            name: "Date of termination"
        },
        {
            name : "Actions",
            colSpan : 2
        },
       
    ]

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

    const handleOnSearchValue = (searchValue: string) =>{
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (searchValue) params.set("search", searchValue);
            else params.delete("search");
            return params;
      }); 
    }

    const onClearSearch = () => {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);
         if (params.get("search")) params.delete("search");
         return params;
      });
    };

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
        status,
        search,
        leases,
        activeHeaders,
        paginationData, 
        renewalHeaders,
        terminatedHeaders,
        handleOnSearchValue,
        onSuccessCallback,
        setPaginationData,
        setSearchParams,
        onClearSearch,
        setLeases,
        setTotal,

    }
}
