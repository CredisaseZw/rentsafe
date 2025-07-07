import { navlinksToRoutes } from "@/lib/utils";
import Home from "@/routes/Home";
import NotFound from "@/routes/NotFound";
import RentSafeDashboard from "@/routes/rent-safe/Dashboard";
import ServicesHub from "@/routes/ServicesHub";
import type { NavLink, Route } from "@/types";

export const RENTSAFE_NAVLINKS: NavLink[] = [
   {
      label: "Dashboard",
      path: "/",
      _component: RentSafeDashboard,
   },
   {
      label: "To Do List",
      path: "/todo",
   },
   {
      label: "Lease Management",
      path: "/leases",
   },
   {
      label: "Data",
      subLinks: [
         {
            label: "Claim",
            path: "/claim",
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
               },
               {
                  label: "Receipts",
                  path: "/customers/receipts",
               },
               {
                  label: "Customer Statements",
                  path: "/customers/statements",
               },
               {
                  label: "Journals",
                  subLinks: [
                     {
                        label: "Debit Journal",
                        path: "/customers/journals/debit",
                     },
                     {
                        label: "Credit Journal",
                        path: "/customers/journals/credit",
                     },
                  ],
               },
               {
                  label: "Debt Call",
                  path: "/customers/debt-call",
               },
            ],
         },
         {
            label: "Creditors",
            subLinks: [
               {
                  label: "Disbursements",
                  path: "/creditors/disbursements",
               },
               {
                  label: "Creditor Statements",
                  path: "/creditors/statements",
               },
               {
                  label: "Journals",
                  subLinks: [
                     {
                        label: "Debit Journal",
                        path: "/creditors/journals/debit",
                     },
                     {
                        label: "Credit Journal",
                        path: "/creditors/journals/credit",
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
               },
               {
                  label: "Cashflow Forecasts",
                  path: "/reports/forecasts",
               },
            ],
         },
         {
            label: "Settings",
            subLinks: [
               {
                  label: "Currency",
                  path: "/settings/currency",
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
         },
         {
            label: "Subscription Management",
            path: "/admin/subscription-management",
         },
      ],
   },
];

export const RENTSAFE_ROUTES: Route[] = navlinksToRoutes(RENTSAFE_NAVLINKS);

export const ROOT_ROUTES: Route[] = [
   {
      label: "Home",
      path: "/",
      component: Home,
   },
   {
      label: "Services Hub",
      path: "/services",
      component: ServicesHub,
      isIndex: true,
   },
   {
      label: "Not Found",
      path: "*",
      component: NotFound,
   },
];
