import type { IndividualReport } from "@/interfaces";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import React from "react";
import useIndividual from "@/hooks/apiHooks/useIndividual";

export default function useIndividualPaymentStatusReport(individualId: number) {
   const [isFirstLoad, setIsFirstLoad] = React.useState(true);
   const [show, setShow] = React.useState(false);
   const [showFullAddress, setShowFullAddress] = React.useState(false);
   const { individual, isLoading, refetch } = useIndividual(individualId, false, () => setShow(false));

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
      employmentHistory: [],
      personalDetails: {
         surname: individual?.surname || "",
         otherNames: individual?.forenames || "",
         idNumber: individual?.identificationNumber || "",
         dateOfBirth: "",
         gender: "",
         nationality: "",
         maritalStatus: "",
         dependants: [],
         mobileNumber: "",
         telephoneNumber: "",
         email: "",
         address: "",
      },
   };

   const ratingColor =
      PAYMENT_STATUS_CLASSIFICATIONS.find((c) => c.label.toLowerCase() === report.rating.toLowerCase())?.className ||
      "bg-gray-500 text-white";

   return { show, report, isLoading, ratingColor, showFullAddress, handleOpenChange, setShowFullAddress };
}
