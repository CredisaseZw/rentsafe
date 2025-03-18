import React from "react";
import Layout from "../../../../components/Layouts/client/Layout.jsx";
import SearchCreditorComponent from "./SearchCreditor.jsx";
import { formatCurrency } from "../../../../utils/formatting.js";
import useCreditorCreditJournal from "../../../../hooks/page-hooks/useCreditorCreditJournal.js";

export default function CreditorCreditJournal() {
  const { rows, isLoading, addRow, setRows, removeRow, handleSubmit, handleInputChange } =
    useCreditorCreditJournal();

  return (
    <>
      <div className="bg-white border rounded-3">
        <h5 className="text-center p-2 mb-0 text-white bg-danger">Credit Journal</h5>

        <form className="p-2" onSubmit={handleSubmit}>
          <table className="table table-responsive table-bordered table-sm">
            <thead className="position-sticky c-table-top bg-white shadow-sm c-z-5">
              <tr>
                <th className="text-nowrap">Date</th>
                <th className="text-nowrap">Creditor</th>
                <th className="text-nowrap">Details</th>
                <th className="text-nowrap">Account Balance</th>
                <th className="text-nowrap">Credit Amount</th>
                <th className="text-nowrap">End Balance</th>
                <th className="text-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="custom-w-170">
                    <input
                      className="form-control custom-w-fit"
                      type="date"
                      name="date"
                      required
                      max={new Date().toISOString().split("T")[0]}
                      min={
                        row.endDate ? new Date(row.endDate).toISOString().split("T")[0] : undefined
                      }
                      value={row.date}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>

                  <td
                    className="custom-w-170 position-relative"
                    style={{ zIndex: rows.length - index }}
                  >
                    <SearchCreditorComponent
                      value={row.creditorName}
                      setValue={(val) => {
                        const newRows = [...rows];
                        newRows[index].creditorName = val;
                        setRows(newRows);
                      }}
                      // url={reverseUrl('get_client_individual_journals')}
                      url=""
                      placeholder="Start typing"
                      delay={500}
                      setCreditorName={(val) => {
                        const newRows = [...rows];
                        newRows[index].creditorName = val;
                        setRows(newRows);
                      }}
                      setLeaseId={(val) => {
                        const newRows = [...rows];
                        newRows[index].leaseId = val;
                        setRows(newRows);
                      }}
                      setOpeningBalance={(val) => {
                        const newRows = [...rows];
                        newRows[index].accountBalance = val;
                        setRows(newRows);
                      }}
                      setEndDate={(val) => {
                        const newRows = [...rows];
                        newRows[index].endDate = val;
                        setRows(newRows);
                      }}
                    />
                  </td>

                  <td className="custom-w-3">
                    <textarea
                      name="details"
                      className="form-control"
                      rows={2}
                      id="details"
                      value={row.details}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>

                  <td className="text-end">
                    {row.accountBalance ? formatCurrency(row.accountBalance) : ""}
                  </td>

                  <td className="custom-w-150">
                    <input
                      onChange={(e) => handleInputChange(e, index)}
                      className="form-control"
                      type="number"
                      id="creditAmount"
                      name="creditAmount"
                      value={row.creditAmount}
                      required
                    />
                  </td>

                  <td className="text-end">
                    {row.creditAmount
                      ? formatCurrency(Number(row.accountBalance) + Number(row.creditAmount))
                      : row.accountBalance
                        ? formatCurrency(Number(row.accountBalance))
                        : ""}
                  </td>

                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeRow(index)}
                      disabled={rows.length === 1}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end p-2">
            <button type="button" className="btn btn-success" onClick={addRow}>
              <i className="leading-icon material-icons">add</i>
              Add Row
            </button>
          </div>

          <div className="text-center mb-3">
            <button type="submit" className="btn btn-info text-white">
              {isLoading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="ms-2">processing..</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

CreditorCreditJournal.layout = (page) => (
  <Layout children={page} title={"Creditor Credit Adjustment - Credit Journal"} />
);
