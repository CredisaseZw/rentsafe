import React from "react";
import CompanyPaymentStatusReport from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusReport";
import { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import useCompanyBranches from "@/hooks/apiHooks/useCompanyBranches";
import { useNavigate } from "react-router";
import BranchForm from "@/components/routes/rent-safe/dashboard/BranchForm";
import type { PaginationData } from "@/interfaces";

export default function useCompanyPaymentStatusTab() {
   const navigate = useNavigate();
   const searchRef = React.useRef<HTMLInputElement>(null);
   const { data, isLoading, searchQuery } = useCompanyBranches();

   const rows: BaseTableRow[] =
      data?.results?.map((cell) => {
         console.log(cell);
         return {
            registration_name: cell.branch_name || "",
            registration_number: cell.company?.registration_number || "",
            id: cell.id,
            select: (
               <div className="flex items-center gap-2">
                  <BranchForm
                     companyID={cell.company.id}
                     companyName={cell?.company.registration_name + " - " + cell?.company.registration_number}
                  />
                  <CompanyPaymentStatusReport branchID={cell.id} />
               </div>
            ),
         };
      }) || [];

   const headers: BaseTableColumn[] = [
      { name: "registration_name", displayName: "Registered Name" },
      { name: "registration_number", displayName: "Registration Number" },
      { name: "select", displayName: "", colGroupclassName: "w-[1%]" },
   ];

   function handleSearch(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const q = formData.get("company_q") as string;
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("company_q", q);
      navigate({ search: "?" + searchParams.toString() });
   }

   function clearSearch() {
      if (searchRef.current) searchRef.current.value = "";
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("company_q");
      navigate({ search: "?" + searchParams.toString() });
   }

   const paginationData = data as PaginationData;

   return {
      rows,
      headers,
      searchRef,
      isLoading,
      searchQuery,
      paginationData,
      clearSearch,
      handleSearch,
   };
}
