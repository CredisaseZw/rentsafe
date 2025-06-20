import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useCashBookPayments from "../../../hooks/page-hooks/useCashBookPayments.js";
import DisbursementsAsyncSelect from "../../../components/DisbursementsAsyncSelect.jsx";
import { SearchBarStyles } from "../../../constants/index.js";

export default function CashBookPayments() {
  const {
    data,
    rate,
    cashBooks,
    glAccounts,
    processing,
    shouldInputRate,
    selectedCashBookId,
    addRow,
    removeRow,
    setRate,
    handleSubmit,
    handleInputChange,
    handleCreditorSelect,
    setSelectedCashBookId,
  } = useCashBookPayments();

  return (
    <form onSubmit={handleSubmit}>
      <CustomTable.Table tabletitle="Payments" tabletitleColor="white" tabletitleBg="danger">
        <CustomTable.ColGroup ratios={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <td colSpan={10}>
              <div className="d-flex gap-5 py-3 justify-content-center align-items-center">
                <div className="col-auto ">
                  <div className={SearchBarStyles.containerClassname}>
                    <label
                      htmlFor="sort"
                      className={SearchBarStyles.leftButtonClassname + " text-nowrap"}
                    >
                      Cash Book
                    </label>

                    <select
                      className="shadow-none form-select py-1 c-select border-0 rounded-0"
                      name="cash_book"
                      id="cash_book"
                      value={selectedCashBookId}
                      onChange={(e) => setSelectedCashBookId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {cashBooks.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-center align-items-center gap-3 text-nowrap">
                  <label htmlFor="currency" className="form-label">
                    Currency:
                  </label>
                  <div>
                    {cashBooks.find((book) => book.id == selectedCashBookId)?.currency || "N/A"}{" "}
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <th className="text-nowrap">Date</th>
            <th className="text-nowrap">Pay Ref.</th>
            <th className="text-nowrap">Type</th>
            <th className="text-nowrap">Account</th>
            <th className="text-nowrap">Details</th>
            <th className="text-nowrap">Total Pay (Inc. VAT)</th>
            <th className="text-nowrap">VAT</th>
            <th className="text-nowrap">Invoice</th>
            <th className="text-nowrap">Rate</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  className="form-control"
                  name="paymentDate"
                  type="date"
                  required
                  value={row.paymentDate}
                  onChange={(e) => handleInputChange(e, row.id)}
                  max={new Date().toISOString().split("T")[0]}
                  min={
                    row.type === "gl"
                      ? cashBooks.find((book) => book.id == selectedCashBookId)
                          ?.opening_balance_date
                      : row.minDate
                  }
                />
              </td>

              <td>
                <input
                  readOnly
                  value={row.receiptNumber}
                  className="form-control"
                  // name="receiptNumber"
                  // id="receiptNumber"
                />
              </td>

              <td>
                <select
                  className="c-form-select py-2"
                  name="type"
                  // id="type"
                  value={row.type}
                  onChange={(e) => handleInputChange(e, row.id)}
                >
                  <option value="gl">GL</option>
                  <option value="creditor">CR</option>
                </select>
              </td>

              <td>
                {row.type === "creditor" ? (
                  <DisbursementsAsyncSelect
                    handleCreditorSelect={handleCreditorSelect}
                    index={row.id}
                  />
                ) : row.type === "gl" ? (
                  <select
                    className="c-form-select py-2 custom-mn-w-15 w-100"
                    name="glAccount"
                    // id="gl_account"
                    value={row.glAccount}
                    onChange={(e) => handleInputChange(e, row.id)}
                  >
                    <option value="" disabled>
                      Select one
                    </option>

                    {glAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {`${acc.number} - ${acc.name}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  ""
                )}
              </td>

              <td>
                <input
                  placeholder="..."
                  className="form-control custom-mn-w-1"
                  // id="details"
                  name="details"
                  value={row.details}
                  onChange={(e) => handleInputChange(e, row.id)}
                />
              </td>

              <td>
                <input
                  required
                  name="paidAmount"
                  placeholder="0.00"
                  type="number"
                  value={row.paidAmount}
                  onChange={(e) => handleInputChange(e, row.id)}
                  className="form-control custom-mn-w-1"
                />
              </td>

              <td className="text-center">
                <input
                  name="vat"
                  type="checkbox"
                  value="yes"
                  disabled={row.type === "gl"}
                  checked={row.vat}
                  onChange={(e) => handleInputChange(e, row.id)}
                  className="form-check"
                />
              </td>

              <td
              // style={{
              //   backgroundColor: row.color == "light-red" ? "#f87171" : "",
              // }}
              // className={`bg-${
              //   row.color || ""
              // } text-white text-center d-block rounded border border-white border-3`}
              >
                {/* <div className="mt-2">{row.rent_owing}</div> */}
              </td>

              <td>
                <input
                  type="number"
                  name="rate"
                  className="form-control custom-mn-w-07"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0"
                  disabled={!shouldInputRate}
                />
              </td>

              <td>
                <CustomTable.RemoveRowButtonTemplate
                  disabled={data.rows.length === 1}
                  onClick={() => removeRow(row.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={5} className="text-end fw-bold">
              Batch Total
            </td>
            <td className="text-end fw-bold">
              {data.rows.reduce((acc, row) => acc + Number(row.paymentAmount || 0), 0).toFixed(2)}
            </td>
            <td />
            <td />
            <td />
            <td />
          </tr>
        </tfoot>
      </CustomTable.Table>

      <div className="px-2 d-flex justify-content-between align-items-center">
        <CustomTable.AddRowButtonTemplate onClick={addRow} />

        <CustomTable.ActionButtonTemplate type="submit">
          {processing ? (
            <>
              <span className="spinner-grow spinner-grow-sm d-inline-block me-2" />
              <span>Processing..</span>
            </>
          ) : (
            "Submit"
          )}
        </CustomTable.ActionButtonTemplate>
      </div>
    </form>
  );
}

CashBookPayments.layout = (page) => <Layout children={page} title={"Cash Book Payments"} />;
