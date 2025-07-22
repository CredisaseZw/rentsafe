import React from "react";
import CompanyPaymentStatusReport from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusReport";
import { sampleCompanyReport } from "@/lib/sampleData";
import { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import useMinimalCompaniesList from "@/hooks/apiHooks/useMinimalCompaniesList";

export default function useCompanyPaymentStatusTab() {
   const { companies, isLoading } = useMinimalCompaniesList();

   const rows: BaseTableRow[] =
      companies?.map((cell) => ({
         ...cell,
         select: <CompanyPaymentStatusReport report={sampleCompanyReport} />,
      })) || [];

   const headers: BaseTableColumn[] = [
      { name: "registration_name", displayName: "Registered Name" },
      { name: "registration_number", displayName: "Registration Number" },
      { name: "select", displayName: "", colGroupclassName: "w-[1%]" },
   ];

   function handleSearch(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const query = formData.get("q") as string;
      console.log(`Searching for: ${query}`);
   }

   return {
      rows,
      headers,
      isLoading,
      handleSearch,
   };
}
