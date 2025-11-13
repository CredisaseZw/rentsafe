import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Address} from "@/interfaces";
import type { Dispatch, SetStateAction } from "react";
import useSearchClient from "@/hooks/apiHooks/useSearchClient";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";

interface Props {
  index?: number;
  displayValue?: "name" | "ID"
  clientLabel?: string;
  searchItem: string;
  clientType: "tenant" | "individual" | "company" | string;
  isRequired?: boolean;
  createClient?: boolean;
  disableSearch?: boolean;
  setPrimaryTenantAddress?: React.Dispatch<React.SetStateAction<Address | undefined>>;
  onSelectValue?: (item: any, index?: number) => void;
  setSearchItem?: Dispatch<SetStateAction<string>>;
  multiSetSearchItem?: (index: number, key: string, value: string) => void;
}

function AutoCompleteClient({
  displayValue = "ID",
  index,
  createClient,
  searchItem,
  clientType,
  isRequired,
  clientLabel,
  disableSearch,
  setSearchItem,
  onSelectValue,
  multiSetSearchItem,
  setPrimaryTenantAddress,
}: Props) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
  const [open, setOpen] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const path = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
    return () => clearTimeout(handler);
  }, [searchItem]);

  const { data, isLoading } = useSearchClient(
    clientType,
    debouncedSearch,
    hasUserInteracted && !!debouncedSearch
  );

  return (
    <div className="form-group relative">
      {clientLabel && (
        <label className={isRequired === false ? "" : "required"}>
          {clientLabel}
        </label>
      )}
      <Input
        disabled={disableSearch ?? false}
        type="text"
        required={isRequired === false ? false : true}
        name="search_client"
        autoComplete="off"
        onChange={(e) => {
          const { value } = e.target;
          setHasUserInteracted(true);
          if (setSearchItem) setSearchItem(value);
          if (multiSetSearchItem)
            multiSetSearchItem(index ?? 0, "search_value", value);
          setOpen(!!value);
        }}
        value={searchItem}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
      />

      {open && (
        <div className="border-color absolute top-full left-1/2 z-100 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white dark:bg-zinc-950 text-sm shadow-xl">
          {isLoading && !data && (
            <div className="flex items-center justify-center py-5">
              <Loader2 className="text-foreground/60 animate-spin" />
            </div>
          )}
          {data && data.length === 0 && (
            <div className="p-4 text-gray-800 dark:text-white text-center flex flex-col items-center">
              No results found
              {createClient && (
                <Button
                  size={"sm"}
                  type="button"
                  variant={"outline"}
                  className="mt-2"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    navigate(
                      `/services/rent-safe/?${
                        clientType === "individual" || clientType === "tenant"
                          ? "addIndividual"
                          : "addCompany"
                      }=true&&next=${path.pathname}`
                    );
                    setOpen(false);
                  }}
                >
                  Create{" "}
                  {clientType === "individual" ? "Individual" : "Company"}
                </Button>
              )}
            </div>
          )}
          {Array.isArray(data) &&
            data.map((item: any) => {
              const clientName =
                "first_name" in item
                  ? `${item.identification_number} - ${item.first_name} ${item.last_name}`
                  : "company" in item
                  ? `${item.company.registration_number} - ${item.company.registration_name}`
                  : item.full_name;

              const identificationNumber =
                  "first_name" in item
                  ? item.identification_number
                  : "company" in item 
                  ? item.company.registration_number
                  : ""

              if (index === 0 && setPrimaryTenantAddress && "primary_address" in item)
                setPrimaryTenantAddress(item.primary_address);

              return (
                <button
                  key={item.id}
                  type="button"
                  className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (onSelectValue) onSelectValue(item, index);
                    if (setSearchItem){
                      setSearchItem(()=>{
                        if (clientType === "individual"){ 
                          return displayValue === "ID" ? identificationNumber : clientName
                        }
                        return clientName
                      });
                      setHasUserInteracted(false)
                    }
                    
                    if (multiSetSearchItem)
                      multiSetSearchItem(
                        index ?? 0,
                        "search_value",
                        identificationNumber
                      );
                    setOpen(false);
                  }}
                >
                  {clientName}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default AutoCompleteClient;
