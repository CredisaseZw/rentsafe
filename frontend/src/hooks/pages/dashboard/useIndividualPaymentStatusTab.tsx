import React, { useEffect, useState } from "react";
import IndividualPaymentStatusReport from "@/components/routes/rent-safe/dashboard/IndividualPaymentStatusReport";
import type { BaseTableColumn, BaseTableRow } from "@/components/general/BaseTable";
import { useNavigate, useSearchParams } from "react-router";
import useMinimalIndividualsList from "@/hooks/apiHooks/useMinimalIndividualsList";
import type { IndividualMinimal, PaginationData } from "@/interfaces";

export default function useIndividualPaymentStatusTab() {
   const navigate = useNavigate();
   const searchRef = React.useRef<HTMLInputElement>(null);
   const [open, setOpen] = useState(false)
   const { data, isLoading, searchQuery } = useMinimalIndividualsList();
   const [params] = useSearchParams()

   useEffect(()=>{
      if (params.get("addIndividual")) setOpen(true); 
   }, [])

   const rows: BaseTableRow[] = (() => {
      const individuals = Array.isArray(data) ? data : data?.results;

      return (individuals as Omit<IndividualMinimal, "contact_details">[])?.map((cell) => {
         const { addresses, primary_address, account_data, ...rest } = cell;
         return {
            ...rest,
            select: <IndividualPaymentStatusReport individualId={cell.id} />,
         };
      }) || [];
   })();
   
   const headers: BaseTableColumn[] = [
      { name: "first_name", displayName: "First Name" },
      { name: "last_name", displayName: "Last Name" },
      { name: "identification_number", displayName: "ID Number" },
      { name: "select", displayName: "", colGroupclassName: "w-[1%]" },
   ];

   function handleSearch(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const q = formData.get("individual_q") as string;
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("individual_q", q);
      navigate({ search: "?" + searchParams.toString() });
   }

   function clearSearch() {
      if (searchRef.current) searchRef.current.value = "";
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("individual_q");
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
