import type { LucideIcon } from "lucide-react";

export interface Service {
   name: string;
   description: string;
   icon: LucideIcon;
   href: string;
}

export interface CompanyMinimal {
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

export interface Address {
   id: number;
   address_type?: string;
   is_primary?: true;
   street_address?: string;
   line_2?: string;
   postal_code?: string | number;
   latitude?: string | number;
   longitude?: string | number;
   country?: {
      id: number;
      name: string;
      code: string;
   };
   province?: {
      id: number;
      name: string;
      code: string;
   };
   city?: {
      id: number;
      name: string;
   };
   suburb?: {
      id: number;
      name: string;
   };
   date_created: string;
   date_updated: string;
}

export interface Branch {
   id: number;
   company: number;
   branch_name: string;
   addresses: Address[];
   contacts: string[];
}

export interface CompanyFull {
   id: number;
   registration_number: string;
   registration_name: string;
   trading_name?: string;
   legal_status?: string;
   legal_status_display?: string;
   date_of_incorporation?: null;
   industry?: string;
   is_verified?: boolean;
   is_active?: boolean;
   addresses?: Address[];
   branches?: Branch[];
   profile?: {
      email?: string;
      trading_status?: string;
      trading_status_display?: string;
      mobile_phone?: string;
      landline_phone?: string;
      logo?: string;
      registration_date?: string;
      tin_number?: string;
      vat_number?: string;
      number_of_employees?: string;
      website?: string;
      trend?: string;
      trend_display?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      operations?: string;
      contact_person?: string;
      risk_class?: string;
      risk_class_display?: string;
      account_number?: string;
      is_under_judicial?: boolean | string;
      is_under_judicial_display?: boolean | string;
      is_suspended?: boolean;
   };
   date_created?: string;
   date_updated?: string;
}

export interface CompanyReport {
   claims: { claimant: string; type: string; currency: string; amount: number; dateOfClaim: string }[];
   active: { creditor: string; type: string; outstandingSince: string; amount: number }[];
   historic: { creditor: string; type: string; outstandingSince: string; amount: number }[];
   rating: string;
   companyDetails: {
      registeredName: string;
      tradingName: string;
      registrationNumber: string;
      dateOfRegistration: string;
      tradingStatus: string;
      industrySector: string;
      telephoneNumber: string;
      mobileNumber: string;
      email: string;
      website: string;
      address: string;
   };
}
