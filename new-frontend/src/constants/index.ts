import type { Service } from "@/interfaces";
import { ChartColumnDecreasingIcon, House } from "lucide-react";

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
