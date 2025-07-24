import React from "react";
import CompanyPaymentStatusReport from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusReport";
import { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import useMinimalCompaniesList from "@/hooks/apiHooks/useMinimalCompaniesList";

export default function useCompanyPaymentStatusTab() {
   const { companies, isLoading } = useMinimalCompaniesList();

   const rows: BaseTableRow[] =
      companies?.map((cell) => ({
         ...cell,
         select: <CompanyPaymentStatusReport companyId={cell.id} />,
      })) || [];

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

   return {
      rows,
      headers,
      isLoading,
      handleSearch,
   };
}
