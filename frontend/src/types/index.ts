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
