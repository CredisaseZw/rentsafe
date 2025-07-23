import BaseTable from "@/components/general/BaseTable";
import SectionHeading from "@/components/general/SectionHeading";
import IndividualForm from "./IndividualForm";
import useIndividualPaymentStatusTab from "@/hooks/pages/dashboard/useIndividualPaymentStatusTab";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IndividualPaymentStatusTab() {
   const { rows, headers, searchRef, clearSearch, handleSearch } = useIndividualPaymentStatusTab();

   return (
      <div>
         <SectionHeading>Search Individual</SectionHeading>
         <BaseTable
            headers={headers}
            rows={rows}
            tableActions={
               <div className="flex items-center justify-between gap-2">
                  <form
                     onSubmit={handleSearch}
                     className="bg-background border-foreground/40 flex items-center rounded-sm border"
                  >
                     <Button onClick={clearSearch} type="button" variant="ghost" size="xs">
                        <X />
                     </Button>
                     <Input
                        ref={searchRef}
                        placeholder="Search by name or ID..."
                        name="individual_q"
                        required
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 focus-visible:ring-0"
                     />
                     <Button type="submit" variant="ghost" size="xs">
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
