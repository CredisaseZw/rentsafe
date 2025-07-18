import type { CompanyPayload } from "@/interfaces/form-payloads";
import type React from "react";
import useCreateCompany from "../apiHooks/useCreateCompany";

export default function useCompanyForm() {
   const { isPending, createCompany } = useCreateCompany();

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const companyPayload: CompanyPayload = {
         // required
         registration_number: data.registrationNumber as string,
         registration_name: data.registrationName as string,
         profile: {
            email: data.email as string,
            // optional
            registration_date: data.registrationDate as string,
            trading_status: data.tradingStatus as string,
            mobile_phone: data.mobilePhone as string,
            landline_phone: data.landlinePhone as string,
            tin_number: data.tinNumber as string,
            vat_number: data.vatNumber as string,
            number_of_employees: data.numberOfEmployees ? Number(data.numberOfEmployees) : undefined,
            website: data.website as string,
            trend: data.trend as string,
            twitter: data.twitter as string,
            facebook: data.facebook as string,
            instagram: data.instagram as string,
            linkedin: data.linkedin as string,
            operations: data.operations as string,
            risk_class: data.riskClass as string,
            account_number: data.accountNumber as string,
            is_under_judicial: data.isUnderJudicial as "YES" | "NO",
            is_suspended: data.isSuspended ? true : false,
         },
         trading_name: data.tradingName as string,
         legal_status: data.legalStatus as string,
         date_of_incorporation: data.dateOfIncorporation as string,
         industry: data.industry as string,
         notes: data.notes ? [{ content: data.notes as string }] : [],
         documents: undefined,
         addresses: undefined,
      };

      console.log("submitting company data:", companyPayload);
      createCompany(companyPayload);
   }

   return { isPending, handleSubmit };
}
