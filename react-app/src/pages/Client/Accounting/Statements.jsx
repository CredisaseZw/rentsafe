import Layout from '../../../components/Layouts/client/Layout.jsx';
import SearchBar from '../../../components/SearchBar.jsx';
import PaginationControls from '../../../components/PaginationControls.jsx';
import useClientStatements from '../../../hooks/page-hooks/useClientStatements.js';
import { formatCurrency } from '../../../utils/formatting.js';

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
      <h5 className="bg-info text-center text-white p-2 mb-4 rounded-2">
        CUSTOMER SUMMARY
      </h5>

      <div className="p-2 fw-bold d-flex justify-content-between align-items-center">
        <div>USD</div>
        <div>Date: {new Date().toLocaleDateString()}</div>
      </div>

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
              <div> Customer # </div>
            </th>
            <th>
              <div> Customer Name </div>
            </th>
            <th>
              <div> Address </div>
            </th>
            <th className="text-end">
              <div> Rent Owing</div>
            </th>
            <th className="bg-white">
              <div></div>
            </th>
          </tr>
        </thead>

        <tbody>
          {usdStatements?.length > 0 &&
            usdStatements.map((tenant) => (
              <tr key={tenant.id}>
                <th>{tenant.id}</th>
                <td>{tenant.tenant_name} </td>
                <td>{tenant.address}</td>
                <td
                  className={`text-end bg-${tenant.color} text-white`}
                  style={{
                    backgroundColor:
                      tenant.color == 'light-red' ? '#f87171' : '',
                  }}
                >
                  {Number(tenant.owing_amount) >= 0
                    ? formatCurrency(Number(tenant.owing_amount))
                    : `(${formatCurrency(Number(tenant.owing_amount) * -1)})`}
                </td>
                <td
                  className="bg-info text-center"
                  style={{
                    fontWeight: '500',
                    fontSize: '16px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => onOpenStatement(tenant.id)}
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
            <td></td>
            <td className="text-end">
              {usdTotal >= 0
                ? formatCurrency(usdTotal)
                : `(${formatCurrency(usdTotal * -1)})`}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-5 p-2 fw-bold d-flex justify-content-between align-items-center">
        <div>ZWG</div>
        <div>Date: {new Date().toLocaleDateString()}</div>
      </div>

      <table className="table table-bordered table-responsive table-sm c-fs-small">
        <thead className="position-sticky c-table-top c-bg-whitesmoke">
          <tr>
            <td colSpan={7}>
              <div className="col-4 p-0 pt-1">
                <SearchBar searchBy="search" placeholder="Search..." />
              </div>
            </td>
          </tr>

          <tr className="c-thead-bg rounded-2">
            <th>Tenant #</th>
            <td>Tenant Name</td>
            <td>Address</td>
            <td className="text-end">Rent Owing</td>
            <td className="bg-white"></td>
          </tr>
        </thead>

        <tbody>
          {zwlStatements?.length > 0 &&
            zwlStatements.map((tenant) => (
              <tr key={tenant.id}>
                <th>{tenant.id}</th>
                <td>{tenant.tenant_name} </td>
                <td>{tenant.address}</td>
                <td
                  className={`text-end bg-${tenant.color} text-white`}
                  style={{
                    backgroundColor:
                      tenant.color == 'light-red' ? '#f87171' : '',
                  }}
                >
                  {Number(tenant.owing_amount) >= 0
                    ? formatCurrency(Number(tenant.owing_amount))
                    : `(${formatCurrency(Number(tenant.owing_amount) * -1)})`}
                </td>
                <td
                  className="bg-info text-center"
                  style={{
                    fontWeight: '500',
                    fontSize: '16px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => onOpenStatement(tenant.id)}
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
            <td></td>
            <td className="text-end">
              {zwlTotal >= 0
                ? formatCurrency(zwlTotal)
                : `(${formatCurrency(zwlTotal * -1)})`}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="px-3">
        <PaginationControls
          currentPage={current_page}
          totalPages={total_pages}
        />
      </div>
    </div>
  );
}

Statements.layout = (page) => (
  <Layout children={page} title={'Customer Statements'} />
);
