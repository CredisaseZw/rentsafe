import type { NavLink } from "@/types";
import Todo from "@/routes/rent-safe/Todo";
import Home from "@/routes/Home";
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
import CurrencySettings from "@/routes/rent-safe/CurrencySettings";
import RentSafeDashboard from "@/routes/rent-safe/Dashboard";
import SubscriptionManagement from "@/routes/rent-safe/SubscriptionManagement";
import Login from "@/routes/Login";
import Leases from "@/routes/rent-safe/tenants/Leases";
import Communication from "@/routes/rent-safe/tenants/Communication";
import Deposits from "@/routes/rent-safe/tenants/Deposits";
import LeaseTemplate from "@/routes/rent-safe/tenants/LeaseTemplate";
import PropertyLIst from "@/routes/rent-safe/properties/PropertyLIst";
import PropertyPerformanceReports from "@/routes/rent-safe/properties/PropertyPerformanceReports";
import Inspections from "@/routes/rent-safe/properties/Inspections";
import PortfolioPerformance from "@/routes/rent-safe/landlords/PortfolioPerformance";
import RMPendingRequests from "@/routes/rent-safe/landlords/RMPendingRequests";
import WorkOrders from "@/routes/rent-safe/maintaince/WorkOrders";
import MaintenanceSchedules from "@/routes/rent-safe/maintaince/MaintenanceSchedules";
import ContractorManagement from "@/routes/rent-safe/maintaince/ContractorManagement";
import CostTracking from "@/routes/rent-safe/maintaince/CostTracking";
import RMMaintanceHistory from "@/routes/rent-safe/maintaince/RMMaintanceHistory";
import OccupancyVacancy from "@/routes/rent-safe/reports/OccupancyVacancy";
import Turnover from "@/routes/rent-safe/reports/Turnover";
import Sandbox from "@/routes/Sandbox";
import LandlordStatements from "@/routes/rent-safe/landlords/LandlordStatements";

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
      label: "Sandbox (Dev Only)",
      path: "/sandbox",
      segment: "/sandbox",
      pageComponent: Sandbox,
   },
   {
      label: "Not Found",
      path: "*",
      segment: "*",
      pageComponent: NotFound,
   },
];

