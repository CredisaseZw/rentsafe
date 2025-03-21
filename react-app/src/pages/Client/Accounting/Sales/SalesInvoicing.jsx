import ProformaInvoicingInvoiceTab from "../../../../components/Client/ProformaInvoicingInvoiceTab.jsx";
import RecurringInvoicingInvoiceTab from "../../../../components/Client/RecurringInvoicingInvoiceTab.jsx";
import { SalesInvoiceForm } from "../../../../components/Client/SalesInvoiceForm.jsx";
import SalesInvoicingInvoiceTab from "../../../../components/Client/SalesInvoicingInvoiceTab.jsx";
import Layout from "../../../../components/Layouts/client/Layout.jsx";
import { useState } from "react";

const tabs = [
  { key: "Invoice", content: <SalesInvoicingInvoiceTab /> },
  { key: "Recurring", content: <RecurringInvoicingInvoiceTab /> },
  // { key: "Proforma", content: <ProformaInvoicingInvoiceTab /> },
];

export default function SalesInvoicing() {
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
        <SalesInvoiceForm
          isProforma
          triggerChildren="Proforma"
          triggerClassname="btn border border-2"
        />
      </div>

      <div className="p-3">{activeTab.content}</div>
    </div>
  );
}

SalesInvoicing.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
