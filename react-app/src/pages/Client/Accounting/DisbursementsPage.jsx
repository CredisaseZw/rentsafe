import Layout from "../../../components/Layouts/client/Layout.jsx";
import useDisbursements from "../../../hooks/page-hooks/useDisbursements.js";
import DisbursementsAsyncSelect from "../../../components/DisbursementsAsyncSelect.jsx";
import NewPageHeader from "../../../components/NewPageHeader.jsx";

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
    <div>
      <NewPageHeader title="Disbursements" noMargin />

      <div>
        <form onSubmit={handleSubmit}>
          <table className="bg-white table table-responsive table-bordered table-sm">
            <thead>
              <tr>
                <th className="text-nowrap"></th>
                <th className="text-nowrap">Date</th>
                <th className="text-nowrap">Creditor</th>
                <th className="text-nowrap">Ref</th>
                <th className="text-nowrap">Details</th>
                <th className="text-nowrap">Currency</th>
                <th className="text-nowrap">Amount Owing</th>
                <th className="text-nowrap">Paid Amount</th>
                <th className="text-nowrap">Net Balance</th>
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="px-1 py-0 border-end-0">
                    {data.rows.length > 1 && (
                      <button
                        className="btn btn-close btn-sm mt-3"
                        onClick={() => removeRow(index)}
                      />
                    )}
                  </td>

                  <td>
                    <input
                      className="form-control custom-w-fit"
                      type="date"
                      name="date"
                      value={row.date}
                      onChange={(e) => handleInputChange(e, index)}
                      required
                    />
                  </td>

                  <td className="custom-w-2">
                    <DisbursementsAsyncSelect
                      handleCreditorSelect={handleCreditorSelect}
                      index={index}
                    />
                  </td>

                  <td>
                    <input
                      onChange={(e) => handleInputChange(e, index)}
                      value={row.ref}
                      className="form-control"
                      name="ref"
                      id="ref"
                    />
                  </td>

                  <td className="custom-w-170">
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
            </tbody>
          </table>

          <div className="p-2 d-flex justify-content-between align-items-center">
            <button type="button" className="btn btn-sm btn-success" onClick={addRow}>
              <i className="material-icons">add</i>
            </button>

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
        </form>
      </div>
    </div>
  );
}

DisbursementsPage.layout = (page) => <Layout children={page} title={"Disbursements"} />;
