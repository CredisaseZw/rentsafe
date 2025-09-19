import type { IndividualReport } from "@/interfaces";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import React from "react";
import useIndividual from "@/hooks/apiHooks/useIndividual";
import { formatAddress, formatPhones } from "@/lib/utils";

export default function useIndividualPaymentStatusReport(individualId: number) {
   const [isFirstLoad, setIsFirstLoad] = React.useState(true);
   const [show, setShow] = React.useState(false);
   const [fullMobile, setFullMobile] = React.useState(false);
   const [showFullAddress, setShowFullAddress] = React.useState(false);
   const { error, individual, isLoading, refetch } = useIndividual(individualId, false);

   function handleOpenChange(open: boolean) {
      setShow(open);
      if (open) {
         if (isFirstLoad) {
            refetch();
            setIsFirstLoad(false);
         }
      }
   }
   const report: IndividualReport = {
      claims: [],
      active: [],
      historic: [],
      rating: "",
      employmentHistory: [
         {
            employer: individual?.employment_details ? individual?.employment_details[0]?.employer_name || "" : "",
            position: individual?.employment_details ? individual?.employment_details[0]?.job_title || "" : "",
            startDate: individual?.employment_details ? individual?.employment_details[0]?.start_date || "" : "",
         },
      ],
      personalDetails: {
         surname: individual?.last_name || "",
         otherNames: individual?.first_name || "",
         idNumber: individual?.identification_number || "",
         dateOfBirth: individual?.date_of_birth || "",
         gender: individual?.gender || "",
         nationality: "n/a",
         maritalStatus: individual?.marital_status || "",
         dependants: [],
         mobileNumber:  formatPhones(individual?.contact_details ?? []),
         telephoneNumber: "n/a",
         email: individual?.email || "",
         address: individual?.addresses?.map(formatAddress).join(" | ") || "",
      },
   };
   
   const ratingColor =
      PAYMENT_STATUS_CLASSIFICATIONS.find((c) => c.label.toLowerCase() === report.rating.toLowerCase())?.className ||
      "bg-gray-500 text-white";

   return { error, show, report, isLoading, ratingColor, showFullAddress, fullMobile, setFullMobile, handleOpenChange, setShowFullAddress };
}
