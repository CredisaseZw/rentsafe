import type { AddressType, CompanyLegalStatus, Header, Route, TenantSelection } from "@/types";
import type { Service } from "@/interfaces";
import { navlinksToRoutes } from "@/lib/utils";
import { ChartColumnDecreasingIcon, House } from "lucide-react";
import type {Option} from "@/types/index"
import {
  RENT_ADMIN_PANEL_NAVLINKS,
  RENTSAFE_APP_NAVLINKS,
  RENTSAFE_ACCOUNTING_NAVLINKS,
  ROOT_NAVLINKS,
} from "./navlinks";

export const SERVICES: Service[] = [
  {
    name: "Rent-Safe",
    description: "Rental management.",
    href: "/services/rent-safe",
    icon: House,
  },
  {
    name: "Count-Safe",
    description: "Accounting.",
    href: "/services/count-safe",
    icon: ChartColumnDecreasingIcon,
  },
];

export const RENTSAFE_ROUTES: Route[] = navlinksToRoutes([
  ...RENTSAFE_APP_NAVLINKS,
  ...RENTSAFE_ACCOUNTING_NAVLINKS,
  ...RENT_ADMIN_PANEL_NAVLINKS,
]);

export const ROOT_ROUTES: Route[] = navlinksToRoutes(ROOT_NAVLINKS);

export const PRIMARY_GRADIENT = "from-PRIMARY to-SECONDARY bg-gradient-to-br";

export const PAYMENT_STATUS_CLASSIFICATIONS = [
  { label: "Low Risk", className: "bg-SUCCESS text-white" },
  { label: "Medium Risk", className: "bg-[darkorange] text-white" },
  { label: "High Risk", className: "bg-[tomato] text-white" },
  { label: "High Risk+", className: "bg-[firebrick] text-white" },
  { label: "Non Payer", className: "bg-[black] text-white" },
];

export const INDUSTRIES = [
  "Agriculture",
  "Banking",
  "Construction",
  "Education",
  "Energy",
  "Entertainment",
  "Finance",
  "Food",
  "Health",
  "Hospitality",
  "Insurance",
  "Manufacturing",
  "Media",
  "Retail",
  "Technology",
  "Telecommunications",
  "Transportation",
  "Aviation",
  "Real Estate",
  "Other"
]

export const MODAL_WIDTHS = {
  md: "900px" as const,
  lg: "1100px" as const,
};

export const ALL_ADDRESS_TYPES: AddressType[] = ["physical", "postal", "billing", "work", "other"];

export const ALL_POSSIBLE_COMPANY_LEGAL_STATUSES: readonly CompanyLegalStatus[] = [
  "private",
  "public",
  "government",
  "ngo",
  "other",
];

export const DELETION_LINKS = {
  SALES_ITEMS : "/api/accounting/items",
  VAT_SETTINGS : "/api/accounting/vat-settings",
  SALES_CATEGORIES: "/api/accounting/sales-categories",
  ACCOUNT_SECTORS : "/api/accounting/account-sectors",
  CASH_BOOK : "/api/accounting/cash-books",
  GENERAL_LEDGER : "/api/accounting/ledger-accounts",
  INVOICE : "/api/accounting/invoices"
}

export const COLOR_CLASSES: Record<string, { bg: string; text: string }> = {
  slate:   { bg: "bg-slate-200", text: "text-slate-800" },
  gray:    { bg: "bg-gray-200", text: "text-gray-800" },
  zinc:    { bg: "bg-zinc-200", text: "text-zinc-800" },
  neutral: { bg: "bg-neutral-200", text: "text-neutral-800" },
  stone:   { bg: "bg-stone-200", text: "text-stone-800" },
  red:     { bg: "bg-red-200", text: "text-red-800" },
  orange:  { bg: "bg-orange-200", text: "text-orange-800" },
  amber:   { bg: "bg-amber-200", text: "text-amber-800" },
  yellow:  { bg: "bg-yellow-200", text: "text-yellow-800" },
  lime:    { bg: "bg-lime-200", text: "text-lime-800" },
  green:   { bg: "bg-green-200", text: "text-green-800" },
  emerald: { bg: "bg-emerald-200", text: "text-emerald-800" },
  teal:    { bg: "bg-teal-200", text: "text-teal-800" },
  cyan:    { bg: "bg-cyan-200", text: "text-cyan-800" },
  sky:     { bg: "bg-sky-200", text: "text-sky-800" },
  blue:    { bg: "bg-blue-200", text: "text-blue-800" },
  indigo:  { bg: "bg-indigo-200", text: "text-indigo-800" },
  violet:  { bg: "bg-violet-200", text: "text-violet-800" },
  purple:  { bg: "bg-purple-200", text: "text-purple-800" },
  fuchsia: { bg: "bg-fuchsia-200", text: "text-fuchsia-800" },
  pink:    { bg: "bg-pink-200", text: "text-pink-800" },
  rose:    { bg: "bg-rose-200", text: "text-rose-800" },
};

