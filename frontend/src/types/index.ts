import type { Address } from "@/interfaces";
import type { LucideIcon } from "lucide-react";

export type Route = {
   label: string;
   path: string;
   pageComponent: React.FC;
};

export type NavLink = {
   label: string;
   segment: string;
   path?: string;
   subLinks?: NavLink[];
   pageComponent?: React.FC;
};

export type Option = {
   label : string,
   value :string,
   subOptions? : Option[]
}
export type DashboardCardProp = {
   value: string  | number | React.ReactElement;
   subTitle: number | string | React.ReactElement;
   layoutScheme: {
      icon: LucideIcon;
      color: string;
  };
  valueAsChild?: boolean
}
export type AddressType = "physical" | "postal" | "billing" | "work" | "other";

export type CompanyLegalStatus = "private" | "public" | "government" | "ngo" | "other";

export type Client = {
   id: number;
   firstName: string;
   lastName: string;
   accessLevel: string;
   email: string;
};

export type Clients = Client[];

export type DataInternalUser = {
   id: number;
   username: string;
   email: string;
   user_type: "Staff" | "Admin" | string; // extend if needed
   first_name: string;
   last_name: string;
   client: Client;
   profile_object: null;
   roles: Role[];
   is_verified: boolean;
   last_login: string;
   access_level: "Admin" | string;
   date_joined: string;
};

export type Role = {
   id: number;
   name: string;
   description: string;
   permissions: string[];
};

export type Contact = {
   individual: number;
   contact_type: "primary" | "finance" | "technical" | "other" | string;
   is_primary: true | false;
   position: string;
};
export type Roles = Role[];
export type IndividualMaritalStatus = "divorced" | "married" | "single";
export type InspectionMode = {
   key: string;
   label: string;
   Form: React.ComponentType;
};

export type Status = {
   good: boolean;
   ok: boolean;
   bad: boolean;
};

export type Row = {
   rowName: string;
   status: Status;
};

export type Column = {
   captionLabel : string,
   note : string,
   headerName: string;
   rows: Row[];
};
export type Header={
   name : string,
   className?: string,
   colSpan?: number
   textAlign?: "center"| "left" |"end"
}
export type IndividualLease = {
   idPassportNumber: string;
   leaseName: string;
   leaseMobileNumber: string;
   rentGuarantorId: string;
   rentGuarantorName: string;
   propertyType: string;
   numberOfRooms: string;
   otherPropertyDetails: string;
   unitNumber: string;
   buildingComplexName: string;
   streetNumber: string;
   streetName: string;
   suburbArea: string;
   cityTown: string;
   province: string;
   country: string;
   areaCode: string;
   leaseCurrency: string;
   monthlyRent: string;
   otherStandingCharge: string;
   standingChargeNarration: string;
   radiosHere: string;
   leaseCopy: string;
   depositDate: string;
   depositCurrency: string;
   depositAmount: string;
   depositHolder: string;
   leaseStartDate: string;
   leaseEndDate: string;
   subscriptionPeriodRemaining: string;
   paymentPeriodStartDate: string;
   paymentPeriodEndDate: string;
   landlordType: string;
   idRegName: string;
   variableRent: boolean,
   vatInclusive : boolean,
   landlordName: string;
   commissionPercentage: string;
   operatingCostsIncluded: boolean;
   landlordsOpeningBalance: string;
   paymentDataMoreThan3Months: string;
   paymentData07May25: string;
   paymentData07Jun25: string;
   paymentData07Jul25: string;
   paymentData07Aug25: string;
  };

export type PropertiesResponse = {
   count: number;
   next: string | null;
   previous: string | null;
   results: Property[];
}

export type PropertyTypeResponse = {
   count: number;
   next: string | null;
   previous: string | null;
   results : PropertyType[]
}
export interface Features {
  parking: string;
  security: string;
  backup_power: string;
}

export interface SelectedFeature {
   category: string;
    feature: string 
}
export interface AddressInput {
  suburb_id: number;
  street_address: string;
}

export interface LandlordInput {
  landlord_name: string;
  landlord_type: "company" | "individual" | string;
  landlord_id: string | number;
}
export interface Property {
  id?: string;
  name?: string;
  description?: string;
  status?: "active" | "inactive" | string; 
  year_built?: number;
  total_area?: string; 
  is_furnished?: boolean;
  total_number_of_units?: number;
  features?: Features;
  property_type_id?: number;
  property_type?: string | PropertyType;
  type?: string,
  addresses:Address[]
  address_summary?: string;
  addresses_input?: AddressInput;
  landlords_input?: LandlordInput[];
  full_address?: Address[]
  landlords?: Landlord[];
}
export interface PropertyType {
   id: number,
   name: string,
   description: string
}

export type AddPropertyForm = {
  property_type: string;
  status : string
  landlord_type: "individual" | "company";
  landlord_id: string;
  is_furnished : boolean;
  features : Features;
  landlord_name: string;
};

export interface Lease {
  id: number;
  lease_id: string;
  start_date: string;
  end_date: string;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";

