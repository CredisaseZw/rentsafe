import Layout from "../../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../../components/Client/table/CustomTable.jsx";
import SearchCreditorComponent from "./SearchCreditor.jsx";
import useCreditorDebitJournal from "../../../../hooks/page-hooks/useCreditorDebitJournal.js";
import { formatCurrency } from "../../../../utils/formatting.js";

export default function CreditorDebitJournal() {
  const { rows, isLoading, addRow, setRows, removeRow, handleSubmit, handleInputChange } =
    useCreditorDebitJournal();

  return (
    <form onSubmit={handleSubmit}>
      <CustomTable.Table tabletitle="Debit Journal" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, null, 1, 1, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Date</th>
            <th>Creditor</th>
            <th>Details</th>
            <th>Account Balance</th>
            <th>Debit Amount</th>
            <th>End Balance</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                <input
                  required
                  type="date"
                  name="date"
                  value={row.date}
                  className="form-control form-control-sm"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleInputChange(e, index)}
                  min={row.endDate ? new Date(row.endDate).toISOString().split("T")[0] : undefined}
                />
              </td>

              <td className="position-relative" style={{ zIndex: rows.length - index }}>
                <SearchCreditorComponent
                  value={row.creditorName}
                  setValue={(val) => {
                    const newRows = [...rows];
                    newRows[index].creditorName = val;
                    setRows(newRows);
                  }}
                  // url={reverseUrl('get_client_individual_journals')}
                  url={reverseUrl("get_creditor_journals")}
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

              <td>
                <input
                  id="details"
                  name="details"
                  value={row.details}
                  className="form-control form-control-sm"
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              <td className="text-end">
                {row.accountBalance ? formatCurrency(row.accountBalance) : ""}
              </td>

              <td>
                <input
                  required
                  type="number"
                  id="debitAmount"
                  name="debitAmount"
                  value={row.debitAmount}
                  className="form-control form-control-sm"
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              <td className="text-end">
                {row.debitAmount
                  ? formatCurrency(Number(row.accountBalance) - Number(row.debitAmount))
                  : row.accountBalance
                    ? formatCurrency(Number(row.accountBalance))
                    : ""}
              </td>

              <td>
                <CustomTable.RemoveRowButtonTemplate
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                />
              </td>
            </tr>
          ))}

          <tr className="text-end">
            <td colSpan={7}>
              <CustomTable.AddRowButtonTemplate label="add row" onClick={addRow} />
            </td>
          </tr>
        </tbody>
      </CustomTable.Table>

      <div className="text-center mt-3">
        <CustomTable.ActionButtonTemplate type="submit">
          {isLoading ? (
            <>
              <span className="spinner-grow spinner-grow-sm"></span>
              <span className="ms-2">processing..</span>
            </>
          ) : (
            "Submit"
          )}
        </CustomTable.ActionButtonTemplate>
      </div>
    </form>
  );
}

CreditorDebitJournal.layout = (page) => (
  <Layout children={page} title={"Creditor Credit Adjustment - Debit Journal"} />
);
