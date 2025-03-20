import { accountsSectors } from "../../constants/index.js";
import ClientSidebarNavItemModal from "../ClientSidebarNavItemModal.jsx";

export default function AccountsSectors(props) {
  return (
    <ClientSidebarNavItemModal
      {...props}
      modalProps={{
        title: "Accounts Sectors",
        size: "md",
        children: (
          <div>
            <table className="table table-responsive table-sm table-bordered">
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
              </tbody>
            </table>
          </div>
        ),
      }}
    />
  );
}
