import type { IndividualPayload } from "@/interfaces/form-payloads";
import React from "react";
import { extractAddresses, extractPhones, formatDateToPythonSLiking, getFormDataObject, validateZimNationalId } from "@/lib/utils";
import type { IndividualMaritalStatus } from "@/types";
import useCreateIndividual from "../apiHooks/useCreateIndividual";
import { toast } from "sonner";
import { useIndividualContextDialog } from "@/contexts/IndividualDialogueContext";

export default function useIndividualForm() {
   const {open, setOpen} = useIndividualContextDialog()
   const { isPending, createIndividual } = useCreateIndividual();

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const data = getFormDataObject(event);

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

   return {isPending, handleSubmit,open , setOpen};
}
