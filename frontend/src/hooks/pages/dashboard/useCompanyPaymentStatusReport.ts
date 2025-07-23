import type { CompanyReport } from "@/interfaces";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import useCompany from "@/hooks/apiHooks/useCompany";
import React from "react";
import { formatAddress } from "@/lib/utils";

export default function useCompanyPaymentStatusReport(companyId: number) {
   const [isFirstLoad, setIsFirstLoad] = React.useState(true);
   const [show, setShow] = React.useState(false);
   const [showFullAddress, setShowFullAddress] = React.useState(false);
   const { company, isLoading, refetch } = useCompany(companyId, false, () => setShow(false));

   function handleOpenChange(open: boolean) {
      setShow(open);
      if (open) {
         if (isFirstLoad) {
            refetch();
            setIsFirstLoad(false);
         }
      }
   }

   const report: CompanyReport = {
      claims: [],
      active: [],
      historic: [],
      rating: "",
      companyDetails: {
         registeredName: company?.registration_name || "",
         tradingName: company?.trading_name || "",
         registrationNumber: company?.registration_number || "",
         dateOfRegistration: company?.date_of_incorporation || "",
         tradingStatus: company?.profile?.trading_status || "",
         industrySector: company?.industry || "",
         telephoneNumber: company?.profile?.landline_phone || "",
         mobileNumber: company?.profile?.mobile_phone || "",
         email: company?.profile?.email || "",
         website: company?.profile?.website || "",
         address: company?.addresses?.map(formatAddress).join(" | ") || "",
      },
   };

   const ratingColor =
      PAYMENT_STATUS_CLASSIFICATIONS.find((c) => c.label.toLowerCase() === report.rating.toLowerCase())?.className ||
      "bg-gray-500 text-white";

   return { show, report, isLoading, ratingColor, showFullAddress, handleOpenChange, setShowFullAddress };
}
