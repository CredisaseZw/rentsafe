import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { handleAxiosError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import useQueryResults from "@/hooks/apiHooks/useQueryResults";
import { LEASE_TENANTS } from "@/constants/base-links";
import type { InvoiceCustomerDetails, LeaseTenant, Response } from "@/interfaces";

interface LeaseTenantResponse extends Response {
  results : LeaseTenant[]
}

interface props {
    onSelectBiller?: (item: InvoiceCustomerDetails) => void
}

function AutoCompleteTenantLeaseClient({ onSelectBiller }:props) {
    const [searchValue, setSearchValue] = useState("");
    const [open, setOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [hasUserInteracted, setHasUserInteracted] = useState(false)
    const { data, error, isLoading } = useQueryResults<LeaseTenantResponse>({
        link : LEASE_TENANTS.link,
        keyStoreValue: LEASE_TENANTS.keyStoreValue,
        params : {
            ...( debouncedSearch &&
            { search : debouncedSearch }
            )},
        enabled : hasUserInteracted && !!debouncedSearch   
    })

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearch(searchValue)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchValue])
    
    useEffect(()=>{
        if(handleAxiosError("Error fetching category.", error)) return;
    }, [error])

    return (
    <div className="form-group w-full relative">
        <Input
            required
            value={searchValue}
            name =""
            onChange={(e)=> {  
                const { value } = e.target;
                setHasUserInteracted(true);
                setSearchValue(value);
                setOpen(!!value);
            }}
            placeholder="e.g John Doe"
            onFocus={()=>setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 100)}
        />
        {
            open &&
            debouncedSearch && (
                <div className="border-color absolute top-full left-1/2 z-50 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white dark:bg-zinc-900 text-sm shadow-xl">
                {
                    isLoading && 
                    <div className="flex items-center justify-center py-5">
                        <Loader2 className="text-foreground/60 animate-spin" />
                    </div>
                }
                {
                    !isLoading &&
                    !data?.results?.length &&
                    <div className="p-4 text-gray-800 dark:text-white text-center flex flex-col items-center">
                        No results found
                    </div>
                }
                {
                    !isLoading &&
                    data?.results?.map((item)=>(
                    <button
                        key={item.id}
                        type="button"
                        className="border-color text-left w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            const tenant:InvoiceCustomerDetails = {
                                id: item.id,
                                full_name: item.tenant_object.full_name,
                                phone: item.tenant_object.phone_number,
                                email: item.tenant_object.email,
                                tin_number: item.tenant_object.tin_number,
                                vat_number: item.tenant_object.vat_number,
                                account_number: null,
                                industry: null,
                                customer_type : item.tenant_type,
                                address: item.tenant_object.primary_address
                            } 
                           onSelectBiller?.(tenant);
                           setOpen(false);
                           setSearchValue(item.tenant_object.full_name ?? "")
                        }}
                     >
                        {item.tenant_object.full_name}
                     </button>
                ))}
            </div>
            )
        }
    </div>
  )
}

export default AutoCompleteTenantLeaseClient