import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import useSearchLandlord from "@/hooks/apiHooks/useSearchLandlord";
import { Loader2 } from "lucide-react";
import type { CompanyMinimal, IndividualMinimal } from "@/interfaces";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  index? : number;
  landlordIdentifier: string;
  searchItem : string,
  landlord_type : string,
  onSelectValue? : (item: IndividualMinimal | CompanyMinimal) => void;
  setSearchItem? : Dispatch<SetStateAction<string>>;
  multiSetSearchItem? : (index: number, key:string, value: string) => void;
}

function AutoCompleteLandlord({ index, landlordIdentifier, landlord_type, onSelectValue, searchItem, setSearchItem, multiSetSearchItem }: Props) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
    return () => clearTimeout(handler);
  }, [searchItem]);

  const { data, isLoading } = useSearchLandlord(
    landlord_type,
    debouncedSearch,
    !!debouncedSearch 
  );

  return (
    <div className="form-group relative">
      <label className="required">{landlordIdentifier}</label>
      <Input
        type="text"
        required
        autoComplete="off"
        onChange={(e) => {
          const { value } = e.target;
          if (setSearchItem) setSearchItem(value);
          if (multiSetSearchItem) multiSetSearchItem(index ?? 0, "search_value", value,);
          setOpen(!!value);
        }}
        value={searchItem}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        name="landlord_id"
      />

      {open && (
        <div className="border-color absolute top-full left-1/2 z-100 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white text-sm shadow-xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-5">
              <Loader2 className="text-foreground/60 animate-spin" />
            </div>
          ) : !data?.length ? (
            <div className="p-2 text-gray-800">No results found</div>
          ) : (
           data.slice(0, 7).map((item: IndividualMinimal | CompanyMinimal) => {
              const fullname = "first_name" in item 
                ? `${item.first_name} ${item.last_name}` 
                : item.registration_name; 

              return (
                <button
                  key={item.id}
                  type="button"
                  className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (onSelectValue) onSelectValue(item);
                    if (setSearchItem) setSearchItem(fullname); 
                    if (multiSetSearchItem) multiSetSearchItem(index ?? 0, "search_value", fullname,);
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

export default AutoCompleteLandlord;