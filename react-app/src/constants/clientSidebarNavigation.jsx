import { color } from 'chart.js/helpers';
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
        navLink: 'Sales',
        // color: 'firebrick',
        subNavLinks: [
          {
            navLink: 'Invoicing',
            // color: 'firebrick',
            type: 'link',
            href: reverseUrl('client_invoice'),
          },
          {
            navLink: 'Cash Sales',
            // color: 'firebrick',
            type: 'link',
            href: '',
          },
          {
            navLink: 'Products & Services',
            // color: 'firebrick',
            type: 'link',
            href: '',
          },
          {
            navLink: 'Sales Categories',
            // color: 'firebrick',
            type: 'link',
            href: reverseUrl('sales_categories'),
          },
          {
            navLink: 'Sales Accounts',
            // color: 'firebrick',
            type: 'link',
            href: '',
          },
          {
            navLink: 'V.A.T Settings',
            // color: 'firebrick',
            type: 'link',
            href: '',
          },
        ],
      },
      {
        navLink: 'Cashbooks',
        // color: '#00823d',
        type: 'link',
        href: '',
      },
      {
        navLink: 'Customers',
        // color: 'black',
        subNavLinks: [
          {
            navLink: 'Receipts',
            // color: 'black',
            type: 'modal',
            component: <ClientSidebarReceipts />,
          },
          {
            navLink: 'Customer Statements',
            // color: 'black',
            type: 'link',
            href: reverseUrl('tenant_statements'),
          },
          {
            navLink: 'Journals',
            // color: 'black',
            subNavLinks: [
              {
                navLink: 'Debit Journal',
                // color: 'black',
                type: 'link',
                href: reverseUrl('debit_journal'),
              },
              {
                navLink: 'Credit Journal',
                // color: 'black',
                type: 'link',
                href: reverseUrl('credit_journal'),
              },
            ],
          },
          {
            navLink: 'Debt Call',
            // color: 'black',
            type: 'link',
            href: reverseUrl('debt_call'),
          },
        ],
      },
      {
        navLink: 'Creditors',
        // color: '#11158f',
        subNavLinks: [
          {
            navLink: 'Disbursements',
            // color: '#11158f',
            type: 'modal',
            component: <Disbursements />,
          },
          {
            navLink: 'Creditor Statements',
            // color: '#11158f',
            type: 'link',
            href: reverseUrl('creditor_statements'),
          },
          {
            navLink: 'Journals',
            // color: '#11158f',
            subNavLinks: [
              {
                navLink: 'Debit Journal',
                // color: '#11158f',
                type: 'link',
                href: reverseUrl('creditor_debit_journal'),
              },
              {
                navLink: 'Credit Journal',
                // color: '#11158f',
                type: 'link',
                href: reverseUrl('creditor_credit_journal'),
              },
            ],
          },
        ],
      },
      {
        navLink: 'General Ledger',
        // color: '#2aa7d1',
        type: 'link',
        href: '',
      },
      {
        navLink: 'Reports',
        // color: 'red',
        subNavLinks: [
          {
            navLink: 'Commission Statements',
            // color: 'red',
            type: 'modal',
            component: <CommissionStatementsSelection />,
          },
          {
            navLink: 'Cashflow Forecasts',
            // color: 'red',
            type: 'link',
            href: reverseUrl('forecasts'),
          },
        ],
      },
      {
        navLink: 'Settings',
        // color: 'purple',
        subNavLinks: [
          {
            navLink: 'Currency',
            // color: 'purple',
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
