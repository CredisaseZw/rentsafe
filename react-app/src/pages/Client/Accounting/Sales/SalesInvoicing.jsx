import ProformaInvoicingInvoiceTab from "../../../../components/Client/ProformaInvoicingInvoiceTab.jsx";
import RecurringInvoicingInvoiceTab from "../../../../components/Client/RecurringInvoicingInvoiceTab.jsx";
import SalesInvoicingInvoiceTab from "../../../../components/Client/SalesInvoicingInvoiceTab.jsx";
import Layout from "../../../../components/Layouts/client/Layout.jsx";
import { useState } from "react";

const tabs = [
  { key: "Invoice", Content: SalesInvoicingInvoiceTab },
  { key: "Recurring", Content: RecurringInvoicingInvoiceTab },
  { key: "Proforma", Content: ProformaInvoicingInvoiceTab },
];

export default function SalesInvoicing({ invoice_list: recurringInvoices }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? "btn-info text-white" : "border border-2"}`}
          >
            {tab.key}
          </button>
        ))}
      </div>

      <div className="p-3">
        {<activeTab.Content {...(activeTab.key === "Recurring" ? { recurringInvoices } : {})} />}
      </div>
    </div>
  );
}

SalesInvoicing.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
