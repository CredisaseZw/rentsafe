import type { CompanyLegalStatus } from "@/types";

export interface CompanyPayload {
   registration_number: string;
   registration_name: string;
   trading_name?: string;
   legal_status?: CompanyLegalStatus;
   date_of_incorporation?: string;
   industry?: string;
   addresses?: AddressPayload[];
   documents?: { document_type: string; file: string; description: string }[];
   notes?: { content: string }[];
   profile: {
      email: string;
      registration_date?: string;
      mobile_phone?: string;
      landline_phone?: string;
      tin_number?: string;
      vat_number?: string;
      number_of_employees?: number;
      website?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      operations?: string;
      account_number?: string;
   };
}

export interface AddressPayload {
   street_address: string;
   city_id: number;
   address_type?: "physical" | "postal" | "billing" | "work" | "other";
   is_primary?: boolean;
   postal_code?: string;
   suburb_id?: number;
   province_id?: number;
   country_id?: number;
}
