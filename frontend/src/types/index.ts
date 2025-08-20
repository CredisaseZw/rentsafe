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

export type SummaryCardType = {
   subTitle: string;
   value: number | string;
};

export type FilterOptionType = {
   label: string;
   value: string;
};

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

export type Property = {
   id: number;
   name: string;
   property_type: string;
   status: string;
   description: string;
   total_number_of_units: number;
   address_summary: string;
}

export type PropertiesResponse = {
   count: number;
   next: string | null;
   previous: string | null;
   results: Property[];
}
