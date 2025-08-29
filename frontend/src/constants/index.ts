import type { AddressType, CompanyLegalStatus, Route, TenantSelection } from "@/types";
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

export const COLOR_CLASSES: Record<string, { bg: string; text: string }> = {
  slate:   { bg: "bg-slate-200", text: "text-slate-800" },
  gray:    { bg: "bg-gray-200", text: "text-gray-800" },
  zinc:    { bg: "bg-zinc-200", text: "text-zinc-800" },
  neutral: { bg: "bg-neutral-200", text: "text-neutral-800" },
  stone:   { bg: "bg-stone-200", text: "text-stone-800" },
  red:     { bg: "bg-red-200", text: "text-red-800" },
  orange:  { bg: "bg-orange-200", text: "text-orange-800" },
  amber:   { bg: "bg-amber-200", text: "text-amber-800" },
  yellow:  { bg: "bg-yellow-200", text: "text-yellow-800" },
  lime:    { bg: "bg-lime-200", text: "text-lime-800" },
  green:   { bg: "bg-green-200", text: "text-green-800" },
  emerald: { bg: "bg-emerald-200", text: "text-emerald-800" },
  teal:    { bg: "bg-teal-200", text: "text-teal-800" },
  cyan:    { bg: "bg-cyan-200", text: "text-cyan-800" },
  sky:     { bg: "bg-sky-200", text: "text-sky-800" },
  blue:    { bg: "bg-blue-200", text: "text-blue-800" },
  indigo:  { bg: "bg-indigo-200", text: "text-indigo-800" },
  violet:  { bg: "bg-violet-200", text: "text-violet-800" },
  purple:  { bg: "bg-purple-200", text: "text-purple-800" },
  fuchsia: { bg: "bg-fuchsia-200", text: "text-fuchsia-800" },
  pink:    { bg: "bg-pink-200", text: "text-pink-800" },
  rose:    { bg: "bg-rose-200", text: "text-rose-800" },
};

export const MINIMAL_TENANT_OBJECT: TenantSelection = {
   id : 0,
   search_value : "",
   full_name : "",
   identification_number : "", 
   mobile_number : "",
   address : null
}