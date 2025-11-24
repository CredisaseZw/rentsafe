import type {  Currency, SalesItem, Tenant } from "@/types";
import type { LucideIcon } from "lucide-react";

export interface Service {
   name: string;
   description: string;
   icon: LucideIcon;
   href: string;
}
export interface IndividualTenantContact  {
   mobile_phone: string,
   email :  string
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
   address_summary: string;
   primary_address?: Address;
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
}

export interface Contact {
   id: number;
   full_contact: string;
}

export interface Profile {
   trading_status: string | null;
   trading_status_display: string | null;
   mobile_phone: string | null;
   landline_phone: string | null;
   email: string | null;
   logo: string | null;
   registration_date: string | null;
   tin_number: string | null;
   vat_number: string | null;
   number_of_employees: number | null;
   website: string | null;
   trend: string | null;
   trend_display: string | null;
   twitter: string | null;
   facebook: string | null;
   instagram: string | null;
   linkedin: string | null;
   operations: string | null;
   contact_person: string | null;
   risk_class: string | null;
   risk_class_display: string | null;
   account_number: string | null;
   is_under_judicial: string | null;
   is_under_judicial_display: string | null;
   is_suspended: boolean;
}
export interface Branch {
   id: number;
   branch_name: string;
   is_headquarters: boolean;
   is_deleted: boolean;
   company: CompanyMinimal;
   addresses: Address[];
   contacts: Contact[];
   primary_address: Address | null;
   address_summary? : string
   profile: Profile;
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
   profile?: Profile;
}
export interface CompanyCreationResponse {
   id: number;
   branch_name: string;
   is_headquarters: boolean;
   is_deleted: boolean;
   company: {
      id: number;
      registration_number: string;
      registration_name: string;
      trading_name: string;
      legal_status: string;
      legal_status_display: string;
      is_verified: boolean;
   };
   // contacts: [];
   // primary_address: null;
   profile: {
      trading_status: string;
      trading_status_display: string | null;
      mobile_phone: string;
      landline_phone: string;
      email: string;
      logo: string | null;
      registration_date: string | null;
      tin_number: string;
      vat_number: string;
      number_of_employees: string | null;
      website: string | null;
      trend: string | null;
      trend_display: string | null;
      twitter: string | null;
      facebook: string | null;
      instagram: string | null;
      linkedin: string | null;
      operations: string | null;
      contact_person: string | null;
      risk_class: string | null;
      risk_class_display: string | null;
      account_number: string | null;
      is_under_judicial: string | null;
      is_under_judicial_display: string | null;
      is_suspended: boolean | null;
   };
   date_created: string;
   date_updated: string;
}

export interface CompanyReport {
   claims: { claimant: string; type: string; currency: string; amount: number; dateOfClaim: string }[];
   active: { creditor: string; type: string; outstandingSince: string; amount: number }[];
   historic: { creditor: string; type: string; outstandingSince: string; amount: number }[];
   rating: string;
   branchDetails: {
      branchName: string;
      tradingName: string;
      registrationName: string;
      registrationNumber: string;
      dateOfRegistration: string;
      tradingStatus: string;
      isHeadquaters: false | true;
      industrySector: string;
      telephoneNumber: string;
      mobileNumber: string;
      email: string;
      website: string;
      address: string;
   };
}
export interface BranchContact {
   id: number;
   full_contact: string;
}
export interface BranchFull {
   id: number;
   branch_name: string;
   email?:string;
   phone? : string;
   is_headquarters: boolean;
   company: CompanyMinimal;
   contacts: BranchContact[];
   summary_address? : string
   primary_address: Address ;
   account_data? : {
      vat_number?: string,
      tin_number?: string,
   }
}
export interface IndividualReport {
   employmentHistory: { employer: string; position: string; startDate: string }[];
   claims: { claimant: string; type: string; currency: string; amount: number; dateOfClaim: string }[];
   active: { creditor: string; type: string; outstandingSince: string; amount: number }[];
   historic: { creditor: string; type: string; outstandingSince: string; amount: number }[];
   rating: string;
   personalDetails: {
      surname: string;
      otherNames: string;
      idNumber: string;
      dateOfBirth: string;
      gender: string;
      nationality: string;
      maritalStatus: string;
      dependants: { name: string; age: number; relationship: string }[];
      mobileNumber:string;
      telephoneNumber: string;
      email: string;
      address: string;
   };
}

export interface IndividualContact {
      type :string,
      phone_number?: string
}
export interface IndividualMinimal {
   id: number;
   first_name: string;
   last_name: string;
   identification_number: string;
   email?: string
   addresses? : Address,
   primary_address? :Address,
   search_value? : string,
   phone? :string,
   contact_details?: IndividualContact[]
   is_active: boolean;
   account_data? : {
      vat_number?: string,
      tin_number?: string,
   }
}
export interface IndividualFull {
   id: number;
   first_name: string;
   last_name: string;
   date_of_birth: string;
   gender: string;
   email : string,
   marital_status: string;
   identification_type: string;
   identification_number: string;
   contact_details: { type: string; phone_number: string }[];
   addresses: Address[];
   employment_details: {
      id: number;
      employer_name: string;
      job_title: string;
      start_date?: string;
      end_date?: string;
      is_current: boolean;
      monthly_income?: string | number;
   }[];
   next_of_kin?: {
      id: number;
      first_name: string;
      last_name: string;
      relationship: string;
      relationship_display: string;
      mobile_phone: string;
      email: string;
      physical_address: string;
   }[];
   documents?: { id: number; document_type: string; file: string; description: string; is_verified: boolean }[];
   notes?: { id: number; content: string; is_private: boolean; date_created: string; date_updated: string }[];
}

