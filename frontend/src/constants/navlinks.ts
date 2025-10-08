import type { NavLink } from "@/types";
import Home from "@/routes/Home";
import NotFound from "@/routes/NotFound";
import ServicesHub from "@/routes/ServicesHub";
import InternalUsers from "@/routes/rent-safe/admin/InternalUsers";
import RentSafeDashboard from "@/routes/rent-safe/Dashboard";
import Login from "@/routes/Login";
import Leases from "@/routes/rent-safe/tenants/Leases";
import LeaseTemplate from "@/routes/rent-safe/tenants/LeaseTemplate";
import PropertyList from "@/routes/rent-safe/properties/PropertyList";
import Sandbox from "@/routes/Sandbox";
import LandlordStatements from "@/routes/rent-safe/landlords/LandlordStatements";
import Claim from "@/routes/rent-safe/data/claim";
import Commission from "@/routes/rent-safe/reports/Commission";
import CustomersInvoicing from "@/routes/rent-safe/accounting/customers/CustomersInvoicing";
import CustomerStatements from "@/routes/rent-safe/accounting/customers/CustomerStatements";
import CustomerDebtCall from "@/routes/rent-safe/accounting/customers/CustomerDebtCall";
import CustomerDebitJournals from "@/routes/rent-safe/accounting/customers/CustomerJournals/CustomerDebitJournals";
import CustomerCreditJournals from "@/routes/rent-safe/accounting/customers/CustomerJournals/CustomerCreditJournals";
import CreditorDisbursements from "@/routes/rent-safe/accounting/creditors/CreditorDisbursements";
import CreditorStatements from "@/routes/rent-safe/accounting/creditors/CreditorStatements";
import DebitJournals from "@/routes/rent-safe/accounting/creditors/CreditorJournals/DebitJournals";
import CreditJournals from "@/routes/rent-safe/accounting/creditors/CreditorJournals/CreditJournals";
import GeneralJournals from "@/routes/rent-safe/accounting/generalLedgers/GeneralJournals";
import DefaultGeneralLedgerAccounts from "@/routes/rent-safe/accounting/generalLedgers/Reports/DefaultGeneralLedgerAccounts";
import AccountingLists from "@/routes/rent-safe/accounting/generalLedgers/Reports/AccountingLists";
import ReportsSettings from "@/routes/rent-safe/accounting/generalLedgers/Reports/ReportsSettings";
import CommissionStatements from "@/routes/rent-safe/accounting/reports/CommissionStatements";
import CashflowForecasts from "@/routes/rent-safe/accounting/reports/CashflowForecasts";
import RateAuditTrail from "@/routes/rent-safe/accounting/reports/RateAuditTrail";
import SettingsCurrency from "@/routes/rent-safe/accounting/settings/SettingsCurrency";
import VATSettings from "@/routes/rent-safe/accounting/settings/VATSettings";
import AccountsSectors from "@/routes/rent-safe/accounting/settings/GeneralLedger/AccountsSectors";
import PaymentsTypes from "@/routes/rent-safe/accounting/settings/CashBooks/PaymentsTypes";
import SubscriptionManagement from "@/routes/rent-safe/admin/SubscriptionManagement";
import SalesInvoicing from "@/routes/rent-safe/accounting/sales/SalesInvoicing";
import SalesCashSales from "@/routes/rent-safe/accounting/sales/SalesCashSales";
import SalesCreditNote from "@/routes/rent-safe/accounting/sales/SalesCreditNote";
import SalesItems from "@/routes/rent-safe/accounting/sales/SalesItems";
import SalesCategories from "@/routes/rent-safe/accounting/sales/SalesCategories";
import SalesReports from "@/routes/rent-safe/accounting/sales/SalesReports";
import CashbookReceipts from "@/routes/rent-safe/accounting/cashbooks/CashbookReceipts";
import CashbookPayments from "@/routes/rent-safe/accounting/cashbooks/CashbookPayments";
import CashbookBankReconciliation from "@/routes/rent-safe/accounting/cashbooks/CashbookBankReconciliation";
import CashbookRequisitions from "@/routes/rent-safe/accounting/cashbooks/CashbookRequisitions";
import Lists from "@/routes/rent-safe/accounting/settings/CashBooks/Lists";

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

export const RENTSAFE_PRE_SEG = "/services/rent-safe";
export const RENTSAFE_APP_NAVLINKS: NavLink[] = [
   {
      label: "Dashboard",
      path: RENTSAFE_PRE_SEG + "/",
      segment: RENTSAFE_PRE_SEG + "/",
      pageComponent: RentSafeDashboard,
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
            label: "Tenant Statement",
            path: RENTSAFE_PRE_SEG + "/tenant-statement",
            segment: RENTSAFE_PRE_SEG + "/tenants/tenant-statement",
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
         }
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
            pageComponent: PropertyList,
         }
      ],
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
         }
      ],
   },
   {
      label: "Reports",
      segment: RENTSAFE_PRE_SEG + "/reports",
      subLinks: [
         {
            label: "Commission",
            path: RENTSAFE_PRE_SEG + "/commission",
            segment: RENTSAFE_PRE_SEG + "/reports/commission",
            pageComponent: Commission,
         },
      
      ],
   },

];