  tenants: Tenant[];
  landlord: Landlord;
  unit: Unit;
  currency: Currency;
  risk_level_class: "LOW" | "MEDIUM" | "HIGH"; 
  owing: number;
  landlord_opening_balances_data?: [{
   id: 7,
   landlord: Landlord
   amount: Number,
   commission_percentage: string,
   operating_costs_inclusive: boolean

  }]
}
export interface LeaseReceiptPayload {
  lease_id: string;
  current_balance: string;
  lease_status : string;
  risk_level_class?: string;
}
export interface TenantMinimal {
   id: number;
   full_name: string;
   identification_number: string;
}

export type TenantSelection = TenantMinimal &{
   search_value: string,
   store_mobile? : string,
   mobile_number: string,
   address : Address | null,
   is_primary : false
}
export interface Tenant {
  id: number;
  lease: number;
  tenant_object: TenantMinimal;
  is_primary_tenant: boolean;
}
export type TenantPayload = {
  tenant_id: string;
  tenant_type: string;
  is_primary_tenant: boolean;
  address? : Address | undefined
};

export type guarantorPayload = {
   guarantor_type: string;
   guarantor_id: number;
   guarantee_amount: string;
};

export interface Landlord {
  id: number;
  landlord_name: string;
  landlord_type: "individual" | "company";
  landlord_id: string;
}

export interface Unit {
  id: number;
  unit_number: string;
  property: Property;
}
export interface MinimalUnit{
   id: number,
   unit_number: string,
   unit_type: string,
   status: "active" | "inactive" | string,
   number_of_rooms?: number,
}
export interface Currency {
  id: number;
  currency_code: string;
  symbol: string;
  currency_name: string;
}

export interface LeaseResponse {
   count: number;
   next: string | null;
   previous: string | null;
   results: Lease[]
}
export type ShortPropertyData =  {
   name: string;
   description: string;
   status: string;
   year_built?: number;
   total_area?: string | number;
   is_furnished?: boolean;
   total_number_of_units?: number;
   features?: Record<string, boolean | string>;
   property_type_name: string;
  };

export type LeasePayload = {
  start_date: string;
  end_date: string;
  signed_date: string;
  status: string;
  currency: number;
  payment_frequency: string;
  due_day_of_month: number;
  grace_period_days: number;
  is_rent_variable: boolean;
  includes_utilities: boolean;
  property_data : ShortPropertyData,
  unit_data: {
    unit_number: string;
    unit_type: string;
    number_of_rooms: number;
  };

  address_data: ShortSuburbAddressData
  landlord_data?: LandlordInput
  guarantor_data?: guarantorPayload 
  tenants: TenantPayload[];

  charges: {
   charge_type: "RENT" | "UTILITY" | "OTHER";
   description: string;
   amount: number;
   currency: number;
   frequency: "MONTHLY" | "QUARTERLY" | "ANNUALLY" | "ONCE";
   effective_date: string;
   end_date: string;
   vat_inclusive: boolean;
  }[];

  deposits: {
   amount: number;
   currency: number;
   deposit_date: string;
   deposit_holder: "agent" | "landlord" | "other";
  }[];

  lease_opening_balance_data: {
   current_month_balance: number;
   one_month_back_balance: number;
   two_months_back_balance: number;
   three_months_back_balance: number;
   three_months_plus_balance: number;
   outstanding_balance: number;
  };

  landlord_opening_balances_data?: {
   amount: string;
   commission_percentage: string;
   operating_costs_inclusive: boolean;
  }[];
};
export interface ShortSuburbAddressData{
   street_address: string;
   suburb_id: number;
   postal_code: string | number;
}

export interface LeaseSubscription {
  id: number;
  period: number;
  start_date: string; 
  end_date: string;   
  sub_type: string;
  total_slots: number;
  used_slots: number;
  open_slots: number;
}

export interface LeaseSubscriptionResponse {
   count: number,
   next: string | null,
   previous: string |null,
   results: LeaseSubscription[]
}

export interface SuburbPayload {
   id: number,
   name: string,
   city: string,
   province: string,
   country: string
}

export interface PaymentMethod {
   id: number,
   payment_method_name: string
}
export interface Currency{
   id: number,
   currency_code: string,
   currency_name: string 
}

export interface CurrencyResponse{
   count: number,
   next: string | null,
   previous: string | null,
   results: Currency[]
}
export interface LeaseOpeningBalanceData {
  current_month_balance: number;
  one_month_back_balance: number;
  two_months_back_balance: number;
  three_months_back_balance: number;
  three_months_plus_balance: number;
  outstanding_balance: number;
}


export type ReceiptLease =  {
   lease_id: string,
   id : number,
   rentOwing : Number ,
   customerName : string,
   currentRentOwing? :  Number,
   payment_date?: string,
   payment_method_id? : number,
   reference? :  string,
   amount? : string,
   description? : string
}
export interface PaymentHistory{
   id : number,
   invoice_number : string,
   amount : string,
   method: string,
   payment_date : string,
   reference : string   
   description : string
   type : "Payment" | string
}

export interface PaymentStatementInformation {
   opening_balance_date : string | undefined
   opening_balance: number,
   primary_tenant: string ,
   address: string,
   total_invoiced: string,
   current_balance: string
}
export type PaymentHistoryResponse = PaymentStatementInformation & {
   count : number,
   next : string | null,
   previous : string | null,
   results : PaymentHistory[]
}  