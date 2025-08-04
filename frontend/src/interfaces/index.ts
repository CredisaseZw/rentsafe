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
   date_created: string;
   date_updated: string;
}

export type BranchComplete = {
   id: number;
   branch_name: string;
   is_headquarters: boolean;
   is_deleted: boolean;
   company: {
      id: number;
      registration_number: string;
      registration_name: string;
      trading_name: string | null;
      legal_status: string;
      legal_status_display: string;
      is_verified: boolean;
   };
};
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
   addresses: Address[];
   contacts: Contact[];
   primary_address: Address | null;
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
      // address: string;
   };
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
      mobileNumber: string;
      telephoneNumber: string;
      email: string;
      address: string;
   };
}

export interface AddressLocation {
   countryId?: string;
   provinceId?: string;
   cityId?: string;
   suburbId?: string;
   countryName?: string;
   provinceName?: string;
   cityName?: string;
   suburbName?: string;
}

export interface IndividualMinimal {
   id: number;
   first_name: string;
   last_name: string;
   identification_number: string;
   contact_details?: {
      id: number;
      individual_id: number;
      mobile_phone: string[];
      email: string;
   }[];
   is_active: boolean;
}

export interface IndividualFull {
   id: number;
   first_name: string;
   last_name: string;
   date_of_birth: string;
   gender: string;
   marital_status: string;
   identification_type: string;
   identification_number: string;
   contact_details: { id: number; individual_id: number; mobile_phone: string[]; email: string }[];
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
   results: BranchComplete[];
}

export interface IndividualApiResponse extends PaginationData {
   results: IndividualMinimal[];
}
