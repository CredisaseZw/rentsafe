import useRecurringInvoicingInvoiceTab from "../../hooks/component-hooks/useRecurringInvoicingInvoiceTab.js";
import { friendlyDate } from "../../utils/index.js";

export default function RecurringInvoicingInvoiceTab() {
  const { loading, invoiceList } = useRecurringInvoicingInvoiceTab();
  console.log(invoiceList[0]);
  return (
    <div>
      <div>
        <table className="table table-sm table-bordered table-responsive bg-white">
          <thead className="position-sticky c-table-top shadow-sm c-z-5">
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

                  <td className="ps-3"></td>

                  <td className="ps-3">{invoice.customer}</td>

                  <td className="p-0">
                    <div className="d-flex justify-content-center align-items-center p-1">
                      <button className="btn btn-sm w-100 justify-content-center btn-info text-white">
                        View
                      </button>
                    </div>
                  </td>

                  <td className="p-0">
                    <div className="d-flex justify-content-center align-items-center p-1">
                      <button className="btn btn-sm w-100 justify-content-center btn-dark text-white">
                        <i className="material-icons">close</i>
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
