import React from "react";
import CompanyPaymentStatusReport from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusReport";
import { sampleCompanyReport, sampleCompanyRows } from "@/lib/sampleData";
import { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";

export default function useCompanyPaymentStatusTab() {
   const rows: BaseTableRow[] = sampleCompanyRows.map((cell) => ({
      ...cell,
      select: <CompanyPaymentStatusReport report={sampleCompanyReport} />,
   }));

   const headers: BaseTableColumn[] = [
      { name: "registeredName", displayName: "Registered Name" },
      { name: "registrationNumber", displayName: "Registration Number" },
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
      handleSearch,
   };
}
