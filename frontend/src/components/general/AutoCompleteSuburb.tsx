import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type {  SuburbPayload } from "@/types";
import useSearchSuburb from "@/hooks/apiHooks/useSearchSuburb";
import { handleAxiosError } from "@/lib/utils";

interface Props {
  searchItem: string;
  onSelectValue?: (item: SuburbPayload) => void;
  setSearchItem: Dispatch<SetStateAction<string>>;
}

function AutoCompleteSuburb({ searchItem, setSearchItem, onSelectValue }: Props) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
    return () => clearTimeout(handler);
  }, [searchItem]);

  const { data, isLoading, error } = useSearchSuburb(
    debouncedSearch,
    hasUserInteracted && !!debouncedSearch,
  
  );

  useEffect(() => {handleAxiosError("Failed to fetch suburbs", error)}, [error]);

  return (
    <div className="form-group relative">
      <label className="required">Suburb/Area</label>
      <Input
        type="text"
        required
        autoComplete="off"
        value={searchItem}
        onChange={(e) => {
          setHasUserInteracted(true);
          const { value } = e.target;
          setSearchItem(value);
          setOpen(!!value);

        }}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        name="suburb_name"
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
          ) : !data?.length ? (
            <div className="p-4 text-gray-800 dark:text-white text-center flex flex-col items-center">
              No results found
              </div>
          ) : (
            data?.slice(0, 7).map((item: SuburbPayload) => {
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

export default AutoCompleteSuburb;
