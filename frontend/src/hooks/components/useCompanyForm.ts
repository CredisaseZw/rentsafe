import type { CompanyPayload } from "@/interfaces/form-payloads";
import React from "react";
import useCreateCompany from "../apiHooks/useCreateCompany";
import { extractAddresses, formatDateToPythonSLiking } from "@/lib/utils";
import type { CompanyLegalStatus } from "@/types";

export default function useCompanyForm() {
   const [showForm, setShowForm] = React.useState(false);
   const { isPending, createCompany } = useCreateCompany(() => setShowForm(false));

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const companyPayload: CompanyPayload = {
         // required
         registration_number: data.registration_number as string,
         registration_name: data.registration_name as string,
         profile: {
            email: data.email as string,
            // optional
            registration_date: data.registration_date as string,
            mobile_phone: data.mobile_phone as string,
            landline_phone: data.landline_phone as string,
            tin_number: data.tin_number as string,
            vat_number: data.vat_number as string,
            number_of_employees: data.number_of_employees ? Number(data.numberOfEmployees) : undefined,
            website: data.website as string,
            twitter: data.twitter as string,
            facebook: data.facebook as string,
            instagram: data.instagram as string,
            linkedin: data.linkedin as string,
            operations: data.operations as string,
            account_number: data.account_number as string,
         },
         trading_name: data.trading_name as string,
         legal_status: data.legal_status as CompanyLegalStatus,
         date_of_incorporation: data.date_of_incorporation as string,
         industry: data.industry as string,
         notes: data.notes ? [{ content: data.notes as string }] : [],
         documents: undefined,
         addresses: extractAddresses(data),
      };

      if (companyPayload.date_of_incorporation) {
         companyPayload.date_of_incorporation = formatDateToPythonSLiking(companyPayload.date_of_incorporation);
      } else companyPayload.date_of_incorporation = undefined;

      if (companyPayload.profile.registration_date) {
         companyPayload.profile.registration_date = formatDateToPythonSLiking(companyPayload.profile.registration_date);
      } else companyPayload.profile.registration_date = undefined;

      console.log({ companyPayload });
      createCompany(companyPayload);
   }

   return { showForm, isPending, handleSubmit, setShowForm };
}
