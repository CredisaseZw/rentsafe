import useAccountsSectors from "../../../hooks/page-hooks/useAccountsSectors.js";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";

export default function AccountsSectors() {
  const { accountsSectors } = useAccountsSectors();
  return (
    <div>
      <CustomTable.Table tabletitle="Accounts Sectors" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null]} />
        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Code</th>
            <th>Sector</th>
          </tr>
        </thead>

        <tbody>
          {accountsSectors.map((sector, index) => (
            <tr key={index}>
              <td className="text-nowrap">{sector.code}</td>
              <td>{sector.name}</td>
            </tr>
          ))}

          {accountsSectors.length === 0 && <CustomTable.NothingToShow colSpan={2} />}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

AccountsSectors.layout = (page) => <Layout children={page} title={"Accounts Sectors"} />;
