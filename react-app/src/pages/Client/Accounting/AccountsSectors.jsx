import useAccountsSectors from "../../../hooks/page-hooks/useAccountsSectors.js";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import ContentModal from "../../../components/ContentModal.jsx";

export default function AccountsSectors() {
  const { accountsSectors, showAdd, loading, closeAddForm, handleSubmit, openAddForm } =
    useAccountsSectors();
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
            <button disabled={loading} type="submit" className="btn btn-primary">
              {loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="d-inline-block ms-2">saving..</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </ContentModal>

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

      <div className="p-3 text-end">
        <CustomTable.ActionButtonTemplate icon="add" onClick={openAddForm}>
          New
        </CustomTable.ActionButtonTemplate>
      </div>
    </div>
  );
}

AccountsSectors.layout = (page) => <Layout children={page} title={"Accounts Sectors"} />;
