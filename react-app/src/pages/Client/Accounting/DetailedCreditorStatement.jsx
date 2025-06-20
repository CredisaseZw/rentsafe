import Layout from "../../../components/Layouts/client/Layout.jsx";
import html2pdf from "html2pdf.js";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import { useRef } from "react";
import { capitalize } from "lodash";
import { friendlyDate } from "../../../utils/index.js";
import { formatCurrency } from "../../../utils/formatting.js";

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
        <CustomTable.Table
          tabletitleOverideContent={
            <div className="d-flex text-start justify-content-between align-items-center p-3">
              <div>
                <h4 className="text-white fw-bold">
                  {capitalize(statement.creditor_name ? statement.creditor_name : "Creditor")}{" "}
                  Statement - USD
                </h4>
              </div>

              <div>
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          }
          tabletitleBg="danger"
          tabletitleColor="white"
          size="lg"
        >
          <CustomTable.ColGroup ratios={[1, null, 1, 1, 1]} />

          <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
            <tr className="c-thead-bg">
              <th>Date</th>
              <td>Description</td>
              <td>Ref</td>
              <td>Amount</td>
              <td>Balance</td>
            </tr>
          </thead>

          <tbody>
            {statement?.rows?.length ? (
              statement.rows.map((row, index) => (
                <tr key={index}>
                  <td className="text-nowrap">{friendlyDate(row.date)}</td>
                  <td>{row.description}</td>
                  <td className="text-nowrap">{row.ref}</td>
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
              ))
            ) : (
              <CustomTable.NothingToShow colSpan={5} />
            )}
          </tbody>
        </CustomTable.Table>
      </div>

      <div className="d-flex justify-content-end align-items-center gap-3 p-4">
        <CustomTable.ActionButtonTemplate size="lg" variant="primary" disabled>
          Period request
        </CustomTable.ActionButtonTemplate>

        <CustomTable.ActionButtonTemplate size="lg" onClick={handlePrintToPdf}>
          Print
        </CustomTable.ActionButtonTemplate>
      </div>
    </div>
  );
}

DetailedCreditorStatement.layout = (page) => (
  <Layout children={page} title={"Detailed Creditor Statement"} />
);
