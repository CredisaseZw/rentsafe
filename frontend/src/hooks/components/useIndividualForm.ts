import type { IndividualPayload } from "@/interfaces/form-payloads";
import React, { useEffect } from "react";
import { extractAddresses, extractPhones, formatDateToPythonSLiking, validateZimNationalId } from "@/lib/utils";
import type { IndividualMaritalStatus } from "@/types";
import useCreateIndividual from "../apiHooks/useCreateIndividual";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";

export default function useIndividualForm() {
   const [showForm, setShowForm] = React.useState(false);
   const [params] = useSearchParams();
   const router = useNavigate();
   const { isPending, createIndividual } = useCreateIndividual(successCallback);

   useEffect(()=>{
      if (params.get("addIndividual")) setShowForm(true); 
   }, [])

   function successCallback(){
      const nextParam = params.get("next");
      if (params.get("addIndividual") && nextParam) {
         router(nextParam.trim());
      }
      setShowForm(false)
   }

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());


      const individualPayload: IndividualPayload = {
         first_name: data.firstName as string,
         last_name: data.lastName as string,
         date_of_birth: data.dateOfBirth as string,
         gender: data.gender as string,
         identification_type: data.identificationType as string,
         identification_number: data.identificationNumber as string,
         marital_status: data.maritalStatus as IndividualMaritalStatus,
         email: data.email as string,
         contact_details: extractPhones(data),
         next_of_kin: undefined,
         documents: undefined,
         addresses: extractAddresses(data),
      };

      if (
         individualPayload.employment_details &&
         (!individualPayload.employment_details[0].employer_name ||
            !individualPayload.employment_details[0].job_title ||
            !individualPayload.employment_details[0].start_date)
      ) {
         delete individualPayload.employment_details;
      }

      if (individualPayload.identification_type === "national_id") {
         const isValid = validateZimNationalId(individualPayload.identification_number);
         if (!isValid) {
            toast.error(`Invalid Zimbabwean National ID '${individualPayload.identification_number}'`, {
               description: "Use correct format, without spaces or dashes.",
            });
            return;
         }
      }

      if (individualPayload?.date_of_birth?.length !== 0) {
         individualPayload.date_of_birth = formatDateToPythonSLiking(individualPayload.date_of_birth ?? "");
      } else{
        delete individualPayload.date_of_birth
      }

      for (const employment of individualPayload.employment_details || []) {
         if (employment.start_date) {
            employment.start_date = formatDateToPythonSLiking(employment.start_date);
         }
         if (employment.end_date) {
            employment.end_date = formatDateToPythonSLiking(employment.end_date);
         }
      }

      if (individualPayload.addresses) {
         individualPayload.addresses = individualPayload.addresses.map(({ is_primary, ...addr }) => ({
            ...addr,
            postal_code: addr.postal_code ? addr.postal_code.toString() : undefined
         }));
      }

      createIndividual(individualPayload);
   }

   return { showForm, isPending, handleSubmit, setShowForm };
}
