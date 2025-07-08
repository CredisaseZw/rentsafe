import type { NavLink } from "@/types";
import Todo from "@/routes/rent-safe/Todo";
import Home from "@/routes/Home";
import Claim from "@/routes/rent-safe/Claim";
import Journal from "@/routes/rent-safe/Journal";
import NotFound from "@/routes/NotFound";
import DebtCall from "@/routes/rent-safe/DebtCall";
import Receipts from "@/routes/rent-safe/Receipts";
import Invoicing from "@/routes/rent-safe/Invoicing";
import Forecasts from "@/routes/rent-safe/Forecasts";
import Statements from "@/routes/rent-safe/Statements";
import ServicesHub from "@/routes/ServicesHub";
import InternalUsers from "@/routes/rent-safe/InternalUsers";
import Disbursements from "@/routes/rent-safe/Disbursements";
import LeaseManagement from "@/routes/rent-safe/LeaseManagement";
import CurrencySettings from "@/routes/rent-safe/CurrencySettings";
import RentSafeDashboard from "@/routes/rent-safe/Dashboard";
import SubscriptionManagement from "@/routes/rent-safe/SubscriptionManagement";
import Login from "@/routes/Login";

export const ROOT_NAVLINKS: NavLink[] = [
   {
      label: "Home",
      path: "/",
      segment: "/",
      pageComponent: Home,
   },
   {
      label: "Login",
      path: "/login",
      segment: "/login",
      pageComponent: Login,
   },
   {
      label: "Services Hub",
      path: "/services",
      segment: "/services",
      pageComponent: ServicesHub,
   },
   {
      label: "Not Found",
      path: "*",
      segment: "*",
      pageComponent: NotFound,
   },
];

const RENTSAFE_PRE_SEG = "/services/rent-safe";
export const RENTSAFE_NAVLINKS: NavLink[] = [
   {
      label: "Dashboard",
      path: RENTSAFE_PRE_SEG + "/",
      segment: RENTSAFE_PRE_SEG + "/",
      pageComponent: RentSafeDashboard,
   },
   {
      label: "To Do List",
      path: RENTSAFE_PRE_SEG + "/todo",
      segment: RENTSAFE_PRE_SEG + "/todo",
      pageComponent: Todo,
   },
   {
      label: "Lease Management",
      path: RENTSAFE_PRE_SEG + "/leases",
      segment: RENTSAFE_PRE_SEG + "/leases",
      pageComponent: LeaseManagement,
   },
   {
      label: "Data",
      segment: RENTSAFE_PRE_SEG + "/data",
      subLinks: [
         {
            label: "Claim",
            path: RENTSAFE_PRE_SEG + "/claim",
            segment: RENTSAFE_PRE_SEG + "/data/claim",
            pageComponent: Claim,
         },
      ],
   },
   {
      label: "Accounting",
      segment: RENTSAFE_PRE_SEG + "/accounting",
      subLinks: [
         {
            label: "Customers",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers",
            subLinks: [
               {
                  label: "Invoicing",
                  path: RENTSAFE_PRE_SEG + "/customers/invoicing",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/invoicing",
                  pageComponent: Invoicing,
               },
               {
                  label: "Receipts",
                  path: RENTSAFE_PRE_SEG + "/customers/receipts",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/receipts",
                  pageComponent: Receipts,
               },
               {
                  label: "Customer Statements",
                  path: RENTSAFE_PRE_SEG + "/customers/statements",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/statements",
                  pageComponent: Statements,
               },
               {
                  label: "Journals",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/journals",
                  subLinks: [
                     {
                        label: "Debit Journal",
                        path: RENTSAFE_PRE_SEG + "/customers/journals/debit",
                        segment: RENTSAFE_PRE_SEG + "/accounting/customers/journals/debit",
                        pageComponent: Journal,
                     },
                     {
                        label: "Credit Journal",
                        path: RENTSAFE_PRE_SEG + "/customers/journals/credit",
                        segment: RENTSAFE_PRE_SEG + "/accounting/customers/journals/credit",
                        pageComponent: Journal,
                     },
                  ],
               },
               {
                  label: "Debt Call",
                  path: RENTSAFE_PRE_SEG + "/customers/debt-call",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/debt-call",
                  pageComponent: DebtCall,
               },
            ],
         },
         {
            label: "Creditors",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors",
            subLinks: [
               {
                  label: "Disbursements",
                  path: RENTSAFE_PRE_SEG + "/creditors/disbursements",
                  segment: RENTSAFE_PRE_SEG + "/accounting/creditors/disbursements",
                  pageComponent: Disbursements,
               },
               {
                  label: "Creditor Statements",
                  path: RENTSAFE_PRE_SEG + "/creditors/statements",
                  segment: RENTSAFE_PRE_SEG + "/accounting/creditors/statements",
                  pageComponent: Statements,
               },
               {
                  label: "Journals",
                  segment: RENTSAFE_PRE_SEG + "/accounting/creditors/journals",
                  subLinks: [
                     {
                        label: "Debit Journal",
                        path: RENTSAFE_PRE_SEG + "/creditors/journals/debit",
                        segment: RENTSAFE_PRE_SEG + "/accounting/creditors/journals/debit",
                        pageComponent: Journal,
                     },
                     {
                        label: "Credit Journal",
                        path: RENTSAFE_PRE_SEG + "/creditors/journals/credit",
                        segment: RENTSAFE_PRE_SEG + "/accounting/creditors/journals/credit",
                        pageComponent: Journal,
                     },
                  ],
               },
            ],
         },
         {
            label: "Reports",
            segment: RENTSAFE_PRE_SEG + "/accounting/reports",
            subLinks: [
               {
                  label: "Commission Statements",
                  path: RENTSAFE_PRE_SEG + "/reports/commission-statements",
                  segment: RENTSAFE_PRE_SEG + "/accounting/reports/commission-statements",
                  pageComponent: Statements,
               },
               {
                  label: "Cashflow Forecasts",
                  path: RENTSAFE_PRE_SEG + "/reports/forecasts",
                  segment: RENTSAFE_PRE_SEG + "/accounting/reports/forecasts",
                  pageComponent: Forecasts,
               },
            ],
         },
         {
            label: "Settings",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings",
            subLinks: [
               {
                  label: "Currency",
                  path: RENTSAFE_PRE_SEG + "/settings/currency",
                  segment: RENTSAFE_PRE_SEG + "/accounting/settings/currency",
                  pageComponent: CurrencySettings,
               },
            ],
         },
      ],
   },
   {
      label: "Admin",
      segment: RENTSAFE_PRE_SEG + "/admin",
      subLinks: [
         {
            label: "Internal Users",
            path: RENTSAFE_PRE_SEG + "/admin/internal-users",
            segment: RENTSAFE_PRE_SEG + "/admin/internal-users",
            pageComponent: InternalUsers,
         },
         {
            label: "Subscription Management",
            path: RENTSAFE_PRE_SEG + "/admin/subscription-management",
            segment: RENTSAFE_PRE_SEG + "/admin/subscription-management",
            pageComponent: SubscriptionManagement,
         },
      ],
   },
];
