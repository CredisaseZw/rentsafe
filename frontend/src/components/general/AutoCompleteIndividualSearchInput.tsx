import useAutoCompleteIndividualSearchInput from "@/hooks/components/useAutoCompleteIndividualSearchInput";
import { Input } from "../ui/input";
import { Loader2, X } from "lucide-react";
import type { IndividualMinimal } from "@/interfaces";

export default function AutoCompleteIndividualSearchInput({ number }: { number: number }) {
   const {
      open,
      query,
      isLoading,
      inputRef,
      individuals,
      selectedIndividual,
      setOpen,
      setQuery,
      setSelectedIndividual,
   } = useAutoCompleteIndividualSearchInput();

   const clearSelection = () => {
      setSelectedIndividual(null);
      setQuery("");
      inputRef.current?.focus();
   };

   return (
      <div className="relative w-full">
         <input type="hidden" name={"individual" + number} value={selectedIndividual?.id || ""} readOnly />

         <div className="relative">
            <Input
               type="text"
               placeholder="Search individuals..."
               ref={inputRef}
               onFocus={() => {
                  if (!query && selectedIndividual) {
                     setOpen(false);
                  }
               }}
               onBlur={() => {
                  setTimeout(() => {
                     setOpen(false);
                  }, 100);
               }}
               onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length) setOpen(true);
                  else setOpen(false);
               }}
               value={selectedIndividual ? `${selectedIndividual.first_name} ${selectedIndividual.last_name}` : query}
            />

            {selectedIndividual && (
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
            <div className="border-color absolute top-full left-1/2 z-50 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col items-center justify-center overflow-y-auto rounded-sm border bg-white dark:bg-zinc-950 text-sm shadow-xl">
               {isLoading ? (
                  <div className="flex items-center justify-center py-5">
                     <Loader2 className="text-foreground/60 animate-spin" />
                  </div>
               ) : !individuals.results?.length ? (
                  <div className="p-2 text-gray-800 dark:text-white">No results found</div>
               ) : (
                  individuals.results?.map((individual: IndividualMinimal) => (
                     <button
                        key={individual.id}
                        type="button"
                        className="border-color w-full border-b bg-white px-2 py-3 last:border-b-0 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-950"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                           setSelectedIndividual(individual);
                           setOpen(false);
                        }}
                     >
                        {individual.first_name} {individual.last_name}
                     </button>
                  ))
               )}
            </div>
         )}
      </div>
   );
}
