import { friendlyDate } from "../../../utils/index.js";
import SearchBar from "../../../components/SearchBar.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import useCreditorInvoice from "../../../hooks/page-hooks/useCreditorInvoice.js";
import ContentModal from "../../../components/ContentModal.jsx";
import DisbursementsAsyncSelect from "../../../components/DisbursementsAsyncSelect.jsx";

export default function CreditorInvoice() {
  const {
    rows,
    loading,
    glAccounts,
    vatOptions,
    showAddModal,
    baseCurrency,
    creditorInvoices,
    handleCreditorSelect,
    handleFilters,
    openAddModal,
    handleSubmit,
    handleChange,
    handleClose,
    removeRow,
    addRow,
  } = useCreditorInvoice();

  return (
    <div>
      <ContentModal
        size="xl"
        titleOverideContent={
          <div className="bg-danger mb-4 text-white p-1 rounded-2 text-center">
            Creditor Invoice
          </div>
        }
        show={showAddModal}
        handleClose={handleClose}
        centerTitle
      >
        <form onSubmit={handleSubmit}>
          <table className="table table-sm table-bordered table-responsive bg-white">
            <thead className="position-sticky c-table-top shadow-sm c-z-5">
              <tr>
                <th className="ps-3">Date</th>
                <th>Creditor </th>
                <th>Details</th>
                <th>Inv Ref</th>
                <th>GL Acc Number</th>
                <th>Currency</th>
                <th className="text-end">Total Amount (Inc)</th>
                <th className="text-end">VAT</th>
                <th className="text-end">Net Amount (Excl)</th>
                <th className="text-end">Rate</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {rows?.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={row.date}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => handleChange(e, index)}
                      className="form-control"
                    />
                  </td>

                  <td>
                    <DisbursementsAsyncSelect
                      handleCreditorSelect={handleCreditorSelect}
                      index={index}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      name="details"
                      value={row.details}
                      onChange={(e) => handleChange(e, index)}
                      className="form-control"
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      name="inv_ref"
                      value={row.inv_ref}
                      onChange={(e) => handleChange(e, index)}
                      className="form-control"
                    />
                  </td>

                  <td>
                    <select
                      className="form-select"
                      name="gl_acc_number"
                      id="gl_acc_number"
                      value={row.gl_acc_number}
                      onChange={(e) => handleChange(e, index)}
                    >
                      <option value="">Select one</option>

                      {glAccounts.map((acc, index) => (
                        <option key={index} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      className="form-select"
                      name="currency"
                      id="currency"
                      value={row.currency}
                      onChange={(e) => handleChange(e, index)}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      <option value="USD">USD</option>
                      <option value="zig">ZIG</option>
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      name="total_amount_inc"
                      value={row.total_amount_inc}
                      onChange={(e) => handleChange(e, index)}
                      className="form-control"
                    />
                  </td>

                  <td>
                    <select
                      className="form-select"
                      name="vat"
                      id="vat"
                      value={row.vat}
                      onChange={(e) => handleChange(e, index)}
                    >
                      <option value="">Select one</option>

                      {vatOptions.map((vat, index) => (
                        <option key={index} value={vat.id}>
                          {vat.rate}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      name="net_amount_excl"
                      value={row.net_amount_excl}
                      readOnly
                      className="form-control"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      disabled={
                        String(baseCurrency).trim().toUpperCase() ===
                        String(row.currency).trim().toUpperCase()
                      }
                      name="rate"
                      value={row.rate}
                      onChange={(e) => handleChange(e, index)}
                      className="form-control"
                    />
                  </td>

                  <td>
                    <button
                      disabled={rows.length === 1}
                      type="button"
                      className="btn btn-dark btn-sm"
                      onClick={() => removeRow(index)}
                    >
                      <i className="material-icons">close</i>
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={10}>
                  <button type="button" className="btn btn-outline-info btn-sm" onClick={addRow}>
                    <i className="material-icons me-2">add</i>Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button type="submit" className="btn btn-info text-white">
              Submit
            </button>
          </div>
        </form>
      </ContentModal>

      <h5 className="mb-4 bg-danger text-center p-2 rounded-2 text-white">Creditor Invoice</h5>

      <div className="d-flex justify-content-between align-items-center gap-4 mb-5">
        <form onSubmit={handleFilters} className="d-flex border  gap-2 align-items-center">
          <select
            className="form-select"
            name="year"
            id="year"
            required
            value={new Date().getFullYear()}
            onChange={(e) => handleChange(e, index)}
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
            value={(new Date().getMonth() + 1).toString()}
            onChange={(e) => handleChange(e, index)}
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
          <SearchBar placeholder="Search..." searchBy="q" />
        </div>
      </div>

      <div>
        <h5 className="position-relative text-center mb-2 p-2 mb-0">
          Creditor Invoice List
          <div className="position-absolute top-0 end-0">
            <button className="btn btn-danger" onClick={openAddModal}>
              <i className="material-icons me-2">add</i>New
            </button>
          </div>
        </h5>

        <table className="table table-sm table-bordered table-responsive bg-white">
          <thead className="position-sticky c-table-top text-white bg-danger shadow-sm c-z-5">
            <tr>
              <th className="ps-3">Inv. Date</th>
              <th>Supplier</th>
              <th>Inv. Number</th>
              <th>Details</th>
              <th>Currency</th>
              <th className="text-end">Net Amount</th>
              <th className="text-end">VAT</th>
              <th className="text-end">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="custom-h-3 bg-white d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : !Boolean(creditorInvoices?.length) ? (
              <tr>
                <td colSpan={8}>
                  <div className="custom-h-2 bg-white d-flex justify-content-center align-items-center">
                    Nothing to show
                  </div>
                </td>
              </tr>
            ) : (
              creditorInvoices?.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.date_created && friendlyDate(invoice.date_created)}</td>

                  <td className="ps-3">{invoice.supplier}</td>

                  <td className="ps-3">{invoice.invoice_number}</td>

                  <td className="ps-3">{invoice.details}</td>

                  <td className="ps-3">{invoice.currency}</td>

                  <td className="ps-3 text-end">{invoice.net_amount}</td>

                  <td className="ps-3 text-end">{invoice.vat}</td>

                  <td className="ps-3 text-end">{invoice.total_amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CreditorInvoice.layout = (page) => <Layout children={page} title={"Creditor Invoices"} />;