export const RENTSAFE_ACCOUNTING_NAVLINKS: NavLink[] = [
   {
      label: "Sales",
      baseColor : "red",
      segment: RENTSAFE_PRE_SEG + "/accounting/sales",
      subLinks: [
         {
            label: "Invoicing",
            path: RENTSAFE_PRE_SEG + "/sales/invoicing",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/invoicing",
            pageComponent: SalesInvoicing,
         },
         {
            label: "Cash Sales",
            path: RENTSAFE_PRE_SEG + "/sales/cash-sales",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/cash-sales",
            pageComponent: SalesCashSales,
         },
         {
            label: "Credit Note",
            path: RENTSAFE_PRE_SEG + "/sales/credit-note",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/credit-note",
            pageComponent: SalesCreditNote,
         },
         {
            label: "Sales Items",
            path: RENTSAFE_PRE_SEG + "/sales/sales-items",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/sales-items",
            pageComponent: SalesItems,
         },
         {
            label: "Sales Categories",
            path: RENTSAFE_PRE_SEG + "/sales/sales-categories",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/sales-categories",
            pageComponent: SalesCategories,
         },
         {
            label: "Sales Reports",
            path: RENTSAFE_PRE_SEG + "/sales/sales-reports",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/sales-reports",
            pageComponent: SalesReports,
         }, 
      ],
   },
   {
      label: "Cashbooks",
      baseColor : "green",
      segment: RENTSAFE_PRE_SEG + "/accounting/cashbooks",
      subLinks: [
         {
            label: "Receipts",
            path: RENTSAFE_PRE_SEG + "/cashbooks/receipts",
            segment: RENTSAFE_PRE_SEG + "/accounting/cashbooks/receipts",
            pageComponent: CashbookReceipts,
         },
         {
            label: "Requisition",
            path: RENTSAFE_PRE_SEG + "/cashbooks/requisition",
            segment: RENTSAFE_PRE_SEG + "/accounting/cashbooks/requisition",
            pageComponent: CashbookRequisitions,
         },
         {
            label: "Payments",
            path: RENTSAFE_PRE_SEG + "/cashbooks/payments",
            segment: RENTSAFE_PRE_SEG + "/accounting/cashbooks/payments",
            pageComponent: CashbookPayments,
         },
         {
            label: "Bank Reconciliation",
            path: RENTSAFE_PRE_SEG + "/cashbooks/bank-reconciliation",
            segment: RENTSAFE_PRE_SEG + "/accounting/cashbooks/bank-reconciliation",
            pageComponent: CashbookBankReconciliation,
         }
      ],
   },
   {
      label: "Customers",
      baseColor : "black",
      segment: RENTSAFE_PRE_SEG + "/accounting/customers",
      subLinks: [
         {
            label: "Invoicing",
            path: RENTSAFE_PRE_SEG + "/customers/invoicing",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/invoicing",
            pageComponent: CustomersInvoicing,
         },
         {
            label: "Customer Statements",
            path: RENTSAFE_PRE_SEG + "/customers/statements",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/statements",
            pageComponent: CustomerStatements,
         },
         {
            label: "Debt Call",
            path: RENTSAFE_PRE_SEG + "/customers/debt-call",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/debt-call",
            pageComponent: CustomerDebtCall,
         },
         {
            label: "Journals",
            baseColor : "black",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/journals",
            subLinks: [
               {
                  label: "Debit Journal",
                  path: RENTSAFE_PRE_SEG + "/customers/journals/debit",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/journals/debit",
                  pageComponent: CustomerDebitJournals,
               },
               {
                  label: "Credit Journal",
                  path: RENTSAFE_PRE_SEG + "/customers/journals/credit",
                  segment: RENTSAFE_PRE_SEG + "/accounting/customers/journals/credit",
                  pageComponent: CustomerCreditJournals,
               },
            ],
         },
      ],
   },
   {
      label: "Creditors",
      baseColor : "blue",
      segment: RENTSAFE_PRE_SEG + "/accounting/creditors",
      subLinks: [
         {
            label: "Disbursements",
            path: RENTSAFE_PRE_SEG + "/creditors/disbursements",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors/disbursements",
            pageComponent: CreditorDisbursements,
         },
         {
            label: "Creditor Statements",
            path: RENTSAFE_PRE_SEG + "/creditors/statements",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors/statements",
            pageComponent: CreditorStatements,
         },
         {
            label: "Journals",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors/journals",
            baseColor : "blue",
            subLinks: [
               {
                  label: "Debit Journal",
                  path: RENTSAFE_PRE_SEG + "/creditors/journals/debit",
                  segment: RENTSAFE_PRE_SEG + "/accounting/creditors/journals/debit",
                  pageComponent: DebitJournals,
               },
               {
                  label: "Credit Journal",
                  path: RENTSAFE_PRE_SEG + "/creditors/journals/credit",
                  segment: RENTSAFE_PRE_SEG + "/accounting/creditors/journals/credit",
                  pageComponent: CreditJournals,
               },
            ],
         },
      ],
   },
   {
      label: "General Ledgers",
      baseColor : "lightBlue",
      segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers",
      subLinks :[
         {
            label : "General Journals",
            path : RENTSAFE_PRE_SEG + "/general-ledgers/general-journals",
            segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/general-journals",
            pageComponent : GeneralJournals
         },
         {
            label : "Reports",
            baseColor : "lightBlue",
            segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/reports",
            subLinks : [
               {
                  label : "Default General Ledger Accounts",
                  path : RENTSAFE_PRE_SEG + "/general-ledgers/general-journals/reports/default-general-ledger-accounts",
                  segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/general-journals/reports/default-general-ledger-accounts",
                  pageComponent : DefaultGeneralLedgerAccounts
               },
               {
                  label: "Accounts List",
                  path : RENTSAFE_PRE_SEG + "/general-ledgers/general-journals/reports/accounts-list",
                  segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/general-journals/reports/accounts-list",
                  pageComponent : AccountingLists
               },
               {
                  label: "Settings",
                  path : RENTSAFE_PRE_SEG + "/general-ledgers/general-journals/reports/settings",
                  segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/general-journals/reports/settings",
                  pageComponent : ReportsSettings
               }
            ]
         }
      ]

   },
   {
      label: "Reports",
      baseColor : "red",
      segment: RENTSAFE_PRE_SEG + "/accounting/reports",
      subLinks: [
         {
            label: "Commission Statements",
            path: RENTSAFE_PRE_SEG + "/reports/commission-statements",
            segment: RENTSAFE_PRE_SEG + "/accounting/reports/commission-statements",
            pageComponent: CommissionStatements,
         },
         {
            label: "Cashflow Forecasts",
            path: RENTSAFE_PRE_SEG + "/reports/forecasts",
            segment: RENTSAFE_PRE_SEG + "/accounting/reports/forecasts",
            pageComponent: CashflowForecasts,
         },
         {
            label: "Rate Audit Trails",
            path: RENTSAFE_PRE_SEG + "/reports/rate-audit-trails",
            segment: RENTSAFE_PRE_SEG + "/accounting/reports/rate-audit-trails",
            pageComponent: RateAuditTrail,
         },
      ],
   },
   {
      label: "Settings",
      baseColor: "purple",
      segment: RENTSAFE_PRE_SEG + "/accounting/settings",
      subLinks: [
         {
            label: "Currency",
            path: RENTSAFE_PRE_SEG + "/settings/currency",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/currency",
            pageComponent: SettingsCurrency,
         },
         {
            label: "V.A.T Settings",
            path: RENTSAFE_PRE_SEG + "/settings/vat-settings",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/vat-settings",
            pageComponent: VATSettings,
         },
         {
            label : "General Ledger",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/general-ledger",
            baseColor: "purple",
            subLinks : [
               {
                  label : "Accounts List",
                  path : RENTSAFE_PRE_SEG + "/settings/general-ledger/accounts-list",
                  segment: RENTSAFE_PRE_SEG + "/accounting/settings/general-ledger/accounts-list",
                  pageComponent: AccountingLists
               },
               {
                  label : "Accounts Sectors",
                  path : RENTSAFE_PRE_SEG + "/settings/general-ledger/accounts-sectors",
                  segment: RENTSAFE_PRE_SEG + "/accounting/settings/general-ledger/accounts-sectors",
                  pageComponent: AccountsSectors
               },
            ]
         },
         {
            label : "Cash book",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/cash-book",
            baseColor: "purple",
            subLinks : [
               {
                  label : "Payment Types",
                  path : RENTSAFE_PRE_SEG + "/settings/cash-book/payment-types",
                  segment: RENTSAFE_PRE_SEG + "/accounting/settings/cash-book/payment-types",
                  pageComponent: PaymentsTypes
               },
               {
                  label : "List",
                  path : RENTSAFE_PRE_SEG + "/settings/cash-book/list",
                  segment: RENTSAFE_PRE_SEG + "/accounting/settings/cash-book/list",
                  pageComponent: Lists
               },
            ]
         }
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
