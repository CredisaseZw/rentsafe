import type { CompanyLegalStatus, IndividualMaritalStatus } from "@/types";

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

export interface IndividualPayload {
   first_name: string;
   last_name: string;
   date_of_birth: string;
   gender: string;
   identification_type: string;
   identification_number: string;
   marital_status: IndividualMaritalStatus;
   contact_details: { email?: string; mobile_phone: string[] }[];
   addresses?: AddressPayload[];
   documents?: { document_type: string; file: string; description: string }[];
   notes?: { content: string }[];
   employment_details?: {
      employer_name?: string;
      job_title?: string;
      start_date?: string;
      end_date?: string;
      email?: string;
      monthly_income?: number;
   }[];
   next_of_kin?: {
      first_name: string;
      last_name: string;
      relationship: string;
      mobile_phone: string;
      email?: string;
      physical_address?: string;
   }[];
}

export interface BranchPayload {
   company: number;
   branch_name: string;
   addresses: AddressPayload[];
   contacts: {
      individual: number;
      contact_type: string;
      is_primary: boolean;
      position: string;
   }[];
}
