import ClientSidebarNavItemModal from "./ClientSidebarNavItemModal.jsx";
import useCashBookPayments from "../hooks/modal-hooks/useCashBookPayments.js";
import DisbursementsAsyncSelect from "./DisbursementsAsyncSelect.jsx";

export default function CashBookPayments(props) {
  const {
    data,
    rate,
    cashBooks,
    glAccounts,
    processing,
    shouldInputRate,
    requestCloseFlag,
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
    <ClientSidebarNavItemModal
      {...props}
      modalProps={{
        requestCloseFlag,
        navlinkTitle: "Payments",
        titleOverideContent: (
          <h5 className="text-center bg-danger text-white rounded-2 p-1 m-0 mb-4">Payments</h5>
        ),
        centerTitle: true,
        size: "xl",
        children: (
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex gap-4 justify-content-center align-items-center">
              <div className="mb-3 d-flex justify-content-center align-items-center gap-3 text-nowrap">
                <label htmlFor="cash_book" className="form-label">
                  Cash book:
                </label>

                <select
                  className="c-form-select"
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

              <div className="mb-3 d-flex justify-content-center align-items-center gap-3 text-nowrap">
                <label htmlFor="currency" className="form-label">
                  Currency:
                </label>
                <div>{cashBooks.find((book) => book.id == selectedCashBookId)?.currency}</div>
              </div>
            </div>

            <table className="table table-responsive table-bordered table-sm">
              <thead>
                <tr>
                  <th className="text-nowrap">Date</th>
                  <th className="text-nowrap">Pay Ref.</th>
                  <th className="text-nowrap">Type (GL/C)</th>
                  <th className="text-nowrap">Account</th>
                  <th className="text-nowrap">Details</th>
                  <th className="text-nowrap">Total Pay (Inc. VAT)</th>
                  <th className="text-nowrap">VAT</th>
                  <th className="text-nowrap">Matching Invoice</th>
                  <th className="text-nowrap">Rate</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {data.rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        className="form-control custom-w-fit"
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

                    <td className="custom-w-2">
                      {row.type === "creditor" ? (
                        <DisbursementsAsyncSelect
                          handleCreditorSelect={handleCreditorSelect}
                          index={row.id}
                        />
                      ) : row.type === "gl" ? (
                        <select
                          className="c-form-select py-2 w-100"
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

                    <td className="custom-w-170">
                      <input
                        placeholder="..."
                        className="form-control"
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
                      <button
                        disabled={data.rows.length === 1}
                        className="btn btn-danger btn-sm"
                        onClick={() => removeRow(row.id)}
                      >
                        <i className="material-icons">close</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={5} className="text-end fw-bold">
                    Batch Total:
                  </td>
                  <td className="text-end fw-bold">
                    {data.rows
                      .reduce((acc, row) => acc + Number(row.paymentAmount || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            <>
              <div className="px-2">
                <button type="button" className="btn btn-sm btn-success" onClick={addRow}>
                  <i className="material-icons">add</i>
                </button>
              </div>

              <div className="p-2 text-end">
                <button type="submit" className="btn btn-info text-white gap-2">
                  {processing ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm" />
                      <span>Processing..</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          </form>
        ),
      }}
    />
  );
}
