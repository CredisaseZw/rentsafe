import Layout from "../../../components/Layouts/client/Layout.jsx";
import ClientSidebarNavItemModal from "../../../components/ClientSidebarNavItemModal.jsx";
import useAccountsSectors from "../../../hooks/page-hooks/useAccountsSectors.js";

export default function AccountsSectors() {
  const { accountsSectors } = useAccountsSectors();

  return (
    <div>
      <h6 className="text-white p-2 rounded-3 bg-info">Accounts Sectors</h6>

      <table className="table bg-white table-responsive table-sm table-bordered">
        <thead className="sticky-top bg-white shadow-sm">
          <tr>
            <th>Code</th>
            <th>Sector</th>
          </tr>
        </thead>
        <tbody>
          {accountsSectors.map((sector, index) => (
            <tr key={index}>
              <td>{sector.code}</td>
              <td>{sector.sector}</td>
            </tr>
          ))}

          {accountsSectors.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-5">
                Nothing to show
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

AccountsSectors.layout = (page) => <Layout children={page} title={"Accounts Sectors"} />;
