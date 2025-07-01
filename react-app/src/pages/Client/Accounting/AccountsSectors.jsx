import useAccountsSectors from "../../../hooks/page-hooks/useAccountsSectors.js";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import ContentModal from "../../../components/ContentModal.jsx";

export default function AccountsSectors() {
  const {
    accountsSectors,
    showAdd,
    loading,
    closeAddForm,
    handleSubmit,
    openAddForm,
    deleteSector,
  } = useAccountsSectors();
  return (
    <div>
      <ContentModal
        centerTitle
        show={showAdd}
        handleClose={closeAddForm}
        title={"Add Sector"}
        size="md"
      >
        <form className="px-4 pb-5" onSubmit={handleSubmit}>
          <div className="c-bg-light p-1 mb-3 text-center">Sector</div>

          <div className="mb-3">
            <label htmlFor="code" className="form-label">
              Code
            </label>
            <input type="text" className="form-control" id="code" name="code" required />
          </div>

          <div>
            <label htmlFor="name" className="form-label">
              Sector
            </label>
            <input type="text" className="form-control" id="name" name="name" required />
          </div>

          <div className="mt-5 text-center">
            <CustomTable.ActionButtonTemplate disabled={loading} type="submit">
              {loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="d-inline-block ms-2">saving..</span>
                </>
              ) : (
                "Save"
              )}
            </CustomTable.ActionButtonTemplate>
          </div>
        </form>
      </ContentModal>

      <CustomTable.Table tabletitle="Accounts Sectors" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, 1]} />
        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Code</th>
            <th>Sector</th>
            <th>
              <CustomTable.AddRowButtonTemplate onClick={openAddForm} label="New" />
            </th>
          </tr>
        </thead>

        <tbody>
          {accountsSectors.map((sector, index) => (
            <tr key={index}>
              <td className="text-nowrap">{sector.code}</td>
              <td>{sector.name}</td>
              <td className="text-center">
                <CustomTable.RemoveRowButtonTemplate onClick={() => deleteSector(sector.id)} />
              </td>
            </tr>
          ))}

          {accountsSectors.length === 0 && <CustomTable.NothingToShow colSpan={2} />}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

AccountsSectors.layout = (page) => <Layout children={page} title={"Accounts Sectors"} />;
