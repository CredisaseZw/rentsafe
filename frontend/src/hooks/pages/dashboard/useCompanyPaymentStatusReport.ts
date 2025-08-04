import type { CompanyReport } from "@/interfaces";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import useBranch from "@/hooks/apiHooks/useBranch";
import React from "react";
//import { formatAddress } from "@/lib/utils";

export default function useCompanyPaymentStatusReport(branchID: number) {
   const [isFirstLoad, setIsFirstLoad] = React.useState(true);
   const [show, setShow] = React.useState(false);
   const [showFullAddress, setShowFullAddress] = React.useState(false);
   const { error, branch, isLoading, refetch } = useBranch(branchID, false);

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
      branchDetails: {
         branchName: branch?.branch_name || "",
         registrationName: branch?.company?.registration_name || "",
         tradingName: branch?.company?.trading_name || "",
         registrationNumber: branch?.company?.registration_number || "",
         dateOfRegistration: branch?.profile.registration_date || "",
         tradingStatus: branch?.profile?.trading_status_display || "",
         telephoneNumber: branch?.profile?.landline_phone || "",
         mobileNumber: branch?.profile?.mobile_phone || "",
         email: branch?.profile?.email || "",
         website: branch?.profile?.website || "",
         isHeadquaters: false,
         industrySector: "",
         //address: branch?.addresses?.map(formatAddress).join(" | ") || "",
      },
   };

   const ratingColor =
      PAYMENT_STATUS_CLASSIFICATIONS.find((c) => c.label.toLowerCase() === report.rating.toLowerCase())?.className ||
      "bg-gray-500 text-white";

   return { show, error, report, isLoading, ratingColor, showFullAddress, handleOpenChange, setShowFullAddress };
}