export const MINIMAL_TENANT_OBJECT: TenantSelection = {
  id : 0,
  search_value : "",
  full_name : "",
  identification_number : "", 
  mobile_number : "",
  address : null,
  is_primary : false

}

export const INVOICE_TYPES: Option[] = [ 
  { label: "FISCAL", value: "fiscal" },
  { label: "PROFORMA", value: "proforma" },
  { label: "RECURRING", value: "recurring" },

];

export const IN_LEASE_CLIENT_TYPES: Option[] = [
  { label: "Individual", value: "individual" },
  { label: "Company", value: "company" },
];

export const STATUS_OPTIONS: Option[] = [
  { label: "Occupied", value: "occupied" },
  { label: "Vacant", value: "vacant" },
];

export const LEASE_STATUS_OPTIONS: Option[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Approval", value: "PENDING APPROVAL" },
  { label: "Terminated", value: "TERMINATED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Renewed", value: "RENEWED" },
  { label: "Suspended", value: "SUSPENDED" },
];

export const PAYMENT_FREQUENCY_OPTIONS: Option[] = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Half Early", value: "HALF_EARLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Annually", value: "ANNUALLY" },
];

export const DEPOSIT_HOLDER_OPTIONS: Option[] = [
  { label: "Agent", value: "agent" },
  { label: "Landlord", value: "landlord" },
];

export const UNIT_TYPES: Option[] = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Office", value: "office" },
  { label: "Retail Space", value: "retail_space" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Other", value: "other" },
];

export const UNIT_STATUS:Option[] = [
  {label :"Vacant", value :"vacant"},
  {label :"Occupied", value :"occupied"},
]

export const TENANT_STATEMENTS_HEADERS: Header[] = [
  {name : "Lease ID"},
  {name : "Customer name"},
  {name : "Address"},
  {name : "Rent Owing"},
  {name : "Action"}
]

export const TENANT_STATEMENT_HEADERS: Header[] = [
  {name : "Date"},
  {name : "Description", textAlign : "left"},
  {name : "Reference"},
  {name : "Cashbook Name"},
  {name : "Amount", textAlign: "end"},
  {name : "Balance", textAlign :"end"}
]

export const PROPERTY_HEADERS:Header[] = [
  {name  :"Id"},
  {name  :"Unit Number"},
  {name  :"Unit Type"},
  {name  :"Status"},
]

