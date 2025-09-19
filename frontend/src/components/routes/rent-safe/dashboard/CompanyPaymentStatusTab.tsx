import { Plus, Search, X } from "lucide-react";
import BaseTable from "@/components/general/BaseTable";
import CompanyForm from "./CompanyForm";
import SectionHeading from "@/components/general/SectionHeading";
import useCompanyPaymentStatusTab from "@/hooks/pages/dashboard/useCompanyPaymentStatusTab";
import { Button } from "@/components/ui/button";
import BranchForm from "./BranchForm";
import useCompanyForm from "@/hooks/components/useCompanyForm";
export default function CompanyPaymentStatusTab() {
  const {
    paginationData,
    rows,
    headers,
    isLoading,
    searchRef,
    searchQuery,
    clearSearch,
    handleSearch,
  } = useCompanyPaymentStatusTab();

  const { showForm, setShowForm } = useCompanyForm();

  return (
    <div>
      <SectionHeading>Search Company</SectionHeading>

      <BaseTable
        headers={headers}
        rows={rows}
        noDataNode={
          <div className="mt-2 flex flex-row items-center justify-center">
            <Button onClick={() => setShowForm(true)} variant={"outline"}>
               Add New Company 
            </Button>
          </div>
        }
        paginationData={paginationData}
        paginationName="company_page"
        isLoading={isLoading}
        tableActions={
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
            <form
              onSubmit={handleSearch}
              className="border-color flex w-full sm:w-auto items-center rounded-sm border bg-transparent"
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
                placeholder="Search by name or reg..."
                name="company_q"
                required
                defaultValue={searchQuery}
                className="flex-1 min-w-0 w-full sm:max-w-[400px] text-sm rounded-none border-none bg-transparent px-3 py-3 text-gray-600 placeholder-gray-400 ring-0 outline-none focus:ring-0 focus:outline-none dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
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

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between lg:justify-end">
              <BranchForm setCompanyFormOpen={setShowForm} />
              <Button onClick={() => setShowForm(true)} >
                  Add New Company <Plus size={18} />
              </Button>
            </div>
          </div>
        }
      />

      <CompanyForm open={showForm} setShowForm={setShowForm} />
    </div>
  );
}
