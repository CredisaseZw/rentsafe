import BaseTable from "@/components/general/BaseTable";
import SectionHeading from "@/components/general/SectionHeading";
import IndividualForm from "./IndividualForm";
import useIndividualPaymentStatusTab from "@/hooks/pages/dashboard/useIndividualPaymentStatusTab";
import { UserSearch } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function IndividualPaymentStatusTab() {
   const { rows, headers, handleSearch } = useIndividualPaymentStatusTab();

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
                     <UserSearch size={20} className="mx-2" />
                     <Input
                        placeholder="Search by name or ID..."
                        name="q"
                        minLength={2}
                        required
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 focus-visible:ring-0"
                     />
                  </form>
                  <IndividualForm />
               </div>
            }
         />
      </div>
   );
}
