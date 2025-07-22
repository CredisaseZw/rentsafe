import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BaseTable from "@/components/general/BaseTable";
import CompanyForm from "./CompanyForm";
import SectionHeading from "@/components/general/SectionHeading";
import useCompanyPaymentStatusTab from "@/hooks/pages/dashboard/useCompanyPaymentStatusTab";

export default function CompanyPaymentStatusTab() {
   const { rows, headers, isLoading, handleSearch } = useCompanyPaymentStatusTab();

   return (
      <div>
         <SectionHeading>Search Company</SectionHeading>
         <BaseTable
            headers={headers}
            rows={rows}
            isLoading={isLoading}
            tableActions={
               <div className="flex items-center justify-between gap-2">
                  <form
                     onSubmit={handleSearch}
                     className="bg-background border-foreground/40 flex items-center rounded-sm border"
                  >
                     <Search size={20} className="mx-2" />
                     <Input
                        placeholder="Search by name or reg..."
                        name="q"
                        minLength={2}
                        required
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 focus-visible:ring-0"
                     />
                  </form>
                  <CompanyForm />
               </div>
            }
         />
      </div>
   );
}
