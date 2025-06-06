import Layout from "../../../components/Layouts/client/Layout.jsx";
import ClientSidebarNavItemModal from "../../../components/ClientSidebarNavItemModal.jsx";
import useAccountsSectors from "../../../hooks/page-hooks/useAccountsSectors.js";
import NewPageHeader from "../../../components/NewPageHeader.jsx";

export default function AccountsSectors() {
  const { accountsSectors } = useAccountsSectors();

  return (
    <div>
      <NewPageHeader title="Accounts Sectors" />

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
