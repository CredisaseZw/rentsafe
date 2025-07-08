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

export const ROOT_NAVLINKS: NavLink[] = [
   {
      label: "Home",
      path: "",
      pageComponent: Home,
   },
   {
      label: "Services Hub",
      path: "/services",
      pageComponent: ServicesHub,
   },
   {
      label: "Not Found",
      path: "*",
      pageComponent: NotFound,
   },
];

export const RENTSAFE_NAVLINKS: NavLink[] = [
   {
      label: "Dashboard",
      path: "",
      pageComponent: RentSafeDashboard,
   },
   {
      label: "To Do List",
      path: "/todo",
      pageComponent: Todo,
   },
   {
      label: "Lease Management",
      path: "/leases",
      pageComponent: LeaseManagement,
   },
   {
      label: "Data",
      subLinks: [
         {
            label: "Claim",
            path: "/claim",
            pageComponent: Claim,
         },
      ],
   },
   {
      label: "Accounting",
      subLinks: [
         {
            label: "Customers",
            subLinks: [
               {
                  label: "Invoicing",
                  path: "/customers/invoicing",
                  pageComponent: Invoicing,
               },
               {
                  label: "Receipts",
                  path: "/customers/receipts",
                  pageComponent: Receipts,
               },
               {
                  label: "Customer Statements",
                  path: "/customers/statements",
                  pageComponent: Statements,
               },
               {
                  label: "Journals",
                  subLinks: [
                     {
                        label: "Debit Journal",
                        path: "/customers/journals/debit",
                        pageComponent: Journal,
                     },
                     {
                        label: "Credit Journal",
                        path: "/customers/journals/credit",
                        pageComponent: Journal,
                     },
                  ],
               },
               {
                  label: "Debt Call",
                  path: "/customers/debt-call",
                  pageComponent: DebtCall,
               },
            ],
         },
         {
            label: "Creditors",
            subLinks: [
               {
                  label: "Disbursements",
                  path: "/creditors/disbursements",
                  pageComponent: Disbursements,
               },
               {
                  label: "Creditor Statements",
                  path: "/creditors/statements",
                  pageComponent: Statements,
               },
               {
                  label: "Journals",
                  subLinks: [
                     {
                        label: "Debit Journal",
                        path: "/creditors/journals/debit",
                        pageComponent: Journal,
                     },
                     {
                        label: "Credit Journal",
                        path: "/creditors/journals/credit",
                        pageComponent: Journal,
                     },
                  ],
               },
            ],
         },
         {
            label: "Reports",
            subLinks: [
               {
                  label: "Commission Statements",
                  path: "/reports/commission-statements",
                  pageComponent: Statements,
               },
               {
                  label: "Cashflow Forecasts",
                  path: "/reports/forecasts",
                  pageComponent: Forecasts,
               },
            ],
         },
         {
            label: "Settings",
            subLinks: [
               {
                  label: "Currency",
                  path: "/settings/currency",
                  pageComponent: CurrencySettings,
               },
            ],
         },
      ],
   },
   {
      label: "Admin",
      subLinks: [
         {
            label: "Internal Users",
            path: "/admin/internal-users",
            pageComponent: InternalUsers,
         },
         {
            label: "Subscription Management",
            path: "/admin/subscription-management",
            pageComponent: SubscriptionManagement,
         },
      ],
   },
];
