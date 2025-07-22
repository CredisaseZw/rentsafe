import React from "react";
import CompanyPaymentStatusReport from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusReport";
import { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import useMinimalCompaniesList from "@/hooks/apiHooks/useMinimalCompaniesList";
import { useNavigate } from "react-router";

export default function useCompanyPaymentStatusTab() {
   const navigate = useNavigate();
   const { companies, isLoading } = useMinimalCompaniesList();

   // @ts-expect-error ReactNode types will never be rendered
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
      const q = formData.get("q") as string;
      navigate({ search: "?q=" + q });
   }

   return {
      rows,
      headers,
      isLoading: isLoading,
      handleSearch,
   };
}
