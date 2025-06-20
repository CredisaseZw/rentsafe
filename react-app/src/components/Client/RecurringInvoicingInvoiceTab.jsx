import CustomTable from "./table/CustomTable.jsx";
import useRecurringInvoicingInvoiceTab from "../../hooks/component-hooks/useRecurringInvoicingInvoiceTab.js";
import { SalesInvoiceForm } from "./SalesInvoiceForm.jsx";
import { friendlyDate } from "../../utils/index.js";

export default function RecurringInvoicingInvoiceTab() {
  const { loading, invoiceList } = useRecurringInvoicingInvoiceTab();

  return (
    <CustomTable.Table
      tabletitle="Recurring Invoices"
      tabletitleBg="danger"
      tabletitleColor="white"
    >
      <CustomTable.ColGroup ratios={[1, 1, null, null, 1]} />

      <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
        <tr>
          <th>Inv. #</th>
          <th>Invoice Date</th>
          <th>Customer Acc</th>
          <th>Customer Name</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <CustomTable.LoadingIndicator colSpan={6} />
        ) : !Boolean(invoiceList?.length) ? (
          <CustomTable.NothingToShow colSpan={6} />
        ) : (
          invoiceList?.map((invoice, index) => (
            <tr key={index}>
              <td className="text-nowrap">{invoice.id}</td>

              <td className="text-nowrap">
                {invoice.date_created && friendlyDate(invoice.date_created)}
              </td>

              <td>{invoice.customer_acc || ""}</td>

              <td>{invoice.customer}</td>

              <td>
                <CustomTable.ActionButtonsContainer>
                  <SalesInvoiceForm
                    invoice={invoice}
                    triggerLabel="Generate"
                    triggerVariant="danger"
                  />

                  <CustomTable.RemoveRowButtonTemplate />
                </CustomTable.ActionButtonsContainer>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </CustomTable.Table>
  );
}
