import Layout from "../../../../components/Layouts/client/Layout.jsx";
import useSalesInvoicing from "../../../../hooks/page-hooks/useSalesInvoicing.js";

export default function SalesInvoicing({ invoice_list: recurringInvoices }) {
  const { tabs, activeTab, setActiveTab } = useSalesInvoicing();

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

SalesInvoicing.layout = (page) => <Layout children={page} title={"Sales Invoicing"} />;
