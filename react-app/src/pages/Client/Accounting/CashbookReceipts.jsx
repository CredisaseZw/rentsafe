import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import CustomAsyncSelect from "../../../components/CustomAsyncSelect.jsx";
import useCashbookReceipts from "../../../hooks/page-hooks/useCashbookReceipts.js";
import { SearchBarStyles } from "../../../constants/index.js";

export default function CashbookReceipts() {
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
    handleTenantSelect,
    handlePaymentAmount,
    setSelectedCashBookId,
  } = useCashbookReceipts();

  return (
    <form onSubmit={handleSubmit}>
      <CustomTable.Table tabletitle="Receipts" tabletitleColor="white" tabletitleBg="dark">
        <CustomTable.ColGroup ratios={[1, 1, 1, 1, 1, 1, 1, 1, 1]} />

        <thead>
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
                    {cashBooks.find((book) => book.id == selectedCashBookId)?.currency || "N/A"}
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <th>Date</th>
            <th>Receipt Number</th>
            <th>Type</th>
            <th>Account</th>
            <th>Details</th>
            <th>Amount</th>
            <th>Matching Invoice</th>
            <th>Rate</th>
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

              <td>
                <div className="custom-mn-w-15">
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
                </div>
              </td>

              <td>
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
                <CustomTable.RemoveRowButtonTemplate
                  disabled={data.rows.length === 1}
                  onClick={() => removeRow(row.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
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

CashbookReceipts.layout = (page) => <Layout children={page} title={"Cash Book Receipts"} />;
