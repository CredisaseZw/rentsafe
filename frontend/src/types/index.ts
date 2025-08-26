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

export type FilterOption = {
   label: string;
   value: string;
};

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
export type PropertyType = {
   id : number,
   name: string,
   description: string
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
export interface AddressInput {
  suburb_id: number;
  street_address: string;
}

export interface LandlordInput {
  landlord_name: string;
  landlord_type: "company" | "individual" | string;
  landlord_id: string;
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
  property_type?: string;
  address_summary?: string;
  addresses_input?: AddressInput;
  landlords_input?: LandlordInput[];
  full_address?: Address[]
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

export type ApiError = {
   message: string;
   error?: string;
}