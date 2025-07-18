export interface CompanyPayload {
   registration_number: string;
   registration_name: string;
   trading_name?: string;
   legal_status?: string;
   date_of_incorporation?: string;
   industry?: string;
   addresses?: {
      street_address: string;
      city_id: number;
      address_type?: "physical" | "postal" | "billing" | "work" | "other";
      is_primary?: boolean;
      postal_code?: string;
      suburb_id?: number;
      province_id?: number;
      country_id?: number;
   }[];
   documents?: { document_type: string; file: string; description: string }[];
   notes?: { content: string }[];
   profile: {
      email: string;
      registration_date?: string;
      trading_status?: string;
      mobile_phone?: string;
      landline_phone?: string;
      tin_number?: string;
      vat_number?: string;
      number_of_employees?: number;
      website?: string;
      trend?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      operations?: string;
      risk_class?: string;
      account_number?: string;
      is_under_judicial?: "YES" | "NO";
      is_suspended?: boolean;
   };
}
