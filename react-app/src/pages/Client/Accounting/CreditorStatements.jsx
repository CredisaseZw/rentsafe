import SearchBar from "../../../components/SearchBar.jsx";
import PaginationControls from "../../../components/PaginationControls.jsx";
import React from "react";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import { Inertia } from "@inertiajs/inertia";
import { formatCurrency } from "../../../utils/formatting.js";
import CreditorView from "../../../components/Client/ClientView/CreditorView.jsx";
import useCreditorStatements from "../../../hooks/modal-hooks/useCreditorStatements.js";

export default function CreditorStatements({ creditors, current_page, total_pages, total_items }) {
  const { balanceTotal, creditorViewProps } = useCreditorStatements(
    creditors,
    current_page,
    total_pages,
    total_items
  );

  return (
    <div>
      <CreditorView creditorViewProps={creditorViewProps} />

      <h5 className="bg-danger text-center text-white p-2 mb-4 rounded-2">CREDITOR SUMMARY</h5>

      <table className="table table-bordered table-responsive table-sm c-fs-small">
        <thead className="position-sticky c-table-top c-bg-whitesmoke">
          <tr>
            <td colSpan={7}>
              <div className="col-4 p-0 pt-1">
                <SearchBar searchBy="search" placeholder="Search..." />
              </div>
            </td>
          </tr>

          <tr className="c-thead-bg rounded-2 c-force-borders">
            <th>
              <div> Creditor ID</div>
            </th>
            <th>
              <div> Creditor Name</div>
            </th>
            <th className="text-end">
              <div> Balance Owed</div>
            </th>
            <th className="text-end bg-white">
              <div></div>
            </th>
          </tr>
        </thead>

        {Boolean(creditors.length) && (
          <>
            <tbody>
              {creditors.map((creditor, index) => (
                <tr key={creditor.creditor_id + " - " + index}>
                  <td>{creditor.creditor_id}</td>

                  <td>
                    <button
                      type="button"
                      title="double click for communication history"
                      className="custom-btn text-decoration-underline"
                      onDoubleClick={() => creditorViewProps.openCreditorView(creditor)}
                    >
                      {creditor.creditor_name}
                    </button>
                  </td>

                  <td className="text-end px-3">
                    {Number(creditor.balance_owed) >= 0
                      ? formatCurrency(Number(creditor.balance_owed))
                      : `(${formatCurrency(Number(creditor.balance_owed) * -1)})`}
                  </td>

                  <td
                    className="bg-info text-center"
                    style={{
                      fontWeight: "500",
                      fontSize: "16px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      Inertia.visit(
                        reverseUrl("detailed_creditor_statement", creditor.creditor_id),
                        { data: { lease_id: creditor.lease_id } }
                      )
                    }
                  >
                    View
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="fw-bold c-fs-18">
              <tr>
                <th>Total</th>
                <td></td>
                <td className="text-end">
                  {balanceTotal >= 0
                    ? formatCurrency(balanceTotal)
                    : `(${formatCurrency(balanceTotal * -1)})`}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </>
        )}
      </table>

      {!Boolean(creditors.length) && (
        <div className="custom-h-4 d-flex justify-content-center align-items-center border border-2">
          Nothing to show
        </div>
      )}

      <div className="px-3">
        <PaginationControls currentPage={current_page || 1} totalPages={total_pages || 1} />
      </div>
    </div>
  );
}

CreditorStatements.layout = (page) => <Layout children={page} title={"Creditor Statements"} />;
