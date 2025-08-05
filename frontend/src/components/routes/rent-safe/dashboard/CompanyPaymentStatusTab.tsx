import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import BaseTable from "@/components/general/BaseTable";
import CompanyForm from "./CompanyForm";
import SectionHeading from "@/components/general/SectionHeading";
import useCompanyPaymentStatusTab from "@/hooks/pages/dashboard/useCompanyPaymentStatusTab";
import { Button } from "@/components/ui/button";
import BranchForm from "./BranchForm";

export default function CompanyPaymentStatusTab() {
   const { paginationData, rows, headers, isLoading, searchRef, searchQuery, clearSearch, handleSearch } =
      useCompanyPaymentStatusTab();

   return (
      <div>
         <SectionHeading>Search Company</SectionHeading>
         <BaseTable
            headers={headers}
            rows={rows}
            paginationData={paginationData}
            paginationName="company_page"
            isLoading={isLoading}
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
                        placeholder="Search by name or reg..."
                        name="company_q"
                        required
                        defaultValue={searchQuery}
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 py-2 focus-visible:ring-0"
                     />
                     <Button type="submit" variant="ghost" size="sm">
                        <Search />
                     </Button>
                  </form>

                  <div className="flex flex-row gap-3">
                     <BranchForm />
                     <CompanyForm />
                  </div>
               </div>
            }
         />
      </div>
   );
}
