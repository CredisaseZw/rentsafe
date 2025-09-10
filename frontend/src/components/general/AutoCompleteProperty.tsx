import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import useSearchProperty from "@/hooks/apiHooks/useSearchProperty";
import type { Property } from "@/types";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
  searchItem: string;
  onSelectValue?: (item: Property) => void;
  setSearchItem: Dispatch<SetStateAction<string>>;
  alternativeOption? : ()=> void;
}

function AutoCompleteProperty({ searchItem, setSearchItem, onSelectValue, alternativeOption }: Props) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
    return () => clearTimeout(handler);
  }, [searchItem]);

  const { data, isLoading, error } = useSearchProperty(
    debouncedSearch,
    !!debouncedSearch
  );

  useEffect(() => {
    if (error && isAxiosError(error)) {
      console.error(error);
      toast.error("Failed to fetch suburbs", {
        description: error.response?.data.error || error.response?.data.details || "Something went wrong",
      });
    }
  }, [error]);


  return (
    <div className="form-group relative">
      <label className="required">Property Name</label>
      <Input
        type="text"
        required
        autoComplete="off"
        value={searchItem}
        onChange={(e) => {
          const { value } = e.target;
          setSearchItem(value);
          setOpen(!!value);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        name="property_name"
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
              <Button 
                size={"sm"}
                type="button"
                variant={"outline"}
                className="mt-2"
                onMouseDown={(e) => e.preventDefault()} 
                onClick={()=> {
                  setOpen(false)
                  alternativeOption?.();
                }}>Use Primary Tenants Address</Button>
              </div>
          ) : (
            data.results.slice(0, 7).map((item: Property) => {
              const fullname = item.name;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelectValue?.(item);
                    setSearchItem(fullname ?? "");
                    setOpen(false);
                  }}
                >
                  {fullname}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default AutoCompleteProperty;
