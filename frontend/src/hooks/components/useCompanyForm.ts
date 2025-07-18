import type { CompanyPayload } from "@/interfaces/form-payloads";
import type React from "react";
import useCreateCompany from "../apiHooks/useCreateCompany";
import { formatDateToPythonSLiking, toIntElseUndefined } from "@/lib/utils";

export default function useCompanyForm() {
   const { isPending, createCompany } = useCreateCompany();

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
            trading_status: data.trading_status as string,
            mobile_phone: data.mobile_phone as string,
            landline_phone: data.landline_phone as string,
            tin_number: data.tin_number as string,
            vat_number: data.vat_number as string,
            number_of_employees: data.number_of_employees ? Number(data.numberOfEmployees) : undefined,
            website: data.website as string,
            trend: data.trend as string,
            twitter: data.twitter as string,
            facebook: data.facebook as string,
            instagram: data.instagram as string,
            linkedin: data.linkedin as string,
            operations: data.operations as string,
            risk_class: data.risk_class as string,
            account_number: data.account_number as string,
            is_under_judicial: data.is_under_judicial as "YES" | "NO",
            is_suspended: data.is_suspended ? true : false,
         },
         trading_name: data.trading_name as string,
         legal_status: data.legal_status as string,
         date_of_incorporation: data.date_of_incorporation as string,
         industry: data.industry as string,
         notes: data.notes ? [{ content: data.notes as string }] : [],
         documents: undefined,
         addresses: undefined,
      };

      const address = {
         street_address: data.street_address as string,
         city_id: toIntElseUndefined(data.city_id as string),
         address_type: data.address_type as "physical" | "postal" | "billing" | "work" | "other",
         is_primary: !!data.is_primary,
         postal_code: data.postal_code as string,
         suburb_id: toIntElseUndefined(data.suburb_id as string),
         province_id: toIntElseUndefined(data.province_id as string),
         country_id: toIntElseUndefined(data.country_id as string),
      };

      if (typeof address.city_id === "number") {
         companyPayload.addresses = [{ ...address, city_id: address.city_id }];
      }

      if (companyPayload.date_of_incorporation) {
         companyPayload.date_of_incorporation = formatDateToPythonSLiking(companyPayload.date_of_incorporation);
      } else companyPayload.date_of_incorporation = undefined;

      if (companyPayload.profile.registration_date) {
         companyPayload.profile.registration_date = formatDateToPythonSLiking(companyPayload.profile.registration_date);
      } else companyPayload.profile.registration_date = undefined;

      console.log({ companyPayload });
      createCompany(companyPayload);
   }

   return { isPending, handleSubmit };
}
