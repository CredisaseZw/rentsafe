import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useAccountsList from "../../../hooks/modal-hooks/useAccountsList.js";

export default function AccountsList(props) {
  const { loading, mappableAccountsList } = useAccountsList();

  return (
    <div>
      <CustomTable.Table tabletitle="Accounts List" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, 1, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Account Name</th>
            <th>Account Number</th>
            <th>Accounts Sector</th>
            <th>Sector Name</th>
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
                <td>{account.accountName}</td>
                <td>{account.accountNumber}</td>
                <td>{account.accountsSector}</td>
                <td>{account.sectorName}</td>
              </tr>
            ))
          )}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

AccountsList.layout = (page) => <Layout children={page} title={"Accounts"} />;
