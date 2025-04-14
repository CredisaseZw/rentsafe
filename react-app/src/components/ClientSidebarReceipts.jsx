import ClientSidebarNavItemModal from "./ClientSidebarNavItemModal.jsx";
import useClientSidebarReceipts from "../hooks/modal-hooks/useClientSidebarReceipts.js";
import CustomAsyncSelect from "./CustomAsyncSelect.jsx";

export default function ClientSidebarReceipts(props) {
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
    handleTenantSelect,
    handlePaymentAmount,
    setSelectedCashBookId,
  } = useClientSidebarReceipts();

  return (
    <ClientSidebarNavItemModal
      {...props}
      modalProps={{
        requestCloseFlag,
        navlinkTitle: "Receipts",
        titleOverideContent: (
          <h5 className="text-center bg-dark text-white rounded-2 p-1 m-0 mb-4">Receipts</h5>
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
                  <th className="text-nowrap">Receipt Number</th>
                  <th className="text-nowrap">Type (GL/C)</th>
                  <th className="text-nowrap">Account</th>
                  <th className="text-nowrap">Details</th>
                  <th className="text-nowrap">Amount</th>
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
                        min={row.minDate}
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
                        <option value="customer">Customer</option>
                      </select>
                    </td>

                    <td className="custom-w-2">
                      {row.type === "customer" ? (
                        <CustomAsyncSelect
                          extraProps={{ className: "w-100", required: true }}
                          url={reverseUrl("get_all_active_leases")}
                          onChange={(selectedOption) => handleTenantSelect(selectedOption, row.id)}
                          value={row.tenant ? { label: row.tenant, value: row.lease_id } : null}
                          defaultValue={null}
                          isDisabled={false}
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
                        name="paymentAmount"
                        placeholder="0.00"
                        type="number"
                        value={row.paymentAmount}
                        onChange={(e) => handleInputChange(e, row.id)}
                        className={
                          row.isVariable
                            ? "form-control border-2 custom-no-pointer-events"
                            : "form-control custom-mn-w-1"
                        }
                        readOnly={row.isVariable}
                      />

                      {row.isVariable && (
                        <div className="mt-1">
                          <div className="mb-1">
                            <label className="small form-label">Rent</label>
                            <input
                              name="baseAmount"
                              type="number"
                              className="form-control form-control-sm"
                              value={row.baseAmount}
                              onChange={(e) => handlePaymentAmount(e, row.id)}
                            />
                          </div>

                          <div className="mb-1">
                            <label className="small form-label">OPC</label>
                            <input
                              name="operatingCost"
                              type="number"
                              className="form-control form-control-sm"
                              value={row.operatingCost}
                              onChange={(e) => handlePaymentAmount(e, row.id)}
                            />
                          </div>
                        </div>
                      )}
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
