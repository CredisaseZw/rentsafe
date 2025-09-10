import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Lease} from "@/types";
import useGetLeases from "@/hooks/apiHooks/useGetActiveLeases";
import { toast } from "sonner";

interface Props {
  index : number;
  searchItem : string,
  onSelectValue? : (index : number, item: Lease ) => void;
  setSearchItem? : (index: number, key: string, value: any) => void;
  checkReceipt : (lease_id: string) => boolean;

}

function AutoCompleteLease({ index, onSelectValue, searchItem, setSearchItem, checkReceipt }: Props) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
    return () => clearTimeout(handler);
  }, [searchItem]);

  const { data, isLoading } = useGetLeases( 1, "", debouncedSearch );

  return (
    <div className="form-group relative">
      <label className="required">Customer Name</label>
      <Input
        type="text"
        required
        name = "search_customer"
        autoComplete="off"
        readOnly = {index === 0}
        onChange={(e) => {
          const { value } = e.target;
          if (setSearchItem) setSearchItem(index, "customerName", value);
          setOpen(!!value);
        }}
        value={searchItem}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
      />

      {open && (
        <div className="border-color absolute top-full left-1/2 z-100 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white dark:bg-zinc-950 text-sm shadow-xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-5">
              <Loader2 className="text-foreground/60 animate-spin" />
            </div>
          ) : !data?.results.length ? (
          <div className="p-4 text-gray-800 dark:text-white text-center flex flex-col items-center">
            No results found
          </div>
          ) : (
           data.results.map((lease: Lease) => {
             const primaryFullname =
              lease.tenants.find((t) => t.is_primary_tenant)?.tenant_object.full_name ?? "";              
              return (
                <button
                  key={lease.id}
                  type="button"
                  className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (checkReceipt(lease.lease_id)) {
                      toast.error("Duplicate receipts detected", {description :`Receipt id ${lease.lease_id} is already selected`})
                    } else {
 if (onSelectValue) onSelectValue(index, lease);
                    if (setSearchItem) setSearchItem(index, "customerName", primaryFullname);
                    setOpen(false)
                    } 
                   
                  }}
                >
                  {primaryFullname}
                </button>
              );
            })                    
          )}
        </div>
      )}
    </div>
  );
}

export default AutoCompleteLease;
