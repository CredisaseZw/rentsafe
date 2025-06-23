import Layout from "../../../components/Layouts/client/Layout.jsx";
import NewPageHeader from "../../../components/NewPageHeader.jsx";
import useAccountsList from "../../../hooks/modal-hooks/useAccountsList.js";

export default function AccountsList(props) {
  const { loading, mappableAccountsList } = useAccountsList();

  return (
    <div>
      <NewPageHeader title="Accounts List" />

      <table className="bg-white table table-responsive table-sm table-bordered">
        <thead className="sticky-top bg-white shadow-sm">
          <tr>
            <th>Account Name</th>
            <th>Account Number</th>
            <th>Accounts Sector</th>
            <th>Sector Name</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          ) : mappableAccountsList.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Nothing to show
              </td>
            </tr>
          ) : (
            mappableAccountsList.map((account, index) => (
              <tr key={index}>
                <td>{account.accountName}</td>
                <td>{account.accountNumber}</td>
                <td>{account.accountsSector}</td>
                <td>{account.sectorName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

AccountsList.layout = (page) => <Layout children={page} title={"Accounts"} />;
