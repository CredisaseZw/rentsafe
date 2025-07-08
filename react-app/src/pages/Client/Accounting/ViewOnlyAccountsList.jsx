import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useAccountsList from "../../../hooks/modal-hooks/useAccountsList.js";

export default function ViewOnlyAccountsList() {
  const { loading, mappableAccountsList } = useAccountsList();

  return (
    <div>
      <CustomTable.Table tabletitle="Accounts List" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Account Number</th>
            <th>Account Name</th>
            <th>Accounts Sector</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <CustomTable.LoadingIndicator colSpan={4} />
          ) : mappableAccountsList.length === 0 ? (
            <CustomTable.NothingToShow colSpan={4} />
          ) : (
            mappableAccountsList.map((account, index) => (
              <tr key={index}>
                <td>{account.accountNumber}</td>
                <td>{account.accountName}</td>
                <td>{account.accountsSector}</td>
              </tr>
            ))
          )}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

ViewOnlyAccountsList.layout = (page) => <Layout children={page} title={"Accounts View"} />;
