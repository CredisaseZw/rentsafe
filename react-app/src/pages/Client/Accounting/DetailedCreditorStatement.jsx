import React, { useRef } from "react";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import { capitalize } from "lodash";
import moment from "moment";
import { formatCurrency } from "../../../utils/formatting.js";
import html2pdf from "html2pdf.js";

export default function DetailedCreditorStatement({ statement }) {
  const contentRef = useRef();
  console.log({ statement });

  const handlePrintToPdf = () => {
    const element = contentRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "modal-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  };

  return (
    <div>
      <div ref={contentRef}>
        <div
          style={{
            lineHeight: "5px",
            fontSize: "18px",
          }}
          className="bg-danger d-flex justify-content-between align-items-center text-white p-3"
        >
          <h4 className="fw-bold text-white mb-4">
            {capitalize(statement.creditor_name ? statement.creditor_name : "Creditor")} Statement -
            USD
          </h4>

          <div>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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

          <tbody>
            {Boolean(statement.rows?.length) &&
              statement.rows.map((row, index) => (
                <tr key={index}>
                  <th>{moment(row.date).format("YYYY-MM-DD")}</th>

                  <td>{row.description} </td>

                  <td>{row.ref}</td>

                  <td className="text-end">
                    {row.amount < 0
                      ? `(${formatCurrency(row.amount * -1)})`
                      : formatCurrency(row.amount)}
                  </td>

                  <td className="text-end">
                    {row.balance < 0
                      ? `(${formatCurrency(row.balance * -1)})`
                      : formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {!Boolean(statement.rows?.length) && (
          <div className="custom-h-4 d-flex justify-content-center align-items-center border border-2">
            Nothing to show
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end align-items-center gap-3 p-4">
        <button className="btn btn-primary" disabled>
          Period request
        </button>

        <button onClick={handlePrintToPdf} className="btn btn-info text-white">
          Print
        </button>
      </div>
    </div>
  );
}

DetailedCreditorStatement.layout = (page) => (
  <Layout children={page} title={"Detailed Creditor Statement"} />
);
