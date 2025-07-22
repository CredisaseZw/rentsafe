import type { LucideIcon } from "lucide-react";

export interface Service {
   name: string;
   description: string;
   icon: LucideIcon;
   href: string;
}

export interface Company {
   id: number;
   registration_number: string;
   registration_name: string;
   trading_name?: string;
   legal_status?: string;
   legal_status_display?: string;
   industry?: string;
   is_verified?: boolean;
   primary_address?: string;
}