export interface PlaceBase {
   id: number;
   name: string;
}

export interface Country extends PlaceBase {
   code: string;
   dial_code: string;
   currency_code: string;
   currency_name: string;
   slug: string;
   is_active: boolean;
}

export interface ProvinceMinimal extends PlaceBase {
   code: string;
}

export type CityMinimal = PlaceBase;

export type SuburbMinimal = PlaceBase;

export interface Province extends ProvinceMinimal {
   country: string;
   slug: string;
   is_active: boolean;
   approved: boolean;
}

export interface City extends CityMinimal {
   province: string;
   slug: string;
   is_active: boolean;
}

export interface Suburb extends SuburbMinimal {
   city: string;
   slug: string;
   is_active: boolean;
}

export interface CountryWithProvinces extends Country {
   provinces: ProvinceMinimal[];
}

export interface ProvinceWithCities extends Province {
   cities: CityMinimal[];
}

export interface CityWithSuburbs extends City {
   suburbs: SuburbMinimal[];
}

export interface BranchCreationResponse {
   id: number;
   company: number;
   branch_name: string;
   addresses: Address[];
   is_headquarters: boolean;
}

export interface PaginationData {
   count: number;
   next?: string;
   previous?: string;
}

export interface BranchApiResponse extends PaginationData {
   results: Branch[];
}


export interface IndividualApiResponse extends PaginationData {
   results: IndividualMinimal[];
}

export interface SearchCompanyApiRespionse extends PaginationData {
   results: CompanyMinimal[];
}

export interface Charges {
   id: number;
   amount: string;
   currency: string;
    charge_type: string;
}
export interface LeaseResponse {
  id: number;
  tenants: Tenant[];
  charges: Charges[];
  guarantor: {
    id: number;
    guarantor_object: {
      id: number;
      full_name: string;
      identification_number: string;
    };
    guarantee_amount: string;
  } | null;
  deposits: {
    id: number;
    amount: string;
    currency: number;
    deposit_date: string; 
    deposit_holder: string;
  }[];
  unit: {
   id: number;
   unit_number: string;
   unit_type: string,
   number_of_rooms: number,
   property: {
      id: number;
      name: string;
      slug: string;
      addresses:Address[]
    };
  };
  currency: {
    id: number;
    currency_code: string;
    currency_name: string;
    symbol: string;
  };
  risk_level_class: string;
  owing: number;
  lease_opening_balance_data: {
    id: number;
    current_month_balance: string;
    one_month_back_balance: string;
    two_months_back_balance: string;
    three_months_back_balance: string;
    three_months_plus_balance: string;
    outstanding_balance: string;
  };
  landlord_opening_balances_data: {
    id: number;
    landlord: {
      id: number;
      landlord_name: string;
      landlord_type: string;
      landlord_id: string;
    };
    amount: string;
    commission_percentage: string;
    operating_costs_inclusive: boolean;
  }[];
  date_created: string;
  date_updated: string;
  lease_id: string;
  start_date: string;
  end_date: string;
  signed_date: string;
  status: string;
  payment_frequency: string;
  due_day_of_month: number;
  grace_period_days: number;
  includes_utilities: boolean;
  utilities_details: string | null;
  account_number: string | null;
  is_rent_variable: boolean;
  managing_client: number;
  lease_tenants: number[];
}

export interface Response {
   count : number
   next : string | undefined
   previous : string | undefined
}
export interface Biller {
  biller_id: number ;
  biller_name: string;
  selector_type : "tenant" | "individual" | "company";
  biller_type: "tenant" | "individual" | "company";
  biller_phone: string;
  biller_email: string;
  biller_address: string;
  biller_vat_no: string;
  biller_tin_number: string;
  invoice_type: "fiscal" | "proforma" | "recurring";
  issue_date : string,
  description :string
};
export interface Invoice {
  id: number;
  document_number: string;
  invoice_type: "proforma" | "fiscal" | "recurring" | undefined;
  currency: Currency;
  discount: string;
  date_created: string;
  status: string;
  total_excluding_vat: number;
  vat_total: number;
  total_inclusive: number;
  customer_details: InvoiceCustomerDetails;
  line_items: LineItem[];
  lease: number;
  reference_number: string | null;
  is_recurring: boolean;
  frequency: string;
  next_invoice_date: string | null;
  original_invoice: string | null;
  is_invoiced: boolean;
  can_convert_to_fiscal: boolean;
}
export interface InvoiceCustomerDetails {
  id: number;
  full_name: string;
  phone: string | null;
  email: string | null;
  tin_number: string | null;
  vat_number: string | null;
  account_number: string | null;
  industry: string | null;
  customer_type : "individual" | "company" | "tenant",
  address: Address | null
}
export interface LineItem {
  sales_item: SalesItem;
  quantity: string;
  unit_price: string;
  vat_amount: string;
  total_price: string;
  date_created: string;
  date_updated: string;
}
export interface CreditNote {
  id: number;
  document_number: string;
  credit_date: string;
  total_amount: string;
  description: string | null;
  discount: string;
  currency: Currency;
  customer_details: InvoiceCustomerDetails;
  total_vat: string;
  total_excluding_vat: string;
  credit_note_total: string;
}

export interface SwitchRate {
   from : string | undefined
   to : string | undefined,
   rate : number | undefined
}