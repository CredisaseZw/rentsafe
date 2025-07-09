import type { Route } from "@/types";
import type { Service } from "@/interfaces";
import { navlinksToRoutes } from "@/lib/utils";
import { ChartColumnDecreasingIcon, House } from "lucide-react";
import { 
   RENT_ADMIN_PANEL_NAVLINKS, 
   RENTSAFE_APP_NAVLINKS,
   RENTSAFE_ACCOUNTING_NAVLINKS,
   ROOT_NAVLINKS } from "./navlinks";

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

export const RENTSAFE_ROUTES: Route[] = navlinksToRoutes([...RENTSAFE_APP_NAVLINKS, ...RENTSAFE_ACCOUNTING_NAVLINKS, ...RENT_ADMIN_PANEL_NAVLINKS]);

export const ROOT_ROUTES: Route[] = navlinksToRoutes(ROOT_NAVLINKS);

export const PRIMARY_GRADIENT = "from-PRIMARY to-SECONDARY bg-gradient-to-br";
