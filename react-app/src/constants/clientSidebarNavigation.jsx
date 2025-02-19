import AdverseData from '../components/AdverseData.jsx';
import SubscriptionsManagement from '../components/Client/SubscriptionsManagement.jsx';
import ClientSidebarReceipts from '../components/ClientSidebarReceipts.jsx';
import CommissionStatementsSelection from '../components/CommissionStatementsSelection.jsx';
import Disbursements from '../components/Disbursements.jsx';
import CurrencySettings from '../components/modals/sidebar/CurrencySettings.jsx';
import ToDoList from '../components/modals/sidebar/ToDoList.jsx';

export const clientSidebarNavigation = [
  {
    navLink: 'Dashboard',
    type: 'link',
    href: reverseUrl('home'),
  },
  {
    navLink: 'To Do List',
    type: 'modal',
    component: <ToDoList />,
  },
  {
    navLink: 'Services',
    subNavLinks: [
      {
        navLink: 'RentSafe',
        type: 'link',
        href: reverseUrl('client-leases'),
      },
    ],
  },
  {
    navLink: 'Data',
    subNavLinks: [
      {
        navLink: 'Claim',
        type: 'modal',
        component: <AdverseData />,
      },
    ],
  },
  {
    navLink: 'Accounting',
    subNavLinks: [
      {
        navLink: 'Customers',
        subNavLinks: [
          {
            navLink: 'Invoicing',
            type: 'link',
            href: reverseUrl('client_invoice'),
          },
          {
            navLink: 'Receipts',
            type: 'modal',
            component: <ClientSidebarReceipts />,
          },
          {
            navLink: 'Customer Statements',
            type: 'link',
            href: reverseUrl('tenant_statements'),
          },
          {
            navLink: 'Journals',
            subNavLinks: [
              {
                navLink: 'Debit Journal',
                type: 'link',
                href: reverseUrl('debit_journal'),
              },
              {
                navLink: 'Credit Journal',
                type: 'link',
                href: reverseUrl('credit_journal'),
              },
            ],
          },
          {
            navLink: 'Debt Call',
            type: 'link',
            href: reverseUrl('debt_call'),
          },
        ],
      },
      {
        navLink: 'Creditors',
        subNavLinks: [
          {
            navLink: 'Disbursements',
            type: 'modal',
            component: <Disbursements />,
          },
          {
            navLink: 'Creditor Statements',
            type: 'link',
            href: reverseUrl('creditor_statements'),
          },
          {
            navLink: 'Journals',
            subNavLinks: [
              {
                navLink: 'Debit Journal',
                type: 'link',
                href: reverseUrl('creditor_debit_journal'),
              },
              {
                navLink: 'Credit Journal',
                type: 'link',
                href: reverseUrl('creditor_credit_journal'),
              },
            ],
          },
        ],
      },
      {
        navLink: 'Reports',
        subNavLinks: [
          {
            navLink: 'Commission Statements',
            type: 'modal',
            component: <CommissionStatementsSelection />,
          },
          {
            navLink: 'Cashflow Forecasts',
            type: 'link',
            href: reverseUrl('forecasts'),
          },
        ],
      },
      {
        navLink: 'Settings',
        subNavLinks: [
          {
            navLink: 'Currency',
            type: 'modal',
            component: <CurrencySettings />,
          },
        ],
      },
    ],
  },
  {
    navLink: 'Admin',
    subNavLinks: [
      {
        navLink: 'Internal Users',
        type: 'link',
        href: reverseUrl('client-users'),
      },
      {
        navLink: 'Subscription Management',
        type: 'modal',
        component: <SubscriptionsManagement />,
      },
    ],
  },
];
