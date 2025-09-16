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
   "Construction",
   "Education",
   "Finance",
   "Healthcare",
   "Hospitality",
   "Information Technology",
   "Manufacturing",
   "Retail",
   "Transportation",
   "Other",
];

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
   { label: "Pending Approval", value: "PENDING_APPROVAL" },
   { label: "Terminated", value: "TERMINATED" },
   { label: "Expired", value: "EXPIRED" },
   { label: "Renewed", value: "RENEWED" },
   { label: "Suspended", value: "SUSPENDED" },
];

export const PAYMENT_FREQUENCY_OPTIONS: Option[] = [
   { label: "Monthly", value: "MONTHLY" },
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
