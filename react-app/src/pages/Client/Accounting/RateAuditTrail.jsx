import Layout from "../../../components/Layouts/client/Layout.jsx";
import useRateAuditTrail from "../../../hooks/page-hooks/useRateAuditTrail.js";
import { friendlyDate } from "../../../utils/index.js";

export default function RateAuditTrail() {
  const { rows, loading, periodSelectionType, setPeriodSelectionType } = useRateAuditTrail();

  return (
    <div>
      <h5 className="bg-danger text-white p-2 text-center rounded-1">Rate Audit Trail</h5>

      <div className="d-flex gap-2 my-4 text-nowrap">
        <fieldset className="d-flex justify-content-around align-items-end flex-fill gap-3 border custom-rounded-1 border-3">
          <legend className="px-1">Period Selection</legend>

          <div className="d-flex align-items-end gap-3">
            <div className="form-check">
              <input
                disabled={loading}
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
              disabled={loading || periodSelectionType !== "period_selection_type_month"}
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
                disabled={loading}
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
                disabled={loading || periodSelectionType !== "period_selection_type_date"}
                className="form-control form-control-sm"
                name="period_selection_date_from"
                id="period_selection_date_from"
                type="date"
              />
            </div>

            <div>
              <label className="form-label">To</label>
              <input
                disabled={loading || periodSelectionType !== "period_selection_type_date"}
                className="form-control form-control-sm"
                name="period_selection_date_to"
                id="period_selection_date_to"
                type="date"
              />
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <table className="table table-bordered table-responsive table-sm bg-white">
          <thead className="shadow-sm sticky-top c-table-top bg-white ">
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th className="custom-mn-w-2">User</th>
              <th className="text-end">Base USD</th>
              <th>Convert Currency</th>
              <th className="text-end">Rate</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-5">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5">
                  Nothing to show
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  <td>{friendlyDate(row.date)}</td>
                  <td>{row.source}</td>
                  <td>{row.user}</td>
                  <td className="text-end">{row.baseUsd}</td>
                  <td>{row.convertCurrency}</td>
                  <td className="text-end">{row.rate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

RateAuditTrail.layout = (page) => <Layout children={page} title={"Rate Audit Trail"} />;
