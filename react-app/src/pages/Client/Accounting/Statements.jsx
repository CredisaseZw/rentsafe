import Layout from "../../../components/Layouts/client/Layout.jsx";
import SearchBar from "../../../components/SearchBar.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import PaginationControls from "../../../components/PaginationControls.jsx";
import useClientStatements from "../../../hooks/page-hooks/useClientStatements.js";
import { formatCurrency } from "../../../utils/formatting.js";
import { friendlyDate } from "../../../utils/index.js";

export default function Statements() {
  const {
    usdTotal,
    zwlTotal,
    total_pages,
    current_page,
    usdStatements,
    zwlStatements,
    onOpenStatement,
  } = useClientStatements();

  return (
    <div>
      <CustomTable.Table tabletitle="Customer Summary" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, null, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <td colSpan={5}>
              <div className="d-flex gap-2 align-items-center justify-content-between">
                <div className="fw-bold">USD - {friendlyDate(new Date())}</div>

                <div className="c-w-fit pt-1">
                  <SearchBar searchBy="search" placeholder="Search..." />
                </div>
              </div>
            </td>
          </tr>

          <tr className="c-thead-bg">
            <th>Customer #</th>
            <th>Customer Name</th>
            <th>Address</th>
            <th className="text-end">Rent Owing</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {usdStatements?.length > 0 ? (
            usdStatements.map((tenant) => (
              <tr key={tenant.id}>
                <th>{tenant.id}</th>
                <td>{tenant.tenant_name} </td>
                <td>{tenant.address}</td>

                <td
                  className={`text-end bg-${tenant.color}  ${tenant.color === "warning" || tenant.color === "light-red" ? "fw-bold" : "text-white"} `}
                  style={{ backgroundColor: tenant.color == "light-red" ? "#f87171" : "" }}
                >
                  {Number(tenant.owing_amount) >= 0
                    ? formatCurrency(Number(tenant.owing_amount))
                    : `(${formatCurrency(Number(tenant.owing_amount) * -1)})`}
                </td>

                <td>
                  <CustomTable.ActionButtonTemplate onClick={() => onOpenStatement(tenant.id)}>
                    View
                  </CustomTable.ActionButtonTemplate>
                </td>
              </tr>
            ))
          ) : (
            <CustomTable.NothingToShow colSpan={5} />
          )}
        </tbody>

        <tfoot>
          <tr>
            <th className="fw-bolder c-fs-11">Total</th>
            <td />
            <td />
            <td className="fw-bolder c-fs-11 text-end">
              {usdTotal >= 0 ? formatCurrency(usdTotal) : `(${formatCurrency(usdTotal * -1)})`}
            </td>
            <td />
          </tr>
        </tfoot>
      </CustomTable.Table>

      <div className="mt-5" />

      <CustomTable.Table>
        <CustomTable.ColGroup ratios={[1, null, null, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <td colSpan={5}>
              <div className="d-flex gap-2 align-items-center justify-content-between">
                <div className="fw-bold">ZWG - {friendlyDate(new Date())}</div>

                <div className="c-w-fit pt-1">
                  <SearchBar searchBy="search" placeholder="Search..." />
                </div>
              </div>
            </td>
          </tr>

          <tr className="c-thead-bg">
            <th>Tenant #</th>
            <th>Tenant Name</th>
            <th>Address</th>
            <th className="text-end">Rent Owing</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {zwlStatements?.length > 0 ? (
            zwlStatements.map((tenant) => (
              <tr key={tenant.id}>
                <th>{tenant.id}</th>
                <td>{tenant.tenant_name}</td>
                <td>{tenant.address}</td>

                <td
                  className={`text-nowrap text-end bg-${tenant.color}  ${tenant.color === "warning" || tenant.color === "light-red" ? "fw-bold" : "text-white"} `}
                  style={{ backgroundColor: tenant.color == "light-red" ? "#f87171" : "" }}
                >
                  {Number(tenant.owing_amount) >= 0
                    ? formatCurrency(Number(tenant.owing_amount))
                    : `(${formatCurrency(Number(tenant.owing_amount) * -1)})`}
                </td>

                <td>
                  <CustomTable.ActionButtonTemplate onClick={() => onOpenStatement(tenant.id)}>
                    View
                  </CustomTable.ActionButtonTemplate>
                </td>
              </tr>
            ))
          ) : (
            <CustomTable.NothingToShow colSpan={5} />
          )}
        </tbody>

        <tfoot>
          <tr>
            <th className="fw-bolder c-fs-11">Total</th>
            <td />
            <td />
            <td className="fw-bolder c-fs-11 text-end">
              {zwlTotal >= 0 ? formatCurrency(zwlTotal) : `(${formatCurrency(zwlTotal * -1)})`}
            </td>
            <td />
          </tr>
        </tfoot>
      </CustomTable.Table>

      <div className="px-3">
        <PaginationControls currentPage={current_page} totalPages={total_pages} />
      </div>
    </div>
  );
}

Statements.layout = (page) => <Layout children={page} title={"Customer Statements"} />;
