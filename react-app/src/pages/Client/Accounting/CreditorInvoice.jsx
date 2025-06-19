import Layout from "../../../components/Layouts/client/Layout.jsx";
import SearchBar from "../../../components/SearchBar.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import ContentModal from "../../../components/ContentModal.jsx";
import useCreditorInvoice from "../../../hooks/page-hooks/useCreditorInvoice.js";
import DisbursementsAsyncSelect from "../../../components/DisbursementsAsyncSelect.jsx";
import { friendlyDate } from "../../../utils/index.js";

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
        title="Creditor Invoice"
        show={showAddModal}
        handleClose={handleClose}
        centerTitle
      >
        <form onSubmit={handleSubmit}>
          <CustomTable.Table>
            <CustomTable.ColGroup ratios={[1, null, null, 1, null, 1, 1, 1, 1, 1, 1]} />

            <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
              <tr>
                <th>Date</th>
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
                    <CustomTable.RemoveRowButtonTemplate
                      disabled={rows.length === 1}
                      onClick={() => removeRow(index)}
                    />
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={11} className="text-end">
                  <CustomTable.AddRowButtonTemplate onClick={addRow} />
                </td>
              </tr>
            </tbody>
          </CustomTable.Table>

          <div className="text-center mt-3">
            <CustomTable.ActionButtonTemplate type="submit" variant="info">
              Submit
            </CustomTable.ActionButtonTemplate>
          </div>
        </form>
      </ContentModal>

      <CustomTable.Table
        tabletitle="Creditor Invoice"
        tabletitleBg="danger"
        tabletitleColor="white"
      >
        <CustomTable.ColGroup ratios={[1, null, 1, null, 1, 1, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <td colSpan={8}>
              <div className="pt-1 d-flex justify-content-between align-items-center gap-4">
                <form onSubmit={handleFilters} className="d-flex gap-2 align-items-center">
                  <select
                    className="form-select form-select-sm custom-mn-w-1 custom-mx-w-1"
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
                    className="form-select form-select-sm custom-mn-w-1 custom-mx-w-1"
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
                </form>

                <div className="d-flex align-items-center gap-2">
                  <SearchBar placeholder="Search..." searchBy="q" />

                  <CustomTable.ActionButtonTemplate
                    variant="danger"
                    icon="add"
                    onClick={openAddModal}
                  >
                    New
                  </CustomTable.ActionButtonTemplate>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <th>Inv. Date</th>
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
            <CustomTable.LoadingIndicator colSpan={8} />
          ) : !Boolean(creditorInvoices?.length) ? (
            <CustomTable.NothingToShow colSpan={8} />
          ) : (
            creditorInvoices?.map((invoice, index) => (
              <tr key={index}>
                <td className="text-nowrap">
                  {invoice.date_created && friendlyDate(invoice.date_created)}
                </td>

                <td>{invoice.supplier}</td>

                <td className="text-nowrap">{invoice.invoice_number}</td>

                <td>{invoice.details}</td>

                <td>{invoice.currency}</td>

                <td className="text-end">{invoice.net_amount}</td>

                <td className="text-end">{invoice.vat}</td>

                <td className="text-end">{invoice.total_amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

CreditorInvoice.layout = (page) => <Layout children={page} title={"Creditor Invoices"} />;
