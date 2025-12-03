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
import CustomerStatements from "@/routes/rent-safe/accounting/customers/CustomerStatements";
import CustomerDebitJournals from "@/routes/rent-safe/accounting/customers/CustomerJournals/CustomerDebitJournals";
import CustomerCreditJournals from "@/routes/rent-safe/accounting/customers/CustomerJournals/CustomerCreditJournals";
import CreditorStatements from "@/routes/rent-safe/accounting/creditors/CreditorStatements";
import DebitJournals from "@/routes/rent-safe/accounting/creditors/CreditorJournals/DebitJournals";
import CreditJournals from "@/routes/rent-safe/accounting/creditors/CreditorJournals/CreditJournals";
import GeneralJournals from "@/routes/rent-safe/accounting/generalLedgers/GeneralJournals";
import SettingsCurrency from "@/routes/rent-safe/accounting/settings/SettingsCurrency";
import VATSettings from "@/routes/rent-safe/accounting/settings/VATSettings";
import AccountsSectors from "@/routes/rent-safe/accounting/settings/GeneralLedger/AccountsSectors";
import PaymentsTypes from "@/routes/rent-safe/accounting/settings/CashBooks/PaymentsTypes";
import SubscriptionManagement from "@/routes/rent-safe/admin/SubscriptionManagement";
import SalesCashSales from "@/routes/rent-safe/accounting/sales/SalesCashSales";
import SalesCreditNotes from "@/routes/rent-safe/accounting/sales/SalesCreditNotes/SalesCreditNotes";
import SalesItems from "@/routes/rent-safe/accounting/sales/SalesItems";
import SalesCategories from "@/routes/rent-safe/accounting/sales/SalesCategories";
import CashbookReceipts from "@/routes/rent-safe/accounting/cashbooks/CashbookReceipts";
import CashbookPayments from "@/routes/rent-safe/accounting/cashbooks/CashbookPayments";
import CashbookBankReconciliation from "@/routes/rent-safe/accounting/cashbooks/CashbookBankReconciliation";
import CashbookRequisitions from "@/routes/rent-safe/accounting/cashbooks/CashbookRequisitions";
import Lists from "@/routes/rent-safe/accounting/settings/CashBooks/Lists";
import AccountsLists from "@/routes/rent-safe/accounting/settings/GeneralLedger/AccountsLists";
import SalesReportsCommission from "@/routes/rent-safe/accounting/sales/SalesReports/SalesReportsCommission";
import CashbookReportsCashflowForecasts from "@/routes/rent-safe/accounting/cashbooks/CashbookReports/CashbookReportsCashflowForecasts";
import CashbookReportsCashflowReports from "@/routes/rent-safe/accounting/cashbooks/CashbookReports/CashbookReportsCashflowReports";
import CashbookReportsBankReconciliation from "@/routes/rent-safe/accounting/cashbooks/CashbookReports/CashbookReportsBankReconciliation";
import CustomerAgedAnalysis from "@/routes/rent-safe/accounting/customers/CustomerAgedAnalysis";
import CreditorInvoices from "@/routes/rent-safe/accounting/creditors/CreditorInvoices";
import CreditorAgedAnalysis from "@/routes/rent-safe/accounting/creditors/CreditorAgedAnalysis";
import GeneralLedgersStatementsAccountingLists from "@/routes/rent-safe/accounting/generalLedgers/Statements/GeneralLedgersStatementsAccountingLists";
import GeneralLedgers from "@/routes/rent-safe/accounting/generalLedgers/GeneralLedgers";
import CurrencyRateAuditTrail from "@/routes/rent-safe/accounting/reports/CurrencyRateAuditTrail";
import ReportsFinancialStatementsProfitLoss from "@/routes/rent-safe/accounting/reports/FinancialStatements/ReportsFinancialStatementsProfitLoss";
import ReportsFinancialStatementsBalanceSheet from "@/routes/rent-safe/accounting/reports/FinancialStatements/ReportsFinancialStatementsBalanceSheet";
import ReportsFinancialStatementsCashflowStatements from "@/routes/rent-safe/accounting/reports/FinancialStatements/ReportsFinancialStatementsCashflowStatements";
import CustomerSettings from "@/routes/rent-safe/accounting/settings/CustomerSettings";
import CompanySettings from "@/routes/rent-safe/accounting/settings/CompanySettings";
import CreditorSettings from "@/routes/rent-safe/accounting/settings/CreditorSettings";
import OpeningBalances from "@/routes/rent-safe/accounting/settings/OpeningBalances";
import SalesInvoices from "@/routes/rent-safe/accounting/sales/SalesInvoicing/SalesInvoices";

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
            pageComponent: SalesInvoices,
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
            pageComponent: SalesCreditNotes,
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
            label: "Reports",
            baseColor : "red",
            segment: RENTSAFE_PRE_SEG + "/accounting/sales/sales-reports",
            subLinks: [
               {
                  label: "Commission",
                  path: RENTSAFE_PRE_SEG + "/sales/sales-reports/sales-commission",
                  segment: RENTSAFE_PRE_SEG + "/accounting/sales/sales-reports/sales-commission",
                  pageComponent: SalesReportsCommission,
               },

            ],
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
         },
         {
            label: "Reports",
            baseColor : "green",
            segment: RENTSAFE_PRE_SEG + "/accounting/cashbook/cashbook-reports",
            subLinks: [
               {
                  label: "Bank Reconciliation",
                  path: RENTSAFE_PRE_SEG + "/cashbook/cashbook-reports/bank-reconciliation",
                  segment: RENTSAFE_PRE_SEG + "/accounting/cashbook/cashbook-reports/bank-reconciliation",
                  pageComponent: CashbookReportsBankReconciliation,
               },
               {
                  label: "Cashflow Report",
                  path: RENTSAFE_PRE_SEG + "/cashbook/cashbook-reports/cash-flow-report",
                  segment: RENTSAFE_PRE_SEG + "/accounting/cashbook/cashbook-reports/cash-flow-report",
                  pageComponent: CashbookReportsCashflowReports,
               },
               {
                  label: "Cashflow Forecast",
                  path: RENTSAFE_PRE_SEG + "/cashbook/cashbook-reports/cash-flow-forecast",
                  segment: RENTSAFE_PRE_SEG + "/accounting/cashbook/cashbook-reports/cash-flow-forecast",
                  pageComponent: CashbookReportsCashflowForecasts,
               },


            ],
         },
      ],
   },
   {
      label: "Customers",
      baseColor : "black",
      segment: RENTSAFE_PRE_SEG + "/accounting/customers",
      subLinks: [
         {
            label: "Customer Statements",
            path: RENTSAFE_PRE_SEG + "/customers/statements",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/statements",
            pageComponent: CustomerStatements,
         },
         {
           label: "Aged Analysis",
            path: RENTSAFE_PRE_SEG + "/customers/aged-analysis",
            segment: RENTSAFE_PRE_SEG + "/accounting/customers/aged-analysis",
            pageComponent: CustomerAgedAnalysis,  
         },
         {
            label: "Customer Journals",
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
            label: "Creditor Invoice",
            path: RENTSAFE_PRE_SEG + "/creditors/creditor-invoice",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors/creditor-invoice",
            pageComponent: CreditorInvoices,
         },
         {
            label: "Creditor Statements",
            path: RENTSAFE_PRE_SEG + "/creditors/statements",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors/statements",
            pageComponent: CreditorStatements,
         },
         {
            label : "Aged Analysis",
            path: RENTSAFE_PRE_SEG + "/creditors/aged-analysis",
            segment: RENTSAFE_PRE_SEG + "/accounting/creditors/aged-analysis",
            pageComponent : CreditorAgedAnalysis
         },
         {
            label: "Creditor Journals",
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
            label : "General Ledgers",
            path : RENTSAFE_PRE_SEG + "/general-ledgers/general-ledgers",
            segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/general-ledgers",
            pageComponent : GeneralLedgers
         },
         {
            label : "Statements",
            baseColor : "lightBlue",
            segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/statements",
            subLinks : [
               {
                  label : "Accounts Lists",
                  path : RENTSAFE_PRE_SEG + "/general-ledgers/statements/accounts-lists",
                  segment : RENTSAFE_PRE_SEG + "/accounting/general-ledgers/statements/accounts-lists",
                  pageComponent : GeneralLedgersStatementsAccountingLists
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
            label: "Currency Rate Audit Trails",
            path: RENTSAFE_PRE_SEG + "/reports/rate-audit-trails",
            segment: RENTSAFE_PRE_SEG + "/accounting/reports/rate-audit-trails",
            pageComponent: CurrencyRateAuditTrail,
         },
         {
            label : "Financial Statements",
            segment: RENTSAFE_PRE_SEG + "/accounting/reports/financial-statements",
            baseColor: "red",
            subLinks : [
               {
                  label : "Profit & Loss",
                  path : RENTSAFE_PRE_SEG + "/reports/financial-statements/profit-loss",
                  segment: RENTSAFE_PRE_SEG + "/accounting/reports/financial-statements/profit-loss",
                  pageComponent: ReportsFinancialStatementsProfitLoss
               },
               {
                  label : "Balance Sheet",
                  path : RENTSAFE_PRE_SEG + "/reports/financial-statements/balance-sheet",
                  segment: RENTSAFE_PRE_SEG + "/accounting/reports/financial-statements/balance-sheet",
                  pageComponent: ReportsFinancialStatementsBalanceSheet
               },
               {
                  label : "Cashflow Statements",
                  path : RENTSAFE_PRE_SEG + "/reports/financial-statements/cashflow-statements",
                  segment: RENTSAFE_PRE_SEG + "/accounting/reports/financial-statements/cashflow-statements",
                  pageComponent: ReportsFinancialStatementsCashflowStatements
               },
            ]
         }
      ],
   },
   {
      label: "Settings",
      baseColor: "purple",
      segment: RENTSAFE_PRE_SEG + "/accounting/settings",
      subLinks: [
         {
            label: "Customer Settings",
            path: RENTSAFE_PRE_SEG + "/settings/customer-settings",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/customer-settings",
            pageComponent: CustomerSettings,
         },
         {
            label: "Company Settings",
            path: RENTSAFE_PRE_SEG + "/settings/company-settings",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/company-settings",
            pageComponent: CompanySettings,
         },
         {
            label: "Creditor Settings",
            path: RENTSAFE_PRE_SEG + "/settings/creditor-settings",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/creditor-settings",
            pageComponent: CreditorSettings,
         },
         {
            label: "Opening Balances",
            path: RENTSAFE_PRE_SEG + "/settings/opening-balances-settings",
            segment: RENTSAFE_PRE_SEG + "/accounting/settings/opening-balances-settings",
            pageComponent: OpeningBalances,
         },
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
                  pageComponent: AccountsLists
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
