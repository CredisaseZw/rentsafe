import React from "react";
import IndividualPaymentStatusReport from "@/components/routes/rent-safe/dashboard/IndividualPaymentStatusReport";
import type { BaseTableColumn, BaseTableRow } from "@/components/general/BaseTable";
import { sampleIndividualReport, sampleIndividualRows } from "@/lib/sampleData";

export default function useIndividualPaymentStatusTab() {
   const rows: BaseTableRow[] = sampleIndividualRows.map((cell) => ({
      ...cell,
      select: <IndividualPaymentStatusReport report={sampleIndividualReport} />,
   }));

   const headers: BaseTableColumn[] = [
      { name: "forenames", displayName: "Forenames" },
      { name: "surname", displayName: "Surname" },
      { name: "identificationNumber", displayName: "Identification Number" },
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
