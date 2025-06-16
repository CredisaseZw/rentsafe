import moment from "moment";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import useCommissionStatement from "../../../hooks/page-hooks/useCommissionStatement.js";
import { formatCurrency } from "../../../utils/formatting.js";

export default function CommissionStatement({ statement }) {
  const { type, date, contentRef, handlePrintToPdf } = useCommissionStatement(statement);

  return (
    <div>
      <div ref={contentRef}>
        <div
          style={{
            lineHeight: "5px",
            fontSize: "18px",
          }}
          className="bg-info d-flex justify-content-between align-items-center text-white p-3"
        >
          <h4 className="fw-bold text-white mb-4">Commissions Statement - {type} - USD</h4>

          <div>
            Period: <span className="text-decoration-underline"> {date}</span>
          </div>
        </div>

        <table
          style={{ lineHeight: "5px", fontSize: "12px" }}
          className="table table-bordered table-responsive"
        >
          <thead className="position-sticky c-table-top">
            <tr className="c-thead-bg">
              <th>Date</th>
              <td>Description</td>
              <td>Ref</td>
              <td>Amount</td>
              <td>Balance</td>
            </tr>
          </thead>

          {Boolean(statement.rows.length) && (
            <tbody>
              {statement.rows.map((item, index) => (
                <tr key={index}>
                  <th>{moment(item.date).format("YYYY-MM-DD")}</th>

                  <td>{item.description} </td>

                  <td>{item.ref}</td>

                  <td className="text-end">
                    {item.amount < 0
                      ? `(${formatCurrency(item.amount * -1)})`
                      : formatCurrency(item.amount)}
                  </td>

                  <td className="text-end">
                    {item.balance < 0
                      ? `(${formatCurrency(item.balance * -1)})`
                      : formatCurrency(item.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {!Boolean(statement.rows.length) && (
          <div className="custom-h-4 bg-white d-flex justify-content-center align-items-center border border-2">
            Nothing to show
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end align-items-center gap-3 p-4">
        <button onClick={handlePrintToPdf} className="btn btn-info text-white">
          Print
        </button>
      </div>
    </div>
  );
}

CommissionStatement.layout = (page) => (
  <Layout children={page} title={"Detailed Commission Statement"} />
);
