import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { handleAxiosError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { Category } from "@/types";
import useQueryResults from "@/hooks/apiHooks/useQueryResults";
import { BASE_TRUST_ACC_SALES_CATEGORIES } from "@/constants/base-links";
import type { Response } from "@/interfaces";

interface TrustAccountCategoriesResponse extends Response {
  results : Category[]
}

interface props {
    onSelectAccount?: (item: Category) => void
    defaultValue? : string
}

function AutoCompleteTrustAccSalesCategories({defaultValue, onSelectAccount }:props) {
    const [searchValue, setSearchValue] = useState(defaultValue ?? "");
    const [open, setOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [hasUserInteracted, setHasUserInteracted] = useState(false)
    const { data, error, isLoading } = useQueryResults<TrustAccountCategoriesResponse>({
        link : BASE_TRUST_ACC_SALES_CATEGORIES.link,
        keyStoreValue: BASE_TRUST_ACC_SALES_CATEGORIES.keyStoreValue,
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
        <Label className="required">Category</Label>
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
            placeholder="e.g Accessories"
            onFocus={()=>setOpen(true)}
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
                           onSelectAccount?.(item);
                           setOpen(false);
                           setSearchValue(item.name ?? "")
                        }}
                     >
                        {item.code} - {item.name}
                     </button>
                ))}
            </div>
            )
        }
    </div>
  )
}

export default AutoCompleteTrustAccSalesCategories