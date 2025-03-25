import ClientSidebarNavItemModal from "../ClientSidebarNavItemModal.jsx";
import useAccountsSectors from "../../hooks/modal-hooks/useAccountsSectors.js";

export default function AccountsSectors(props) {
  const { accountsSectors } = useAccountsSectors();

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
