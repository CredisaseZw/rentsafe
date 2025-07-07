import type { Service } from "@/interfaces";
import Home from "@/routes/Home";
import NotFound from "@/routes/NotFound";
import ServicesHub from "@/routes/ServicesHub";
import type { Route } from "@/types";
import { ChartColumnDecreasingIcon, House } from "lucide-react";

export const ROUTES: Route[] = [
   {
      href: "/",
      component: Home,
   },
   {
      href: "/services",
      component: ServicesHub,
      isIndex: true,
   },
   {
      href: "*",
      component: NotFound,
   },
];

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
