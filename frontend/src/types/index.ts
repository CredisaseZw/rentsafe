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
   roles: string[];
   is_verified: boolean;
   last_login: string;
   access_level: "Admin" | string;
   date_joined: string;
};

export type Role = {
   id: number;
   name: string;
   description: string;
};

export type Roles = Role[];
