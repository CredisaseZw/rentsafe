import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { handleAxiosError } from "@/lib/utils";
import useQueryResults from "@/hooks/apiHooks/useQueryResults";
import type { TrustAccountSalesItemsResponse } from "@/hooks/components/useTrustAccountingSalesItems";
import { BASE_TRUST_ACC_SALES_ITEMS } from "@/constants/base-links";
import type { TrustAccSalesItem } from "@/interfaces";

interface Props {
    index: number
    searchItem: string;
    onSelectValue?: (item: TrustAccSalesItem) => void;
    setSearchItem:  (index: number, key: string, value: string) => void;
}

export default function AutoCompleteTrustAccSalesItem({ 
    index,
    searchItem,
    setSearchItem,
    onSelectValue,
}: Props) {
    const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
    const [open, setOpen] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
        return () => clearTimeout(handler);
    }, [searchItem]);

    const {data, error, isLoading} = useQueryResults<TrustAccountSalesItemsResponse>({
        link: BASE_TRUST_ACC_SALES_ITEMS.link,
        keyStoreValue : BASE_TRUST_ACC_SALES_ITEMS.keyStoreValue,
        params : {
            search : debouncedSearch
        },
        enabled : hasUserInteracted && !!debouncedSearch
    })

    useEffect(() => {handleAxiosError("Failed to fetch sales items", error)}, [error]);

    return (
        <div className="form-group relative">
            <Input
                type="text"
                required
                autoComplete="off"
                value={searchItem}
                onChange={(e) => {
                    const { value } = e.target;
                    setHasUserInteracted(true);
                    setSearchItem(index, "searchSalesItem", value);
                    setOpen(!!value);
                }}
                onBlur={() => setTimeout(() => setOpen(false), 100)}
                name="saleItemName"
            />

            {open && (
                <div
                    className="border-color absolute top-full left-1/2 z-[100] mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white dark:bg-zinc-900 text-sm shadow-xl"
                    role="listbox"
                >
                {isLoading ? (
                    <div className="flex items-center justify-center py-5">
                        <Loader2 className="text-foreground/60 animate-spin" />
                    </div>
                ) : !data?.results?.length ? (
                    <div className="p-4 text-gray-800 dark:text-white text-center flex flex-col items-center">
                        No results found
                    </div>
                ) : (
                    data.results.slice(0, 7).map((item: TrustAccSalesItem) => {
                        return (
                            <button
                            key={item.id}
                            type="button"
                            role="option"
                            className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                onSelectValue?.(item);
                                setOpen(false);
                            }}
                            >
                            {item.name}
                            </button>
                        );
                        })
                    )}
                </div>
            )}
        </div>
  );
}
