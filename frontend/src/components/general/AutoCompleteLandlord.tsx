import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import useSearchLandlord from "@/hooks/apiHooks/useSearchLandlord";
import { Loader2 } from "lucide-react";
import type { CompanyMinimal, IndividualMinimal } from "@/interfaces";
import type { AddPropertyForm } from "@/types";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  landlordIdentifier: string;
  addPropertyForm: AddPropertyForm;
  setAddPropertyForm: Dispatch<SetStateAction<AddPropertyForm>>;
}

function AutoCompleteLandlord({ landlordIdentifier, addPropertyForm, setAddPropertyForm }: Props) {
  const [searchItem, setSearchItem] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchItem);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchItem), 300);
    return () => clearTimeout(handler);
  }, [searchItem]);

  const { data, isLoading } = useSearchLandlord(
    addPropertyForm.landlord_type,
    debouncedSearch,
    !!debouncedSearch 
  );

  const handleSelect = (id: string, name: string) => {
    setAddPropertyForm((prev) => ({
      ...prev,
      landlord_id: id,
      landlord_name: name,
    }));
    setSearchItem(id); 
    setOpen(false);
  };

  return (
    <div className="form-group relative">
      <label className="required">{landlordIdentifier}</label>
      <Input
        type="text"
        required
        onChange={(e) => {
          const value = e.target.value;
          setSearchItem(value);
          setOpen(!!value);
        }}
        value={searchItem}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        name="landlord_id"
      />

      {open && (
        <div className="border-color absolute top-full left-1/2 z-50 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white text-sm shadow-xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-5">
              <Loader2 className="text-foreground/60 animate-spin" />
            </div>
          ) : !data?.length ? (
            <div className="p-2 text-gray-800">No results found</div>
          ) : (
            data.map((item: IndividualMinimal | CompanyMinimal) => {
              if ("first_name" in item) {
                const fullName = `${item.first_name} ${item.last_name}`;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      handleSelect(item.identification_number,  fullName)
                    }
                  >
                    {fullName}
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  className="border-color w-full border-b px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    handleSelect(item.registration_number, item.registration_name)
                  }
                >
                  {item.registration_name}
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
