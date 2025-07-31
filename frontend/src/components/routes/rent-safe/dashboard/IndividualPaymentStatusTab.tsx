import BaseTable from "@/components/general/BaseTable";
import SectionHeading from "@/components/general/SectionHeading";
import IndividualForm from "./IndividualForm";
import useIndividualPaymentStatusTab from "@/hooks/pages/dashboard/useIndividualPaymentStatusTab";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
                     className="border-foreground/40 flex items-center rounded-sm border bg-transparent"
                  >
                     <Button onClick={clearSearch} type="button" variant="ghost" size="sm">
                        <X />
                     </Button>
                     <Input
                        ref={searchRef}
                        placeholder="Search by name or ID..."
                        name="individual_q"
                        required
                        defaultValue={searchQuery}
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 py-2 focus-visible:ring-0"
                     />
                     <Button type="submit" variant="ghost" size="sm">
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
