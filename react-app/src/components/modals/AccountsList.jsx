import { accountsList } from "../../constants/index.js";
import ClientSidebarNavItemModal from "../ClientSidebarNavItemModal.jsx";

export default function AccountsList(props) {
  return (
    <ClientSidebarNavItemModal
      {...props}
      modalProps={{
        title: "Accounts List",
        size: "lg",
        children: (
          <div>
            <table className="table table-responsive table-sm table-bordered">
              <thead className="sticky-top bg-white shadow-sm">
                <tr>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Accounts Sector</th>
                  <th>Sector Name</th>
                </tr>
              </thead>
              <tbody>
                {accountsList.map((account, index) => (
                  <tr key={index}>
                    <td>{account.accountName}</td>
                    <td>{account.accountNumber}</td>
                    <td>{account.accountsSector}</td>
                    <td>{account.sectorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      }}
    />
  );
}
