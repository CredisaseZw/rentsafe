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
                     className="border-foreground/40 flex items-center rounded-sm border bg-transparent"
                  >
                     <Search size={20} className="mx-2" />
                     <Input
                        placeholder="Search by name or reg..."
                        name="q"
                        minLength={2}
                        required
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-3 py-3 text-gray-900 placeholder-gray-400 ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 active:ring-0 active:outline-none dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
                     />
                  </form>
                  <CompanyForm />
               </div>
            }
         />
      </div>
   );
}
