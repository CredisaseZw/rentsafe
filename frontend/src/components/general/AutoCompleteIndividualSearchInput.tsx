import useAutoCompleteIndividualSearchInput from "@/hooks/components/useAutoCompleteIndividualSearchInput";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";

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

   return (
      <div className="relative w-full">
         <input type="hidden" name={"individual" + number} value={selectedIndividual?.id || ""} readOnly />

         <Input
            type="text"
            placeholder="Search individuals..."
            ref={inputRef}
            onFocus={() => {
               if (selectedIndividual) {
                  setSelectedIndividual(null);
                  setQuery("");
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
            value={
               query
                  ? query
                  : selectedIndividual
                    ? selectedIndividual?.first_name + " " + selectedIndividual?.last_name
                    : ""
            }
         />

         {open && (
            <div className="border-color absolute top-full left-1/2 mt-1 flex max-h-[200px] min-h-[50px] w-full -translate-x-1/2 flex-col items-center justify-center overflow-y-auto rounded-sm border bg-white text-sm shadow-xl">
               {isLoading ? (
                  <div className="flex items-center justify-center">
                     <Loader2 className="text-foreground/60 animate-spin" />
                  </div>
               ) : !individuals?.length ? (
                  <div className="p-2 text-gray-800">No results found</div>
               ) : (
                  individuals?.map((individual) => (
                     <div
                        key={individual.id}
                        className="border-color w-full cursor-pointer border-b p-1.5 last:border-b-0 hover:bg-gray-100"
                        onClick={() => {
                           setSelectedIndividual(individual);
                           setQuery("");
                           setOpen(false);
                        }}
                     >
                        {individual.first_name} {individual.last_name}
                     </div>
                  ))
               )}
            </div>
         )}
      </div>
   );
}