export const UNIT_FEATURES:Option[] = [
  {
    label: "Furnishing",
    value: "furnishing",
    subOptions: [
      { label: "Furnished", value: "furnished" },
      { label: "Unfurnished", value: "unfurnished" },
      { label: "Partially Furnished", value: "partially_furnished" },
      { label: "Built-in Wardrobes", value: "built_in_wardrobes" },
      { label: "Kitchen Appliances", value: "kitchen_appliances" },
      { label: "Study Desk", value: "study_desk" },
      { label: "Bed & Mattress", value: "bed_mattress" },
      { label: "Sofa & Chairs", value: "sofa_chairs" },
    ],
  },
  {
    label: "Utilities",
    value: "utilities",
    subOptions: [
      { label: "Wi-Fi", value: "wifi" },
      { label: "Water Included", value: "water_included" },
      { label: "Electricity Included", value: "electricity_included" },
      { label: "Gas Included", value: "gas_included" },
      { label: "Solar Power", value: "solar_power" },
      { label: "Backup Generator", value: "backup_generator" },
    ],
  },
  {
    label: "Amenities",
    value: "amenities",
    subOptions: [
      { label: "Parking", value: "parking" },
      { label: "Swimming Pool", value: "swimming_pool" },
      { label: "Garden", value: "garden" },
      { label: "Laundry Room", value: "laundry_room" },
      { label: "Gym / Fitness Center", value: "gym" },
      { label: "Playground", value: "playground" },
      { label: "BBQ Area", value: "bbq_area" },
      { label: "Community Hall", value: "community_hall" },
    ],
  },
  {
    label: "Comfort",
    value: "comfort",
    subOptions: [
      { label: "Air Conditioning", value: "air_conditioning" },
      { label: "Heating", value: "heating" },
      { label: "Ceiling Fan", value: "ceiling_fan" },
      { label: "Balcony", value: "balcony" },
      { label: "Patio", value: "patio" },
      { label: "Private Entrance", value: "private_entrance" },
      { label: "Soundproofing", value: "soundproofing" },
    ],
  },
  {
    label: "Kitchen",
    value: "kitchen",
    subOptions: [
      { label: "Modern Kitchen", value: "modern_kitchen" },
      { label: "Open Plan Kitchen", value: "open_plan_kitchen" },
      { label: "Pantry", value: "pantry" },
      { label: "Dishwasher", value: "dishwasher" },
      { label: "Microwave", value: "microwave" },
      { label: "Refrigerator", value: "refrigerator" },
    ],
  },
  {
    label: "Bathroom",
    value: "bathroom",
    subOptions: [
      { label: "En-suite Bathroom", value: "ensuite_bathroom" },
      { label: "Bathtub", value: "bathtub" },
      { label: "Shower", value: "shower" },
      { label: "Hot Water", value: "hot_water" },
      { label: "Double Sink", value: "double_sink" },
    ],
  },
  {
    label: "Security",
    value: "security",
    subOptions: [
      { label: "CCTV", value: "cctv" },
      { label: "Gated Community", value: "gated" },
      { label: "24/7 Security Guard", value: "guard" },
      { label: "Fire Alarm System", value: "fire_alarm" },
      { label: "Smoke Detectors", value: "smoke_detectors" },
      { label: "Secure Entry", value: "secure_entry" },
    ],
  },
  {
    label: "Policies",
    value: "policies",
    subOptions: [
      { label: "Pet Friendly", value: "pet_friendly" },
      { label: "No Smoking", value: "no_smoking" },
      { label: "Students Allowed", value: "students_allowed" },
      { label: "Family Friendly", value: "family_friendly" },
      { label: "Single Occupancy Only", value: "single_occupancy" },
    ],
  },
  {
    label: "Accessibility",
    value: "accessibility",
    subOptions: [
      { label: "Wheelchair Accessible", value: "wheelchair_accessible" },
      { label: "Elevator Access", value: "elevator_access" },
      { label: "Wide Doorways", value: "wide_doorways" },
      { label: "Ground Floor", value: "ground_floor" },
    ],
  },
  {
    label: "View",
    value: "view",
    subOptions: [
      { label: "City View", value: "city_view" },
      { label: "Garden View", value: "garden_view" },
      { label: "Pool View", value: "pool_view" },
      { label: "Mountain View", value: "mountain_view" },
      { label: "Lake View", value: "lake_view" },
    ],
  },
]

export const PHONE_TYPES = [
  { label: "Mobile", value: "mobile" },
  { label: "Whatsapp", value: "whatsapp" },
  { label: "Combined", value: "combined" },
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Other", value: "Other" }
]

export const COLOR_THEMES = {
  default: {
      active: "bg-[var(--navlink)] dark:bg-zinc-800",
      inactiveText: "text-gray-800 dark:text-white",
      activeText: "text-blue-700 dark:text-white hover:text-gray-800 hover:dark:text-white",
      hover: "hover:bg-gray-100/90 hover:dark:bg-zinc-900",
  },
  black: {
      active: "bg-black/10 dark:bg-zinc-900",
      inactiveText: "text-gray-800 dark:text-white",
      activeText: "text-gray-800 dark:text-white hover:text-gray-800 hover:dark:text-white",
      hover: "hover:bg-black/10 hover:dark:bg-zinc-900",
  },
  red: {
      active: "bg-red-100 dark:bg-red-800/10",
      activeText: "text-red-600",
      inactiveText: "text-red-600",
      hover  :"hover:bg-red-100 hover:dark:bg-red-800/10"
  },
  green: {
      active: "bg-green-100 dark:bg-green-800/10",
      activeText: "text-green-600",
      inactiveText: "text-green-600",  
      hover  :"hover:bg-green-100 hover:dark:bg-green-800/10"
  },
  blue: {
      active: "bg-blue-100 dark:bg-blue-800/10",
      activeText: "text-blue-800",
      inactiveText: "text-blue-800",
      hover  :"hover:bg-blue-100 hover:dark:bg-blue-800/10"
  },
  lightBlue : {
      active: "bg-[var(--navlink)] dark:bg-blue-800/10",
      inactiveText: "text-blue-500 hover:text-blue-500",
      activeText: "text-blue-500 hover:bg-[var(--navlink)]",
      hover: "hover:bg-[var(--navlink)] hover:dark:bg-blue-800/10",
  },
  purple: {
      active: "bg-purple-100 dark:bg-purple-800/10",
      activeText: "text-purple-600 hover:bg-purple-100",
      inactiveText: "text-purple-600",
      hover  :"hover:bg-purple-100 hover:dark:bg-purple-800/10"
  }

}

