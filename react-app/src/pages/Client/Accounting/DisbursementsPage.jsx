import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useDisbursements from "../../../hooks/page-hooks/useDisbursements.js";
import DisbursementsAsyncSelect from "../../../components/DisbursementsAsyncSelect.jsx";

export default function DisbursementsPage() {
  const {
    data,
    processing,
    addRow,
    removeRow,
    handleSubmit,
    handleInputChange,
    handleCreditorSelect,
  } = useDisbursements();

  return (
    <form onSubmit={handleSubmit}>
      <CustomTable.Table tabletitle="Disbursements" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, 1, 1, 1, null, 1, 1, 1, 1]} />

        <thead>
          <tr>
            <th />
            <th>Date</th>
            <th>Creditor</th>
            <th>Ref</th>
            <th>Details</th>
            <th>Currency</th>
            <th>Amount Owing</th>
            <th>Paid Amount</th>
            <th>Net Balance</th>
          </tr>
        </thead>

        <tbody>
          {data.rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                <CustomTable.RemoveRowButtonTemplate
                  disabled={data.rows.length === 1 || processing}
                  onClick={() => removeRow(index)}
                />
              </td>

              <td>
                <input
                  required
                  type="date"
                  name="date"
                  value={row.date}
                  className="form-control"
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              <td>
                <DisbursementsAsyncSelect
                  handleCreditorSelect={handleCreditorSelect}
                  index={index}
                />
              </td>

              <td>
                <input
                  onChange={(e) => handleInputChange(e, index)}
                  value={row.ref}
                  className="form-control custom-mn-w-05"
                  name="ref"
                  id="ref"
                />
              </td>

              <td>
                <input
                  className="form-control"
                  id="details"
                  name="details"
                  value={row.details}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              <td className="text-center">
                <div className="mt-2">{row.currency || ""}</div>
              </td>

              <td className="text-center">
                <div className="mt-2">{row.amountOwing || ""}</div>
              </td>

              <td>
                <input
                  required
                  name="paidAmount"
                  value={row.paidAmount}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
              </td>

              <td>
                <input
                  name="netBalance"
                  value={Number(row.netBalance).toFixed(2)}
                  readOnly
                  className="form-control custom-no-pointer-events"
                />
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan={9}>
              <div className="d-flex justify-content-between align-items-center">
                <CustomTable.AddRowButtonTemplate onClick={addRow} />

                <CustomTable.ActionButtonTemplate type="submit" variant="info">
                  {processing ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm me-2" />
                      <span>Processing..</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </CustomTable.ActionButtonTemplate>
              </div>
            </td>
          </tr>
        </tbody>
      </CustomTable.Table>
    </form>
  );
}

DisbursementsPage.layout = (page) => <Layout children={page} title={"Disbursements"} />;
