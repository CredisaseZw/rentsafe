import SearchBar from "../SearchBar.jsx";
import CustomTable from "./table/CustomTable.jsx";
import useSalesInvoicingInvoiceTab from "../../hooks/component-hooks/useSalesInvoicingInvoiceTab.js";
import { SalesInvoiceForm } from "./SalesInvoiceForm.jsx";
import { friendlyDate } from "../../utils/index.js";

export default function SalesInvoicingInvoiceTab({ isProforma = false }) {
  const { loading, invoiceList, applyFilters, reloadInvoices } =
    useSalesInvoicingInvoiceTab(isProforma);

  return (
    <CustomTable.Table
      tabletitle={isProforma ? "Proforma Invoice List" : "Invoice List"}
      tabletitleBg="info"
      tabletitleColor="white"
    >
      <CustomTable.ColGroup ratios={[1, 1, null, 1, 1, 1]} />

      <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
        <tr>
          <td colSpan={7}>
            <div className="d-flex justify-content-between align-items-center gap-4">
              <form onSubmit={applyFilters} className="d-flex gap-2 align-items-center">
                <select
                  className="form-select form-select-sm custom-w-1"
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
                  className="form-select form-select-sm custom-w-1"
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

                <CustomTable.ActionButtonTemplate type="submit" variant="success">
                  Apply Filter
                </CustomTable.ActionButtonTemplate>
              </form>

              <div className="d-flex align-items-center gap-2 pt-1">
                <SearchBar placeholder="Search..." searchBy="invoice" />

                <SalesInvoiceForm isProforma={isProforma} onClose={reloadInvoices} />
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <th>Inv. #</th>
          <th>Date Created</th>
          <th>Customer</th>
          <th>Currency</th>
          <th className="text-end">Invoice Total</th>
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

              <td>{invoice.customer_details.full_name}</td>

              <td className="text-nowrap">{invoice.currency.currency_code}</td>

              <td className="text-nowrap text-end">
                {invoice.total_inclusive && !Number.isNaN(Number(invoice.total_inclusive))
                  ? Number(invoice.total_inclusive).toFixed(2)
                  : ""}
              </td>

              <td>
                <CustomTable.ActionButtonTemplate disabled>View</CustomTable.ActionButtonTemplate>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </CustomTable.Table>
  );
}
