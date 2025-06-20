import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import NewPageHeader from "../../../components/NewPageHeader.jsx";
import useDetailedGeneralLedgerAccount from "../../../hooks/modal-hooks/useDetailedGeneralLedgerAccount";

export default function DetailedGeneralLedgerAccount() {
  const {
    rows,
    loading,
    tableTitle,
    contentRef,
    accountsList,
    transactionTotals,
    periodSelectionType,
    setPeriodSelectionType,
    printContent,
    handleSubmit,
  } = useDetailedGeneralLedgerAccount();

  return (
    <div>
      <NewPageHeader title="Detailed General Ledger" color="dark" />

      <form onSubmit={handleSubmit} className="mb-3">
        <div className="d-flex gap-2 justify-content-between align-items-end">
          <fieldset className="d-flex flex-fill custom-rounded-1 gap-3 border border-3">
            <legend>Account</legend>

            <div>
              <label className="form-label d-block">From</label>
              <select
                disabled={loading}
                className="c-form-select"
                name="account_from"
                id="account_from"
                defaultValue=""
              >
                <option disabled value="">
                  Select one
                </option>
                {accountsList.map((account, index) => (
                  <option key={index} value={account.accountNumber}>
                    {account.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label d-block">To</label>
              <select
                disabled={loading}
                className="c-form-select"
                name="account_to"
                id="account_to"
                defaultValue=""
              >
                <option disabled value="">
                  Select one
                </option>
                {accountsList.map((account, index) => (
                  <option key={index} value={account.accountNumber}>
                    {account.accountNumber}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className="d-flex flex-fill custom-rounded-1 gap-3 border border-3">
            <legend>Period Selection</legend>

            <div className="d-flex align-items-end gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="period_selection_type"
                  id="period_selection_type_month"
                  value="period_selection_type_month"
                  checked={periodSelectionType === "period_selection_type_month"}
                  onChange={(e) => {
                    setPeriodSelectionType(e.target.value);
                  }}
                />
                <label className="form-check-label">Month</label>
              </div>

              <select
                disabled={periodSelectionType !== "period_selection_type_month"}
                className="c-form-select"
                name="month"
                id="month"
                defaultValue="1"
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
            </div>

            <div className="d-flex align-items-end gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="period_selection_type"
                  id="period_selection_type_date"
                  value="period_selection_type_date"
                  checked={periodSelectionType === "period_selection_type_date"}
                  onChange={(e) => {
                    setPeriodSelectionType(e.target.value);
                  }}
                />
                <label className="form-check-label">Date</label>
              </div>

              <div>
                <label className="form-label">From</label>
                <input
                  disabled={periodSelectionType !== "period_selection_type_date"}
                  className="form-control form-control-sm"
                  name="period_selection_date_from"
                  id="period_selection_date_from"
                  type="date"
                />
              </div>

              <div>
                <label className="form-label">To</label>
                <input
                  disabled={periodSelectionType !== "period_selection_type_date"}
                  className="form-control form-control-sm"
                  name="period_selection_date_to"
                  id="period_selection_date_to"
                  type="date"
                />
              </div>
            </div>
          </fieldset>

          <div className="p-2">
            <button disabled={loading} type="submit" className="btn btn-sm btn-primary text-white">
              fetch
            </button>
          </div>
        </div>
      </form>

      <div ref={contentRef}>
        <CustomTable.Table tabletitle={tableTitle} tabletitleBg="info" tabletitleColor="white">
          <CustomTable.ColGroup ratios={[1, null, 1, 1, 1, 1]} />

          <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
            <tr>
              <th>Date</th>
              <th>Details</th>
              <th>Ref</th>
              <th className="text-end">
                <div className="custom-mn-w-05"> DR</div>
              </th>
              <th className="text-end">
                <div className="custom-mn-w-05"> CR</div>
              </th>
              <th className="text-end">
                <div className="custom-mn-w-05"> Balance</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <CustomTable.LoadingIndicator colSpan={6} />
            ) : rows.length === 0 ? (
              <CustomTable.NothingToShow colSpan={6} />
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="text-nowrap">{row.date}</td>
                  <td>{row.description}</td>
                  <td className="text-nowrap">{row.ref}</td>
                  <td className="text-end">{row.debit}</td>
                  <td className="text-end">{row.credit}</td>
                  <td className="text-end">{row.balance}</td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan={3} className="text-end">
                Transaction Totals
              </th>
              <th className="text-end">{transactionTotals.credit}</th>
              <th className="text-end">{transactionTotals.debit}</th>
              <th className="text-end">{transactionTotals.balance}</th>
            </tr>
          </tfoot>
        </CustomTable.Table>
      </div>

      <div className="text-end mt-4">
        <button onClick={printContent} type="button" className="btn btn-sm btn-info text-white">
          Print
        </button>
      </div>
    </div>
  );
}

DetailedGeneralLedgerAccount.layout = (page) => (
  <Layout children={page} title={"Detailed general ledger"} />
);
