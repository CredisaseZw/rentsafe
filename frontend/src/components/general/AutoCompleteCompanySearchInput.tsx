import { Input } from "../ui/input";
import { Loader2, X } from "lucide-react";
import type { CompanyMinimal } from "@/interfaces";
import { SearchCompany } from "@/hooks/apiHooks/useSearchCompanies";
import { useState, useRef, useEffect } from "react";

export default function AutoCompleteCompanySearchInput({ elementName }: { elementName: string }) {
   const inputRef = useRef<HTMLInputElement>(null);
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState("");
   const [selectedCompany, setSelectedCompany] = useState<null | CompanyMinimal>(null);

   // ✅ Run search hook when query changes
   const { companies, isLoading } = SearchCompany(query);

   useEffect(() => {
      if (query.length > 0) {
         setOpen(true);
      } else {
         setOpen(false);
      }
   }, [query]);

   const clearSelection = () => {
      setSelectedCompany(null);
      setQuery("");
      inputRef.current?.focus();
   };

   return (
      <div className="relative w-full">
         <input type="hidden" name={elementName} value={selectedCompany?.id || ""} readOnly />

         <div className="relative">
            <Input
               type="text"
               placeholder="Search companies..."
               ref={inputRef}
               onFocus={() => {
                  if (!query && selectedCompany) setOpen(false);
               }}
               onBlur={() => {
                  setTimeout(() => setOpen(false), 100);
               }}
               onChange={(e) => setQuery(e.target.value)}
               value={
                  selectedCompany
                     ? `${selectedCompany.registration_name} - ${selectedCompany.registration_number}`
                     : query
               }
            />

            {selectedCompany && (
               <button
                  type="button"
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearSelection}
               >
                  <X size={16} />
               </button>
            )}
         </div>

         {open && (
            <div className="border-color absolute top-full left-1/2 z-50 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-sm border bg-white text-sm shadow-xl">
               {isLoading ? (
                  <div className="flex items-center justify-center py-5">
                     <Loader2 className="text-foreground/60 animate-spin" />
                  </div>
               ) : !companies?.results?.length ? (
                  <div className="p-2 text-gray-800">No results found</div>
               ) : (
                  companies.results.map((result) => (
                     <button
                        key={result.id}
                        type="button"
                        className="border-color w-full border-b bg-white px-2 py-3 last:border-b-0 hover:bg-gray-200"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                           setSelectedCompany(result);
                           setOpen(false);
                        }}
                     >
                        {result.registration_name} - {result.registration_number}
                     </button>
                  ))
               )}
            </div>
         )}
      </div>
   );
}
