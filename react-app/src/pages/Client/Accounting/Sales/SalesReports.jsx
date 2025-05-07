import Layout from "../../../../components/Layouts/client/Layout.jsx";
import useSalesReports from "../../../../hooks/page-hooks/useSalesReports.js";

export default function SalesReports() {
  const {
    rate,
    loading,
    zwgTotals,
    usdTotals,
    grandTotals,
    zwgRowsObject,
    usdRowsObject,
    selectedCurrency,
    periodSelectionType,
    setPeriodSelectionType,
    setSelectedCurrency,
  } = useSalesReports();

  return (
    <div>
      <h5 className="bg-info text-white p-2 text-center rounded-1">Sales Reports</h5>

      <div className="d-flex gap-2 my-4 text-nowrap">
        <fieldset className="d-flex justify-content-around align-items-end flex-fill gap-3 border custom-rounded-1 border-3">
          <legend className="px-1">Category</legend>

          <div>
            <label className="d-block form-label">From</label>
            <select
              disabled={loading}
              className="c-form-select"
              name="bureau_from"
              id="bureau_from"
              defaultValue="bureau"
            >
              <option value="bureau">Bureau</option>
            </select>
          </div>

          <div>
            <label className="d-block form-label">To</label>
            <select
              disabled={loading}
              className="c-form-select"
              name="bureau_to"
              id="bureau_to"
              defaultValue="bureau"
            >
              <option value="bureau">Bureau</option>
            </select>
          </div>
        </fieldset>

        <fieldset className="d-flex justify-content-around align-items-end flex-fill gap-3 border custom-rounded-1 border-3">
          <legend className="px-1">Currency</legend>

          <select
            disabled={loading}
            className="c-form-select w-100 bg-danger text-white"
            name="currency"
            id="currency"
            value={selectedCurrency}
            onChange={(e) => {
              setSelectedCurrency(e.target.value);
            }}
          >
            <option value="usd">USD - United States Dollars</option>
            <option value="zwg">ZWG - Zimbabwean Dollar</option>
            <option value="combined">Combined</option>
          </select>
        </fieldset>

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
          <thead className="shadow-sm sticky-top c-table-top bg-white c-force-borders">
            <tr>
              <th>
                <div> Date</div>
              </th>
              <th>
                <div> Inv #</div>
              </th>
              <th className="custom-mn-w-2">
                <div>Customer</div>
              </th>

              <th className="text-end">
                <div>Amount (Excl)</div>
              </th>
              <th className="text-end">
                <div>VAT</div>
              </th>
              <th className="text-end">
                <div>Total (Inc)</div>
              </th>

              {selectedCurrency === "combined" && (
                <>
                  <th className="text-center">
                    <div>Rate</div>
                  </th>
                  <th className="text-end">
                    <div>Amount (Excl)</div>
                  </th>
                  <th className="text-end">
                    <div>VAT</div>
                  </th>
                  <th className="text-end">
                    <div>Total (Inc)</div>
                  </th>
                </>
              )}
            </tr>

            {selectedCurrency === "combined" && (
              <tr>
                <th colSpan="3"></th>
                <th colSpan="3" className="text-center bg-danger text-white">
                  ZWG
                </th>
                <th></th>
                <th colSpan="3" className="text-center bg-danger text-white">
                  USD
                </th>
              </tr>
            )}
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
            ) : (
              <>
                {selectedCurrency !== "zwg" && (
                  <>
                    <tr>
                      <td colSpan={selectedCurrency === "combined" ? 10 : 6}>
                        <b className="bg-danger text-white p-2 d-inline-block mt-1 rounded-2 ">
                          USD
                        </b>
                      </td>
                    </tr>

                    <>
                      <tr>
                        <th colSpan={selectedCurrency === "combined" ? 10 : 6}>
                          <div className="fs-6 py-2">BUR001 - Consumer Enquiries</div>
                        </th>
                      </tr>

                      {usdRowsObject?.consumer_enquiries.map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>{row.inv}</td>
                          <td>{row.customer}</td>

                          {selectedCurrency === "combined" && (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          )}

                          <td className="text-end">{row.amountExcl}</td>
                          <td className="text-end">{row.vat}</td>
                          <td className="text-end">{row.totalInc}</td>
                        </tr>
                      ))}

                      <tr>
                        <th colSpan={3} className="text-end">
                          Totals Sales USD
                        </th>

                        {selectedCurrency === "combined" && (
                          <>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </>
                        )}

                        <th className="text-end">
                          {usdTotals.consumer_enquiries.amountExcl.toFixed(2)}
                        </th>
                        <th className="text-end">{usdTotals.consumer_enquiries.vat.toFixed(2)}</th>
                        <th className="text-end">
                          {usdTotals.consumer_enquiries.totalInc.toFixed(2)}
                        </th>
                      </tr>
                    </>

                    <>
                      <tr>
                        <th colSpan={selectedCurrency === "combined" ? 10 : 6}>
                          <div className="fs-6 py-2">BUR002 - Company Enquiries</div>
                        </th>
                      </tr>

                      {usdRowsObject?.company_enquiries.map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>{row.inv}</td>
                          <td>{row.customer}</td>

                          {selectedCurrency === "combined" && (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          )}

                          <td className="text-end">{row.amountExcl}</td>
                          <td className="text-end">{row.vat}</td>
                          <td className="text-end">{row.totalInc}</td>
                        </tr>
                      ))}

                      <tr>
                        <th colSpan={3} className="text-end">
                          Totals Sales USD
                        </th>

                        {selectedCurrency === "combined" && (
                          <>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </>
                        )}

                        <th className="text-end">
                          {usdTotals.company_enquiries.amountExcl.toFixed(2)}
                        </th>
                        <th className="text-end">{usdTotals.company_enquiries.vat.toFixed(2)}</th>
                        <th className="text-end">
                          {usdTotals.company_enquiries.totalInc.toFixed(2)}
                        </th>
                      </tr>
                    </>

                    <>
                      <tr>
                        <th colSpan={selectedCurrency === "combined" ? 10 : 6}>
                          <div className="fs-6 py-2">BUR003 - Rescission</div>
                        </th>
                      </tr>

                      {usdRowsObject?.rescission.map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>{row.inv}</td>
                          <td>{row.customer}</td>

                          {selectedCurrency === "combined" && (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          )}

                          <td className="text-end">{row.amountExcl}</td>
                          <td className="text-end">{row.vat}</td>
                          <td className="text-end">{row.totalInc}</td>
                        </tr>
                      ))}

                      <tr>
                        <th colSpan={3} className="text-end">
                          Totals Sales USD
                        </th>

                        {selectedCurrency === "combined" && (
                          <>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </>
                        )}

                        <th className="text-end">{usdTotals.rescission.amountExcl.toFixed(2)}</th>
                        <th className="text-end">{usdTotals.rescission.vat.toFixed(2)}</th>
                        <th className="text-end">{usdTotals.rescission.totalInc.toFixed(2)}</th>
                      </tr>
                    </>
                  </>
                )}

                {selectedCurrency !== "usd" && (
                  <>
                    <tr>
                      <td colSpan={selectedCurrency === "combined" ? 10 : 6}>
                        <b className="bg-danger text-white p-2 d-inline-block mt-1 rounded-2 ">
                          ZWG
                        </b>
                      </td>
                    </tr>

                    <>
                      <tr>
                        <th colSpan={selectedCurrency === "combined" ? 10 : 6}>
                          <div className="fs-6 py-2">BUR001 - Consumer Enquiries</div>
                        </th>
                      </tr>

                      {zwgRowsObject?.consumer_enquiries.map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>{row.inv}</td>
                          <td>{row.customer}</td>

                          <td className="text-end">{row.amountExcl}</td>
                          <td className="text-end">{row.vat}</td>
                          <td className="text-end">{row.totalInc}</td>

                          {selectedCurrency === "combined" && (
                            <>
                              <td className="text-danger text-center">{rate || ""}</td>
                              <td className="text-end">
                                {(Number(row.amountExcl || 0) / (rate || 1)).toFixed(2)}
                              </td>
                              <td className="text-end">
                                {(Number(row.vat || 0) / (rate || 1)).toFixed(2)}
                              </td>
                              <td className="text-end">
                                {(Number(row.totalInc || 0) / (rate || 1)).toFixed(2)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}

                      <tr>
                        <th colSpan={3} className="text-end">
                          Total Sales ZWG / USD equivalent
                        </th>

                        <th className="text-end">
                          {zwgTotals.consumer_enquiries.amountExcl.toFixed(2)}
                        </th>
                        <th className="text-end">{zwgTotals.consumer_enquiries.vat.toFixed(2)}</th>
                        <th className="text-end">
                          {zwgTotals.consumer_enquiries.totalInc.toFixed(2)}
                        </th>

                        {selectedCurrency === "combined" && (
                          <>
                            <td className="text-danger text-center">{rate || ""}</td>
                            <th className="text-end">
                              {(zwgTotals.consumer_enquiries.amountExcl / (rate || 1)).toFixed(2)}
                            </th>
                            <th className="text-end">
                              {(zwgTotals.consumer_enquiries.vat / (rate || 1)).toFixed(2)}
                            </th>
                            <th className="text-end">
                              {(zwgTotals.consumer_enquiries.totalInc / (rate || 1)).toFixed(2)}
                            </th>
                          </>
                        )}
                      </tr>
                    </>

                    <>
                      <tr>
                        <th colSpan={selectedCurrency === "combined" ? 10 : 6}>
                          <div className="fs-6 py-2">BUR002 - Company Enquiries</div>
                        </th>
                      </tr>

                      {zwgRowsObject?.company_enquiries.map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>{row.inv}</td>
                          <td>{row.customer}</td>

                          <td className="text-end">{row.amountExcl}</td>
                          <td className="text-end">{row.vat}</td>
                          <td className="text-end">{row.totalInc}</td>

                          {selectedCurrency === "combined" && (
                            <>
                              <td className="text-danger text-center">{rate || ""}</td>
                              <td className="text-end">
                                {(Number(row.amountExcl || 0) / (rate || 1)).toFixed(2)}
                              </td>
                              <td className="text-end">
                                {(Number(row.vat || 0) / (rate || 1)).toFixed(2)}
                              </td>
                              <td className="text-end">
                                {(Number(row.totalInc || 0) / (rate || 1)).toFixed(2)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}

                      <tr>
                        <th colSpan={3} className="text-end">
                          Total Sales ZWG / USD equivalent
                        </th>

                        <th className="text-end">
                          {zwgTotals.company_enquiries.amountExcl.toFixed(2)}
                        </th>
                        <th className="text-end">{zwgTotals.company_enquiries.vat.toFixed(2)}</th>
                        <th className="text-end">
                          {zwgTotals.company_enquiries.totalInc.toFixed(2)}
                        </th>

                        {selectedCurrency === "combined" && (
                          <>
                            <td className="text-danger text-center">{rate || ""}</td>
                            <th className="text-end">
                              {(zwgTotals.company_enquiries.amountExcl / (rate || 1)).toFixed(2)}
                            </th>
                            <th className="text-end">
                              {(zwgTotals.company_enquiries.vat / (rate || 1)).toFixed(2)}
                            </th>
                            <th className="text-end">
                              {(zwgTotals.company_enquiries.totalInc / (rate || 1)).toFixed(2)}
                            </th>
                          </>
                        )}
                      </tr>
                    </>

                    <>
                      <tr>
                        <th colSpan={selectedCurrency === "combined" ? 10 : 6}>
                          <div className="fs-6 py-2">BUR003 - Rescission</div>
                        </th>
                      </tr>

                      {zwgRowsObject?.rescission.map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>{row.inv}</td>
                          <td>{row.customer}</td>

                          <td className="text-end">{row.amountExcl}</td>
                          <td className="text-end">{row.vat}</td>
                          <td className="text-end">{row.totalInc}</td>

                          {selectedCurrency === "combined" && (
                            <>
                              <td className="text-danger text-center">{rate || ""}</td>
                              <td className="text-end">
                                {(Number(row.amountExcl || 0) / (rate || 1)).toFixed(2)}
                              </td>
                              <td className="text-end">
                                {(Number(row.vat || 0) / (rate || 1)).toFixed(2)}
                              </td>
                              <td className="text-end">
                                {(Number(row.totalInc || 0) / (rate || 1)).toFixed(2)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}

                      <tr>
                        <th colSpan={3} className="text-end">
                          Total Sales ZWG / USD equivalent
                        </th>

                        <th className="text-end">{zwgTotals.rescission.amountExcl.toFixed(2)}</th>
                        <th className="text-end">{zwgTotals.rescission.vat.toFixed(2)}</th>
                        <th className="text-end">{zwgTotals.rescission.totalInc.toFixed(2)}</th>

                        {selectedCurrency === "combined" && (
                          <>
                            <td className="text-danger text-center">{rate || ""}</td>
                            <th className="text-end">
                              {(zwgTotals.rescission.amountExcl / (rate || 1)).toFixed(2)}
                            </th>
                            <th className="text-end">
                              {(zwgTotals.rescission.vat / (rate || 1)).toFixed(2)}
                            </th>
                            <th className="text-end">
                              {(zwgTotals.rescission.totalInc / (rate || 1)).toFixed(2)}
                            </th>
                          </>
                        )}
                      </tr>
                    </>
                  </>
                )}
              </>
            )}
          </tbody>

          {!loading && (
            <tfoot className="bg-light">
              <tr>
                <th colSpan={selectedCurrency === "combined" ? 7 : 3} className="text-end">
                  Grand Total Sales USD
                </th>

                <th className="text-end">{grandTotals.amountExcl.toFixed(2)}</th>
                <th className="text-end">{grandTotals.vat.toFixed(2)}</th>
                <th className="text-end">{grandTotals.totalInc.toFixed(2)}</th>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

SalesReports.layout = (page) => <Layout children={page} title={"Sales Reports"} />;
