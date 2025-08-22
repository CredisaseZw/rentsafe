import BaseTable from "@/components/general/BaseTable";
import SectionHeading from "@/components/general/SectionHeading";
import IndividualForm from "./IndividualForm";
import useIndividualPaymentStatusTab from "@/hooks/pages/dashboard/useIndividualPaymentStatusTab";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IndividualPaymentStatusTab() {
   const { rows, headers, isLoading, searchRef, searchQuery, paginationData, clearSearch, handleSearch } =
      useIndividualPaymentStatusTab();

   return (
      <div>
         <SectionHeading>Search Individual</SectionHeading>
         <BaseTable
            headers={headers}
            rows={rows}
            isLoading={isLoading}
            paginationData={paginationData}
            paginationName="individual_page"
            tableActions={
               <div className="flex items-center justify-between gap-2">
                  <form
                     onSubmit={handleSearch}
                     className="border-color flex items-center rounded-sm border bg-transparent"
                  >
                     <Button 
                        onClick={clearSearch}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-400"
                     
                     >
                        <X />
                     </Button>
                     <input
                        ref={searchRef}
                        placeholder="Search by name or ID..."
                        name="individual_q"
                        required
                        defaultValue={searchQuery}
                        className="h-fit max-w-[400px] text-sm  rounded-none border-none bg-transparent px-3 py-3 text-gray-600 placeholder-gray-400 ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 active:ring-0 active:outline-none dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
                     />
                     <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-gray-400"
                     >
                        <Search />
                     </Button>
                  </form>

                  <IndividualForm />
               </div>
            }
         />
      </div>
   );
}
