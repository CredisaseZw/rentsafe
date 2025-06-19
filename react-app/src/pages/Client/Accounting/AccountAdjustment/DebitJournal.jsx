import Layout from "../../../../components/Layouts/client/Layout.jsx";
import SearchCustomerComponent from "./SearchCustomer.jsx";
import useDebitJournal from "../../../../hooks/page-hooks/useDebitJournal.js";
import { formatCurrency } from "../../../../utils/formatting.js";
import CustomTable from "../../../../components/Client/table/CustomTable.jsx";

export default function DebitJournal() {
  const {
    rows,
    isLoading,
    addRow,
    setRows,
    removeRow,
    handleSubmit,
    getCustomerUrl,
    handleInputChange,
  } = useDebitJournal();

  return (
    <form onSubmit={handleSubmit}>
      <CustomTable.Table tabletitle="Debit Journal" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, 1, null, null, 1, 1, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Date</th>
            <th>Customer Type</th>
            <th>Customer</th>
            <th>Details</th>
            <th>Account Balance</th>
            <th>Debit Amount</th>
            <th>End Balance</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                <input
                  className="form-control form-control-sm"
                  type="date"
                  name="date"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  min={row.endDate ? new Date(row.endDate).toISOString().split("T")[0] : undefined}
                  value={row.date}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              <td>
                <select
                  className="form-select form-select-sm"
                  name="customerType"
                  value={row.customerType}
                  onChange={(e) => handleInputChange(e, index)}
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </td>

              <td className="position-relative" style={{ zIndex: rows.length - index }}>
                <SearchCustomerComponent
                  value={row.customerName}
                  setValue={(val) => {
                    const newRows = [...rows];
                    newRows[index].customerName = val;
                    setRows(newRows);
                  }}
                  url={getCustomerUrl(row.customerType)}
                  placeholder="Start typing"
                  delay={500}
                  type={row.customerType}
                  setCustomerName={(val) => {
                    const newRows = [...rows];
                    newRows[index].customerName = val;
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
                  name="details"
                  className="form-control form-control-sm"
                  id="details"
                  value={row.details}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              <td className="text-end">
                {row.accountBalance ? formatCurrency(row.accountBalance) : ""}
              </td>

              <td>
                <input
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control form-control-sm"
                  type="number"
                  id="debitAmount"
                  name="debitAmount"
                  value={row.debitAmount}
                  required
                />
              </td>

              <td className="text-end">
                {row.debitAmount
                  ? formatCurrency(Number(row.accountBalance) + Number(row.debitAmount))
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
        </tbody>
      </CustomTable.Table>

      <div className="text-end">
        <CustomTable.AddRowButtonTemplate onClick={addRow} />
      </div>

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

DebitJournal.layout = (page) => (
  <Layout children={page} title={"Customer Credit Adjustment - Debit Journal"} />
);
