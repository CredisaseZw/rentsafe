import type { PaginationData } from "@/interfaces"
import type { Header, Lease } from "@/types"
import { useState } from "react"
import { useSearchParams } from "react-router"

export default function useLeases(defaultStatus: string) {
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

  return {
    renewalHeaders,
    terminatedHeaders,
    activeHeaders,
    page, 
    status,
    search,
    paginationData, 
    leases,
    setLeases,
    setPaginationData,
    setSearchParams
}
}
