import useSalesInvoicingInvoiceTab from "../../hooks/component-hooks/useSalesInvoicingInvoiceTab.js";
import { friendlyDate } from "../../utils/index.js";
import SearchBar from "../SearchBar.jsx";
import { SalesInvoiceForm } from "./SalesInvoiceForm.jsx";

export default function SalesInvoicingInvoiceTab() {
  const { loading, invoiceList, handleFilters } = useSalesInvoicingInvoiceTab();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center gap-4 mb-5">
        <form onSubmit={handleFilters} className="d-flex border  gap-2 align-items-center">
          <select
            className="form-select"
            name="year"
            id="year"
            required
            defaultValue={new Date().getFullYear()}
          >
            {new Array(new Date().getFullYear() - 2020).fill(0).map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            name="month"
            id="month"
            required
            defaultValue={(new Date().getMonth() + 1).toString()}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <div>
            <button type="submit" className="btn btn-success ">
              Submit
            </button>
          </div>
        </form>

        <div className="custom-mx-w-4">
          <SearchBar placeholder="Search..." searchBy="invoice" />
        </div>
      </div>

      <div>
        <h5 className="position-relative text-center mb-2 p-2 mb-0">
          Invoice List
          <div className="position-absolute top-0 end-0">
            <SalesInvoiceForm />
          </div>
        </h5>

        <table className="table table-sm table-bordered table-responsive bg-white">
          <thead className="position-sticky c-table-top text-white bg-info shadow-sm c-z-5">
            <tr>
              <th className="ps-3">Inv. #</th>
              <th>Date Created</th>
              <th>Customer</th>
              <th>Currency</th>
              <th className="text-end">Invoice Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-3 bg-white d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              //  : !Boolean(invoiceList?.length) ? (
              //   <tr>
              //     <td colSpan={6}>
              //       <div className="custom-h-3 bg-white d-flex justify-content-center align-items-center">
              //         Nothing to show
              //       </div>
              //     </td>
              //   </tr>
              // )
              invoiceList?.map((invoice, index) => (
                <tr key={index}>
                  <td className="ps-3">{invoice.id}</td>

                  <td className="ps-3">
                    {invoice.date_created && friendlyDate(invoice.date_created)}
                  </td>

                  <td className="ps-3">{invoice.customer}</td>

                  <td className="ps-3">{invoice.currency}</td>

                  <td className="ps-3 text-end">{invoice.total.toFixed(2)}</td>

                  <td className="d-flex justify-content-center align-items-center p-1">
                    <button className="btn btn-sm w-100 justify-content-center btn-info text-white">
                      View
                    </button>
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
