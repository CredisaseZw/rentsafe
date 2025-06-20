import Layout from "../../../components/Layouts/client/Layout.jsx";
import SearchBar from "../../../components/SearchBar.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import CreditorView from "../../../components/Client/ClientView/CreditorView.jsx";
import PaginationControls from "../../../components/PaginationControls.jsx";
import useCreditorStatements from "../../../hooks/modal-hooks/useCreditorStatements.js";
import { Inertia } from "@inertiajs/inertia";
import { formatCurrency } from "../../../utils/formatting.js";

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

      <CustomTable.Table
        tabletitle="Creditor Summary"
        tabletitleBg="danger"
        tabletitleColor="white"
      >
        <CustomTable.ColGroup ratios={[1, null, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <td colSpan={4}>
              <div className="pt-1 c-w-fit">
                <SearchBar searchBy="search" placeholder="Search..." />
              </div>
            </td>
          </tr>

          <tr className="c-thead-bg">
            <th>Creditor ID</th>
            <th>Creditor Name</th>
            <th>Balance Owed</th>
            <th>
              <div className="custom-mn-w-05" />
            </th>
          </tr>
        </thead>

        <tbody>
          {!Boolean(creditors.length) && <CustomTable.NothingToShow colSpan={4} />}

          {creditors?.map((creditor, index) => (
            <tr key={index}>
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

              <td className="text-end">
                {Number(creditor.balance_owed) >= 0
                  ? formatCurrency(Number(creditor.balance_owed))
                  : `(${formatCurrency(Number(creditor.balance_owed) * -1)})`}
              </td>

              <td>
                <CustomTable.ActionButtonTemplate
                  onClick={() =>
                    Inertia.visit(reverseUrl("detailed_creditor_statement", creditor.creditor_id), {
                      data: { lease_id: creditor.lease_id },
                    })
                  }
                >
                  View
                </CustomTable.ActionButtonTemplate>
              </td>
            </tr>
          ))}
        </tbody>

        {Boolean(creditors.length) && (
          <tfoot className="fw-bold">
            <tr>
              <th colSpan={2}>Total</th>
              <td className="text-end">
                {balanceTotal >= 0
                  ? formatCurrency(balanceTotal)
                  : `(${formatCurrency(balanceTotal * -1)})`}
              </td>
              <td />
            </tr>
          </tfoot>
        )}
      </CustomTable.Table>

      <div className="px-3">
        <PaginationControls currentPage={current_page || 1} totalPages={total_pages || 1} />
      </div>
    </div>
  );
}

CreditorStatements.layout = (page) => <Layout children={page} title={"Creditor Statements"} />;
