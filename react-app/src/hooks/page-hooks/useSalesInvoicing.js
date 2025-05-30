import React from "react";
import SalesInvoicingInvoiceTab from "../../components/Client/SalesInvoicingInvoiceTab.jsx";
import RecurringInvoicingInvoiceTab from "../../components/Client/RecurringInvoicingInvoiceTab.jsx";
import ProformaInvoicingInvoiceTab from "../../components/Client/ProformaInvoicingInvoiceTab.jsx";

const tabs = [
  { key: "Invoice", Content: SalesInvoicingInvoiceTab },
  { key: "Recurring", Content: RecurringInvoicingInvoiceTab },
  { key: "Proforma", Content: ProformaInvoicingInvoiceTab },
];

export default function useSalesInvoicing() {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  return {
    tabs,
    activeTab,
    setActiveTab,
  };
}
