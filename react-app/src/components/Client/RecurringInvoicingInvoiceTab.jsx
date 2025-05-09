import useRecurringInvoicingInvoiceTab from "../../hooks/component-hooks/useRecurringInvoicingInvoiceTab.js";
import { friendlyDate } from "../../utils/index.js";
import { SalesInvoiceForm } from "./SalesInvoiceForm.jsx";

export default function RecurringInvoicingInvoiceTab({ recurringInvoices }) {
  const { loading, invoiceList } = useRecurringInvoicingInvoiceTab(recurringInvoices);

  return (
    <div>
      <div>
        <table className="table table-sm table-bordered table-responsive bg-white">
          <thead className="position-sticky c-table-top shadow-sm bg-white c-z-5">
            <tr>
              <th colSpan={6} className="p-0">
                <div className=" bg-danger text-white text-center p-2">Recurring Invoices</div>
              </th>
            </tr>
            <tr>
              <th className="ps-3">Inv. #</th>
              <th>Invoice Date</th>
              <th>Customer Acc</th>
              <th>Customer Name</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-2 bg-white d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : !Boolean(invoiceList?.length) ? (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-2 bg-white d-flex justify-content-center align-items-center">
                    Nothing to show
                  </div>
                </td>
              </tr>
            ) : (
              invoiceList?.map((invoice, index) => (
                <tr key={index}>
                  <td className="ps-3">{invoice.id}</td>

                  <td className="ps-3">
                    {invoice.date_created && friendlyDate(invoice.date_created)}
                  </td>

                  <td className="ps-3">{invoice.customer_acc || ""}</td>

                  <td className="ps-3">{invoice.customer}</td>

                  <td className="p-0 ">
                    <div className="d-flex justify-content-center align-items-center p-1">
                      <SalesInvoiceForm
                        invoice={invoice}
                        triggerChildren="Generate"
                        triggerClassname="btn btn-sm w-100  justify-content-center btn-danger"
                      />
                    </div>
                  </td>

                  <td className="p-0">
                    <div className="d-flex justify-content-center align-items-center p-1">
                      <button className="btn btn-sm w-100 justify-content-center btn-dark text-white">
                        <span>-</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