const RENTSAFE_PRE_SEG = "/services/rent-safe";
export const RENTSAFE_APP_NAVLINKS: NavLink[] = [
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
      label: "Tenants",
      segment: RENTSAFE_PRE_SEG + "/tenants",
      subLinks: [
         {
            label: "Leases",
            path: RENTSAFE_PRE_SEG + "/leases",
            segment: RENTSAFE_PRE_SEG + "/tenants/leases",
            pageComponent: Leases,
         },
         {
            label: "Communication",
            path: RENTSAFE_PRE_SEG + "/communication",
            segment: RENTSAFE_PRE_SEG + "/tenants/communication",
            pageComponent: Communication,
         },
         {
            label: "Deposits",
            path: RENTSAFE_PRE_SEG + "/deposits",
            segment: RENTSAFE_PRE_SEG + "/tenants/deposits",
            pageComponent: Deposits,
         },
         {
            label: "Lease Template",
            path: RENTSAFE_PRE_SEG + "/lease-templates",
            segment: RENTSAFE_PRE_SEG + "/tenants/lease-templates",
            pageComponent: LeaseTemplate,
         },
      ],
   },
   {
      label: "Landlords",
      segment: RENTSAFE_PRE_SEG + "/landlords",
      subLinks: [
         {
            label: "Statements",
            path: RENTSAFE_PRE_SEG + "/statements",
            segment: RENTSAFE_PRE_SEG + "/landlords/statements",
            pageComponent: LandlordStatements,
         },
         {
            label: "Portfolio Performance",
            path: RENTSAFE_PRE_SEG + "/portfolio-performance",
            segment: RENTSAFE_PRE_SEG + "/landlords/portfolio-performance",
            pageComponent: PortfolioPerformance,
         },
         {
            label: "Communication",
            path: RENTSAFE_PRE_SEG + "/communication",
            segment: RENTSAFE_PRE_SEG + "/landlords/communication",
            pageComponent: Communication,
         },
         {
            label: "R&M Pending Requests",
            path: RENTSAFE_PRE_SEG + "/rm-pending",
            segment: RENTSAFE_PRE_SEG + "/landlords/rm-pending",
            pageComponent: RMPendingRequests,
         },
      ],
   },
   {
      label: "Properties",
      segment: RENTSAFE_PRE_SEG + "/properties",
      subLinks: [
         {
            label: "Property List",
            path: RENTSAFE_PRE_SEG + "/property-list",
            segment: RENTSAFE_PRE_SEG + "/properties/property-list",
            pageComponent: PropertyLIst,
         },
         {
            label: "Property Performance Graph",
            path: RENTSAFE_PRE_SEG + "/pp-graph",
            segment: RENTSAFE_PRE_SEG + "/properties/pp-graph",
            pageComponent: PropertyPerformanceReports,
         },
         {
            label: "Inspections",
            path: RENTSAFE_PRE_SEG + "/inspections",
            segment: RENTSAFE_PRE_SEG + "/properties/inspections",
            pageComponent: Inspections,
         },
      ],
   },
   {
      label: "Maintenance",
      segment: RENTSAFE_PRE_SEG + "/maintenance",
      subLinks: [
         {
            label: "Work Orders",
            path: RENTSAFE_PRE_SEG + "/work-orders",
            segment: RENTSAFE_PRE_SEG + "/maintenance/work-orders",
            pageComponent: WorkOrders,
         },
         {
            label: "Maintenance Schedules",
            path: RENTSAFE_PRE_SEG + "/maintenance-schedules",
            segment: RENTSAFE_PRE_SEG + "/maintenance/maintenance-schedules",
            pageComponent: MaintenanceSchedules,
         },
         {
            label: "Contractor Management",
            path: RENTSAFE_PRE_SEG + "/contractor_management",
            segment: RENTSAFE_PRE_SEG + "/maintenance/contractor_management",
            pageComponent: ContractorManagement,
         },
         {
            label: "Costing Tracking",
            path: RENTSAFE_PRE_SEG + "/costing_tracking",
            segment: RENTSAFE_PRE_SEG + "/maintenance/costing_tracking",
            pageComponent: CostTracking,
         },
         {
            label: "R&M History",
            path: RENTSAFE_PRE_SEG + "/r_m-history",
            segment: RENTSAFE_PRE_SEG + "/maintenance/r_m-history",
            pageComponent: RMMaintanceHistory,
         },
      ],
   },
   {
      label: "Reports",
      segment: RENTSAFE_PRE_SEG + "/reports",
      subLinks: [
         {
            label: "Occupancy And vacancy",
            path: RENTSAFE_PRE_SEG + "/occupancy_vacancy",
            segment: RENTSAFE_PRE_SEG + "/reports/occupancy_vacancy",
            pageComponent: OccupancyVacancy,
         },
         {
            label: "Turnover",
            path: RENTSAFE_PRE_SEG + "/turnover",
            segment: RENTSAFE_PRE_SEG + "/reports/turnover",
            pageComponent: Turnover,
         },
      ],
   },

   {
      label: "Data",
      segment: RENTSAFE_PRE_SEG + "/data",
      subLinks: [
         {
            label: "Leases",
            path: RENTSAFE_PRE_SEG + "/leases",
            segment: RENTSAFE_PRE_SEG + "/tenants/leases",
            pageComponent: Leases,
         },
         {
            label: "Communication",
            path: RENTSAFE_PRE_SEG + "/communication",
            segment: RENTSAFE_PRE_SEG + "/tenants/communication",
            pageComponent: Communication,
         },
         {
            label: "Deposits",
            path: RENTSAFE_PRE_SEG + "/deposits",
            segment: RENTSAFE_PRE_SEG + "/tenants/deposits",
            pageComponent: Deposits,
         },
         {
            label: "Lease Template",
            path: RENTSAFE_PRE_SEG + "/lease-templates",
            segment: RENTSAFE_PRE_SEG + "/tenants/lease-templates",
            pageComponent: LeaseTemplate,
         },
      ],
   },
];
export const RENTSAFE_ACCOUNTING_NAVLINKS: NavLink[] = [
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
            label: "Debt Call",
            path: RENTSAFE_PRE_SEG + "/customers/debt-call",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/debt-call",
            pageComponent: DebtCall,
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
];
export const RENT_ADMIN_PANEL_NAVLINKS: NavLink[] = [
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
