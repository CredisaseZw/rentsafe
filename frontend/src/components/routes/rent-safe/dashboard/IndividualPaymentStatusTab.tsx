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
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
               <form
                  onSubmit={handleSearch}
                  className="flex w-full max-w-full sm:max-w-md items-center rounded-sm border border-color bg-transparent"
               >
                  <Button
                     onClick={clearSearch}
                     type="button"
                     variant="ghost"
                     size="sm"
                     className="text-gray-400 shrink-0"
                  >
                     <X />
                  </Button>

                  <input
                     ref={searchRef}
                     placeholder="Search by name or ID..."
                     name="individual_q"
                     required
                     defaultValue={searchQuery}
                     className="flex-1 min-w-0 text-sm rounded-none border-none bg-transparent px-3 py-2 text-gray-600 placeholder-gray-400 outline-none focus:outline-none dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
                  />

                  <Button
                     type="submit"
                     variant="ghost"
                     size="sm"
                     className="text-gray-400 shrink-0"
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
