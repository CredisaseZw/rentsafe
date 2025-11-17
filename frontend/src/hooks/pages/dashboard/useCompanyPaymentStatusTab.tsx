import React, { useEffect, useState } from "react";
import CompanyPaymentStatusReport from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusReport";
import { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import useCompanyBranches from "@/hooks/apiHooks/useCompanyBranches";
import { useNavigate, useSearchParams } from "react-router";
import type { PaginationData } from "@/interfaces";
import ExpandableText from "@/components/general/ExpandableText";

export default function useCompanyPaymentStatusTab() {
   const navigate = useNavigate();
   const searchRef = React.useRef<HTMLInputElement>(null);
   const [params] = useSearchParams();
   const [open , setOpen] = useState(false);

   const { data, isLoading, searchQuery } = useCompanyBranches();

   useEffect(()=>{
      if (params.get("addCompany")) setOpen(true); 
   }, [])

   const rows: BaseTableRow[] =
      data && 
      typeof data === "object" &&
      "results" in data &&
      data.results?.map((cell) => {
         return {
            registration_name: `${cell.branch_name || ""} - ${cell.company?.registration_number || ""}`,
            trading_name: cell.company.trading_name ?? "-",
            address :cell.address_summary ?  <ExpandableText text= { cell.address_summary }/> : <>-</>,
            id: cell.id,
            select: (
               <div className="flex items-center gap-2">
                  <CompanyPaymentStatusReport branchID={cell.id} />
               </div>
            ),
         };
      }) || [];

   const headers: BaseTableColumn[] = [
      { name: "registration_name", displayName: "Registered Name" },
      { name: "trading_name", displayName: "Trading Name" },
      { name: "address", displayName: "Address" },
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
      open,
      rows,
      headers,
      searchRef,
      isLoading,
      searchQuery,
      paginationData,
      clearSearch,
      handleSearch,
      setOpen
   };
}
