import type { IndividualPayload } from "@/interfaces/form-payloads";
import React from "react";
import { extractAddresses, formatDateToPythonSLiking, validateZimNationalId } from "@/lib/utils";
import type { IndividualMaritalStatus } from "@/types";
import useCreateIndividual from "../apiHooks/useCreateIndividual";
import { toast } from "sonner";

export default function useIndividualForm() {
   const [showForm, setShowForm] = React.useState(false);
   const { isPending, createIndividual } = useCreateIndividual(() => setShowForm(false));

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
         contact_details: [{ email: data.email as string, mobile_phone: [data.mobilePhone as string] }],
         notes: data.notes ? [{ content: data.notes as string }] : [],
         employment_details: [
            {
               employer_name: data.employerName as string,
               job_title: data.jobTitle as string,
               start_date: data.startDate as string,
               end_date: data.endDate ? (data.endDate as string) : undefined,
               email: data.employerEmail ? (data.employerEmail as string) : undefined,
               monthly_income: data.monthlyIncome ? parseFloat(data.monthlyIncome as string) : undefined,
            },
         ],
         next_of_kin: undefined,
         documents: undefined,
         addresses: extractAddresses(data),
      };

      if (individualPayload.identification_type === "national_id") {
         const isValid = validateZimNationalId(individualPayload.identification_number);
         if (!isValid) {
            toast.error(`Invalid Zimbabwean National ID '${individualPayload.identification_number}'`, {
               description: "Remove any spaces or dashes.",
            });
            return;
         }
      }

      if (individualPayload.date_of_birth) {
         individualPayload.date_of_birth = formatDateToPythonSLiking(individualPayload.date_of_birth);
      }
      for (const employment of individualPayload.employment_details || []) {
         if (employment.start_date) {
            employment.start_date = formatDateToPythonSLiking(employment.start_date);
         }
         if (employment.end_date) {
            employment.end_date = formatDateToPythonSLiking(employment.end_date);
         }
      }

      console.log({ individualPayload });
      createIndividual(individualPayload);
   }

   return { showForm, isPending, handleSubmit, setShowForm };
}
