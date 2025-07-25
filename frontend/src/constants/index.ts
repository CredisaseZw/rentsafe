import type { AddressType, CompanyLegalStatus, Route } from "@/types";
import type { Service } from "@/interfaces";
import { navlinksToRoutes } from "@/lib/utils";
import { ChartColumnDecreasingIcon, House } from "lucide-react";

import {
   RENT_ADMIN_PANEL_NAVLINKS,
   RENTSAFE_APP_NAVLINKS,
   RENTSAFE_ACCOUNTING_NAVLINKS,
   ROOT_NAVLINKS,
} from "./navlinks";

export const SERVICES: Service[] = [
   {
      name: "Rent-Safe",
      description: "Rental management.",
      href: "/services/rent-safe",
      icon: House,
   },
   {
      name: "Count-Safe",
      description: "Accounting.",
      href: "/services/count-safe",
      icon: ChartColumnDecreasingIcon,
   },
];

export const RENTSAFE_ROUTES: Route[] = navlinksToRoutes([
   ...RENTSAFE_APP_NAVLINKS,
   ...RENTSAFE_ACCOUNTING_NAVLINKS,
   ...RENT_ADMIN_PANEL_NAVLINKS,
]);

export const ROOT_ROUTES: Route[] = navlinksToRoutes(ROOT_NAVLINKS);

export const PRIMARY_GRADIENT = "from-PRIMARY to-SECONDARY bg-gradient-to-br";

export const PAYMENT_STATUS_CLASSIFICATIONS = [
   { label: "Low Risk", className: "bg-SUCCESS text-white" },
   { label: "Medium Risk", className: "bg-[darkorange] text-white" },
   { label: "High Risk", className: "bg-[tomato] text-white" },
   { label: "High Risk+", className: "bg-[firebrick] text-white" },
   { label: "Non Payer", className: "bg-[black] text-white" },
];

export const INDUSTRIES = [
   "Agriculture",
   "Construction",
   "Education",
   "Finance",
   "Healthcare",
   "Hospitality",
   "Information Technology",
   "Manufacturing",
   "Retail",
   "Transportation",
   "Other",
];

export const MODAL_WIDTHS = {
   md: "900px" as const,
   lg: "1100px" as const,
};

export const ALL_ADDRESS_TYPES: AddressType[] = ["physical", "postal", "billing", "work", "other"];

export const ALL_POSSIBLE_COMPANY_LEGAL_STATUSES: readonly CompanyLegalStatus[] = [
   "private",
   "public",
   "government",
   "ngo",
   "other",
];