export const TAX_OPTIONS_HEADERS:Header[] = [
  {name : "Description"},
  {name : "Rate(%)"},
  {name : "Action"}
]

export const CASHBOOKS_LISTS:Header[] = [
  {name : "Book ID"},
  {name : "Cashbook Name"},
  {name : "Cashbook Currency"},
  {name: "Active Requisitions"},
  {name : "GL Account Number"},
  {name : "Details"}
]

export const ACCOUNT_TYPES:Option[] = [
  {label :"Bank Account", value : "Bank Account"},
  {label : "Current Account", value : "Current Account"},
  {label : "Cash", value : "Cash"},
  {label : "Mobile Money", value :"Mobile Money"}
]

export const YEARS:Option[] = [
  ...Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  })
]
export const MONTHS: Option[] = [
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
  { label: "July", value: "july" },
  { label: "August", value: "august" },
  { label: "September", value: "september" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" }
]

export const SALES_INVOICES_HEADERS :Header[]=[
  {name : "Inv #"},
  {name : "Date Created"},
  {name : "Customer"},
  {name : "Currency"},
  {name : "Invoice Total (Excluding VAT)"},
  {name : "Invoice VAT Total"},
  {name : "Invoice Total (Including VAT)", textAlign : "end"},
  {name : "Actions"}
]

export const CREDIT_NOTE_HEADERS :Header[]=[
  {name : "Cr Note #"},
  {name : "Date Created"},
  {name : "Customer"},
  {name : "Currency"},
  {name : "Amount", textAlign : "end"}
]
export const SALES_ITEMS_HEADERS :Header[]=[
  {name : "ID"},
  {name : "Category"},
  {name : "Name"},
  {name : "Unit Price"},
  {name : "Date Created"},
  {name : "Action",}
]

export const SALES_CATEGORIES_HEADERS:Header[] = [
  {name : "Code"},
  {name : "Category"},
  {name : "Date Created"},
  {name : "Action"},
]

export const SALES_REPORTS_HEADERS:Header[] = [
  {name : "Inv #"},
  {name : "Customer"},
  {name : "Amount (Excl)"},
  {name : "VAT"},
  {name : "Total (Inc)"}
]

export const CASHFLOW_FORECAST:Header[] = [
  {name : "Customer"},
  {name : "0-7 Days"},
  {name : "8-14 Days"},
  {name : "15-21 Days"},
  {name : "21+ Days"},
  {name : "total"}
]
export const CASHBOOKS_RECEIPTS:Header[] = [
  {name : "Date"},
  {name : "Receipt Number"},
  {name : "Type (GL/C)"},
  {name : "Account"},
  {name : "Details"},
  {name : "Amount"},
  {name : "Matching Invoice"},
  {name : "Rate"}
]

export const RATE_AUDIT_TRAIL:Header[] = [
  {name : "Date"},
  {name : "Source"},
  {name : "User"},
  {name : "Base USD"},
  {name : "Convert Currency"},
  {name : "Rate"}
]

export const SUBSCRIPTION_HEADERS:Header[] = [
  { name : "No" },
  { name : "Open Slots" },
  { name : "Period (Months)" },
  { name : "Start Date" },
  { name : "End Date" },
]

export const PARKING_OPTIONS:Option[] = [
  { label: "All", value: "all" },
  { label: "Underground", value: "underground" },
  { label: "Integrated Garage", value: "Integrated Garage"},
  { label: "External Garage", value: "External Garage"},
  { label: "Open", value: "open" },
  { label: "Street", value: "street" },
]

export const SECURITY_OPTIONS:Option[] =[
  { label: "24/7", value: "24/7" },
  { label: "Day time", value: "Day Time" },
  { label: "Night time", value: "Night time" },
  { label: "None", value: "none" },
]

export const BACKUP_POWER_OPTIONS:Option[] = [
  { label: "All", value: "all" },
  { label: "Generator", value: "generator" },
  { label: "Solar", value: "solar" },
  { label: "Battery", value: "battery" },
  { label: "None", value: "none" },
]

export const PROPERTY_FILTER_OPTIONS:Option[] = [
  { label: "All", value: "all" },
  { label: "Occupied", value: "occupied" },
  { label: "Vacant", value: "vacant" },
]
export const PROPERTY_STATUS_OPTIONS:Option[] = [
  {label : "Vacant", value : "vacant"},
  {label : "Partially Occupied", value : "partially_occupied"},
  {label : "Occupied", value : "occupied"},
  {label : "Maintenance", value : "maintenance"},
  {label : "Sold", value : "sold"}
]

export const COMMON_HEADERS:Header[] = [
  {
      name  :"Lease ID",
  },
  {
      name : "Tenant",
  },
  {
      name : "Landlord",
  }, 
  {
      name : "Property Type"
  },
  {
      name : "Address"
  },
]
export const ACTIVE_HEADERS:Header[] = [
  ...COMMON_HEADERS, 
  {
      name : "Rent owing"
  },
  {
      name : "Actions",
      colSpan : 3
  }
]
export const RENEWAL_HEADERS:Header[] = [
  ...COMMON_HEADERS,
  {
      name : "Lease start Date"
  },
  {
      name : "Lease end Date"
  },
  {
      name : "Actions",
      colSpan : 2
  }
]

export const TERMINATED_HEADERS:Header[] = [
  ...COMMON_HEADERS,
  {
      name : "Rent owing"
  },
  {
      name: "Date of termination"
  },
  {
      name : "Actions",
      colSpan : 2
  },
  
]
export const INVOICE_STATUSES:Option[] = [
  { label: "Cancelled Invoices", value: "cancelledInvoices" },
  { label: "Pending Invoices", value: "pendingInvoices" },
  { label: "All Paid Invoices", value: "allPaidInvoices" }
]

export const ACCOUNTING_SECTOR_HEADERS:Header[] = [
  {name : "ID"},
  {name : "Code"},
  {name : "Name"},
  {name : "Actions"}
]

export const CASH_BOOK_HEADERS:Header[] = [
  {name : "Cashbook ID"},
  {name : "Cashbook Name"},
  {name : "Active Requisition"},
  {name : "Account Type"},
  {name : "Branch Name"},
  {name : "General Ledger Account"},
  {name : "Account Sector"},
  {name : "Actions"}
]

export const PAYMENT_METHODS_HEADERS:Header[] = [
  {name : "ID"},
  {name : "Payment Method"},
  {name : "Action"}
]

export const GENERAL_ACCOUNTS_HEADERS: Header[] = [
  { name: "Account Number" },
  { name: "Account Name" },
  { name: "Secondary Currency" },
  { name: "Accounts Sector" },
  { name: "Sector Name" },
  { name: "Actions" },
];

export const CURRENCY_OPTIONS:Option[] = [
  { label: "Base Currency", value: "base_currency" },
  { label: "Secondary Currency", value: "secondary_currency" },
]

export const MODES = {
  FISCAL: "fiscal_invoices",
  RECURRING: "recurring_invoices",
  PROFORMA: "proforma_invoices",
  CANCELLED: "cancelled_invoices",
  PAID: "paid_invoices",
  PENDING: "pending_invoices",
  WITH_PAYMENTS: "invoice_with_payments"
};

export const MODE_PAGES = {
  [MODES.FISCAL]: "fiscal_page",
  [MODES.RECURRING]: "recurring_page",
  [MODES.PROFORMA]: "proforma_page",
  [MODES.CANCELLED]: "cancelled_page",
  [MODES.PAID]: "paid_page",
  [MODES.PENDING]: "pending_page",
  [MODES.WITH_PAYMENTS]: "invoice_payments_page"
};
